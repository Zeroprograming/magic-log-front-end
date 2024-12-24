import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { useLoginMutation, useUsuarioActualQuery } from '@/services/v1/auth';

import { useAuth } from './AuthProvider';

const formSchema = z.object({
  email: z.string().min(4, {
    message: 'El email del usuario debe tener al menos 4 caracteres',
  }),
  password: z.string().min(8, {
    message: 'La contraseña debe tener al menos 8 caracteres',
  }),
});

export default function AuthSignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const loginMutation = useLoginMutation();
  const getUsuarioActual = useUsuarioActualQuery(); // Este hook carga la consulta, pero no ejecuta la llamada hasta que se refetch.

  async function onSubmit(values: z.infer<typeof formSchema>) {
    loginMutation.mutate(values, {
      onSuccess: async () => {
        try {
          toast({
            title: 'Inicio de sesión exitoso',
            description: 'Bienvenido de vuelta',
          });

          // Refetch para obtener los datos del usuario actual después del inicio de sesión.
          const usuarioActual = await getUsuarioActual.refetch();

          // Llama al método login, pasando los datos del usuario actual.
          if (usuarioActual.data) {
            login(usuarioActual.data);
          } else {
            toast({
              title: 'Error al obtener datos del usuario',
              description:
                'No se pudieron cargar los datos del usuario actual.',
            });
          }

          // Redirige al usuario después de iniciar sesión.
          void router.push('/');
        } catch (error) {
          toast({
            title: 'Error al obtener datos del usuario',
            description: 'No se pudieron cargar los datos del usuario actual.',
          });
        }
      },
      onError(error) {
        if (
          error instanceof AxiosError &&
          error.response &&
          error.response.status === 401
        ) {
          toast({
            title: 'Credenciales inválidas',
            description: 'El nombre de usuario o la contraseña son incorrectos',
          });
        } else {
          toast({
            title: 'Falló el inicio de sesión',
            description: 'Ocurrió un error al intentar iniciar sesión',
          });
        }
      },
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="justify-center items-center flex flex-col w-full"
      >
        <div className="flex flex-col gap-2 w-full">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Email"
                    interiorBg="bg-white"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                  <div className="relative w-full">
                    {/* Cambia el tipo de input entre 'password' y 'text' basado en showPassword */}
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Contraseña"
                      interiorBg="bg-white"
                      className="pr-10"
                      {...field}
                    />
                    <div
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                      onClick={() => {
                        setShowPassword((prev) => !prev); // Invierte el estado
                      }}
                    >
                      {/* Cambia el ícono basado en el estado showPassword */}
                      {showPassword ? (
                        <IoEyeOffOutline className="h-5 w-5 text-greyScale-text-body" />
                      ) : (
                        <IoEyeOutline className="h-5 w-5 text-greyScale-text-body" />
                      )}
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
                <div className="flex flex-row justify-end w-full text-xs">
                  <Link
                    href="/auth/register"
                    className="text-greyScale-text-subtitle"
                  >
                    ¿No tienes una cuenta? Regístrate
                  </Link>
                </div>
              </FormItem>
            )}
          />
        </div>

        <Button
          className="rounded-full mt-10 bg-primaryVariant-surface-default text-greyScale-text-negative"
          type="submit"
          disabled={loginMutation.isLoading}
        >
          {loginMutation.isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </Button>
      </form>
    </Form>
  );
}
