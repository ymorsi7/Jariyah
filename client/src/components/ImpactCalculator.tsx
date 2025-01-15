import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { Charity } from '@/lib/types';

interface ImpactCalculatorProps {
  charity: Charity;
}

export function ImpactCalculator({ charity }: ImpactCalculatorProps) {
  const [amount, setAmount] = useState(50);
  const [impactData, setImpactData] = useState<{ name: string; value: number }[]>([]);

  // Calculate impact metrics based on donation amount
  useEffect(() => {
    const metrics = charity.impact.metrics.map(metric => ({
      name: metric.impact,
      value: Math.floor(amount / metric.amount)
    })).filter(m => m.value > 0);

    setImpactData(metrics);
  }, [amount, charity.impact.metrics]);

  const COLORS = ['hsl(147, 98%, 39%)', 'hsl(167, 98%, 39%)', 'hsl(187, 98%, 39%)'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Impact Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <span className="text-2xl font-bold">$</span>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="text-2xl font-bold"
            />
          </div>
          <Slider
            value={[amount]}
            onValueChange={(values) => setAmount(values[0])}
            max={1000}
            step={10}
            className="py-4"
          />
        </div>

        <div className="h-[300px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={amount}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={impactData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {impactData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value}x ${name}`, 'Impact']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="space-y-2">
          {impactData.map((impact, index) => (
            <motion.div
              key={impact.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex justify-between items-center"
            >
              <span className="text-sm text-muted-foreground">{impact.name}</span>
              <span className="font-medium">{impact.value}x</span>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
