import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { id } = await req.json();

    const results = await db.produto.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        produto_restricoes: {
          include: {
            tipo_restricoes: true,
          },
        },
      },
    });

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
