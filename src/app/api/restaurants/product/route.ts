import { db } from "@/lib/db";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id")?.toString();
  try {
    const results = await db.produto.findMany({
      where: {
        id_parceiro: id,
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
        message: `Erro na solicitação GET: ${error}`,
        success: false,
      })
    );
  }
}
