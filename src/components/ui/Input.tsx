import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils.ts';

const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        'w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-300 transition hover:border-2 hover:border-gray-300 box-border',
        className
      )}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export default Input;
