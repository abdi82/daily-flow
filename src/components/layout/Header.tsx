import { motion } from "framer-motion";
import { Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  userName: string;
  greeting?: string;
}

export function Header({ userName, greeting }: HeaderProps) {
  const getGreeting = () => {
    if (greeting) return greeting;
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center justify-between py-4"
    >
      <div className="flex items-center gap-3">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="flex h-11 w-11 items-center justify-center rounded-full gradient-primary text-primary-foreground font-bold text-lg shadow-md"
        >
          {userName.charAt(0).toUpperCase()}
        </motion.div>
        <div>
          <p className="text-sm text-muted-foreground">{getGreeting()}</p>
          <p className="font-semibold text-foreground">{userName}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon-sm" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
            2
          </span>
        </Button>
        <Button variant="ghost" size="icon-sm">
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </motion.header>
  );
}
