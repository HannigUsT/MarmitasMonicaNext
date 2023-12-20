/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Link from "next/link";
import Image from "next/image";
import axios, { AxiosError } from "axios";
import { FC, useEffect, useState } from "react";
import { Product } from "@/types/@types";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/use-toast";

const PartnerProductsPage: FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [count, setCount] = useState(0);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get("/api/product/owner");
        console.log(data)
        setProducts(data);
      } catch (error) {
        if (error instanceof AxiosError) {
          return toast({
            title: "Erro",
            description: error.message,
            variant: "destructive",
          });
        }
        return toast({
          title: "Erro",
          description: "Aconteceu um erro inesperado.",
          variant: "destructive",
        });
      }
    })();
  }, [count]);

  const deleteProduct = async (id: string) => {
    try {
      await axios.delete(`/api/product?id=${id}`, {
        headers: { "Content-Type": "application/json" },
      });
      setCount(count + 1);
    } catch (error) {
      if (error instanceof AxiosError) {
        return toast({
          title: "Erro",
          description: error.message,
          variant: "destructive",
        });
      }
      return toast({
        title: "Error",
        description: "Aconteceu um erro inesperado.",
        variant: "destructive",
      });
    }
  };

  const updateProduct = async (id: string) => {
    router.push("/partner/product/update-product?id=" + id);
  };

  return (
    <div className="container mx-auto bg-gray-50 p-8 rounded-lg shadow-lg">
      <div className="flex justify-start mb-6">
        <div className="bg-gray-100 p-4 space-y-6 max-w-2xl mx-auto rounded-lg shadow">
          <div className="flex">
            <Button className="rounded">
              <Link href="/partner" className="btn-secondary">
                Voltar
              </Link>
            </Button>
            <Button className="rounded ml-auto">
              <Link
                href="/partner/product/new-product"
                className="btn-secondary"
              >
                Novo Produto
              </Link>
            </Button>
          </div>
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Lista de Produtos
          </h2>
          {products.length === 0 ? (
            <p className="text-center text-gray-500">
              Nenhum produto encontrado, adicione um produto.
              <br />
            </p>
          ) : (
            <ul>
              {products.map((product) => (
                <li
                  key={product.id}
                  className="border p-6 space-y-6 rounded mb-4"
                >
                  <div className="flex items-center justify-center">
                    <Image
                      src={product.foto}
                      alt={product.nome}
                      width={100}
                      height={100}
                      className="object-cover rounded"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-center mb-2">
                      {product.nome}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded ${
                        product.status === true ? "bg-green-500" : "bg-gray-500"
                      } text-white`}
                    >
                      {product.status === true ? "Ativo" : "Inativo"}
                    </span>
                    <div className="container mx-auto"></div>
                    <strong>
                      <p className="mt-2">Descrição:</p>
                    </strong>
                    <p>{product.descricao}</p>
                    <p>
                      <strong>Preço:</strong> R${product.preco.toFixed(2)}
                    </p>
                    <p>
                      <strong>Restrições:</strong>{" "}
                      {product.produto_restricoes
                        .map((restricao) => restricao.tipo_restricoes.descricao)
                        .join(", ")}
                    </p>
                  </div>
                  <div className="flex">
                    <Button
                      onClick={() => deleteProduct(product.id)}
                      className="bg-red-500 py-2 text-white rounded"
                    >
                      Deletar
                    </Button>
                    <Button
                      onClick={() => updateProduct(product.id)}
                      className="bg-yellow-500 py-2 text-white rounded ml-auto"
                    >
                      Editar
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default PartnerProductsPage;
