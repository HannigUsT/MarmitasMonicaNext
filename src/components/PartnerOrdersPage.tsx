/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { ChangeEvent, useEffect, useState } from "react";
import Link from "next/link";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import {
  Order,
  OrderRetrieve,
  Product,
  ProductOrder,
  SchedulingObj,
  StatusEnum,
} from "@/types/@types";
import { Button } from "./ui/Button";
import { Select } from "./ui/Select";
import { useRouter } from "next/navigation";
import Image from "next/image";

const PartnerOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<OrderRetrieve[] | null>(null);
  const [orderModalOpen, setOrderModalOpen] = useState<boolean>(false);
  const [userModalOpen, setUserModalOpen] = useState<boolean>(false);
  const [schedulingModalOpen, setSchedulingModalOpen] =
    useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderRetrieve | null>(
    null
  );
  const [selectedStatusArray, setSelectedStatusArray] = useState<string[]>([]);
  const [count, setCount] = useState(0);
  const { toast } = useToast();
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState<ProductOrder | null>(
    null
  );

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get("/api/order/partner");
        if (typeof data === "string") {
          toast({
            title: "Info",
            description: data,
            variant: "destructive",
          });
          setOrders([]);
        } else {
          setOrders(data as OrderRetrieve[]);
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          toast({
            title: "Erro",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Erro",
            description: "Aconteceu um erro inesperado.",
            variant: "destructive",
          });
        }
      }
    })();
  }, []);

  const closeProductInfoModal = () => {
    setSelectedProduct(null);
  };

  const loadProductDetails = async (productId: number) => {
    try {
      const payload = {
        productId,
      };
      const { data } = await axios.post(`/api/order/partner/product`, payload);
      const response: ProductOrder = data;
      if (response) {
        setSelectedProduct(response);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          title: "Erro",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erro",
          description: "Aconteceu um erro inesperado.",
          variant: "destructive",
        });
      }
    }
  };

  const openOrderModal = (order: OrderRetrieve) => {
    setSelectedOrder(order);
    setOrderModalOpen(true);
  };

  const openUserModal = () => {
    setUserModalOpen(true);
  };

  const openSchedulingModal = () => {
    setSchedulingModalOpen(true);
  };

  const closeModals = () => {
    setOrderModalOpen(false);
    setUserModalOpen(false);
    setSchedulingModalOpen(false);
  };

  const getStatusNumber = (status: keyof typeof StatusEnum): number => {
    return StatusEnum[status];
  };

  const getStatusName = (
    statusNumber: number
  ): keyof typeof StatusEnum | undefined => {
    const key = Object.keys(StatusEnum).find(
      (k) => StatusEnum[k as keyof typeof StatusEnum] === statusNumber
    ) as keyof typeof StatusEnum | undefined;

    return key;
  };

  const changeStatus = async (
    status: keyof typeof StatusEnum,
    scheduling: SchedulingObj[],
    index: number
  ) => {
    try {
      if (index >= 0 && index < scheduling.length) {
        const updatedScheduling = [...scheduling];
        updatedScheduling[index] = {
          ...updatedScheduling[index],
          status: getStatusNumber(status),
        };
        if (selectedOrder) {
          const order: Order = {
            id: selectedOrder.id,
            agendamento: JSON.stringify(updatedScheduling),
          };
          const { data } = await axios.patch("/api/order/partner", order);
          if (data === "OK") {
            router.push("/");
          }
          setCount(count + 1);
        }

        toast({
          title: "Sucesso",
          description: "Status do produto atualizado com sucesso.",
          variant: "default",
        });
      } else {
        throw new Error("Índice inválido");
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar o status do produto.",
        variant: "destructive",
      });
    }
  };

  const getStatusEnumValue = (
    statusString: string
  ): keyof typeof StatusEnum | undefined => {
    const statusValues = Object.values(StatusEnum) as string[];
    const foundStatus = statusValues.find((value) => value === statusString);
    return foundStatus as keyof typeof StatusEnum | undefined;
  };

  const openNewModal = (productId: number) => {
    loadProductDetails(productId);
    // Lógica para abrir um novo modal
  };

  const renderProductDetails = () => (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-md max-w-md w-full">
        <p className="text-xl font-semibold mb-4">Detalhes do Produto</p>
        {selectedProduct && (
          <div className="mb-4">
            <p>Nome: {selectedProduct.nome}</p>
            <p>Preço: R${selectedProduct.preco.toFixed(2)}</p>
            <p>
              Status: {selectedProduct.status ? "Disponível" : "Indisponível"}
            </p>
            {/* <Image src={selectedProduct.foto} alt={"Foto do produto"} /> */}

            {selectedProduct.restricoes.length > 0 && (
              <div>
                <p>Restrições:</p>
                <ul>
                  {selectedProduct.restricoes.map((restricao, index) => (
                    <li key={index}>{restricao.tipo_restricoes.descricao}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        <div className="flex justify-end">
          <Button onClick={() => closeProductInfoModal()}>Voltar</Button>
        </div>
      </div>
    </div>
  );

  const renderUserDetails = (selectedOrder: OrderRetrieve) => (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-md max-w-md w-full">
        <p className="text-xl font-semibold mb-4">Detalhes do Cliente</p>
        <div className="mb-4">
          <p>Nome: {selectedOrder.user.name}</p>
          <p>Contato: {selectedOrder.user.contato}</p>
          <p>Cep: {selectedOrder.address.cep}</p>
          <p>Bairro: {selectedOrder.address.bairro}</p>
          <p>localidade: {selectedOrder.address.localidade}</p>
          <p>UF: {selectedOrder.address.uf}</p>
          <p>Logradouro: {selectedOrder.address.logradouro}</p>
          <p>Complemento: {selectedOrder.address.complemento}</p>
          <p>Casa: {selectedOrder.address.casa}</p>
        </div>
        <div className="flex justify-end">
          <Button
            onClick={() => setUserModalOpen(false)}
            className=" hover:bg-gray-400"
          >
            Voltar
          </Button>
        </div>
      </div>
    </div>
  );

  const renderSchedulingDetails = (schedulingArray: SchedulingObj[]) => (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-gray-100 p-4 rounded w-full max-w-md overflow-y-auto max-h-full">
        <p className="text-lg font-semibold mb-4">Detalhes do Agendamento</p>
        <div className="pl-4 mt-2">
          {schedulingArray.map((scheduling, index) => (
            <div
              key={index}
              className="mt-2 border border-black p-2 flex flex-col md:flex-row items-start md:items-center justify-between"
            >
              <div>
                <p>Dia: {scheduling.day}</p>
                <p>Produto: {scheduling.scheduling.product}</p>
                <p>Horário: {scheduling.scheduling.hours}</p>
                <p>Quantidade: {scheduling.scheduling.quantity}</p>
                <p>Status: {getStatusName(scheduling.status)}</p>
              </div>
              <div className="mt-2 md:mt-0 md:ml-4">
                <Button
                  size={"sm"}
                  onClick={() => openNewModal(scheduling.scheduling.product)}
                >
                  Visualizar Produto
                </Button>
                {selectedProduct && renderProductDetails()}
              </div>
              <div className="mt-2 md:mt-0 md:ml-4">
                <Select
                  options={[
                    "Pedido Recebido",
                    "Pedido Aceito",
                    "Pedido em Andamento",
                    "Pedido Entregue",
                    "Pedido Concluído",
                  ]}
                  value={getStatusName(scheduling.status) || ""}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                    const statusEnumValue = getStatusEnumValue(e.target.value);
                    if (statusEnumValue !== undefined) {
                      const updatedStatusArray = [...selectedStatusArray];
                      updatedStatusArray[index] = e.target.value;
                      setSelectedStatusArray(updatedStatusArray);
                      changeStatus(statusEnumValue, schedulingArray, index);
                    }
                  }}
                />
              </div>
            </div>
            ))}
          <Button onClick={() => setSchedulingModalOpen(false)}>Voltar</Button>
        </div>
      </div>
    </div>
  );

  const openModal = () => (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-md max-w-md w-full">
        {selectedOrder && (
          <>
            <p className="text-xl font-semibold mb-4">
              Detalhes do Pedido #{selectedOrder.id}
            </p>

            <div className="mb-4">
              <Button
                disabled={schedulingModalOpen}
                hidden={schedulingModalOpen}
                onClick={() => openUserModal()}
                className="mr-2"
              >
                Dados do Cliente
              </Button>
              <Button onClick={() => openSchedulingModal()}>Agendamento</Button>
            </div>

            {userModalOpen && renderUserDetails(selectedOrder)}

            {schedulingModalOpen &&
              selectedOrder &&
              selectedOrder.agendamento &&
              renderSchedulingDetails(JSON.parse(selectedOrder.agendamento))}

            <div className="flex justify-end">
              <Button onClick={closeModals} className=" hover:bg-gray-400">
                Fechar
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );

  const renderOrders = () => {
    if (!orders) {
      return <p className="text-xl mt-4">Carregando...</p>;
    }

    if (orders.length === 0) {
      return <p className="text-xl mt-4">Nenhum pedido no momento.</p>;
    }

    return (
      <ul className=" mx-auto p-12">
        {orders.map((order) => (
          <li key={order.id} className="border border-black p-4">
            <div
              className="cursor-pointer "
              onClick={() => openOrderModal(order)}
            >
              Pedido #{order.id}
              <p>
                {" "}
                Data do Pedido:{" "}
                {order.data_pedido
                  ? new Date(order.data_pedido).toLocaleDateString("pt-Br", {
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                    })
                  : "Sem data"}
              </p>
              <p>
                Valor Total: R$
                <span className="text-green-700">
                  {order.valor_total?.toFixed(2) || "0.00"}
                </span>
              </p>
              <p>Status do Pedido: {order.status}</p>
            </div>
          </li>
        ))}
        {orderModalOpen && openModal()}{" "}
      </ul>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <p className="text-2xl font-semibold mb-4">Pedidos dos Parceiros</p>
      <Link
        href={{ pathname: "/partner/product" }}
        className="px-4 py-2 bg-black text-white rounded inline-block mb-4"
      >
        Página de Produtos
      </Link>
      {renderOrders()}
    </div>
  );
};

export default PartnerOrdersPage;
