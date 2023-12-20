/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import axios, { AxiosError } from "axios";
import { useEffect, useState, CSSProperties } from "react";
import Modal from "react-modal";
import Image from "next/image";
import { ModalProps, OrderObj, SchedulingObj2 } from "@/types/@types";
import { mapDayOfWeekToName, statusOrder } from "@/lib/utils/utils";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const ClientOrderPage = ({ ...session }) => {
  const [order, setOrder] = useState<OrderObj[]>([]);
  const [scheduling, setScheduling] = useState<SchedulingObj2[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter()
  const [valueNumber, setNumber] = useState<number>(0);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const successValue = query.get("success");

    if (successValue === "true" && valueNumber == 0) {
      try {
        setNumber(1)
        const scheduling = localStorage.getItem("order");
        const restaurants = localStorage.getItem("restaurants");
        const amount = localStorage.getItem("amount");

        axios
          .post(
            `/api/order/`,
            {
              scheduling: scheduling,
              restaurants: restaurants,
              amount: amount,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
              responseType: "json",
            }
          )
          .then((response) => {
            if (response.data.success) {
              localStorage.removeItem("order");
              localStorage.removeItem("restaurants");
              localStorage.removeItem("amount");
              localStorage.removeItem("type_order");
              localStorage.getItem("scheduling")
                ? localStorage.removeItem("scheduling")
                : localStorage.removeItem("products");
            }
          })
          .catch((error) => {
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
          });
       
        router.push('/');
      } catch (error) {
        console.error(error);
      }
    }
  });


  useEffect(() => {
    axios
      .get(`/api/order/user?id=${session.session.user.id}`)
      .then((response) => {
        const transformedOrder = response.data.map(
          (data: {
            id: number;
            id_parceiro: string;
            parceiros: {
              nome_fantasia: string;
              logotipo?: string;
            };
            agendamento: string;
            valor_total: number;
            avaliacao: number | null;
            data_pedido: string;
            status: string;
          }) => ({
            id: data.id,
            partner: {
              name: data.parceiros.nome_fantasia,
              id_partner: data.id_parceiro,
              logo: data.parceiros.logotipo || "/icopequeno.ico",
            },
            scheduling: JSON.parse(data.agendamento),
            amount: data.valor_total,
            assessment: data.avaliacao || null,
            order_date: new Date(data.data_pedido),
            status: data.status,
          })
        );
        setOrder(transformedOrder);
      })
      .catch((error) => {
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
      });
  }, []);

  const AddToCartModal: React.FC<ModalProps> = ({ isShowing, toggle }) => {
    const modalStyle: ReactModal.Styles = {
      content: {
        position: "absolute",
        top: "60%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "8px",
        maxWidth: "400px",
        width: "100%",
        textAlign: "center",
        height: "65%",
      },
      overlay: {
        backgroundColor: "rgba(0, 0, 0, 0.3)",
      },
    };

    const cancelButtonStyle: CSSProperties = {
      backgroundColor: "#CFCFCF",
      color: "black",
      padding: "10px 80px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      marginTop: "25px",
    };
    return (
      // @ts-ignore
      <Modal isOpen={isShowing} onRequestClose={toggle} style={modalStyle}>
        <h2>
          <strong>Agendamentos</strong>
        </h2>
        <div className="text-center">
          {scheduling[0] &&
            Array.isArray(scheduling[0]) &&
            scheduling[0].map((item) => (
              <div
                key={item.day}
                className="mt-2 border border-black p-2 flex flex-col md:flex-row items-start md:items-center justify-between"
              >
                <p className="text-xl font-bold">{`${mapDayOfWeekToName(
                  item.day
                )}`}</p>
                <div key={item.scheduling.product}>
                  <p className="mb-2 text-gray-700">{`Produto: ${item.scheduling.product}`}</p>
                  <p className="mb-2 text-gray-700">{`Hora: ${item.scheduling.hours}`}</p>
                  <p className="mb-2 text-gray-700">{`Quantidade: R$ ${item.scheduling.quantity}`}</p>
                </div>

                <p className="mb-2 text-gray-700">{`Status: ${statusOrder(
                  item.status
                )}`}</p>
              </div>
            ))}
        </div>
        <button
          style={cancelButtonStyle}
          onClick={() => {
            toggle();
          }}
        >
          Fechar
        </button>
      </Modal>
    );
  };

  return (
    <>
      {/* Barra marrom */}
      <div className="fixed top-[72px] inset-x-0 bg-[#383836] text-white py-2 z-10">
        <div className="container max-w-7xl h-full mx-auto flex items-center justify-between gap-2">
          <h2 className="text-xl font-bold">Pedidos</h2>
        </div>
      </div>

      {/* Lista de pedidos */}
      <div className="container max-w-7xl mx-auto mt-8">
        {order.map((item) => (
          <div
            key={item.id}
            className="mb-8 p-4 bg-white shadow-md rounded-md"
            onClick={() => {
              setScheduling([item.scheduling]);
              setIsModalOpen(true);
            }}
          >
            <div className="flex items-center">
              {/* Lado esquerdo - Logo do parceiro */}
              <div className="mr-4">
                <Image
                  className="rounded-full"
                  width={50}
                  height={50}
                  src={item.partner.logo}
                  alt="Logo do parceiro"
                />
              </div>

              {/* Centro - Número do pedido, Descrições e Status */}
              <div className="flex-1 ">
                <p className="text-xl font-bold">{`Nº Pedido: ${item.id}`}</p>
                <p className="mb-2 text-gray-700">{`Restaurante: ${item.partner.name}`}</p>
                <p className="mb-2 text-gray-700">{`Data: ${item.order_date.toLocaleDateString()}`}</p>
                <p className="mb-2 text-gray-700">{`Valor: R$ ${item.amount.toFixed(
                  2
                )}`}</p>
              </div>

              {/* Lado direito - Status do Pedido */}
              <div>
                <span
                  className={`w-8 h-8 text-white py-1 px-2 rounded self-end ${
                    item.status === "Aberto" ? "bg-green-500" : "bg-gray-500"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <AddToCartModal
        isShowing={isModalOpen}
        toggle={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default ClientOrderPage;
