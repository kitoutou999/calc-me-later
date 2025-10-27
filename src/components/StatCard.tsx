import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
}

const variantStyles = {
  default: 'border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10',
  success: 'border-accent/20 bg-gradient-to-br from-accent/5 to-accent/10',
  warning: 'border-warning/20 bg-gradient-to-br from-warning/5 to-warning/10',
  danger: 'border-destructive/20 bg-gradient-to-br from-destructive/5 to-destructive/10',
};

const iconStyles = {
  default: 'text-primary bg-primary/10',
  success: 'text-accent bg-accent/10',
  warning: 'text-warning bg-warning/10',
  danger: 'text-destructive bg-destructive/10',
};

export function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  variant = 'default',
  className 
}: StatCardProps) {
  return (
    <Card className={cn(
      'p-6 border-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]',
      variantStyles[variant],
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        <div className={cn(
          'p-3 rounded-lg',
          iconStyles[variant]
        )}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </Card>
  );
}
