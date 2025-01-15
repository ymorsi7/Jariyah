import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator } from 'lucide-react';

const formSchema = z.object({
  cash: z.number().min(0).default(0),
  gold: z.number().min(0).default(0),
  silver: z.number().min(0).default(0),
  investments: z.number().min(0).default(0),
  businessAssets: z.number().min(0).default(0),
  otherAssets: z.number().min(0).default(0),
});

type FormValues = z.infer<typeof formSchema>;

export function ZakatCalculator() {
  const [result, setResult] = useState<{total: number, breakdown: Record<string, number>} | null>(null);

  // Current gold and silver prices (you would typically fetch these from an API)
  const GOLD_PRICE_PER_GRAM = 60; // USD
  const SILVER_PRICE_PER_GRAM = 0.80; // USD
  const NISAB_GOLD_GRAMS = 85; // grams
  const NISAB_SILVER_GRAMS = 595; // grams
  const ZAKAT_RATE = 0.025; // 2.5%

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cash: 0,
      gold: 0,
      silver: 0,
      investments: 0,
      businessAssets: 0,
      otherAssets: 0,
    },
  });

  const calculateZakat = (values: FormValues) => {
    const totalWealth = Object.values(values).reduce((sum, val) => sum + val, 0);
    const nisabGold = GOLD_PRICE_PER_GRAM * NISAB_GOLD_GRAMS;
    const nisabSilver = SILVER_PRICE_PER_GRAM * NISAB_SILVER_GRAMS;
    const nisabThreshold = Math.min(nisabGold, nisabSilver);

    if (totalWealth >= nisabThreshold) {
      const zakatAmount = totalWealth * ZAKAT_RATE;
      const breakdown = Object.entries(values).reduce((acc, [key, value]) => {
        acc[key] = value * ZAKAT_RATE;
        return acc;
      }, {} as Record<string, number>);

      setResult({ total: zakatAmount, breakdown });
    } else {
      setResult(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          <CardTitle>Zakat Calculator</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(calculateZakat)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              {[
                { name: 'cash', label: 'Cash & Bank Balances' },
                { name: 'gold', label: 'Gold Value' },
                { name: 'silver', label: 'Silver Value' },
                { name: 'investments', label: 'Investments & Shares' },
                { name: 'businessAssets', label: 'Business Assets' },
                { name: 'otherAssets', label: 'Other Assets' },
              ].map(({ name, label }) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name as keyof FormValues}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{label}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                          <Input 
                            {...field} 
                            type="number" 
                            className="pl-8"
                            onChange={e => field.onChange(Number(e.target.value))}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>

            <Button type="submit" className="w-full">Calculate Zakat</Button>

            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <Separator />
                  <div className="rounded-lg bg-primary/5 p-4">
                    <div className="text-lg font-medium mb-4">
                      Total Zakat Due: <span className="text-primary">${result.total.toFixed(2)}</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      {Object.entries(result.breakdown).map(([category, amount]) => (
                        amount > 0 && (
                          <div key={category} className="flex justify-between">
                            <span className="text-muted-foreground capitalize">
                              {category.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <span>${amount.toFixed(2)}</span>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    Pay Zakat Now
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}