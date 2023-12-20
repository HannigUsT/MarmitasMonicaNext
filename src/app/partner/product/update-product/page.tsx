import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import UpdateProductPage from "@/components/UpdateProductPage";

export default async function Page() {
  const session = await getAuthSession();
  if (session?.user.perfil === 0) {
    redirect("/");
  } else if (session?.user.perfil === 2) {
    redirect("/admin");
  } else {
    return <UpdateProductPage />;
  }
}
