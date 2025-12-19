import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Phone, CheckCircle2, Loader2, AlertCircle,
  Smartphone, ArrowRight, Wallet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Step = "amount" | "confirm" | "processing" | "success" | "error";

interface AddMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (amount: number) => void;
}

const presetAmounts = [100, 500, 1000, 2000, 5000];

export function AddMoneyModal({ isOpen, onClose, onSuccess }: AddMoneyModalProps) {
  const [step, setStep] = useState<Step>("amount");
  const [amount, setAmount] = useState("");
  const [phoneNumber] = useState("+254 712 345 678");
  const [error, setError] = useState("");

  const handleAmountChange = (value: string) => {
    // Only allow numbers
    const numValue = value.replace(/[^0-9]/g, "");
    setAmount(numValue);
    setError("");
  };

  const handlePresetAmount = (preset: number) => {
    setAmount(preset.toString());
    setError("");
  };

  const handleContinue = () => {
    const numAmount = parseInt(amount);
    if (!amount || numAmount < 10) {
      setError("Minimum amount is KES 10");
      return;
    }
    if (numAmount > 150000) {
      setError("Maximum amount is KES 150,000");
      return;
    }
    setStep("confirm");
  };

  const handleConfirm = async () => {
    setStep("processing");
    
    // Simulate M-Pesa STK Push processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Simulate 90% success rate
    if (Math.random() > 0.1) {
      setStep("success");
      onSuccess?.(parseInt(amount));
    } else {
      setStep("error");
    }
  };

  const handleClose = () => {
    setStep("amount");
    setAmount("");
    setError("");
    onClose();
  };

  const handleRetry = () => {
    setStep("confirm");
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center"
        onClick={handleClose}
      >
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-card rounded-t-3xl sm:rounded-3xl p-6 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">
              {step === "success" ? "Success!" : step === "error" ? "Failed" : "Add Money"}
            </h2>
            <button
              onClick={handleClose}
              className="rounded-full p-2 hover:bg-muted transition-colors"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            {step === "amount" && (
              <motion.div
                key="amount"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                {/* Source */}
                <div className="rounded-xl bg-muted/50 p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[#4CAF50] flex items-center justify-center">
                    <Smartphone className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">From M-Pesa</p>
                    <p className="font-medium text-foreground">{phoneNumber}</p>
                  </div>
                </div>

                {/* Amount Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-muted-foreground">
                      KES
                    </span>
                    <Input
                      type="text"
                      inputMode="numeric"
                      value={amount}
                      onChange={(e) => handleAmountChange(e.target.value)}
                      placeholder="0"
                      className={cn(
                        "pl-16 pr-4 h-14 text-2xl font-bold text-right",
                        error && "border-destructive focus-visible:ring-destructive"
                      )}
                    />
                  </div>
                  {error && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {error}
                    </p>
                  )}
                </div>

                {/* Preset Amounts */}
                <div className="flex flex-wrap gap-2">
                  {presetAmounts.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => handlePresetAmount(preset)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-sm font-medium transition-colors",
                        amount === preset.toString()
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80 text-foreground"
                      )}
                    >
                      {preset.toLocaleString()}
                    </button>
                  ))}
                </div>

                <Button
                  onClick={handleContinue}
                  className="w-full"
                  variant="hero"
                  size="lg"
                  disabled={!amount}
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            )}

            {step === "confirm" && (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                {/* Summary */}
                <div className="rounded-2xl border border-border p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="text-xl font-bold text-foreground">
                      KES {parseInt(amount).toLocaleString()}
                    </span>
                  </div>
                  <div className="h-px bg-border" />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">From</span>
                    <span className="font-medium text-foreground">{phoneNumber}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">To</span>
                    <span className="font-medium text-foreground">DailyWallet</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Fee</span>
                    <span className="font-medium text-primary">FREE</span>
                  </div>
                </div>

                {/* M-Pesa Notice */}
                <div className="rounded-xl bg-[#4CAF50]/10 p-4 flex items-start gap-3">
                  <Smartphone className="h-5 w-5 text-[#4CAF50] mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">
                      M-Pesa PIN Prompt
                    </p>
                    <p className="text-xs text-muted-foreground">
                      You will receive an M-Pesa prompt on your phone. Enter your PIN to complete the transaction.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setStep("amount")}
                    variant="outline"
                    size="lg"
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleConfirm}
                    variant="hero"
                    size="lg"
                    className="flex-1"
                  >
                    Confirm
                  </Button>
                </div>
              </motion.div>
            )}

            {step === "processing" && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="py-10 flex flex-col items-center text-center space-y-4"
              >
                <div className="relative">
                  <div className="h-20 w-20 rounded-full bg-[#4CAF50]/10 flex items-center justify-center">
                    <Smartphone className="h-10 w-10 text-[#4CAF50]" />
                  </div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0"
                  >
                    <div className="h-20 w-20 rounded-full border-2 border-transparent border-t-[#4CAF50]" />
                  </motion.div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">
                    Check your phone
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Enter your M-Pesa PIN to complete the transaction
                  </p>
                </div>
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </motion.div>
            )}

            {step === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="py-8 flex flex-col items-center text-center space-y-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 15, stiffness: 300, delay: 0.1 }}
                  className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center"
                >
                  <CheckCircle2 className="h-10 w-10 text-primary" />
                </motion.div>
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-foreground">
                    Money Added!
                  </h3>
                  <p className="text-3xl font-bold text-primary">
                    KES {parseInt(amount).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    has been added to your wallet
                  </p>
                </div>
                <Button
                  onClick={handleClose}
                  variant="hero"
                  size="lg"
                  className="w-full mt-4"
                >
                  Done
                </Button>
              </motion.div>
            )}

            {step === "error" && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="py-8 flex flex-col items-center text-center space-y-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 15, stiffness: 300, delay: 0.1 }}
                  className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center"
                >
                  <AlertCircle className="h-10 w-10 text-destructive" />
                </motion.div>
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-foreground">
                    Transaction Failed
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    The transaction was cancelled or timed out. Please try again.
                  </p>
                </div>
                <div className="flex gap-3 w-full mt-4">
                  <Button
                    onClick={handleClose}
                    variant="outline"
                    size="lg"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleRetry}
                    variant="hero"
                    size="lg"
                    className="flex-1"
                  >
                    Retry
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
