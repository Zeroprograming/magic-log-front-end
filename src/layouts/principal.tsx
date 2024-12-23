'use client';

import { ChevronDown, ChevronUp, LogOut } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';

import { useAuth } from '@/components/common/Auth/AuthProvider';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { getCurrentUser } from '@/store/selectors/user';

interface Props {
  children: JSX.Element;
  className?: string;
}

const MainContent = ({ children }: Props) => {
  return (
    <div className="mt-0 pb-0 pt-16 w-full flex flex-col items-center justify-center">
      <div className="pb-0 relative">{children}</div>
    </div>
  );
};

function PrincipalLayout({ children, className }: Props) {
  const [isOpenViewUser, setIsOpenViewUser] = useState(false);

  const user = useSelector(getCurrentUser);

  const { logout } = useAuth();

  return (
    <div className={`${className}`}>
      <div className="p-4 flex flex-col w-full justify-center items-center bg-white">
        {/* Ajustamos el contenedor principal de la navbar */}
        <div className="flex flex-row w-full justify-between items-center max-w-screen-xl">
          <Link href="/" passHref>
            <Image
              src="/images/logo_white_background.svg"
              alt="Logo"
              width={160}
              height={100}
              className="min-w-[160px] cursor-pointer"
            />
          </Link>

          <div>
            <DropdownMenu
              onOpenChange={(open) => {
                setIsOpenViewUser(open);
              }} // Actualiza el estado según si el menú está abierto o cerrado
            >
              <DropdownMenuTrigger>
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarFallback>{`${user.name.charAt(0)}`}</AvatarFallback>
                  </Avatar>
                  {isOpenViewUser ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mr-48">
                <DropdownMenuLabel className="flex flex-col gap-2">
                  <div className="flex flex-row gap-2 items-center">
                    <Avatar>
                      <AvatarFallback>
                        {`${user.name.charAt(0)}`}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col w-full gap-1">
                      <span className="text-sm font-semibold capitalize">
                        {user.name}
                      </span>
                      <span className="text-xs text-greyScale-text-caption">
                        {user.email}
                      </span>
                    </div>
                  </div>
                  <Separator />
                </DropdownMenuLabel>
                <DropdownMenuGroup className="px-2">
                  <DropdownMenuItem
                    className="flex w-full"
                    onClick={() => {
                      logout();
                      toast({
                        title: 'Sesión cerrada',
                        description: 'La sesión ha sido cerrada correctamente',
                      });
                    }}
                  >
                    <div className="flex flex-row w-full gap-2 justify-center items-center">
                      <LogOut className="size-5" />
                      <span className="w-full px-1">Cerrar sesión</span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Contenido principal de la página */}
      <div className="flex items-center justify-center flex-col gap-4 w-full min-h-[80vh] bg-greyScale-background">
        <MainContent>{children}</MainContent>
      </div>
    </div>
  );
}

export default PrincipalLayout;
