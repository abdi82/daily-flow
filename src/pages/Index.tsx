import { useState } from "react";
import { motion } from "framer-motion";
import { Wallet, Calendar, CalendarDays, PiggyBank, ChevronRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { WalletCard } from "@/components/wallet/WalletCard";
import { InterestBanner } from "@/components/wallet/InterestBanner";
import { QuickActions } from "@/components/wallet/QuickActions";
import { NudgeCard } from "@/components/wallet/NudgeCard";
import { TransactionItem } from "@/components/wallet/TransactionItem";
import { toast } from "sonner";

// Mock data for demonstration
const mockWalletData = {
  daily: { amount: 100, progress: 60 },
  weekly: { amount: 375 },
  monthly: { amount: 1500 },
  savings: { amount: 4525, interest: 1.60 },
};

const mockTransactions = [
  { type: "outgoing" as const, category: "transport" as const, title: "Matatu to Work", amount: 60, time: "8:30 AM" },
  { type: "outgoing" as const, category: "food" as const, title: "Lunch - Mama Pima", amount: 80, time: "1:15 PM" },
  { type: "incoming" as const, category: "transfer" as const, title: "M-Pesa Deposit", amount: 1200, time: "Yesterday" },
  { type: "outgoing" as const, category: "shopping" as const, title: "Airtime Purchase", amount: 50, time: "Yesterday" },
];

export default function Index() {
  const [activeTab, setActiveTab] = useState("home");
  const [showNudge, setShowNudge] = useState(true);

  const handleAddMoney = () => {
    toast.success("Add Money", { description: "Feature coming soon!" });
  };

  const handleSendMoney = () => {
    toast.success("Send Money", { description: "Feature coming soon!" });
  };

  const handleAdjustPlan = () => {
    toast.info("Adjust Plan", { description: "Feature coming soon!" });
  };

  const handleHistory = () => {
    toast.info("Transaction History", { description: "Feature coming soon!" });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-md px-4 pb-24">
        <Header userName="John" />

        {/* Main Content */}
        <main className="space-y-5">
          {/* Behavioral Nudge */}
          {showNudge && (
            <NudgeCard
              type="achievement"
              title="Great job today! 🎉"
              message="You've stuck to your budget for 7 days straight. Keep it up!"
              onDismiss={() => setShowNudge(false)}
            />
          )}

          {/* Daily Wallet - Featured */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <WalletCard
              title="Today's Money"
              amount={mockWalletData.daily.amount}
              icon={Wallet}
              variant="daily"
              subtitle="KES 40 remaining"
              progress={mockWalletData.daily.progress}
            />
          </motion.div>

          {/* Secondary Wallets Grid */}
          <div className="grid grid-cols-2 gap-3">
            <WalletCard
              title="This Week"
              amount={mockWalletData.weekly.amount}
              icon={Calendar}
              variant="weekly"
              delay={0.1}
            />
            <WalletCard
              title="This Month"
              amount={mockWalletData.monthly.amount}
              icon={CalendarDays}
              variant="monthly"
              delay={0.2}
            />
          </div>

          {/* Savings & Interest */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <WalletCard
              title="Total Savings"
              amount={mockWalletData.savings.amount}
              icon={PiggyBank}
              variant="savings"
              subtitle="Earning 13% annual interest"
            />
          </motion.div>

          {/* Interest Banner */}
          <InterestBanner
            interestEarned={mockWalletData.savings.interest}
            totalSavings={mockWalletData.savings.amount}
          />

          {/* Quick Actions */}
          <QuickActions
            onAddMoney={handleAddMoney}
            onSendMoney={handleSendMoney}
            onAdjustPlan={handleAdjustPlan}
            onHistory={handleHistory}
          />

          {/* Recent Transactions */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                Recent Activity
              </h2>
              <button className="flex items-center gap-1 text-sm text-primary font-medium hover:text-primary-glow transition-colors">
                See all
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              {mockTransactions.map((tx, index) => (
                <TransactionItem
                  key={index}
                  type={tx.type}
                  category={tx.category}
                  title={tx.title}
                  amount={tx.amount}
                  time={tx.time}
                  delay={0.7 + index * 0.1}
                />
              ))}
            </div>
          </motion.section>
        </main>
      </div>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
