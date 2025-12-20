import { useState } from "react";
import { motion } from "framer-motion";
import { X, Bell, Shield, Moon, Sun, Globe, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [notifications, setNotifications] = useState({
    dailyReminder: true,
    budgetAlerts: true,
    interestUpdates: false,
    promotions: false,
  });
  const [darkMode, setDarkMode] = useState(false);
  const [biometrics, setBiometrics] = useState(true);

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    toast.success("Settings updated");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">Settings</DialogTitle>
            <button
              onClick={onClose}
              className="rounded-full p-2 hover:bg-muted transition-colors"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-y-auto">
          {/* Appearance */}
          <div className="p-4 border-b border-border">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Appearance
            </h3>
            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                {darkMode ? (
                  <Moon className="h-5 w-5 text-primary" />
                ) : (
                  <Sun className="h-5 w-5 text-primary" />
                )}
                <div>
                  <p className="font-medium text-foreground">Dark Mode</p>
                  <p className="text-xs text-muted-foreground">Toggle dark theme</p>
                </div>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>
          </div>

          {/* Notifications */}
          <div className="p-4 border-b border-border">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Notifications
            </h3>
            <div className="space-y-1">
              <motion.div className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Daily Reminder</p>
                    <p className="text-xs text-muted-foreground">Get notified about daily budget</p>
                  </div>
                </div>
                <Switch 
                  checked={notifications.dailyReminder} 
                  onCheckedChange={() => handleNotificationChange("dailyReminder")} 
                />
              </motion.div>

              <motion.div className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-accent" />
                  <div>
                    <p className="font-medium text-foreground">Budget Alerts</p>
                    <p className="text-xs text-muted-foreground">Warn when nearing limit</p>
                  </div>
                </div>
                <Switch 
                  checked={notifications.budgetAlerts} 
                  onCheckedChange={() => handleNotificationChange("budgetAlerts")} 
                />
              </motion.div>

              <motion.div className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">Interest Updates</p>
                    <p className="text-xs text-muted-foreground">Weekly earnings summary</p>
                  </div>
                </div>
                <Switch 
                  checked={notifications.interestUpdates} 
                  onCheckedChange={() => handleNotificationChange("interestUpdates")} 
                />
              </motion.div>
            </div>
          </div>

          {/* Security */}
          <div className="p-4 border-b border-border">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Security
            </h3>
            <div className="space-y-1">
              <motion.div className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Biometric Login</p>
                    <p className="text-xs text-muted-foreground">Use fingerprint or Face ID</p>
                  </div>
                </div>
                <Switch checked={biometrics} onCheckedChange={setBiometrics} />
              </motion.div>

              <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <div className="text-left">
                    <p className="font-medium text-foreground">Change PIN</p>
                    <p className="text-xs text-muted-foreground">Update your security PIN</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Language */}
          <div className="p-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Regional
            </h3>
            <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-primary" />
                <div className="text-left">
                  <p className="font-medium text-foreground">Language</p>
                  <p className="text-xs text-muted-foreground">English</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
