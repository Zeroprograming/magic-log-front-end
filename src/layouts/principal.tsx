'use client';

import { AxiosError } from 'axios';
import {
  ChevronDown,
  ChevronUp,
  LogOut,
  ShoppingCart,
  Store,
  UserRoundCog,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';

import { useAuth } from '@/components/common/Auth/AuthProvider';
import { ModalCartView } from '@/components/common/Cart/ModalCartView';
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
import { useLogoutMutation } from '@/services/v1/auth';
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
  const [openCart, setOpenCart] = useState(false);
  const logoffMutation = useLogoutMutation();

  const router = useRouter();

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
                    <AvatarFallback>{`${user.email.charAt(0)}`}</AvatarFallback>
                  </Avatar>
                  {isOpenViewUser ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="md:mr-4 lg:mr-6 xl:mr-20  2xl:mr-48">
                <DropdownMenuLabel className="flex flex-col gap-2">
                  <div className="flex flex-row gap-2 items-center">
                    <Avatar>
                      <AvatarFallback>
                        {`${user.email.charAt(0)}`}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col w-full gap-1">
                      <span className="text-sm font-semibold">
                        {user.email}
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
                      setOpenCart(true);
                    }}
                  >
                    <div className="flex flex-row w-full gap-2 justify-center items-center">
                      <ShoppingCart className="size-5" />
                      <span className="w-full px-1">Carrito</span>
                    </div>
                  </DropdownMenuItem>
                  {user.role?.id === 1 ? (
                    <DropdownMenuItem
                      className="flex w-full"
                      onClick={() => {
                        void router.push('/admin-panel');
                      }}
                    >
                      <div className="flex flex-row w-full gap-2 justify-center items-center">
                        <UserRoundCog className="size-5" />
                        <span className="w-full px-1">Panel Administrador</span>
                      </div>
                    </DropdownMenuItem>
                  ) : null}
                  {user.role?.id === 2 || user.role?.id === 1 ? (
                    <DropdownMenuItem
                      className="flex w-full"
                      onClick={() => {
                        void router.push('/seller');
                      }}
                    >
                      <div className="flex flex-row w-full gap-2 justify-center items-center">
                        <Store className="size-5" />
                        <span className="w-full px-1">Panel Vendedor</span>
                      </div>
                    </DropdownMenuItem>
                  ) : null}
                  <Separator className="my-1.5" />
                  <DropdownMenuItem
                    className="flex w-full"
                    onClick={() => {
                      logoffMutation.mutate(undefined, {
                        onSuccess: () => {
                          logout();
                        },
                        onError(error) {
                          const axiosError = error as AxiosError;
                          switch (axiosError.response?.status) {
                            case 401:
                              toast({
                                title: 'Error - 401',
                                description:
                                  'No se pudo cerrar sesión de forma segura',
                              });
                              logout();
                              break;

                            default:
                              toast({
                                title: 'Error - 500',
                                description:
                                  'No se pudo cerrar sesión de forma segura',
                              });
                              logout();
                              break;
                          }
                        },
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
        <MainContent>
          <>
            {children}

            <ModalCartView open={openCart} setOpen={setOpenCart} />
          </>
        </MainContent>
      </div>
    </div>
  );
}

export default PrincipalLayout;
