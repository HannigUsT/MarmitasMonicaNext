import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { userValidator, UserFormData } from "@/lib/validators/user";
import { z } from "zod";
import { addressValidator } from "@/lib/validators/address";
import { UserSession } from "@/types/@types";

export async function GET() {
  const session = await getAuthSession();

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = await db.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  const endereco = await db.endereco.findUnique({
    where: {
      id_usuario: session.user.id,
    },
  });

  const objReturn = {
    pessoa: {
      nome: user?.name,
      contato: user?.contato,
      cpf: user?.cpf,
      dataNascimento: user?.data_nascimento,
    },
    endereco: {
      bairro: endereco?.bairro,
      casa: endereco?.casa,
      cep: endereco?.cep,
      complemento: endereco?.complemento,
      localidade: endereco?.localidade,
      logradouro: endereco?.logradouro,
      uf: endereco?.uf,
    },
  } as UserFormData;

  return new Response(JSON.stringify(objReturn));
}

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { endereco, pessoa, privacyPolicy }: UserFormData & UserSession =
      await req.json();

    if (pessoa && endereco) {
      const validatedUser = userValidator.parse(pessoa);
      if (!validatedUser) {
        return new Response("Erro, invalid request data", { status: 400 });
      }
      const validatedAddress = addressValidator.parse(endereco);
      if (!validatedAddress) {
        return new Response("Erro, invalid request data", { status: 400 });
      }

      const updatedUser = await db.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          name: pessoa.nome,
          data_nascimento: pessoa.dataNascimento,
          contato: pessoa.contato,
          cpf: pessoa.cpf,
          data_cadastro: new Date(),
          privacyPolicy: privacyPolicy,
        },
      });

      if (!updatedUser) {
        return new Response("Erro on updating user.", { status: 500 });
      }

      const user = await db.user.findFirst({
        where: {
          id: session.user.id,
        },
      });

      if (!user) {
        return new Response("User not found", { status: 404 });
      } else {
        const addressExists = await db.endereco.findUnique({
          where: {
            id_usuario: user.id,
          },
        });

        if (addressExists) {
          const updateAdress = await db.endereco.update({
            data: {
              id_usuario: session.user.id,
              cep: endereco.cep,
              logradouro: endereco.logradouro,
              bairro: endereco.bairro,
              localidade: endereco.localidade,
              uf: endereco.uf,
              complemento: endereco.complemento,
              casa: endereco.casa,
            },
            where: {
              id_usuario: user.id,
            },
          });

          if (!updateAdress) {
            return new Response("Erro on updating address.", { status: 500 });
          }
        } else {
          const createAdress = await db.endereco.create({
            data: {
              id_usuario: session.user.id,
              cep: endereco.cep,
              logradouro: endereco.logradouro,
              bairro: endereco.bairro,
              localidade: endereco.localidade,
              uf: endereco.uf,
              complemento: endereco.complemento,
              casa: endereco.casa,
            },
          });

          if (!createAdress) {
            return new Response("Erro on creating address.", { status: 500 });
          }
        }
      }

      return new Response("OK");
    }
  } catch (error) {
    error;

    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 });
    }

    return new Response(
      "Could not update user at this time. Please try later",
      { status: 500 }
    );
  }
}
