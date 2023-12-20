import { db } from "@/lib/db";
import { OrderItem, ProductObjApi, Scheduling } from "@/types/@types";
import { getAuthSession } from "@/lib/auth";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const serializedOrder = url.searchParams.get("order");
  // const restaurant = url.searchParams.get("restaurants");
  const products: ProductObjApi[] = [];
  const type_order = url.searchParams.get("type_order");
  // Obtenha a string serializada do parâmetro "order"
  //const serializedOrder = req.query as string;

  // Desserializar a string para um objeto
  if (serializedOrder != null) {
    // Use Promise.all para aguardar todas as consultas
    if (type_order == "1") {
      const order: OrderItem[] = JSON.parse(
        decodeURIComponent(serializedOrder)
      );
      await Promise.all(
        order.map(async (item) => {
          const results = await db.produto.findUnique({
            where: {
              id: item.id,
            },
          });

          if (results) {
            const product: ProductObjApi = {
              id: results.id,
              name: results.nome,
              description: results.descricao,
              price: results.preco,
              quantity: item.quantity,
              image: results.foto,
              scheduling: null,
            };

            // Adicione o objeto ProductObj ao array de produtos
            products.push(product);
          }
        })
      );
    } else {
      const order = JSON.parse(decodeURIComponent(serializedOrder));

      const keys = Object.keys(order);
      await Promise.all(
        keys.map(async (item) => {
          const results = await db.produto.findUnique({
            where: {
              id: parseInt(item),
            },
          });

          const totalQuantity = order[parseInt(item)].reduce(
            (accumulator: any, valor: any) => accumulator + valor.quantity,
            0
          );

          if (results) {
            let scheduling: Scheduling | null = null;
            let schedulings: Scheduling[] = [];
            order[parseInt(item)].map((valor: any) => {
              scheduling = {
                day: valor.day,
                hours: valor.hours,
                quantity: valor.quantity,
              };

              schedulings.push(scheduling);
            });

            const product: ProductObjApi = {
              id: results.id,
              name: results.nome,
              description: results.descricao,
              price: results.preco,
              quantity: totalQuantity,
              image: results.foto,
              scheduling: schedulings,
            };

            // Adicione o objeto ProductObj ao array de produtos
            products.push(product);
          }
        })
      );
    }
  }
  return new Response(JSON.stringify(products));
}

export async function POST(req: Request) {
  try {

    const session = await getAuthSession();

    const req_json = await req.json();
    const id_partner = req_json.restaurants;
    const amount = parseFloat(req_json.amount);
    const scheduling = req_json.scheduling;
    // Obtendo a data atual
    const dataAtual = new Date();

    // Obtendo os componentes da data
    const dia = String(dataAtual.getDate()).padStart(2, "0");
    const mes = String(dataAtual.getMonth() + 1).padStart(2, "0"); // Lembrando que os meses são indexados de 0 a 11
    const ano = dataAtual.getFullYear();
    
    const insertOrder = await db.pedido.create({
      data: {
        id_parceiro: id_partner,
        valor_total: amount,
        agendamento: scheduling,
        id_usuario: session!.user.id,
        avaliacao: null,
        status: "Aberto",
        data_pedido: dataAtual,
      },
    });
    console.log(insertOrder)

    // Criar sessões de checkout a partir dos parâmetros do corpo.
    return new Response(
      JSON.stringify({
        message: `Pedido realizado com sucesso!`,
        success: true,
      })
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        message: `Erro ao criar sessão de checkout: ${err}`,
        success: false,
      })
    );
  }
}
