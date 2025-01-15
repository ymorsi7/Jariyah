import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Search, MoonStar } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function Navigation() {
  const [location] = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40">
      <div className="container h-16 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-semibold text-primary pl-4">
          <MoonStar className="h-6 w-6" />
          Jariyah
        </Link>

        <div className="hidden md:flex space-x-1 mx-4">
          {[
            ['/', 'Discover'],
            ['/portfolio', 'Portfolio'],
            ['/manual-input', 'Record Donation']
          ].map(([href, label]) => (
            <Link 
              key={href} 
              href={href}
              className={`px-3 py-2 text-sm rounded-md transition-colors ${
                location === href 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-muted-foreground hover:text-primary hover:bg-muted'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="w-full pl-10 bg-muted/50"
              placeholder="Search causes..."
            />
          </div>
        </div>
      </div>
    </nav>
  );
}