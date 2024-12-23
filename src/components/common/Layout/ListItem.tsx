import * as React from 'react';

import { NavigationMenuLink } from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';

interface ListItemProps extends React.ComponentPropsWithoutRef<'a'> {
  title: string;
  icon: React.ReactNode;
  option?: number;
  setViewOption?: (option: number) => void;
  href?: string;
}

const ListItem = React.forwardRef<React.ElementRef<'a'>, ListItemProps>(
  (
    { className, title, children, icon, option, setViewOption, href, ...props },
    ref,
  ) => {
    // Manejar el click cuando no hay href pero si option
    const handleClick = (
      e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    ) => {
      if (!href && option !== undefined && setViewOption) {
        e.preventDefault(); // Evitar comportamiento de enlace por defecto
        setViewOption(option); // Establecer la vista con la opción proporcionada
      }
    };

    return (
      <li className="flex w-full">
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            href={href ?? '#'} // Si no hay href, establecer un placeholder para evitar errores
            onClick={handleClick} // Manejar el click si es necesario
            className={cn(
              'w-full select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground flex flex-row justify-start items-center gap-7',
              className,
            )}
            {...props}
          >
            <div className="icon-container p-3 bg-primaryVariant-surface-default rounded-lg">
              {React.cloneElement(icon as React.ReactElement, {
                className: 'size-6 text-white',
              })}
            </div>

            <div className="flex flex-col gap-2 justify-center">
              <div className="text-sm font-medium leading-none">{title}</div>
              <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                {children}
              </p>
            </div>
          </a>
        </NavigationMenuLink>
      </li>
    );
  },
);

ListItem.displayName = 'ListItem';

export { ListItem };
