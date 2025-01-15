import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { charities } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function CharitiesList() {
  const { data: charitiesList, isLoading } = useQuery({
    queryKey: ['charities'],
    queryFn: () => charities
  });

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array(6).fill(0).map((_, i) => (
          <Skeleton key={i} className="h-[300px]" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Charities</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {charitiesList.map((charity) => (
          <Card key={charity.id} className="overflow-hidden">
            <div className="aspect-video relative">
              <img
                src={charity.imageUrl}
                alt={charity.name}
                className="object-cover w-full h-full"
              />
            </div>
            <CardHeader>
              <CardTitle>{charity.name}</CardTitle>
              <CardDescription>{charity.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  {charity.impact.description}
                </div>
                <Link href={`/charity/${charity.id}`}>
                  <Button className="w-full gap-2">
                    <Heart className="w-4 h-4" />
                    Donate Now
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
