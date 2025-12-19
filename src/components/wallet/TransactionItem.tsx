import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownLeft, Wallet, ShoppingBag, Car, Utensils, Receipt, Film } from "lucide-react";
import { cn } from "@/lib/utils";

export type TransactionType = "incoming" | "outgoing";
export type TransactionCategory = "transfer" | "shopping" | "transport" | "food" | "bills" | "entertainment";

interface TransactionItemProps {
  type: TransactionType;
  category: TransactionCategory;
  title: string;
  amount: number;
  time: string;
  delay?: number;
}

const categoryIcons: Record<TransactionCategory, React.ComponentType<{ className?: string }>> = {
  transfer: Wallet,
  shopping: ShoppingBag,
  transport: Car,
  food: Utensils,
  bills: Receipt,
  entertainment: Film,
};

export function TransactionItem({
  type,
  category,
  title,
  amount,
  time,
  delay = 0,
}: TransactionItemProps) {
  const Icon = categoryIcons[category];
  const isIncoming = type === "incoming";

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay }}
      className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-muted/50"
    >
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-xl",
          isIncoming ? "bg-primary-light" : "bg-muted"
        )}
      >
        <Icon
          className={cn(
            "h-5 w-5",
            isIncoming ? "text-primary" : "text-muted-foreground"
          )}
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground truncate">{title}</p>
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>

      <div className="flex items-center gap-1">
        {isIncoming ? (
          <ArrowDownLeft className="h-4 w-4 text-primary" />
        ) : (
          <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
        )}
        <span
          className={cn(
            "font-semibold",
            isIncoming ? "text-primary" : "text-foreground"
          )}
        >
          {isIncoming ? "+" : "-"}KES {amount.toLocaleString()}
        </span>
      </div>
    </motion.div>
  );
}
