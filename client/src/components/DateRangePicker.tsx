import { useState } from 'react';
import { format, subDays, subMonths, subYears, startOfYear } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';

interface DateRangePickerProps {
  onRangeChange: (range: { from: Date; to: Date }) => void;
  defaultRange?: { from: Date; to: Date };
}

export function DateRangePicker({ onRangeChange, defaultRange }: DateRangePickerProps) {
  const [date, setDate] = useState<{
    from: Date;
    to: Date;
  }>({
    from: defaultRange?.from || subDays(new Date(), 30),
    to: defaultRange?.to || new Date()
  });

  const [open, setOpen] = useState(false);

  const handleSelect = (value: { from?: Date; to?: Date }) => {
    if (value.from && value.to) {
      const newRange = { from: value.from, to: value.to };
      setDate(newRange);
      onRangeChange(newRange);
    }
  };

  const presets = [
    { 
      label: '24h', 
      getRange: () => ({ from: subDays(new Date(), 1), to: new Date() })
    },
    { 
      label: '7d', 
      getRange: () => ({ from: subDays(new Date(), 7), to: new Date() })
    },
    { 
      label: '30d', 
      getRange: () => ({ from: subDays(new Date(), 30), to: new Date() })
    },
    { 
      label: '1y', 
      getRange: () => ({ from: subYears(new Date(), 1), to: new Date() })
    },
    { 
      label: 'All', 
      getRange: () => ({ from: new Date(2020, 0, 1), to: new Date() })
    },
  ];

  const handlePresetClick = (preset: typeof presets[number]) => {
    const newRange = preset.getRange();
    setDate(newRange);
    onRangeChange(newRange);
    setOpen(false);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {presets.map((preset) => (
          <Button
            key={preset.label}
            variant="outline"
            size="sm"
            onClick={() => handlePresetClick(preset)}
            className={`px-2 ${
              date.from.getTime() === preset.getRange().from.getTime() &&
              date.to.getTime() === preset.getRange().to.getTime()
                ? 'bg-primary/10 text-primary'
                : ''
            }`}
          >
            {preset.label}
          </Button>
        ))}
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-start text-left font-normal">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date.from ? (
              date.to ? (
                <>
                  {format(date.from, "MMM d, yyyy")} - {format(date.to, "MMM d, yyyy")}
                </>
              ) : (
                format(date.from, "MMM d, yyyy")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}