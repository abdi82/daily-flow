import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface WalletCardProps {
  title: string;
  amount: number;
  icon: LucideIcon;
  variant: "daily" | "weekly" | "monthly" | "savings";
  subtitle?: string;
  progress?: number;
  delay?: number;
}

const variantStyles = {
  daily: {
    bg: "bg-gradient-to-br from-primary to-primary-glow",
    iconBg: "bg-primary-foreground/20",
    text: "text-primary-foreground",
  },
  weekly: {
    bg: "bg-gradient-to-br from-[hsl(200,85%,45%)] to-[hsl(200,85%,55%)]",
    iconBg: "bg-white/20",
    text: "text-white",
  },
  monthly: {
    bg: "bg-gradient-to-br from-[hsl(260,70%,55%)] to-[hsl(260,70%,65%)]",
    iconBg: "bg-white/20",
    text: "text-white",
  },
  savings: {
    bg: "bg-gradient-to-br from-accent to-accent-glow",
    iconBg: "bg-accent-foreground/20",
    text: "text-accent-foreground",
  },
};

export function WalletCard({
  title,
  amount,
  icon: Icon,
  variant,
  subtitle,
  progress,
  delay = 0,
}: WalletCardProps) {
  const styles = variantStyles[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        "relative overflow-hidden rounded-2xl p-5 shadow-lg",
        styles.bg
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className={cn("text-sm font-medium opacity-80", styles.text)}>
            {title}
          </p>
          <p className={cn("text-2xl font-bold tracking-tight", styles.text)}>
            KES {amount.toLocaleString()}
          </p>
          {subtitle && (
            <p className={cn("text-xs opacity-70", styles.text)}>{subtitle}</p>
          )}
        </div>
        <div className={cn("rounded-xl p-2.5", styles.iconBg)}>
          <Icon className={cn("h-5 w-5", styles.text)} />
        </div>
      </div>

      {progress !== undefined && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className={cn("opacity-70", styles.text)}>Used today</span>
            <span className={cn("font-medium", styles.text)}>{progress}%</span>
          </div>
          <div className={cn("h-1.5 rounded-full bg-black/10")}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, delay: delay + 0.3 }}
              className="h-full rounded-full bg-white/90"
            />
          </div>
        </div>
      )}

      {/* Decorative circles */}
      <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-white/10" />
      <div className="absolute -right-8 -bottom-8 h-32 w-32 rounded-full bg-white/5" />
    </motion.div>
  );
}
