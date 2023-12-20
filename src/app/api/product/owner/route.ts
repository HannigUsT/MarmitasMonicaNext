import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const user = await db.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    if (!user) {
      return new Response("Usuario não encontrado", { status: 404 });
    }

    const partner = await db.parceiros.findUnique({
      where: {
        usuario_id: user.id,
      },
    });


    if (!partner) {
      return new Response("Parceiro não encontrado", { status: 404 });
    }

    const results = await db.produto.findMany({
      include: {
        produto_restricoes: {
          include: {
            tipo_restricoes: true,
          },
        },
      },
      where: {
        id_parceiro: partner.id,
      },
    });
    console.log('teste')
    console.log(results)

    return new Response(JSON.stringify(results));
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: `Erro na solicitação: ${error}`,
        success: false,
      })
    );
  }
}
