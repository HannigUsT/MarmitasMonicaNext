import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { ProductValidator } from "@/lib/validators/product";
import fs from "fs";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.formData();

    const partner = await db.parceiros.findFirst({
      where: {
        usuario_id: session.user.id,
      },
    });

    if (!partner) {
      return new Response("Partner does not exists.", {
        status: 404,
      });
    }
    const product = {
      name: body.get("name")?.toString(),
      description: body.get("description")?.toString(),
      price: Number(body.get("price")),
      restrictions: Array.from(body.getAll("restrictions[]"), (restriction) =>
        Number(restriction)
      ).map(String),
      image: body.get("image"),
    };
   
    const file = product.image as Blob;
    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = `/imagens/products/${partner.id}_${file.name}`;
    fs.writeFileSync("public" + filePath, buffer);

    //const validated = ProductValidator.parse(product);
    const createProduct = await db.produto.create({
      data: {
        nome: product.name,
        foto: filePath,
        preco: product.price,
        descricao: product.description,
        status: true,
        id_parceiro: partner.id,
        data_cadastro: new Date(),
      },
    });
   
    for (var i = 0; i < product.restrictions.length; i++) {
      await db.produto_restricoes.create({
        data: {
          id_produto: createProduct.id,
          id_restricoes: Number(product.restrictions[i]),
        },
      });
    }

    if (!createProduct) {
      return new Response("Erro creating product.", {
        status: 400,
      });
    }

    return new Response("Produto criado");
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: `Erro na solicitação POST: ${error}`,
        success: false,
      })
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.formData();

    const partner = await db.parceiros.findFirst({
      where: {
        usuario_id: session.user.id,
      },
    });

    if (!partner) {
      return new Response("Partner does not exists.", {
        status: 400,
      });
    }

    const idEntry = body.get("id");

    if (idEntry !== null && typeof idEntry === "string") {
      let restrictionsString = body.get("restrictions");
      const product = {
        idProduct: parseInt(idEntry),
        name: String(body.get("name")),
        description: String(body.get("description")),
        restrictionsString: body.get("restrictions"),
        restrictions: ([] = restrictionsString
          ? JSON.parse(restrictionsString.toString())
          : []),
        price: Number(body.get("price")),
        image: body.get("image") instanceof Blob,
        status: Number(body.get("status")) === 1 ? true : false,
      };

      let file: Blob = body.get("imagePrevious") as Blob;
      let filePath: string;

      if (!product.image) {
        filePath = String(file);
      } else {
        fs.unlink("public" + file, async (error) => {
          return "Erro ao excluir o arquivo" + error;
        });
        file = body.get("image") as Blob;
        const buffer = Buffer.from(await file.arrayBuffer());
        filePath = `/imagens/products/${partner.id}_${file.name}`;
        fs.writeFileSync("public" + filePath, buffer);
      }

      await db.produto_restricoes
        .deleteMany({
          where: {
            id_produto: product.idProduct,
          },
        })
        .catch((error) => {
          throw new Error("Erro ao excluir as restrições: " + error);
        });

      const updateProduct = await db.produto.update({
        where: { id: product.idProduct },
        data: {
          nome: product.name,
          foto: filePath,
          preco: product.price,
          descricao: product.description,
          status: product.status,
          id_parceiro: partner.id,
          data_cadastro: new Date(),
        },
      });

      for (var i = 0; i < product.restrictions.length; i++) {
        db.produto_restricoes
          .create({
            data: {
              id_produto: product.idProduct,
              id_restricoes: Number(product.restrictions[i]),
            },
          })
          .catch((error) => {
            return new Response(
              "Erro ao criar as restrições do produto." + error,
              { status: 400 }
            );
          });
      }

      return new Response(
        JSON.stringify({
          message: `ID recebido na solicitação Update: ${updateProduct}`,
          success: true,
        })
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: `Erro na solicitação Update: ${error}`,
        success: false,
      })
    );
  }
}

export async function GET() {
  const session = await getAuthSession();

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const results = await db.produto.findMany({
    include: {
      produto_restricoes: {
        include: {
          tipo_restricoes: true,
        },
      },
    },
  });
  return new Response(JSON.stringify(results));
}

export async function DELETE(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (id !== null) {
      const idProduct = parseInt(id);
      const deleteProduct = await db.produto.delete({
        where: {
          id: idProduct,
        },
      });
      return new Response(
        JSON.stringify({
          message: `ID recebido na solicitação DELETE: ${deleteProduct}`,
          success: true,
        })
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: `Erro na solicitação GET: ${error}`,
        success: false,
      })
    );
  }
}
