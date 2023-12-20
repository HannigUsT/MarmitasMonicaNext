import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { z } from "zod";
import fs from "fs";

export async function GET() {
  const session = await getAuthSession();

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const partners = await db.parceiros.findMany({
    where: {
      active: false,
      firstTime: true,
    },
  });

  if (!partners || partners.length === 0) {
    return new Response("Partners not found.", { status: 402 });
  }

  const partnersWithAddresses = [];

  for (const partner of partners) {
    const endereco = await db.endereco.findUnique({
      where: {
        id_usuario: partner.id,
      },
    });

    const partnerWithAddress = {
      ...partner,
      ...endereco,
    };

    partnersWithAddresses.push(partnerWithAddress);
  }

  return new Response(JSON.stringify(partnersWithAddresses));
}

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.formData();

    const getValueOrNull = (
      value: FormDataEntryValue | null | undefined
    ): string | null => {
      if (value !== null && value !== undefined) {
        //
        if (value instanceof Date) {
          return value.toISOString();
        }
        return String(value);
      }
      return null;
    };

    const atividade_principal = getValueOrNull(
      body.get("partner[atividade_principal]")
    );
    const atividade_secundaria = getValueOrNull(
      body.get("partner[atividade_secundaria]")
    );
    const cnpj = getValueOrNull(body.get("partner[cnpj]"));
    const data_abertura = getValueOrNull(body.get("partner[data_abertura]"));
    const data_situacao_especial = getValueOrNull(
      body.get("partner[data_situacao_especial]")
    );
    const data_situacao_cadastral = getValueOrNull(
      body.get("partner[data_situacao_cadastral]")
    );
    const email_responsavel = getValueOrNull(
      body.get("partner[email_responsavel]")
    );
    const ente_federativo = getValueOrNull(
      body.get("partner[ente_federativo]")
    );
    const logotipo = body.get("partner[logotipo]");
    const nome_empresarial = getValueOrNull(
      body.get("partner[nome_empresarial]")
    );
    const nome_fantasia = getValueOrNull(body.get("partner[nome_fantasia]"));
    const nome_responsavel = getValueOrNull(
      body.get("partner[nome_responsavel]")
    );
    const porte = getValueOrNull(body.get("partner[porte]"));
    const situacao_cadastral = getValueOrNull(
      body.get("partner[situacao_cadastral]")
    );
    const situacao_especial = getValueOrNull(
      body.get("partner[situacao_especial]")
    );
    const telefone_responsavel = getValueOrNull(
      body.get("partner[telefone_responsavel]")
    );
    const bairro = getValueOrNull(body.get("address[bairro]"));
    const casa = getValueOrNull(body.get("address[casa]"));
    const cep = getValueOrNull(body.get("address[cep]"));
    const complemento = getValueOrNull(body.get("address[complemento]"));
    const localidade = getValueOrNull(body.get("address[localidade]"));
    const logradouro = getValueOrNull(body.get("address[logradouro]"));
    const uf = getValueOrNull(body.get("address[uf]"));

    const partner = {
      atividade_principal,
      atividade_secundaria,
      cnpj,
      data_abertura,
      data_situacao_especial,
      data_situacao_cadastral,
      email_responsavel,
      ente_federativo,
      logotipo,
      nome_empresarial,
      nome_fantasia,
      nome_responsavel,
      porte,
      situacao_cadastral,
      situacao_especial,
      telefone_responsavel,
    };

    const address = {
      bairro,
      casa,
      cep,
      complemento,
      localidade,
      logradouro,
      uf,
    };

    const parceiro = await db.parceiros.findFirst({
      where: {
        usuario_id: session.user.id,
      },
    });

    const file = partner.logotipo as Blob;
    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = `/imagens/${session.user.id}_${file.name}`;
    fs.writeFileSync("public" + filePath, buffer);

    if (!parceiro) {
      const partnerCreated = await db.parceiros.create({
        data: {
          usuario_id: session.user.id,
          active: false,
          atividade_principal: partner.atividade_principal,
          atividade_secundaria: partner.atividade_secundaria,
          cnpj: partner.cnpj,
          data_abertura: partner.data_abertura,
          data_cadastro: new Date(),
          data_situacao_cadastral: partner.data_situacao_cadastral,
          data_situacao_especial: partner.data_situacao_especial,
          email_responsavel: partner.email_responsavel,
          ente_federativo: partner.ente_federativo,
          firstTime: true,
          logotipo: filePath,
          nome_empresarial: partner.nome_empresarial,
          nome_fantasia: partner.nome_fantasia,
          nome_responsavel: partner.nome_responsavel,
          porte: partner.porte,
          situacao_cadastral: partner.situacao_cadastral,
          situacao_especial: partner.situacao_especial,
          telefone_responsavel: partner.telefone_responsavel,
        },
      });

      if (!partnerCreated) {
        return new Response("Erro on creating or updating partner.", {
          status: 500,
        });
      } else {
        const partnerAddress = await db.endereco.create({
          data: {
            id_usuario: partnerCreated.id,
            cep: Number(address.cep).toString(),
            logradouro: address.logradouro,
            bairro: address.bairro,
            localidade: address.localidade,
            uf: address.uf,
            complemento: address.complemento,
            casa: address.casa,
          },
        });
        if (!partnerAddress) {
          return new Response("Erro on creating or updating partner.", {
            status: 500,
          });
        }
        return new Response("OK");
      }
    } else {
      return new Response("Exists");
    }
  } catch (error) {
    error;

    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 });
    }

    return new Response("Server error, please try again later.", {
      status: 500,
    });
  }
}
