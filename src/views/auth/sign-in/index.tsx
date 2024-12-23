import React from 'react';

import AuthImageLateralComponent from '@/components/common/Auth/AuthImageLateralComponent';
import AuthSignInForm from '@/components/common/Auth/AuthSignInForm';
import AuthTitleComponent from '@/components/common/Auth/AuthTitleComponent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SignInView() {
  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <AuthImageLateralComponent />
      <div className="hidden lg:flex w-full max-w-screen-xl justify-center items-center h-full">
        <div className="flex flex-col gap-10 w-[380px] xl:mr-20">
          <AuthTitleComponent
            title="Iniciar Sesión"
            subtitle="Por favor ingrese sus credenciales de acceso"
          />
          <AuthSignInForm />
        </div>
      </div>
      <div className="lg:hidden flex justify-center items-center relative w-full max-w-md p-6">
        <Card className="shadow-lg z-10">
          <CardHeader>
            <CardTitle className="text-4xl font-bold">Iniciar Sesión</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-base">
              Por favor ingrese sus credenciales de acceso
            </p>
            <AuthSignInForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
