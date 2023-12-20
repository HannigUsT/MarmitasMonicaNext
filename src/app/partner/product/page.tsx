import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import PartnerProductsPage from "@/components/PartnerProductsPage";

export default async function Page() {
  const session = await getAuthSession();
  if (session?.user.perfil === 0) {
    redirect("/");
  } else if (session?.user.perfil === 2) {
    redirect("/admin");
  } else {
    return <PartnerProductsPage />;
  }
}
