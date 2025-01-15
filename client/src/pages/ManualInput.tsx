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
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { getUserProfile, saveUserProfile, charities } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  charityName: z.string().min(1, 'Charity name is required'),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Amount must be a positive number',
  }),
  date: z.date(),
  isRecurring: z.boolean().default(false),
  frequency: z.enum(['weekly', 'monthly', 'yearly']).optional(),
  category: z.string().min(1, 'Category is required'),
});

export default function ManualInput() {
  const { toast } = useToast();
  const [showFrequency, setShowFrequency] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      charityName: '',
      amount: '',
      date: new Date(),
      isRecurring: false,
      category: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const profile = getUserProfile();
    const donation = {
      id: crypto.randomUUID(),
      charityId: 'manual-' + crypto.randomUUID(), // Special ID for manual entries
      amount: Number(values.amount),
      date: values.date.toISOString(),
      isRecurring: values.isRecurring,
      frequency: values.isRecurring ? values.frequency : undefined,
    };

    profile.donations.push(donation);
    profile.totalDonated += Number(values.amount);
    saveUserProfile(profile);

    toast({
      title: 'Donation recorded',
      description: 'Your manual donation has been added to your profile.',
    });

    form.reset();
  };

  return (
    <div className="container py-24">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Record External Donation</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="charityName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Charity Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter charity name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="health">Health</SelectItem>
                        <SelectItem value="poverty">Poverty Relief</SelectItem>
                        <SelectItem value="disaster">Disaster Relief</SelectItem>
                        <SelectItem value="mosque">Mosque/Masjid</SelectItem>
                        <SelectItem value="zakat">Zakat</SelectItem>
                        <SelectItem value="sadaqah">Sadaqah</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="0" step="0.01" placeholder="0.00" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="w-full pl-3 text-left font-normal"
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isRecurring"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Recurring Donation</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Is this a recurring donation?
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          setShowFrequency(checked);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {showFrequency && (
                <FormField
                  control={form.control}
                  name="frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frequency</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <Button type="submit" className="w-full">
                Record Donation
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
