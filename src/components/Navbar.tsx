import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { Icons } from "./ui/Icons";
import { buttonVariants } from "./ui/Button";
import { UserAccountNav } from "./UserAccountNav";
import { headers } from "next/dist/client/components/headers";

const Navbar = async () => {
  const session = await getServerSession(authOptions);
  const pathname = headers().get("x-invoke-path") || "";
  const specificRoute = "/sign-in";

  return pathname === specificRoute ? (
    ""
  ) : (
    <div className="fixed top-0 inset-x-0 h-fit bg-zinc-100 border-b border-zinc-300 z-[10] py-2">
      <div className="container max-w-7xl h-full mx-auto flex items-center justify-between gap-2">
        {/* logo */}
        <Link href="/" className="flex gap-2 items-center">
          <Icons.logo className="h-16 w-16 sm:h-8 sm:w-8" />
          <p className="hidden text-zinc-700 text-sm font-medium md:block">
            Marmitas da Mônica
          </p>
        </Link>

        {session?.user ? (
          <UserAccountNav user={session.user} perfil={session.user.perfil} />
        ) : (
          <Link href="/sign-in" className={buttonVariants()}>
            Entrar
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
