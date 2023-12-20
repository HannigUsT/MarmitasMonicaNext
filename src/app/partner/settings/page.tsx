import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import PartnerSettings from "@/components/PartnerSettings";

export default async function Page() {
  const session = await getAuthSession();
  if (session?.user.perfil === 0) {
    redirect("/");
  } else if (session?.user.perfil === 2) {
    redirect("/admin");
  }
  return <PartnerSettings />;
}
