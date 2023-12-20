"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "@/hooks/use-toast";
import { useCustomToasts } from "@/hooks/use-custom-toasts";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { ProductCreationRequest } from "@/lib/validators/product";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

const NewProductPage = () => {
  const router = useRouter();
  const { loginToast } = useCustomToasts();
  const [productName, setProductName] = useState<string>("");
  const [productImage, setProductImage] = useState<File>();
  const [productDescription, setProductDescription] = useState<string>("");
  const [productRestrictions, setProductRestrictions] = useState<string[]>([]);
  const [productPrice, setProductPrice] = useState<number>(0.0);

  const toggleRestriction = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setProductRestrictions((prevRestrictions) => {
      if (prevRestrictions.includes(value)) {
        return prevRestrictions.filter((r) => r !== value);
      } else {
        return [...prevRestrictions, value];
      }
    });
  };

  const { mutate: createProduct, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: ProductCreationRequest = {
        name: productName,
        image: productImage,
        description: productDescription,
        restrictions: productRestrictions,
        price: productPrice,
        status: 0,
      };

      const formData = new FormData();
      formData.append("name", payload.name);
      formData.append("image", payload.image);
      formData.append("description", payload.description);
      formData.append("restrictions", JSON.stringify(payload.restrictions));
      formData.append("price", payload.price.toString());
      formData.append("status", payload.status.toString());

      const { data } = await axios.post("/api/product", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return data as string;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          toast({
            title: "Produto já existe.",
            description: "Por favor, escolha um nome diferente.",
            variant: "destructive",
          });
        } else if (error.response?.status === 422) {
          toast({
            title: "Nome de produto inválido.",
            description: "Por favor, escolha um nome entre 3 e 21 letras.",
            variant: "destructive",
          });
        } else if (error.response?.status === 401) {
          loginToast();
        }
      } else {
        toast({
          title: "Ocorreu um erro.",
          description: "Não foi possível criar o produto.",
          variant: "destructive",
        });
      }
    },
    onSuccess: () => {
      router.push(`/partner/product`);
    },
  });

  return (
    <div className="container mx-auto my-8 p-8 bg-gray-100 rounded-lg shadow-lg">
      <div className="flex justify-start mb-6">
        <Button>
          <Link href="/partner/product" className="btn-secondary">
            Voltar
          </Link>
        </Button>
      </div>

      <h1 className="text-2xl font-semibold mb-4 text-center">
        Adicionar Produto
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <p className="text-lg font-medium">Nome</p>
          <Input
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Digite o nome do produto"
            className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <p className="text-lg font-medium">Imagem</p>
          <Input
            className="max-w-full"
            type="file"
            onChange={(e) => setProductImage(e.target.files?.[0])}
          />
        </div>
      </div>

      <div>
        <p className="text-lg font-medium mt-4">Descrição</p>
        <textarea
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value.slice(0, 190))}
          rows={4}
          className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
          maxLength={190}
        />
      </div>

      <div>
        <p className="text-lg font-medium mt-4">Restrições</p>
        <div className="flex gap-4 flex-wrap">
          <label className="max-w-full">
            <input
              type="checkbox"
              value="1"
              checked={productRestrictions.includes("1")}
              onChange={toggleRestriction}
            />
            Saudável
          </label>
          <label className="max-w-full">
            <input
              type="checkbox"
              value="2"
              checked={productRestrictions.includes("2")}
              onChange={toggleRestriction}
            />
            Vegetariana
          </label>
          <label className="max-w-full">
            <input
              type="checkbox"
              value="3"
              checked={productRestrictions.includes("3")}
              onChange={toggleRestriction}
            />
            Vegana
          </label>
          <label className="max-w-full">
            <input
              type="checkbox"
              value="4"
              checked={productRestrictions.includes("4")}
              onChange={toggleRestriction}
            />
            Sem lactose
          </label>
          <label className="max-w-full">
            <input
              type="checkbox"
              value="5"
              checked={productRestrictions.includes("5")}
              onChange={toggleRestriction}
            />
            Não saudável
          </label>
        </div>
      </div>

      <div>
        <p className="text-lg font-medium  mt-4">Preço</p>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-2">
            R$
          </span>
          <input
            type="number"
            step="0.01"
            value={productPrice}
            onChange={(e) => setProductPrice(parseFloat(e.target.value))}
            className="w-full p-2 border rounded focus:outline-none focus:border-blue-500 pl-8"
            placeholder="Preço do Produto"
          />
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <Button
          disabled={isLoading}
          variant="subtle"
          onClick={() => router.back()}
          className="bg-red-500 text-white mr-4"
        >
          Cancelar
        </Button>
        <Button
          isLoading={isLoading}
          disabled={
            productName.length === 0 ||
            productDescription.length === 0 ||
            productPrice === 0 ||
            productImage == null
          }
          onClick={() => createProduct()}
          className="bg-green-500 text-white"
        >
          Adicionar
        </Button>
      </div>
    </div>
  );
};

export default NewProductPage;
