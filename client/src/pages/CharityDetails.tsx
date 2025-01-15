import { useState } from 'react';
import { useRoute } from 'wouter';
import { charities } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { DonationModal } from '@/components/DonationModal';
import { ImpactCalculator } from '@/components/ImpactCalculator';

export default function CharityDetails() {
  const [, params] = useRoute('/charity/:id');
  const [showDonationModal, setShowDonationModal] = useState(false);

  const charity = charities.find(c => c.id === params?.id);

  if (!charity) {
    return <div>Charity not found</div>;
  }

  const progress = (charity.totalRaised / charity.goal) * 100;

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-4xl mx-auto">
        <div className="aspect-video mb-8 rounded-lg overflow-hidden">
          <img
            src={charity.imageUrl}
            alt={charity.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{charity.name}</h1>
              <p className="text-muted-foreground">{charity.description}</p>
            </div>

            <ImpactCalculator charity={charity} />
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>${charity.totalRaised.toLocaleString()}</span>
                    <span>${charity.goal.toLocaleString()}</span>
                  </div>
                  <Progress value={progress} />
                </div>

                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => setShowDonationModal(true)}
                >
                  Donate Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <DonationModal
        charity={charity}
        open={showDonationModal}
        onClose={() => setShowDonationModal(false)}
      />
    </div>
  );
}