import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const data = await req.json();

    const product = await db.produto.findUnique({
      where: {
        id: data.productId,
      },
      include: {
        produto_restricoes: {
          include: {
            tipo_restricoes: true,
          },
        },
      },
    });

    if (!product) {
      return new Response("Product not found.", { status: 404 });
    }

    const productReturn = {
      id: product.id,
      nome: product.nome,
      foto: product.foto,
      preco: product.preco,
      status: product.status,
      restricoes: product.produto_restricoes,
    };

    return new Response(JSON.stringify(productReturn));
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: `Erro na solicitação do produto`,
        success: false,
      })
    );
  }
}
