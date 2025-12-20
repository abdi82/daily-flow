import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Wallet, ArrowRight, Check, Phone, Shield, 
  Calendar, PiggyBank, Sparkles, ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  InputOTP, 
  InputOTPGroup, 
  InputOTPSlot 
} from "@/components/ui/input-otp";
import { toast } from "sonner";

type OnboardingStep = "welcome" | "phone" | "verify" | "name" | "allocation" | "tutorial" | "complete";

const allocationOptions = [
  { id: "conservative", daily: 10, weekly: 25, monthly: 50, savings: 15, label: "Conservative", desc: "Save more, spend carefully" },
  { id: "balanced", daily: 15, weekly: 25, monthly: 40, savings: 20, label: "Balanced", desc: "Equal focus on spending & saving" },
  { id: "flexible", daily: 20, weekly: 30, monthly: 35, savings: 15, label: "Flexible", desc: "More daily spending freedom" },
];

const tutorialSteps = [
  {
    icon: Wallet,
    title: "Daily Wallet",
    description: "Your daily allowance unlocks every morning at 6 AM. Spend within this limit to stay on track.",
    color: "bg-primary",
  },
  {
    icon: Calendar,
    title: "Weekly & Monthly",
    description: "Larger expenses are locked until their release dates. This prevents overspending early in the period.",
    color: "bg-[hsl(200,85%,45%)]",
  },
  {
    icon: PiggyBank,
    title: "Savings (MMF)",
    description: "Your savings earn 13% annual interest in a Money Market Fund. Watch your wealth grow!",
    color: "bg-accent",
  },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("welcome");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [fullName, setFullName] = useState("");
  const [selectedAllocation, setSelectedAllocation] = useState("balanced");
  const [tutorialIndex, setTutorialIndex] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);

  const handlePhoneSubmit = () => {
    if (phoneNumber.length < 9) {
      toast.error("Please enter a valid phone number");
      return;
    }
    setCurrentStep("verify");
    toast.success("Verification code sent!", {
      description: `Code sent to +254 ${phoneNumber}`
    });
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter the complete code");
      return;
    }
    setIsVerifying(true);
    // Simulate verification
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsVerifying(false);
    
    if (otp === "123456") {
      toast.success("Phone verified!");
      setCurrentStep("name");
    } else {
      // For demo, accept any 6-digit code
      toast.success("Phone verified!");
      setCurrentStep("name");
    }
  };

  const handleNameSubmit = () => {
    if (fullName.trim().length < 2) {
      toast.error("Please enter your name");
      return;
    }
    setCurrentStep("allocation");
  };

  const handleAllocationComplete = () => {
    setCurrentStep("tutorial");
  };

  const handleTutorialNext = () => {
    if (tutorialIndex < tutorialSteps.length - 1) {
      setTutorialIndex(tutorialIndex + 1);
    } else {
      setCurrentStep("complete");
    }
  };

  const handleComplete = () => {
    toast.success("Welcome to DailyWallet! 🎉");
    navigate("/");
  };

  const goBack = () => {
    const stepOrder: OnboardingStep[] = ["welcome", "phone", "verify", "name", "allocation", "tutorial", "complete"];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      if (currentStep === "tutorial" && tutorialIndex > 0) {
        setTutorialIndex(tutorialIndex - 1);
      } else {
        setCurrentStep(stepOrder[currentIndex - 1]);
      }
    }
  };

  const showBackButton = currentStep !== "welcome" && currentStep !== "complete";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        {showBackButton ? (
          <button onClick={goBack} className="p-2 rounded-xl hover:bg-muted transition-colors">
            <ChevronLeft className="h-6 w-6 text-foreground" />
          </button>
        ) : (
          <div className="w-10" />
        )}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl gradient-primary flex items-center justify-center">
            <Wallet className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-foreground">DailyWallet</span>
        </div>
        <div className="w-10" />
      </div>

      {/* Progress Indicator */}
      {currentStep !== "welcome" && currentStep !== "complete" && (
        <div className="px-6 mb-4">
          <div className="flex gap-1.5">
            {["phone", "verify", "name", "allocation", "tutorial"].map((step, i) => (
              <div
                key={step}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  ["phone", "verify", "name", "allocation", "tutorial"].indexOf(currentStep) >= i
                    ? "bg-primary"
                    : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 px-6 flex flex-col">
        <AnimatePresence mode="wait">
          {/* Welcome Step */}
          {currentStep === "welcome" && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col items-center justify-center text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="h-24 w-24 rounded-3xl gradient-hero flex items-center justify-center mb-6 shadow-glow"
              >
                <Wallet className="h-12 w-12 text-primary-foreground" />
              </motion.div>
              
              <h1 className="text-3xl font-bold text-foreground mb-3">
                Welcome to DailyWallet
              </h1>
              <p className="text-muted-foreground max-w-xs mb-8">
                Smart money management that helps you build better spending habits, one day at a time.
              </p>

              <div className="space-y-3 w-full max-w-xs">
                <Button variant="hero" size="lg" className="w-full" onClick={() => setCurrentStep("phone")}>
                  Get Started
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <p className="text-xs text-muted-foreground">
                  By continuing, you agree to our Terms of Service
                </p>
              </div>
            </motion.div>
          )}

          {/* Phone Step */}
          {currentStep === "phone" && (
            <motion.div
              key="phone"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col"
            >
              <div className="flex-1 flex flex-col justify-center">
                <div className="h-16 w-16 rounded-2xl bg-primary-light flex items-center justify-center mb-6">
                  <Phone className="h-8 w-8 text-primary" />
                </div>
                
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  What's your phone number?
                </h1>
                <p className="text-muted-foreground mb-6">
                  We'll send you a verification code via SMS
                </p>

                <div className="flex gap-3 items-center">
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-border bg-card">
                    <span className="text-lg">🇰🇪</span>
                    <span className="font-medium text-foreground">+254</span>
                  </div>
                  <Input
                    type="tel"
                    placeholder="712 345 678"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 9))}
                    className="flex-1 text-lg"
                  />
                </div>
              </div>

              <div className="pb-8">
                <Button 
                  variant="hero" 
                  size="lg" 
                  className="w-full" 
                  onClick={handlePhoneSubmit}
                  disabled={phoneNumber.length < 9}
                >
                  Send Verification Code
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Verify Step */}
          {currentStep === "verify" && (
            <motion.div
              key="verify"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col"
            >
              <div className="flex-1 flex flex-col justify-center">
                <div className="h-16 w-16 rounded-2xl bg-primary-light flex items-center justify-center mb-6">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Verify your number
                </h1>
                <p className="text-muted-foreground mb-6">
                  Enter the 6-digit code sent to +254 {phoneNumber}
                </p>

                <div className="flex justify-center mb-6">
                  <InputOTP
                    value={otp}
                    onChange={setOtp}
                    maxLength={6}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <button className="text-sm text-primary font-medium hover:underline">
                  Didn't receive the code? Resend
                </button>
              </div>

              <div className="pb-8">
                <Button 
                  variant="hero" 
                  size="lg" 
                  className="w-full" 
                  onClick={handleVerifyOtp}
                  disabled={otp.length !== 6 || isVerifying}
                >
                  {isVerifying ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                      />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Name Step */}
          {currentStep === "name" && (
            <motion.div
              key="name"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col"
            >
              <div className="flex-1 flex flex-col justify-center">
                <div className="h-16 w-16 rounded-2xl gradient-accent flex items-center justify-center mb-6">
                  <Sparkles className="h-8 w-8 text-accent-foreground" />
                </div>
                
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  What should we call you?
                </h1>
                <p className="text-muted-foreground mb-6">
                  This helps personalize your experience
                </p>

                <Input
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="text-lg"
                />
              </div>

              <div className="pb-8">
                <Button 
                  variant="hero" 
                  size="lg" 
                  className="w-full" 
                  onClick={handleNameSubmit}
                  disabled={fullName.trim().length < 2}
                >
                  Continue
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Allocation Step */}
          {currentStep === "allocation" && (
            <motion.div
              key="allocation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col"
            >
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Choose your spending style
                </h1>
                <p className="text-muted-foreground mb-6">
                  This determines how your income is split across wallets. You can change this anytime.
                </p>

                <div className="space-y-3">
                  {allocationOptions.map((option) => (
                    <motion.button
                      key={option.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedAllocation(option.id)}
                      className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                        selectedAllocation === option.id
                          ? "border-primary bg-primary-light"
                          : "border-border bg-card hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-semibold text-foreground">{option.label}</p>
                          <p className="text-sm text-muted-foreground">{option.desc}</p>
                        </div>
                        {selectedAllocation === option.id && (
                          <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                            <Check className="h-4 w-4 text-primary-foreground" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <div className="flex-1 rounded-lg bg-primary/10 p-2 text-center">
                          <p className="text-xs text-muted-foreground">Daily</p>
                          <p className="font-bold text-primary">{option.daily}%</p>
                        </div>
                        <div className="flex-1 rounded-lg bg-[hsl(200,85%,45%)]/10 p-2 text-center">
                          <p className="text-xs text-muted-foreground">Weekly</p>
                          <p className="font-bold text-[hsl(200,85%,45%)]">{option.weekly}%</p>
                        </div>
                        <div className="flex-1 rounded-lg bg-[hsl(260,70%,55%)]/10 p-2 text-center">
                          <p className="text-xs text-muted-foreground">Monthly</p>
                          <p className="font-bold text-[hsl(260,70%,55%)]">{option.monthly}%</p>
                        </div>
                        <div className="flex-1 rounded-lg bg-accent/10 p-2 text-center">
                          <p className="text-xs text-muted-foreground">Savings</p>
                          <p className="font-bold text-accent">{option.savings}%</p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="pb-8 pt-4">
                <Button 
                  variant="hero" 
                  size="lg" 
                  className="w-full" 
                  onClick={handleAllocationComplete}
                >
                  Continue
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Tutorial Step */}
          {currentStep === "tutorial" && (
            <motion.div
              key="tutorial"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col"
            >
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={tutorialIndex}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="flex flex-col items-center"
                  >
                    <div className={`h-20 w-20 rounded-3xl ${tutorialSteps[tutorialIndex].color} flex items-center justify-center mb-6 shadow-lg`}>
                      {(() => {
                        const Icon = tutorialSteps[tutorialIndex].icon;
                        return <Icon className="h-10 w-10 text-primary-foreground" />;
                      })()}
                    </div>
                    
                    <h2 className="text-2xl font-bold text-foreground mb-3">
                      {tutorialSteps[tutorialIndex].title}
                    </h2>
                    <p className="text-muted-foreground max-w-xs">
                      {tutorialSteps[tutorialIndex].description}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Dots indicator */}
                <div className="flex gap-2 mt-8">
                  {tutorialSteps.map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 rounded-full transition-all ${
                        i === tutorialIndex ? "w-6 bg-primary" : "w-2 bg-muted"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="pb-8">
                <Button 
                  variant="hero" 
                  size="lg" 
                  className="w-full" 
                  onClick={handleTutorialNext}
                >
                  {tutorialIndex < tutorialSteps.length - 1 ? "Next" : "Get Started"}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Complete Step */}
          {currentStep === "complete" && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col items-center justify-center text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="h-24 w-24 rounded-full gradient-accent flex items-center justify-center mb-6 shadow-accent"
              >
                <Check className="h-12 w-12 text-accent-foreground" />
              </motion.div>
              
              <h1 className="text-3xl font-bold text-foreground mb-3">
                You're all set, {fullName.split(" ")[0]}!
              </h1>
              <p className="text-muted-foreground max-w-xs mb-8">
                Your DailyWallet is ready. Start building better spending habits today!
              </p>

              <Button variant="hero" size="lg" className="w-full max-w-xs" onClick={handleComplete}>
                Open My Wallet
                <ArrowRight className="h-5 w-5" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
