"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { UserAvatar } from "@/components/UserAvatar";
import { UserAccountNavProps } from "@/types/@types";

export function UserAccountNav({ user, perfil }: UserAccountNavProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar
          user={{
            name: user.name || `${user.email}`,
            image: user.image || null,
          }}
          className="h-8 w-8"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.name && <p className="font-medium">{user.name}</p>}
          </div>
        </div>
        <DropdownMenuSeparator />

        {perfil === 0 && (
          <>
            <DropdownMenuItem asChild>
              <Link href="/">Restaurantes</Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link href="/orders">Pedidos</Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link href="/settings">Configurações</Link>
            </DropdownMenuItem>
          </>
        )}

        {perfil === 1 && (
          <>
            <DropdownMenuItem asChild>
              <Link href="/">Menu</Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link href="/partner/product">Produtos</Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link href="/partner/product/new-product">Novo Produto</Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link href="/partner/settings">Configurações</Link>
            </DropdownMenuItem>
          </>
        )}

        {perfil === 2 && (
          <>
            <div className="text-center">
              <p>Estamos trabalhando</p>
              <p>para trazer novas</p>
              <p>funcionalidades :)</p>
            </div>
          </>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={(event) => {
            event.preventDefault();
            document.cookie.split(";").forEach((cookie) => {
              const eqPos = cookie.indexOf("=");
              const name = eqPos > -1 ? cookie.slice(0, eqPos) : cookie;
              document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`;
            });
            window.sessionStorage.clear();
            window.localStorage.clear();
            signOut({
              callbackUrl: `${window.location.origin}/sign-in`,
            });
          }}
        >
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
