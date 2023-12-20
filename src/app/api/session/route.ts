import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { UserSession } from "@/types/@types";

export async function GET() {
  const session = await getAuthSession();

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const userSession = {
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
    id: session.user.id,
    perfil: session.user.perfil,
    privacyPolicy: session.user.privacyPolicy,
  } as UserSession;

  return new Response(JSON.stringify(userSession));
}

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const user = await req.json();

    const userUpdated = await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        privacyPolicy: user.privacyPolicy,
      },
    });
    if (!userUpdated) {
      return new Response("Erro on updating privacy policy.", { status: 500 });
    }
    return new Response("OK");
  } catch (error) {
    error;
    return new Response("Server error, please try again later.", {
      status: 500,
    });
  }
}
