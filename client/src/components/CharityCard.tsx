import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Charity } from '@/lib/types';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';

interface CharityCardProps {
  charity: Charity;
  onDonate?: () => void;
}

export function CharityCard({ charity, onDonate }: CharityCardProps) {
  const [, setLocation] = useLocation();
  const progress = (charity.totalRaised / charity.goal) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden hover:ring-1 hover:ring-primary/20 transition-all cursor-pointer group">
        <div 
          className="aspect-[16/9] relative overflow-hidden"
          onClick={() => setLocation(`/charity/${charity.id}`)}
        >
          <img 
            src={charity.imageUrl} 
            alt={charity.name}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          <div className="absolute bottom-0 p-4">
            <h3 className="font-medium text-lg tracking-tight">{charity.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{charity.description}</p>
          </div>
        </div>
        <CardContent className="p-4 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>${charity.totalRaised.toLocaleString()}</span>
              <span className="text-muted-foreground">${charity.goal.toLocaleString()}</span>
            </div>
            <Progress 
              value={progress} 
              className="h-1.5 bg-muted"
            />
            <div className="text-xs text-muted-foreground">
              {progress.toFixed(1)}% of goal reached
            </div>
          </div>

          <Button 
            onClick={onDonate}
            className="w-full bg-primary/10 text-primary hover:bg-primary/20"
          >
            Donate Now
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}