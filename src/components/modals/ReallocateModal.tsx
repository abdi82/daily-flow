import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, Wallet, Calendar, CalendarDays, PiggyBank,
  ArrowLeftRight, Check, AlertCircle
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ReallocateModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletBalances: {
    daily: number;
    weekly: number;
    monthly: number;
    savings: number;
  };
  onSuccess: (from: WalletType, to: WalletType, amount: number) => void;
}

type WalletType = "daily" | "weekly" | "monthly" | "savings";
type Step = "select" | "amount" | "confirm" | "success";

const wallets = [
  { id: "daily" as WalletType, name: "Daily Wallet", icon: Wallet, color: "text-primary" },
  { id: "weekly" as WalletType, name: "Weekly Wallet", icon: Calendar, color: "text-accent" },
  { id: "monthly" as WalletType, name: "Monthly Wallet", icon: CalendarDays, color: "text-secondary-foreground" },
  { id: "savings" as WalletType, name: "Savings", icon: PiggyBank, color: "text-primary-glow" },
];

export function ReallocateModal({ 
  isOpen, 
  onClose, 
  walletBalances,
  onSuccess 
}: ReallocateModalProps) {
  const [step, setStep] = useState<Step>("select");
  const [fromWallet, setFromWallet] = useState<WalletType | null>(null);
  const [toWallet, setToWallet] = useState<WalletType | null>(null);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const resetState = () => {
    setStep("select");
    setFromWallet(null);
    setToWallet(null);
    setAmount("");
    setError("");
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const getWalletBalance = (wallet: WalletType) => walletBalances[wallet];

  const validateAmount = () => {
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      setError("Please enter a valid amount");
      return false;
    }
    if (fromWallet && numAmount > getWalletBalance(fromWallet)) {
      setError("Insufficient balance in source wallet");
      return false;
    }
    if (numAmount < 10) {
      setError("Minimum amount is KES 10");
      return false;
    }
    setError("");
    return true;
  };

  const handleContinue = () => {
    if (step === "select") {
      if (fromWallet && toWallet) {
        setStep("amount");
      }
    } else if (step === "amount") {
      if (validateAmount()) {
        setStep("confirm");
      }
    } else if (step === "confirm") {
      setStep("success");
      setTimeout(() => {
        if (fromWallet && toWallet) {
          onSuccess(fromWallet, toWallet, parseFloat(amount));
        }
        handleClose();
      }, 2000);
    }
  };

  const getWalletInfo = (id: WalletType | null) => wallets.find(w => w.id === id);

  const quickAmounts = fromWallet ? [
    Math.floor(getWalletBalance(fromWallet) * 0.25),
    Math.floor(getWalletBalance(fromWallet) * 0.5),
    Math.floor(getWalletBalance(fromWallet) * 0.75),
    getWalletBalance(fromWallet),
  ].filter(a => a >= 10) : [];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md mx-4 rounded-3xl p-0 overflow-hidden">
        <AnimatePresence mode="wait">
          {/* Step 1: Select Wallets */}
          {step === "select" && (
            <motion.div
              key="select"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6"
            >
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <ArrowLeftRight className="h-5 w-5 text-primary" />
                  Reallocate Funds
                </DialogTitle>
              </DialogHeader>

              <div className="mt-6 space-y-6">
                {/* From Wallet */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">From</label>
                  <div className="grid grid-cols-2 gap-2">
                    {wallets.map((wallet) => {
                      const Icon = wallet.icon;
                      const balance = getWalletBalance(wallet.id);
                      const isDisabled = balance <= 0 || wallet.id === toWallet;
                      
                      return (
                        <button
                          key={wallet.id}
                          onClick={() => !isDisabled && setFromWallet(wallet.id)}
                          disabled={isDisabled}
                          className={cn(
                            "flex flex-col items-start p-3 rounded-xl border-2 transition-all text-left",
                            fromWallet === wallet.id
                              ? "border-primary bg-primary/10"
                              : "border-border bg-card hover:border-primary/50",
                            isDisabled && "opacity-50 cursor-not-allowed"
                          )}
                        >
                          <Icon className={cn("h-5 w-5 mb-1", wallet.color)} />
                          <span className="text-sm font-medium">{wallet.name}</span>
                          <span className="text-xs text-muted-foreground">
                            KES {balance.toLocaleString()}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex justify-center">
                  <div className="p-2 rounded-full bg-muted">
                    <ArrowRight className="h-4 w-4 text-muted-foreground rotate-90" />
                  </div>
                </div>

                {/* To Wallet */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">To</label>
                  <div className="grid grid-cols-2 gap-2">
                    {wallets.map((wallet) => {
                      const Icon = wallet.icon;
                      const isDisabled = wallet.id === fromWallet;
                      
                      return (
                        <button
                          key={wallet.id}
                          onClick={() => !isDisabled && setToWallet(wallet.id)}
                          disabled={isDisabled}
                          className={cn(
                            "flex flex-col items-start p-3 rounded-xl border-2 transition-all text-left",
                            toWallet === wallet.id
                              ? "border-primary bg-primary/10"
                              : "border-border bg-card hover:border-primary/50",
                            isDisabled && "opacity-50 cursor-not-allowed"
                          )}
                        >
                          <Icon className={cn("h-5 w-5 mb-1", wallet.color)} />
                          <span className="text-sm font-medium">{wallet.name}</span>
                          <span className="text-xs text-muted-foreground">
                            KES {getWalletBalance(wallet.id).toLocaleString()}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <Button
                  className="w-full"
                  disabled={!fromWallet || !toWallet}
                  onClick={handleContinue}
                >
                  Continue
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Enter Amount */}
          {step === "amount" && (
            <motion.div
              key="amount"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6"
            >
              <DialogHeader>
                <DialogTitle>Enter Amount</DialogTitle>
              </DialogHeader>

              <div className="mt-6 space-y-6">
                {/* Transfer Preview */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">From</p>
                    <p className="font-medium">{getWalletInfo(fromWallet)?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      KES {fromWallet ? getWalletBalance(fromWallet).toLocaleString() : 0}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-primary" />
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">To</p>
                    <p className="font-medium">{getWalletInfo(toWallet)?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      KES {toWallet ? getWalletBalance(toWallet).toLocaleString() : 0}
                    </p>
                  </div>
                </div>

                {/* Amount Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount (KES)</label>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      setError("");
                    }}
                    className="text-2xl font-bold text-center h-16"
                  />
                  {error && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {error}
                    </p>
                  )}
                </div>

                {/* Quick Amounts */}
                {quickAmounts.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {quickAmounts.map((amt) => (
                      <Button
                        key={amt}
                        variant="outline"
                        size="sm"
                        onClick={() => setAmount(amt.toString())}
                        className={cn(
                          amount === amt.toString() && "border-primary bg-primary/10"
                        )}
                      >
                        KES {amt.toLocaleString()}
                      </Button>
                    ))}
                  </div>
                )}

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setStep("select")}>
                    Back
                  </Button>
                  <Button className="flex-1" onClick={handleContinue}>
                    Continue
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Confirm */}
          {step === "confirm" && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6"
            >
              <DialogHeader>
                <DialogTitle>Confirm Reallocation</DialogTitle>
              </DialogHeader>

              <div className="mt-6 space-y-6">
                <div className="p-4 rounded-xl bg-muted/50 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">From</span>
                    <span className="font-medium">{getWalletInfo(fromWallet)?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">To</span>
                    <span className="font-medium">{getWalletInfo(toWallet)?.name}</span>
                  </div>
                  <div className="border-t border-border pt-4 flex justify-between">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="text-xl font-bold text-primary">
                      KES {parseFloat(amount).toLocaleString()}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-center text-muted-foreground">
                  This action will move funds instantly between your wallets
                </p>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setStep("amount")}>
                    Back
                  </Button>
                  <Button className="flex-1" onClick={handleContinue}>
                    Confirm
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Success */}
          {step === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4"
              >
                <Check className="h-10 w-10 text-primary" />
              </motion.div>
              <h3 className="text-xl font-bold mb-2">Reallocation Complete!</h3>
              <p className="text-muted-foreground">
                KES {parseFloat(amount).toLocaleString()} has been moved from{" "}
                {getWalletInfo(fromWallet)?.name} to {getWalletInfo(toWallet)?.name}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
