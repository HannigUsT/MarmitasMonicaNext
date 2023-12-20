import { db } from "@/lib/db";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  const results = await db.pedido.findMany({
    where: {
      id_usuario: id !== null ? id : undefined,
    },
    include: {
      parceiros: true,
    },
  });
  return new Response(JSON.stringify(results));
}
