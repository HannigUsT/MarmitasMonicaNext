import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { redirect } from "next/navigation";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request, res: Response) {
  try {
    const res = await req.json();
    const unit_amount = parseFloat(res.price) * 100;
    // Criar sessões de checkout a partir dos parâmetros do corpo.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "BRL",
            product_data: {
              name: "Pedidos de Marmitas",
              description: "Descrição do Produto",
            },
            unit_amount: unit_amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `https://marmitas-da-monica-next.vercel.app/orders?success=true`,
      cancel_url: `https://marmitas-da-monica-next.vercel.app/restaurants/bag?canceled=true`,
    });
    
    return new Response(JSON.stringify({ url: session.url! }));
  } catch (err) {
    return new Response(
      JSON.stringify({
        message: `Erro ao criar sessão de checkout: ${err}`,
        success: false,
      })
    );
  }
}
