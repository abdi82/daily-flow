import { motion } from "framer-motion";
import { TrendingUp, Sparkles } from "lucide-react";

interface InterestBannerProps {
  interestEarned: number;
  totalSavings: number;
}

export function InterestBanner({ interestEarned, totalSavings }: InterestBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="relative overflow-hidden rounded-2xl bg-card border border-border p-5"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-light">
          <TrendingUp className="h-6 w-6 text-accent" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-muted-foreground">
              Today's Interest
            </p>
            <Sparkles className="h-3.5 w-3.5 text-accent" />
          </div>
          <p className="text-xl font-bold text-foreground">
            +KES {interestEarned.toFixed(2)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">MMF Balance</p>
          <p className="text-sm font-semibold text-foreground">
            KES {totalSavings.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Subtle animated gradient */}
      <motion.div
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-accent/5 to-transparent"
      />
    </motion.div>
  );
}
