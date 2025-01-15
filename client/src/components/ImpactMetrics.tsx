import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Charity, UserProfile } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Heart, Target, Flame } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useState, useEffect } from 'react';

interface ImpactMetricsProps {
  data: {
    charity: Charity;
    donations: number;
  }[];
  profile: UserProfile;
}

const DONATION_TIERS = [
  { level: 1, name: 'Supporter', threshold: 0, icon: Heart },
  { level: 2, name: 'Champion', threshold: 500, icon: Target },
  { level: 3, name: 'Guardian', threshold: 1000, icon: Award },
  { level: 4, name: 'Legend', threshold: 5000, icon: Flame },
];

export function ImpactMetrics({ data, profile }: ImpactMetricsProps) {
  const [showCelebration, setShowCelebration] = useState(false);
  const currentTier = DONATION_TIERS.reduce((acc, tier) => 
    profile.totalDonated >= tier.threshold ? tier : acc
  , DONATION_TIERS[0]);

  const nextTier = DONATION_TIERS.find(tier => 
    profile.totalDonated < tier.threshold
  );

  const progressToNextTier = nextTier 
    ? ((profile.totalDonated - currentTier.threshold) / (nextTier.threshold - currentTier.threshold)) * 100
    : 100;

  useEffect(() => {
    if (profile.donations.length > 0) {
      const latestDonation = profile.donations[profile.donations.length - 1];
      const donationDate = new Date(latestDonation.date);
      const isRecent = (new Date().getTime() - donationDate.getTime()) < 5000; // 5 seconds
      if (isRecent) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
      }
    }
  }, [profile.donations]);

  const CurrentTierIcon = currentTier.icon;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="relative overflow-hidden">
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute inset-0 bg-primary/20 z-10 flex items-center justify-center"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 0.5, repeat: 2 }}
                className="text-primary text-xl font-bold"
              >
                Impact Milestone Reached! 🎉
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        <CardHeader>
          <CardTitle>Total Impact</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${profile.totalDonated.toLocaleString()}</div>
          <div className="mt-4 space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-primary/20">
                <CurrentTierIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="font-medium">{currentTier.name}</div>
                <div className="text-sm text-muted-foreground">Level {currentTier.level}</div>
              </div>
            </div>
            {nextTier && (
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  Progress to {nextTier.name}
                </div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                >
                  <Progress value={progressToNextTier} className="h-2" />
                </motion.div>
                <div className="text-sm text-muted-foreground">
                  ${(nextTier.threshold - profile.totalDonated).toLocaleString()} to next level
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Impact Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis 
                dataKey="charity.name"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip
                contentStyle={{
                  background: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                }}
              />
              <Bar 
                dataKey="donations"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}