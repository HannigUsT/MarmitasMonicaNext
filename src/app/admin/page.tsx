import AdminPage from "@/components/AdminPage";
import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function Admin() {
  const session = await getAuthSession();

  if (session?.user.perfil === 0) {
    redirect("/");
  } else if (session?.user.perfil === 1) {
    redirect("/partner");
  } else {
    return <AdminPage />;
  }
}
