import { motion } from "framer-motion";
import { Plus, Send, ArrowLeftRight, History } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuickActionsProps {
  onAddMoney: () => void;
  onSendMoney: () => void;
  onReallocate: () => void;
  onHistory: () => void;
}

export function QuickActions({
  onAddMoney,
  onSendMoney,
  onReallocate,
  onHistory,
}: QuickActionsProps) {
  const actions = [
    { label: "Add Money", icon: Plus, onClick: onAddMoney, variant: "hero" as const },
    { label: "Send Money", icon: Send, onClick: onSendMoney, variant: "outline" as const },
    { label: "Reallocate", icon: ArrowLeftRight, onClick: onReallocate, variant: "secondary" as const },
    { label: "History", icon: History, onClick: onHistory, variant: "ghost" as const },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="grid grid-cols-2 gap-3"
    >
      {actions.map((action, index) => (
        <motion.div
          key={action.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
        >
          <Button
            variant={action.variant}
            onClick={action.onClick}
            className="w-full gap-2"
          >
            <action.icon className="h-4 w-4" />
            {action.label}
          </Button>
        </motion.div>
      ))}
    </motion.div>
  );
}
