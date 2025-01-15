import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { Charity } from '@/lib/types';
import { useLocation } from 'wouter';

interface CharityRecommendationsProps {
  charities: (Charity & { matchScore: number })[];
  onDonate: (charity: Charity) => void;
}

export function CharityRecommendations({ charities, onDonate }: CharityRecommendationsProps) {
  const [, setLocation] = useLocation();

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        Recommended for You
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        {charities.slice(0, 4).map((charity) => {
          const progress = (charity.totalRaised / charity.goal) * 100;
          const matchPercentage = (charity.matchScore / 10) * 100;

          return (
            <motion.div
              key={charity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden hover:ring-1 hover:ring-primary/20 transition-all cursor-pointer group">
                <div 
                  className="aspect-video relative overflow-hidden"
                  onClick={() => setLocation(`/charity/${charity.id}`)}
                >
                  <img 
                    src={charity.imageUrl} 
                    alt={charity.name}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  <div className="absolute bottom-0 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="px-2 py-1 rounded-full bg-primary/20 text-primary text-xs">
                        {matchPercentage.toFixed(0)}% Match
                      </div>
                    </div>
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
                    <Progress value={progress} className="h-1.5 bg-muted" />
                    <div className="flex flex-wrap gap-2">
                      {charity.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Button 
                    onClick={() => onDonate(charity)}
                    className="w-full bg-primary/10 text-primary hover:bg-primary/20"
                  >
                    Donate Now
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
