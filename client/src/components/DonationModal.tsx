import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Charity, Donation } from '@/lib/types';
import { getUserProfile, saveUserProfile } from '@/lib/mockData';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface DonationModalProps {
  charity: Charity;
  open: boolean;
  onClose: () => void;
}

export function DonationModal({ charity, open, onClose }: DonationModalProps) {
  const { toast } = useToast();
  const [amount, setAmount] = useState('10');
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  const initialFocusRef = useRef<HTMLButtonElement>(null);

  const presetAmounts = ['10', '25', '50', '100', '250', '500'];

  const handleDonate = () => {
    const donation: Donation = {
      id: crypto.randomUUID(),
      charityId: charity.id,
      amount: Number(amount),
      date: new Date().toISOString(),
      isRecurring,
      frequency: isRecurring ? frequency : undefined
    };

    const profile = getUserProfile();
    profile.donations.push(donation);
    profile.totalDonated += Number(amount);
    saveUserProfile(profile);

    toast({
      title: 'Donation Successful',
      description: `Thank you for your ${isRecurring ? `${frequency} ` : ''}donation of $${amount} to ${charity.name}.`,
      duration: 5000,
    });

    onClose();
  };

  // Focus the first preset amount button when modal opens
  useEffect(() => {
    if (open) {
      initialFocusRef.current?.focus();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-md"
        aria-labelledby="donation-title"
        role="dialog"
      >
        <DialogHeader>
          <DialogTitle id="donation-title">Donate to {charity.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <Label id="amount-label">Quick Select Amount</Label>
            <div 
              className="grid grid-cols-3 gap-2"
              role="radiogroup"
              aria-labelledby="amount-label"
            >
              {presetAmounts.map((preset, index) => (
                <motion.div
                  key={preset}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    ref={index === 0 ? initialFocusRef : undefined}
                    variant={amount === preset ? 'default' : 'outline'}
                    onClick={() => setAmount(preset)}
                    className={`w-full h-12 text-lg font-semibold ${
                      amount === preset 
                        ? 'bg-primary text-primary-foreground shadow-lg' 
                        : 'hover:bg-primary/10 hover:text-primary'
                    }`}
                    role="radio"
                    aria-checked={amount === preset}
                    aria-label={`Donate $${preset}`}
                  >
                    ${preset}
                  </Button>
                </motion.div>
              ))}
            </div>

            <div className="relative mt-4">
              <Label htmlFor="custom-amount">Custom Amount</Label>
              <div className="relative mt-1.5">
                <span 
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                >
                  $
                </span>
                <Input
                  id="custom-amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-8 text-lg"
                  placeholder="Enter amount"
                  aria-label="Enter custom donation amount"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="recurring-toggle" className="text-base">Recurring Donation</Label>
              <div className="text-sm text-muted-foreground">
                Support {charity.name} with regular donations
              </div>
            </div>
            <Switch
              id="recurring-toggle"
              checked={isRecurring}
              onCheckedChange={setIsRecurring}
              aria-label="Make this a recurring donation"
            />
          </div>

          {isRecurring && (
            <div className="space-y-2">
              <Label htmlFor="frequency-select">Frequency</Label>
              <Select 
                value={frequency} 
                onValueChange={(value: any) => setFrequency(value)}
                id="frequency-select"
              >
                <SelectTrigger aria-label="Select donation frequency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <Button 
            onClick={handleDonate} 
            className="w-full h-12 text-lg font-semibold"
            aria-label={`Donate $${amount}${isRecurring ? ` ${frequency}` : ''} to ${charity.name}`}
          >
            Donate ${amount}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}