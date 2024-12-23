'use client';

import * as SwitchPrimitives from '@radix-ui/react-switch';
import * as React from 'react';

import { cn } from '@/lib/utils';

interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
  textOptionA: string;
  textOptionB: string;
}

const SwitchWithText = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(({ className, textOptionA, textOptionB, ...props }, ref) => {
  const [isChecked, setIsChecked] = React.useState(false);

  const handleToggle = () => {
    setIsChecked(!isChecked);
    props.onCheckedChange?.(isChecked);
  };

  return (
    <div className="flex items-center space-x-2">
      <SwitchPrimitives.Root
        className={cn(
          'peer relative inline-flex h-[40px] w-[326px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
          isChecked ? 'bg-input' : 'bg-input',
          className,
        )}
        {...props}
        ref={ref}
        onCheckedChange={handleToggle} // Manejador para actualizar el estado
      >
        {/* Texto para el estado unchecked */}
        <span
          className={cn(
            'absolute left-[56px] z-10 text-base transition-colors duration-200',
            isChecked ? 'text-black' : 'text-white', // Condicional para cambiar color
          )}
        >
          {textOptionA}
        </span>

        <SwitchPrimitives.Thumb
          className={cn(
            'pointer-events-none block h-[40px] w-[165px] rounded-full bg-primaryVariant-surface-default shadow-lg ring-0 transition-transform duration-200',
            isChecked ? 'translate-x-[96%]' : 'translate-x-0',
          )}
        />

        {/* Texto para el estado checked */}
        <span
          className={cn(
            `absolute ${`right-[10rem]`} text-base transition-colors duration-200`,
            isChecked ? 'text-white' : 'text-black', // Condicional para cambiar color
          )}
        >
          {textOptionB}
        </span>
      </SwitchPrimitives.Root>
    </div>
  );
});

SwitchWithText.displayName = SwitchPrimitives.Root.displayName;

export { SwitchWithText };
