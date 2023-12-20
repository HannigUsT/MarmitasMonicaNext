"use client";

import { Icons } from "@/components/ui/Icons";
import UserLoginForm from "@/components/UserLoginForm";

const SignIn = () => {
  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
      <div className="flex flex-col space-y-2 text-center">
        <Icons.logo className="mx-auto h-16 w-16" />
        <h1 className="text-2xl font-semibold tracking-tight">
          Bem vindo de Volta
        </h1>
      </div>
      <UserLoginForm />
    </div>
  );
};

export default SignIn;
