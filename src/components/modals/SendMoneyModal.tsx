import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, CheckCircle2, Loader2, AlertCircle,
  Smartphone, ArrowRight, User, Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Step = "recipient" | "amount" | "confirm" | "processing" | "success" | "error";

interface SendMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
  onSuccess?: (amount: number, recipient: string) => void;
}

const quickAmounts = [50, 100, 200, 500];

// Recent recipients for quick selection
const recentRecipients = [
  { name: "Mama Pima", phone: "+254 722 111 222" },
  { name: "John K.", phone: "+254 733 444 555" },
  { name: "Safaricom", phone: "+254 700 000 000" },
];

export function SendMoneyModal({ 
  isOpen, 
  onClose, 
  availableBalance,
  onSuccess 
}: SendMoneyModalProps) {
  const [step, setStep] = useState<Step>("recipient");
  const [recipient, setRecipient] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const handlePhoneChange = (value: string) => {
    // Format phone number
    const cleaned = value.replace(/[^0-9+]/g, "");
    setRecipient(cleaned);
    setError("");
  };

  const handleSelectRecent = (recent: typeof recentRecipients[0]) => {
    setRecipient(recent.phone);
    setRecipientName(recent.name);
    setStep("amount");
  };

  const handleContinueToAmount = () => {
    if (!recipient || recipient.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }
    if (!recipientName) {
      // Simulate looking up name
      setRecipientName("M-Pesa User");
    }
    setStep("amount");
  };

  const handleAmountChange = (value: string) => {
    const numValue = value.replace(/[^0-9]/g, "");
    setAmount(numValue);
    setError("");
  };

  const handleQuickAmount = (preset: number) => {
    setAmount(preset.toString());
    setError("");
  };

  const handleContinueToConfirm = () => {
    const numAmount = parseInt(amount);
    if (!amount || numAmount < 10) {
      setError("Minimum amount is KES 10");
      return;
    }
    if (numAmount > availableBalance) {
      setError(`Insufficient balance. Available: KES ${availableBalance.toLocaleString()}`);
      return;
    }
    setStep("confirm");
  };

  const handleConfirm = async () => {
    setStep("processing");
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Simulate 95% success rate
    if (Math.random() > 0.05) {
      setStep("success");
      onSuccess?.(parseInt(amount), recipient);
    } else {
      setStep("error");
    }
  };

  const handleClose = () => {
    setStep("recipient");
    setRecipient("");
    setRecipientName("");
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
              {step === "success" ? "Sent!" : step === "error" ? "Failed" : "Send Money"}
            </h2>
            <button
              onClick={handleClose}
              className="rounded-full p-2 hover:bg-muted transition-colors"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          {/* Step Indicator */}
          {["recipient", "amount", "confirm"].includes(step) && (
            <div className="flex items-center gap-2 mb-6">
              {["recipient", "amount", "confirm"].map((s, i) => (
                <div key={s} className="flex items-center gap-2 flex-1">
                  <div
                    className={cn(
                      "h-1.5 rounded-full flex-1 transition-colors",
                      ["recipient", "amount", "confirm"].indexOf(step) >= i
                        ? "bg-primary"
                        : "bg-muted"
                    )}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Step Content */}
          <AnimatePresence mode="wait">
            {step === "recipient" && (
              <motion.div
                key="recipient"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                {/* Phone Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Recipient Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="tel"
                      value={recipient}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      placeholder="+254 7XX XXX XXX"
                      className={cn(
                        "pl-12 h-14 text-lg",
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

                {/* Recipient Name (optional) */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Recipient Name (optional)
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="Enter name"
                      className="pl-12 h-12"
                    />
                  </div>
                </div>

                {/* Recent Recipients */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Recent</p>
                  <div className="space-y-2">
                    {recentRecipients.map((recent) => (
                      <button
                        key={recent.phone}
                        onClick={() => handleSelectRecent(recent)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors text-left"
                      >
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary">
                            {recent.name.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{recent.name}</p>
                          <p className="text-xs text-muted-foreground">{recent.phone}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleContinueToAmount}
                  className="w-full"
                  variant="hero"
                  size="lg"
                  disabled={!recipient}
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            )}

            {step === "amount" && (
              <motion.div
                key="amount"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                {/* Recipient Info */}
                <div className="rounded-xl bg-muted/50 p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {recipientName.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{recipientName}</p>
                    <p className="text-xs text-muted-foreground">{recipient}</p>
                  </div>
                </div>

                {/* Amount Input */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground">Amount</label>
                    <span className="text-xs text-muted-foreground">
                      Available: KES {availableBalance.toLocaleString()}
                    </span>
                  </div>
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

                {/* Quick Amounts */}
                <div className="flex flex-wrap gap-2">
                  {quickAmounts.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => handleQuickAmount(preset)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-sm font-medium transition-colors",
                        amount === preset.toString()
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80 text-foreground"
                      )}
                    >
                      {preset}
                    </button>
                  ))}
                  <button
                    onClick={() => handleQuickAmount(availableBalance)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-sm font-medium transition-colors",
                      amount === availableBalance.toString()
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80 text-foreground"
                    )}
                  >
                    All ({availableBalance})
                  </button>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setStep("recipient")}
                    variant="outline"
                    size="lg"
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleContinueToConfirm}
                    variant="hero"
                    size="lg"
                    className="flex-1"
                    disabled={!amount}
                  >
                    Continue
                  </Button>
                </div>
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
                    <span className="text-muted-foreground">To</span>
                    <div className="text-right">
                      <p className="font-medium text-foreground">{recipientName}</p>
                      <p className="text-xs text-muted-foreground">{recipient}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Fee</span>
                    <span className="font-medium text-primary">FREE</span>
                  </div>
                  <div className="h-px bg-border" />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total</span>
                    <span className="text-lg font-bold text-foreground">
                      KES {parseInt(amount).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Balance After */}
                <div className="rounded-xl bg-muted/50 p-4 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Balance after</span>
                  <span className="font-semibold text-foreground">
                    KES {(availableBalance - parseInt(amount)).toLocaleString()}
                  </span>
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
                    Send Money
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
                  <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <Smartphone className="h-10 w-10 text-primary" />
                  </div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0"
                  >
                    <div className="h-20 w-20 rounded-full border-2 border-transparent border-t-primary" />
                  </motion.div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">
                    Sending money...
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Please wait while we process your transaction
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
                    Money Sent!
                  </h3>
                  <p className="text-3xl font-bold text-primary">
                    KES {parseInt(amount).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    sent to {recipientName}
                  </p>
                </div>

                {/* Confirmation Details */}
                <div className="w-full rounded-xl bg-muted/50 p-4 text-left space-y-2 mt-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Transaction ID</span>
                    <span className="font-mono text-foreground">TXN{Date.now().toString().slice(-8)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Time</span>
                    <span className="text-foreground">{new Date().toLocaleTimeString()}</span>
                  </div>
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
                    Transfer Failed
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Unable to complete the transfer. Please check the recipient details and try again.
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
