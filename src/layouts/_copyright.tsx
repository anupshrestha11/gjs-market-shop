import cn from 'classnames';

export default function Copyright({ className }: { className?: string }) {
  const currentYear = new Date().getFullYear();
  return (
    <div className={cn('tracking-[0.2px]', className)}>
      &copy; Copyright {currentYear} By{' '}
    </div>
  );
}
