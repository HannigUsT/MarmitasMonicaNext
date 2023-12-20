/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Button } from "@/components/ui/Button";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { CSSProperties, useEffect, useState } from "react";
import Link from "next/link";
import Modal from "react-modal";
import Image from "next/image";
import {
  ModalProps,
  addressObj,
  ProductObj,
  SchedulingObj,
} from "@/types/@types";
import { useToast } from "@/hooks/use-toast";
import { mapDayOfWeekToName } from "@/lib/utils/utils";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.STRIPE_PUBLIC_KEY!).toString();

const ViewBagPage = ({ ...session }) => {
  const [address, setAdress] = useState<addressObj>();
  const [products, setProducts] = useState<ProductObj[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    axios
      .get(`/api/user/address?id_user=${session.session.user.id}`)
      .then((response) => {
        setAdress(response.data);
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

  useEffect(() => {
    const schedulingString = localStorage.getItem("scheduling");
    const productsString = localStorage.getItem("products");
    const order = productsString
      ? JSON.parse(productsString)
      : schedulingString
      ? JSON.parse(schedulingString)
      : null;
    const restaurants = localStorage.getItem("restaurants");
    const type_order = localStorage.getItem("type_order");

    const query = new URLSearchParams(window.location.search);
    if (query.get("canceled")) {
      localStorage.removeItem("order");
      setIsModalOpen(true);
    }

    const serializedOrder = encodeURIComponent(JSON.stringify(order));
    axios
      .get(
        `/api/order?order=${serializedOrder}&restaurants=${restaurants}&type_order=${type_order}`
      )
      .then((response) => {
        const updatedProducts = response.data.map((product: ProductObj) => {
          if (product.scheduling === null) {
            const currentDay = new Date().getDay() + 1;
            const currentTime = new Date();
            const nextHour = new Date(currentTime.getTime() + 60 * 60 * 1000);
            const formattedCurrentTime = `${currentTime.getHours()}:${String(
              currentTime.getMinutes()
            ).padStart(2, "0")}`;
            const formattedNextHour = `${nextHour.getHours()}:${String(
              nextHour.getMinutes()
            ).padStart(2, "0")}`;
            const timeRange = `${formattedCurrentTime} - ${formattedNextHour}`;
            product.scheduling = [
              {
                day: currentDay,
                hours: timeRange,
                quantity: product.quantity,
              },
            ];
          }
          return product;
        });
        setProducts(updatedProducts);
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

  const calculateSubtotal = () => {
    return products.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const { mutate: makePayment } = useMutation({
    mutationFn: async () => {
      const updatedScheduling: SchedulingObj[] = [];

      products.forEach((item) => {
        if (item.scheduling) {
          item.scheduling.forEach((schedule) => {
            const schedulingObj: SchedulingObj = {
              day: schedule.day,
              scheduling: {
                product: item.id,
                hours: schedule.hours,
                quantity: schedule.quantity,
              },
              status: 0,
            };

            updatedScheduling.push(schedulingObj);
          });
        }
      });

      localStorage.setItem("amount", calculateSubtotal().toFixed(2));
      localStorage.setItem("order", JSON.stringify(updatedScheduling));

      axios
        .post(
          `/api/order/payment`,
          {
            price: calculateSubtotal().toFixed(2),
          },
          {
            headers: {
              "Content-Type": "application/json", // Certifique-se de que o tipo de conteúdo é JSON
            },
            responseType: "json", // Defina explicitamente o tipo de resposta como JSON
          }
        )
        .then((response) => {
          router.push(response.data.url);
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
    },
  });
  const AddToCartModal: React.FC<ModalProps> = ({ isShowing, toggle }) => {
    const modalStyle: ReactModal.Styles = {
      content: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "8px",
        maxWidth: "400px",
        width: "100%",
        textAlign: "center",
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
        <h1>
          <strong>Atenção: </strong> Pagamento não efetuado!
        </h1>
        <div>
          <button
            style={cancelButtonStyle}
            onClick={() => {
              toggle();
            }}
          >
            Fechar
          </button>
        </div>
      </Modal>
    );
  };

  return (
    <>
      {/* Barra marrom */}
      <div className="fixed top-[72px] inset-x-0 bg-[#383836] text-white py-2 z-10">
        <div className="container max-w-7xl h-full mx-auto flex items-center justify-between gap-2">
          <h2 className="text-xl font-bold">Sacola</h2>
          <Link href="/" className="bg-[#FEC619] px-2 py-2 text-white rounded">
            Voltar
          </Link>
        </div>
      </div>

      {/* Seção de Endereço do Cliente */}
      <div className="container max-w-7xl mx-auto mt-8 p-4">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Endereço Cadastrado
        </h2>
        <p className="text-gray-700">
          <strong>CEP:</strong> {address?.zip_code}
          <br />
          <strong>Logradouro:</strong> {address?.public_place}
          <br />
          <strong>Bairro:</strong> {address?.neighborhood}
          <br />
          <strong>Complemento:</strong> {address?.complement}
          <br />
          <strong>Número:</strong> {address?.number}
        </p>
      </div>
      <hr className={`my-2 border-t border-gray-300`} />
      {/* Seção de Produtos na Sacola */}
      <div className="container max-w-7xl mx-auto mt-8 p-4">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Produtos na Sacola
        </h2>
        {products.map((item) => (
          <div
            key={item.id}
            className="flex flex-col md:flex-row items-center justify-between border-b py-4"
          >
            <div className="flex items-center mb-4 md:mb-0">
              <Image
                src={item.image == null ? "/icopequeno.ico" : item.image}
                alt={item.name}
                width={75} // Defina a largura desejada
                height={75} // Defina a altura desejada
                objectFit="cover" // ou outro valor conforme sua necessidade
                className="rounded-md mr-4"
              />
              <div>
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-gray-500">{item.description}</p>
                <p className="text-gray-700">
                  R$ {item.price.toFixed(2)} x {item.quantity}
                </p>
              </div>
            </div>
            {/* Agendamento */}
            <div
              className={`p-2 bg-gray-100 mt-4 md:mt-0 md:ml-4 flex-grow w-full ${
                item.scheduling == null ? "hidden" : "visible"
              }`}
            >
              <h4 className="text-lg font-semibold mb-2">
                Horário da Solicitação:
              </h4>
              <ul className="list-disc list-inside">
                {item.scheduling?.map((schedule, index) => (
                  <li key={index}>
                    <span className="font-semibold">
                      {mapDayOfWeekToName(schedule.day)}:
                    </span>{" "}
                    {schedule.hours === "Select time"
                      ? "Selecione um horário"
                      : schedule.hours}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <br />
              <strong>
                <p className="text-gray-800">
                  Subtotal: R$ {(item.price * item.quantity).toFixed(2)}
                </p>
              </strong>
            </div>
          </div>
        ))}

        {/* Seção de Subtotal e Botão de Pagamento */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Subtotal</h2>
          <p className="text-gray-700 font-semibold">
            Subtotal: R$ {calculateSubtotal().toFixed(2)}
          </p>
          <Button
            onClick={() => {
              makePayment();
            }}
            className="bg-[#383836] px-6 py-3 text-white rounded block w-full mt-4"
          >
            Realizar Pagamento
          </Button>
        </div>
      </div>

      <AddToCartModal
        isShowing={isModalOpen}
        toggle={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default ViewBagPage;
