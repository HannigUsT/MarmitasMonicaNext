import ViewBagPage from "@/components/ViewBagPage";
import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function Settings() {
  const session = await getAuthSession();

  if (session?.user.perfil === 1) {
    redirect("/partner");
  } else if (session?.user.perfil === 2) {
    redirect("/admin");
  } else {
    return <ViewBagPage session={session} />;
  }
}
