import AuthImageLateralComponent from '@/components/common/Auth/AuthImageLateralComponent';
import SignUpForm from '@/components/common/Auth/register/AuthChangePasswordForm';
import { Card, CardContent } from '@/components/ui/card';

export default function SignUpView() {
  return (
    <>
      {/* Vista de escritorio */}
      <div className="hidden lg:flex flex-row w-screen justify-center items-center h-screen">
        <div className="flex w-full max-w-screen-xl justify-center items-center h-full xl:pl-40">
          <div className="flex flex-col gap-10 w-[380px]">
            <SignUpForm />
          </div>
        </div>
        <AuthImageLateralComponent />
      </div>

      {/* Vista móvil */}
      <div className="relative flex lg:hidden justify-center items-center w-screen h-screen">
        <AuthImageLateralComponent />
        <div className="relative z-10 w-full max-w-md p-6">
          <Card className="shadow-lg">
            <CardContent className="flex flex-col gap-4 p-10">
              <SignUpForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
