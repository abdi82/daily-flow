import { useState } from "react";
import { X, HelpCircle, MessageCircle, Phone, ChevronRight, Search, Book, ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const faqs = [
  {
    question: "How does DailyWallet work?",
    answer: "DailyWallet divides your income into time-based wallets: Daily, Weekly, Monthly, and Savings. Each wallet releases funds at specific intervals, helping you manage spending and build better financial habits."
  },
  {
    question: "When does my daily allowance reset?",
    answer: "Your daily wallet resets every morning at 6:00 AM. Any unspent money from the previous day is automatically moved to your savings."
  },
  {
    question: "How do I earn interest on my savings?",
    answer: "Your savings are invested in a Money Market Fund that earns approximately 13% annual interest. Interest is calculated daily and credited to your account."
  },
  {
    question: "Can I change my allocation percentages?",
    answer: "Yes! Go to Profile > Settings > Allocation to adjust how your income is split between Daily, Weekly, Monthly, and Savings wallets."
  },
  {
    question: "How do I withdraw from locked wallets?",
    answer: "Locked wallets (Weekly/Monthly) release their funds on schedule. For emergencies, you can request an early unlock, but this may affect your budget score."
  },
  {
    question: "Is my money safe?",
    answer: "Yes! DailyWallet is regulated by the Central Bank of Kenya. Your savings are held in licensed Money Market Funds with guaranteed returns."
  },
];

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = faqs.filter(
    faq => 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden max-h-[85vh]">
        <DialogHeader className="p-6 pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">Help Center</DialogTitle>
            <button
              onClick={onClose}
              className="rounded-full p-2 hover:bg-muted transition-colors"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </DialogHeader>

        <div className="overflow-y-auto">
          {/* Search */}
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-4 border-b border-border">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Get Support
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-auto flex-col gap-2 p-4">
                <MessageCircle className="h-6 w-6 text-primary" />
                <span className="text-sm">Live Chat</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 p-4">
                <Phone className="h-6 w-6 text-primary" />
                <span className="text-sm">Call Us</span>
              </Button>
            </div>
          </div>

          {/* FAQs */}
          <div className="p-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Frequently Asked Questions
            </h3>
            <Accordion type="single" collapsible className="w-full">
              {filteredFaqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-sm font-medium hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {filteredFaqs.length === 0 && (
              <div className="text-center py-8">
                <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No results found</p>
                <p className="text-sm text-muted-foreground">Try a different search term</p>
              </div>
            )}
          </div>

          {/* Resources */}
          <div className="p-4 border-t border-border">
            <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <Book className="h-5 w-5 text-primary" />
                <div className="text-left">
                  <p className="font-medium text-foreground">User Guide</p>
                  <p className="text-xs text-muted-foreground">Learn how to use DailyWallet</p>
                </div>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
