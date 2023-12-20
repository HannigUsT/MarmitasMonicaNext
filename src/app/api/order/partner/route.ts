import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Order, OrderRetrieve } from "@/types/@types";

export async function GET() {
  const session = await getAuthSession();

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const partner = await db.parceiros.findUnique({
    where: {
      usuario_id: session.user.id,
    },
  });

  if (!partner) {
    return new Response("Partner not found.", {
      status: 404,
    });
  }

  const ordersArray: OrderRetrieve[] = [];

  const orders = await db.pedido.findMany({
    where: {
      id_parceiro: partner.id,
    },
  });

  for (const order of orders) {
    const user = await db.user.findUnique({
      where: {
        id: order.id_usuario,
      },
    });

    if (!user) {
      return new Response("User not found.", { status: 404 });
    }

    const address = await db.endereco.findUnique({
      where: {
        id_usuario: user.id,
      },
    });

    const orderObj: OrderRetrieve = {
      id: order.id,
      status: order.status,
      agendamento: order.agendamento,
      valor_total: order.valor_total,
      data_pedido: order.data_pedido,
      user: {
        name: user.name,
        contato: user.contato,
      },
      address: {
        cep: address?.cep,
        logradouro: address?.logradouro,
        bairro: address?.bairro,
        localidade: address?.localidade,
        uf: address?.uf,
        complemento: address?.complemento,
        casa: address?.casa,
      },
    };

    ordersArray.push(orderObj);
  }

  if (ordersArray.length > 0) {
    return new Response(JSON.stringify(ordersArray));
  } else {
    return new Response("Nenhum novo pedido");
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const data: Order = await req.json();

    await db.pedido.update({
      data: {
        agendamento: data.agendamento,
      },
      where: {
        id: data.id,
      },
    });

    return new Response("OK");
  } catch (error) {
    error;
    return new Response("Server error, please try again later.", {
      status: 500,
    });
  }
}
