import { Badge, UserProfile } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  Heart,
  Repeat,
  Target,
  Sparkles,
  GanttChart,
  Flame,
  Trophy
} from 'lucide-react';

const BADGES: Omit<Badge, 'unlockedAt' | 'progress'>[] = [
  {
    id: 'first-donation',
    name: 'First Steps',
    description: 'Made your first donation',
    icon: 'Heart',
    category: 'milestone',
    requirement: 1
  },
  {
    id: 'recurring-donor',
    name: 'Committed Giver',
    description: 'Set up recurring donations',
    icon: 'Repeat',
    category: 'consistency',
    requirement: 1
  },
  {
    id: 'diverse-causes',
    name: 'Diverse Impact',
    description: 'Donated to 3 different causes',
    icon: 'Target',
    category: 'diversity',
    requirement: 3
  },
  {
    id: 'milestone-100',
    name: 'Century Mark',
    description: 'Reached $100 in total donations',
    icon: 'Award',
    category: 'milestone',
    requirement: 100
  },
  {
    id: 'milestone-1000',
    name: 'Grand Contributor',
    description: 'Reached $1,000 in total donations',
    icon: 'Trophy',
    category: 'milestone',
    requirement: 1000
  },
  {
    id: 'consistent-monthly',
    name: 'Monthly Champion',
    description: 'Donated every month for 3 months',
    icon: 'Flame',
    category: 'consistency',
    requirement: 3
  }
];

const IconMap: Record<string, React.ComponentType<any>> = {
  Heart,
  Repeat,
  Target,
  Award,
  Sparkles,
  GanttChart,
  Flame,
  Trophy
};

interface AchievementBadgesProps {
  profile: UserProfile;
}

export function AchievementBadges({ profile }: AchievementBadgesProps) {
  const getBadgeProgress = (badge: Badge): number => {
    switch (badge.id) {
      case 'first-donation':
        return profile.donations.length > 0 ? 100 : 0;
      case 'recurring-donor':
        return profile.donations.some(d => d.isRecurring) ? 100 : 0;
      case 'diverse-causes':
        const uniqueCauses = new Set(profile.donations.map(d => d.charityId)).size;
        return Math.min((uniqueCauses / badge.requirement) * 100, 100);
      case 'milestone-100':
      case 'milestone-1000':
        return Math.min((profile.totalDonated / badge.requirement) * 100, 100);
      case 'consistent-monthly':
        const months = new Set(
          profile.donations.map(d => 
            new Date(d.date).toISOString().slice(0, 7)
          )
        ).size;
        return Math.min((months / badge.requirement) * 100, 100);
      default:
        return 0;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <AnimatePresence>
            {BADGES.map((badge) => {
              const progress = getBadgeProgress(badge);
              const Icon = IconMap[badge.icon];
              const isUnlocked = progress === 100;

              return (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 rounded-lg border ${
                    isUnlocked ? 'bg-primary/5 border-primary/20' : 'bg-muted/50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <motion.div 
                      className={`p-2 rounded-full ${
                        isUnlocked ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                      }`}
                      animate={{
                        scale: isUnlocked ? [1, 1.2, 1] : 1,
                      }}
                      transition={{
                        duration: 0.3,
                        repeat: isUnlocked ? 0 : undefined,
                        repeatType: "reverse"
                      }}
                    >
                      <Icon className="h-6 w-6" />
                    </motion.div>
                    <div className="flex-1 space-y-1">
                      <div className="font-medium">{badge.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {badge.description}
                      </div>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                      >
                        <Progress value={progress} className="h-1" />
                      </motion.div>
                      <motion.div 
                        className="text-xs text-muted-foreground"
                        animate={{ opacity: [0.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                      >
                        {progress.toFixed(0)}% complete
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}