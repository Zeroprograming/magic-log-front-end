import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';
import { z } from 'zod';

import AuthTitleComponent from '@/components/common/Auth/AuthTitleComponent';
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
import { useRegisterMutation } from '@/services/v1/auth';

const passwordSchema = z
  .string()
  .min(8, {
    message: 'La contraseña debe tener al menos 8 caracteres',
  })
  .max(20, {
    message: 'La contraseña debe tener máximo 20 caracteres',
  })
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])[A-Za-z\d\W]{8,20}$/, {
    message:
      'La contraseña debe tener entre 8 y 20 caracteres, incluyendo al menos una letra mayúscula, una letra minúscula, un número y un carácter especial.',
  });

const formSchema = z
  .object({
    email: z.string().email({
      message: 'El email debe tener un formato válido',
    }),
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export default function SignUpForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const RegisterMutation = useRegisterMutation();

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    RegisterMutation.mutate(
      {
        ...values,
      },
      {
        onSuccess: () => {
          toast({
            title: 'Usuario registrado',
            description: 'Su usuario ha sido registrado correctamente',
          });

          void router.push('/auth/sign-in');
        },
        onError(error: any) {
          switch (error.response.status) {
            case 409:
              toast({
                title: 'Error al registrar el usuario',
                description: 'El correo electrónico ya está en uso',
              });
              break;
            default:
              toast({
                title: 'Error al registrar el usuario',
                description: 'Ha ocurrido un error al registrar el usuario',
              });
              break;
          }
        },
      },
    );
  };

  return (
    <>
      <AuthTitleComponent
        title="Crear una cuenta"
        subtitle="Por favor, ingrese los siguientes datos para crear su cuenta"
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="justify-center items-center flex flex-col w-full gap-2"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Correo electrónico"
                    className="text-greyScale-text-body"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs text-pretty" />
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
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Contraseña"
                      className="text-greyScale-text-body pr-10"
                      {...field}
                    />
                    <div
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                      onClick={() => {
                        setShowPassword(!showPassword);
                      }}
                    >
                      {showPassword ? (
                        <IoEyeOffOutline className="h-5 w-5 text-greyScale-text-body" />
                      ) : (
                        <IoEyeOutline className="h-5 w-5 text-greyScale-text-body" />
                      )}
                    </div>
                  </div>
                </FormControl>
                <FormMessage className="text-xs text-pretty" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Confirmar Contraseña</FormLabel>
                <FormControl>
                  <div className="relative w-full">
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirmar Contraseña"
                      className="text-greyScale-text-body pr-10"
                      {...field}
                    />
                    <div
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                      onClick={() => {
                        setShowConfirmPassword(!showConfirmPassword);
                      }}
                    >
                      {showConfirmPassword ? (
                        <IoEyeOffOutline className="h-5 w-5 text-greyScale-text-body" />
                      ) : (
                        <IoEyeOutline className="h-5 w-5 text-greyScale-text-body" />
                      )}
                    </div>
                  </div>
                </FormControl>
                <FormMessage className="text-xs text-pretty" />
              </FormItem>
            )}
          />
          <Button
            className="rounded-full mt-3 bg-primaryVariant-surface-default text-greyScale-text-negative"
            type="submit"
          >
            Registrarme
          </Button>
        </form>
      </Form>
    </>
  );
}
