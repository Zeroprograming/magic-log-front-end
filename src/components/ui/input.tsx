import { SearchIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  iconEnable?: boolean;
  interiorBg?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, interiorBg, icon, iconEnable = false, type, ...props },
    ref,
  ) => {
    return (
      <div
        className={cn(
          'flex h-10 items-center rounded-lg border border-input bg-white pl-3 text-sm ring-offset-background focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-2',
          className,
        )}
      >
        {iconEnable &&
          (icon ? (
            React.cloneElement(icon as React.ReactElement, {
              className: 'size-4 text-greyScale-text-body',
            })
          ) : (
            <SearchIcon className="size-4 text-greyScale-text-body" />
          ))}

        <input
          {...props}
          type={type}
          ref={ref}
          className={cn(
            'w-full p-2 rounded-lg placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 ',
            interiorBg ? `${interiorBg}` : 'bg-greyScale-surface-default',
          )}
        />
      </div>
    );
  },
);
Input.displayName = 'Input';

export { Input };
