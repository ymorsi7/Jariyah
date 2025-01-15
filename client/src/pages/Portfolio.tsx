import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUserProfile, getRecommendedCharities } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip } from 'recharts';
import { DateRangePicker } from '@/components/DateRangePicker';
import { Donation, UserProfile } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const COLORS = ['hsl(147, 98%, 39%)', 'hsl(167, 98%, 39%)', 'hsl(187, 98%, 39%)', 'hsl(207, 98%, 39%)'];

export default function Portfolio() {
  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => getUserProfile()
  });

  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 60 * 1000),
    to: new Date()
  });

  if (isLoadingProfile || !profile) {
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

  // Filter donations by date range
  const filteredDonations = profile.donations.filter((donation: Donation) => {
    const donationDate = new Date(donation.date);
    return donationDate >= dateRange.from && donationDate <= dateRange.to;
  });

  // Process donation data
  const donationsByCharity = filteredDonations.reduce((acc: Record<string, number>, donation) => {
    acc[donation.charityId] = (acc[donation.charityId] || 0) + donation.amount;
    return acc;
  }, {});

  const pieChartData = Object.entries(donationsByCharity).map(([charityId, amount]) => ({
    name: charityId,
    value: amount
  }));

  // Monthly donation trends
  const monthlyDonations = filteredDonations.reduce((acc: Record<string, number>, donation) => {
    const month = new Date(donation.date).toLocaleString('default', { month: 'short' });
    acc[month] = (acc[month] || 0) + donation.amount;
    return acc;
  }, {});

  const barChartData = Object.entries(monthlyDonations).map(([month, amount]) => ({
    month,
    amount
  }));

  // Calculate impact metrics for filtered data
  const totalRecurring = filteredDonations.filter(d => d.isRecurring).length;
  const totalDonated = filteredDonations.reduce((sum: number, d) => sum + d.amount, 0);
  const averageDonation = filteredDonations.length 
    ? totalDonated / filteredDonations.length 
    : 0;

  return (
    <div className="space-y-8">
      {/* Date Range Picker */}
      <div className="flex justify-end">
        <DateRangePicker onRangeChange={setDateRange} defaultRange={dateRange} />
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalDonated.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">For selected period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recurring</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRecurring}</div>
            <p className="text-xs text-muted-foreground">Monthly commitments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${averageDonation.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Per donation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Charities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(donationsByCharity).length}</div>
            <p className="text-xs text-muted-foreground">Supported</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="amount" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {filteredDonations
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((donation) => (
                  <div
                    key={donation.id}
                    className="flex justify-between items-center py-4 border-b last:border-0"
                  >
                    <div>
                      <div className="font-medium">Charity ID: {donation.charityId}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(donation.date).toLocaleDateString()}
                        {donation.isRecurring && ` · Recurring ${donation.frequency}`}
                      </div>
                    </div>
                    <div className="font-medium text-primary">
                      ${donation.amount.toLocaleString()}
                    </div>
                  </div>
                ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}