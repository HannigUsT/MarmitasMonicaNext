import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { Partner } from "@/types/@types";

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const partner: Partner = await req.json();

    const parceiro = await db.parceiros.findFirst({
      where: {
        usuario_id: partner.usuario_id,
      },
    });

    if (!parceiro) {
      return new Response("Fatal Error, partner does not exists.", {
        status: 500,
      });
    } else {
      const partnerUpdated = await db.parceiros.update({
        data: {
          active: partner.active,
          firstTime: partner.firstTime,
        },
        where: {
          usuario_id: partner.usuario_id,
        },
      });

      if (!partnerUpdated) {
        return new Response("Erro on updating partner.", {
          status: 500,
        });
      } else {
        const updateUserParnerStatus = await db.user.update({
          data: {
            perfil: 1,
          },
          where: {
            id: parceiro.usuario_id,
          },
        });

        if (!updateUserParnerStatus) {
          return new Response("Erro on updating user status", {
            status: 500,
          });
        }

        return new Response("OK");
      }
    }
  } catch (error) {
    error;
    return new Response(
      "Could not update admin at this time. Please try later",
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const partner: Partner = await req.json();

    const parceiro = await db.parceiros.findFirst({
      where: {
        usuario_id: partner.usuario_id,
      },
    });

    if (!parceiro) {
      return new Response("Partner does not exists", {
        status: 400,
      });
    } else {
      const partnerAddressDeleted = await db.endereco.delete({
        where: {
          id_usuario: parceiro.id,
        },
      });
      if (!partnerAddressDeleted) {
        return new Response("Error deleting partner address.", {
          status: 400,
        });
      }
      const partnerDeleted = await db.parceiros.delete({
        where: {
          usuario_id: partner.usuario_id,
        },
      });
      if (!partnerDeleted) {
        return new Response("Error deleting partner.", {
          status: 400,
        });
      }
      return new Response("OK");
    }
  } catch (error) {
    error;
    return new Response("Server error, please try again later.", {
      status: 500,
    });
  }
}
