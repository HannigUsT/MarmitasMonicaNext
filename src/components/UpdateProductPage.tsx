/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "@/hooks/use-toast";
import { useCustomToasts } from "@/hooks/use-custom-toasts";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { ProductCreationRequest } from "@/lib/validators/product";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductS } from "@/types/@types";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const UpdateProductPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginToast } = useCustomToasts();
  const [product, setProduct] = useState<ProductS>();
  const [productName, setProductName] = useState<string>("");
  const [productImage, setProductImage] = useState<File>();
  const [productDescription, setProductDescription] = useState<string>("");
  const [productRestrictions, setProductRestrictions] = useState<string[]>([]);
  const [productPrice, setProductPrice] = useState<number>(0.0);
  const [productId, setProductId] = useState<number | undefined>();
  const [productStatus, setProductStatus] = useState<number>(0);
  const [productPreviousImage, setProductPreviousImage] = useState<string>();

  useEffect(() => {
    const searchId = searchParams.get("id");
    try {
      (async () => {
        const payload = {
          id: searchId,
        };
        const { data } = await axios.post(`/api/product/id`, payload);
        if (data) {
          setProduct(data);
          setProductId(data.id);
          setProductName(data.nome);
          setProductPreviousImage(data.foto);
          setProductDescription(data.descricao);
          setProductPrice(data.preco);
          setProductStatus(data.status === true ? 1 : 0);
          setProductRestrictions(data.produto_restricoes);
        }
      })();
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          title: "Ocorreu um erro.",
          description: error.message,
          variant: "destructive",
        });
      }
      toast({
        title: "Ocorreu um erro.",
        description: "Aconteceu um erro inesperado.",
        variant: "destructive",
      });
    }
  }, []);

  const { mutate: updateProduct, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: ProductCreationRequest = {
        name: productName,
        image: productImage,
        description: productDescription,
        restrictions: productRestrictions,
        price: productPrice,
        status: productStatus,
      };
      const formData = new FormData();
      formData.append("id", (productId ?? "").toString());
      formData.append("name", payload.name);
      formData.append("imagePrevious", productPreviousImage || "");
      formData.append("image", payload.image);
      formData.append("description", payload.description);
      formData.append("restrictions", JSON.stringify(payload.restrictions));
      formData.append("price", payload.price.toString());
      formData.append("status", productStatus.toString());
      const { data } = await axios.put("/api/product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data as string;
    },

    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          return toast({
            title: "Subreddit already exists.",
            description: "Please choose a different name.",
            variant: "destructive",
          });
        }
        if (error.response?.status === 422) {
          return toast({
            title: "Invalid subreddit name.",
            description: "Please choose a name between 3 and 21 letters.",
            variant: "destructive",
          });
        }
        if (error.response?.status === 401) {
          return loginToast();
        }
      }
      toast({
        title: "There was an error.",
        description: "Could not create subreddit.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      router.back();
    },
  });

  const toggleRestriction = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log(`Restrições ids: ${restrictionsIds()}`);
    console.log(`Checkbox clicked: ${value}`);

    setProductRestrictions((prevRestrictions) => {
      const newValue = value.toString();

      if (prevRestrictions.includes(newValue)) {
        const updatedRestrictions = prevRestrictions.filter(
          (r) => r !== newValue
        );
        console.log("Removed restriction:", newValue);
        console.log("Updated restrictions:", updatedRestrictions);

        setProductRestrictions(updatedRestrictions);
        return updatedRestrictions;
      } else {
        const updatedRestrictions = [...prevRestrictions, newValue];
        console.log("Added restriction:", newValue);
        console.log("Updated restrictions:", updatedRestrictions);

        setProductRestrictions(updatedRestrictions);
        return updatedRestrictions;
      }
    });
  };

  const restrictionsIds = () => {
    if (product !== undefined && product.produto_restricoes.length > 0) {
      const idsArray: string[] = [];
      for (let i = 0; i < product.produto_restricoes.length; i++) {
        if (product.produto_restricoes !== undefined) {
          idsArray.push(
            product.produto_restricoes[i].tipo_restricoes.id.toString()
          );
        }
      }
      return idsArray;
    }
    return [];
  };

  const renderRestrictionsCheckboxes = () => {
    const restrictionOptions = [
      { id: "1", label: "Saudável" },
      { id: "2", label: "Vegetariana" },
      { id: "3", label: "Vegana" },
      { id: "4", label: "Sem lactose" },
      { id: "5", label: "Não saudável" },
    ];

    return restrictionOptions.map((option) => (
      <label key={option.id} className="max-w-full">
        <input
          type="checkbox"
          value={option.id}
          checked={restrictionsIds().includes(option.id)}
          onChange={toggleRestriction}
        />
        {option.label}
      </label>
    ));
  };

  return (
    <div className="container mx-auto my-8 p-8 bg-gray-100 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold">Editar Produto</h1>
        <Link href="/partner/product" className="btn-secondary">
          Voltar
        </Link>
      </div>

      <div className="mb-6">
        <label className="text-lg font-medium block">Nome</label>
        <div className="relative">
          <Input
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Digite o nome do produto"
            className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
            value={productName}
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="text-lg font-medium block">Imagem</label>
        <div className="relative">
          {productPreviousImage && (
            <Image
              src={productPreviousImage}
              width={100}
              height={100}
              alt="Existing Image"
            />
          )}
          <Input
            type="file"
            onChange={(e) => setProductImage(e.target.files?.[0])}
            className="max-w-full"
          />
        </div>
      </div>
      <div className="mb-6">
        <label className="text-lg font-medium block">Descrição</label>
        <div className="relative">
          <textarea
            value={productDescription}
            onChange={(e) =>
              setProductDescription(e.target.value.slice(0, 190))
            }
            rows={4}
            maxLength={255}
            className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="text-lg font-medium block">Restrições</label>
        <div className="flex gap-4 flex-wrap">
          {renderRestrictionsCheckboxes()}
        </div>
      </div>

      <div className="mb-6">
        <label className="text-lg font-medium block">Preço</label>
        <div className="relative">
          <Input
            type="number"
            step="0.01"
            value={productPrice}
            onChange={(e) => setProductPrice(parseFloat(e.target.value))}
            className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
            placeholder="Preço do Produto"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="text-lg font-medium block">Status</label>
        <div className="relative">
          <select
            id="select"
            value={productStatus}
            onChange={(e) => setProductStatus(Number(e.target.value))}
            className="custom-select"
          >
            <option value="1">Ativo</option>
            <option value="0">Inativo</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button disabled={isLoading} onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button
          isLoading={isLoading}
          disabled={
            productName.length === 0 ||
            productDescription.length === 0 ||
            productPrice === 0
          }
          onClick={() => updateProduct()}
        >
          Salvar
        </Button>
      </div>
    </div>
  );
};

export default UpdateProductPage;
