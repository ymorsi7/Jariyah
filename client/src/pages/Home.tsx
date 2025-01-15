import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { charities, getUserProfile, getRecommendedCharities } from '@/lib/mockData';
import { DonationModal } from '@/components/DonationModal';
import { CharityRecommendations } from '@/components/CharityRecommendations';
import { ZakatCalculator } from '@/components/ZakatCalculator';
import { ImpactMetrics } from '@/components/ImpactMetrics';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Calculator } from 'lucide-react';
import { DateRangePicker } from '@/components/DateRangePicker';
import { Donation } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [selectedCharity, setSelectedCharity] = useState<any>(null);
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date()
  });

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => getUserProfile()
  });

  const { data: recommendedCharities, isLoading: isLoadingRecommendations } = useQuery({
    queryKey: ['recommendedCharities', profile],
    queryFn: () => profile ? getRecommendedCharities(profile) : Promise.resolve([]),
    enabled: !!profile
  });

  if (isLoadingProfile) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-48 w-full" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return <div>Error loading profile</div>;
  }

  // Filter donations by date range
  const filteredDonations = profile.donations.filter((donation: Donation) => {
    const donationDate = new Date(donation.date);
    return donationDate >= dateRange.from && donationDate <= dateRange.to;
  });

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to Jariyah</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Your companion for meaningful Islamic philanthropy
        </p>
        <Button size="lg" className="gap-2" onClick={() => setSelectedCharity(charities[0])}>
          <Heart className="w-5 h-5" />
          Start Donating
        </Button>
      </section>

      {/* Impact Metrics */}
      <ImpactMetrics 
        data={recommendedCharities?.map(charity => ({
          charity,
          donations: filteredDonations
            .filter(d => d.charityId === charity.id)
            .reduce((sum, d) => sum + d.amount, 0)
        })) || []}
        profile={profile}
      />

      {/* Zakat Calculator Section */}
      <Card>
        <CardHeader>
          <Calculator className="w-8 h-8 mb-2 text-primary" />
          <CardTitle>Zakat Calculator</CardTitle>
          <CardDescription>
            Calculate your Zakat accurately with our comprehensive calculator
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ZakatCalculator />
        </CardContent>
      </Card>

      {/* Recommended Charities */}
      {!isLoadingRecommendations && recommendedCharities && (
        <CharityRecommendations
          charities={recommendedCharities}
          onDonate={setSelectedCharity}
        />
      )}

      {selectedCharity && (
        <DonationModal
          charity={selectedCharity}
          open={true}
          onClose={() => setSelectedCharity(null)}
        />
      )}
    </div>
  );
}