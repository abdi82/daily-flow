import { motion, AnimatePresence } from "framer-motion";
import { X, Lightbulb, TrendingUp, Shield, Target } from "lucide-react";
import { cn } from "@/lib/utils";

type NudgeType = "tip" | "achievement" | "protection" | "goal";

interface NudgeCardProps {
  type: NudgeType;
  title: string;
  message: string;
  onDismiss: () => void;
}

const nudgeConfig = {
  tip: {
    icon: Lightbulb,
    bg: "bg-primary-light",
    iconColor: "text-primary",
    border: "border-primary/20",
  },
  achievement: {
    icon: TrendingUp,
    bg: "bg-accent-light",
    iconColor: "text-accent",
    border: "border-accent/20",
  },
  protection: {
    icon: Shield,
    bg: "bg-secondary",
    iconColor: "text-secondary-foreground",
    border: "border-secondary-foreground/20",
  },
  goal: {
    icon: Target,
    bg: "bg-[hsl(260,70%,95%)]",
    iconColor: "text-[hsl(260,70%,55%)]",
    border: "border-[hsl(260,70%,55%)]/20",
  },
};

export function NudgeCard({ type, title, message, onDismiss }: NudgeCardProps) {
  const config = nudgeConfig[type];
  const Icon = config.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "relative overflow-hidden rounded-xl border p-4",
          config.bg,
          config.border
        )}
      >
        <button
          onClick={onDismiss}
          className="absolute right-3 top-3 rounded-lg p-1 opacity-60 hover:opacity-100 transition-opacity"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-3 pr-6">
          <div className={cn("rounded-lg p-2", config.bg)}>
            <Icon className={cn("h-5 w-5", config.iconColor)} />
          </div>
          <div className="space-y-0.5">
            <p className="text-sm font-semibold text-foreground">{title}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {message}
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
