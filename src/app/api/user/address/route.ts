import { db } from "@/lib/db";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id_user = url.searchParams.get("id_user")?.toString();
  const results = await db.endereco.findUnique({
    where: {
      id_usuario: id_user,
    },
  });

  const address = {
    zip_code: results!.cep.replace(/^(\d{5})(\d{3})$/, "$1-$2"),
    public_place: results!.logradouro,
    neighborhood: results!.bairro,
    complement: results!.complemento,
    number: results!.casa,
  };
  return new Response(JSON.stringify(address));
}
