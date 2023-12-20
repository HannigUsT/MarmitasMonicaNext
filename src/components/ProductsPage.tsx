/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import axios, { AxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, CSSProperties } from "react";
import Link from "next/link";
import Modal from "react-modal";
import Image from "next/image";
import {
  QuantityProduct,
  AvailabilityObj,
  Product,
  ModalProps,
} from "@/types/@types";
import { mapDayOfWeekToName } from "@/lib/utils/utils";
import { useToast } from "@/hooks/use-toast";

const ProductsPage = ({ ...session }) => {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [AvailabilityObj, setAvailabilitObj] = useState<AvailabilityObj[]>([]);
  const name_restaurants = searchParams.get("name_restaurants");
  const availability = searchParams.get("availability");
  const [isModalOpen, setIsModalOpen] = useState(false); // Adicione esta linha
  const [showAddRequestTraditionalButton, setShowAddRequestTraditionalButton] =
    useState(false);
  const [showAddRequestSchedulingButton, setShowAddRequestSchedulingButton] =
    useState(false);
  const [showAddBagButton, setShowAddBagButton] = useState(false);
  const [viewBagType, setViewBagType] = useState<number>(0);
  const [requestTraditional, setRequestTraditional] = useState<
    QuantityProduct[]
  >([]);
  const [, setQuantity] = useState<number>(0);

  const [selectedValues, setSelectedValues] = useState<{
    [productId: number]: {
      day: number;
      hours: string;
      quantity: number;
    }[];
  }>({});

  const handleCheckboxChange = (productId: number, day: number) => {
    setSelectedValues((prevSelectedValues) => {
      const productValues = prevSelectedValues[productId] || [];
      const isDaySelected = productValues.some((item) => item.day === day);

      const updatedValues = {
        ...prevSelectedValues,
        [productId]: isDaySelected
          ? productValues.filter((item) => item.day !== day)
          : [
              ...productValues,
              {
                day: day,
                hours: "Select time",
                quantity: 1,
              },
            ],
      };
      return updatedValues;
    });
  };

  const handleSelectChange = (
    productId: number,
    day: number,
    value: string
  ) => {
    setSelectedValues((prevSelectedValues) => {
      const productValues = prevSelectedValues[productId] || [];
      const updatedValues = {
        ...prevSelectedValues,
        [productId]: productValues.map((item) =>
          item.day === day ? { ...item, hours: value } : item
        ),
      };
      return updatedValues;
    });
  };

  const handleAddButtonClick = (productId: number, day: number) => {
    setSelectedValues((prevSelectedValues) => {
      const productValues = prevSelectedValues[productId] || [];
      const isDaySelected = productValues.some((item) => item.day === day);

      const updatedValues = {
        ...prevSelectedValues,
        [productId]: isDaySelected
          ? productValues.map((item) =>
              item.day === day && item.quantity
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          : [
              ...productValues,
              {
                day: day,
                hours: "Select time",
                quantity: 1,
              },
            ],
      };
      return updatedValues;
    });
  };

  const handleRemoveButtonClick = (productId: number, day: number) => {
    setSelectedValues((prevSelectedValues) => {
      const productValues = prevSelectedValues[productId] || [];
      const updatedValues = {
        ...prevSelectedValues,
        [productId]: productValues
          .map((item) =>
            item.day === day && item.quantity > 0
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
          .filter((item) => item.quantity > 0), // Remover o item se a quantidade for zero
      };
      return updatedValues;
    });
  };

  useEffect(() => {
    const sessao = session.session;
    if (sessao === null) {
      router.push("/sign-in");
    }
  }, []);

  useEffect(() => {
    const searchId = searchParams.get("id");
    axios
      .get(`/api/restaurants/availability?id=${searchId}`)
      .then((response) => {
        setAvailabilitObj(response.data);
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
    const searchId = searchParams.get("id");
    axios
      .get(`/api/restaurants/product?id=${searchId}`)
      .then((response) => {
        setProducts(response.data); // Atu
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

  const viewBag = (type: number) => {
    const searchId: string = searchParams.get("id") || "vazio";
    if (type == 1) {
      localStorage.setItem("products", JSON.stringify(requestTraditional));
      localStorage.removeItem("scheduling");
    } else {
      localStorage.removeItem("products");
      localStorage.setItem("scheduling", JSON.stringify(selectedValues));
    }
    localStorage.setItem("restaurants", searchId);
    localStorage.setItem("type_order", type.toString());

    router.push("/restaurants/bag");
  };

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

    const buttonContainerStyle: CSSProperties = {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "20px",
    };

    const buttonStyle: CSSProperties = {
      backgroundColor: "#383836",
      color: "white",
      padding: "10px 40px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      marginTop: "15px",
      margin: "auto",
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
          <strong>Escolha a opção:</strong>
        </h2>
        <div style={buttonContainerStyle}>
          <button
            style={buttonStyle}
            onClick={() => {
              setViewBagType(2);
              setShowAddRequestSchedulingButton(true);
              setShowAddRequestTraditionalButton(false);
              setShowAddBagButton(false);
              toggle();
            }}
          >
            Agendamento
          </button>
          <button
            style={buttonStyle}
            onClick={() => {
              setViewBagType(1);
              setShowAddRequestTraditionalButton(true);
              setShowAddRequestSchedulingButton(false);
              setShowAddBagButton(false);
              toggle();
            }}
            className={`${availability == "1" ? "visible" : "hidden"}`}
          >
            Tradicional
          </button>
        </div>
        <button
          style={cancelButtonStyle}
          onClick={() => {
            setShowAddRequestSchedulingButton(false);
            setShowAddRequestTraditionalButton(false);
            setShowAddBagButton(false);
            toggle();
          }}
        >
          Cancelar
        </button>
      </Modal>
    );
  };

  const getQuantityById = (id_product: number): number => {
    const product = requestTraditional.find((item) => item.id === id_product);
    return product ? product.quantity : 0;
  };

  return (
    <>
      {/* Barra marrom */}
      <div className="fixed top-[72px] inset-x-0 bg-[#383836] text-white py-2 z-10">
        <div className="container max-w-7xl h-full mx-auto flex items-center justify-between gap-2">
          <h2>{name_restaurants}</h2>
          <Link href="/" className="bg-[#FEC619] px-2 py-2 text-white rounded">
            Voltar
          </Link>
        </div>
      </div>

      {/* Seção de Restaurantes */}
      <div className="container max-w-7xl mx-auto p-4 mt-[72px] md:mt-0 z-1">
        {/* Adicionando margem superior */}

        {/* Exibição de Produtos */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
          style={{ marginBottom: "70px" }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg overflow-hidden shadow-md"
            >
              <Image
                src={product.foto}
                alt={product.nome}
                width={100}
                height={100}
                className="w-full h-40 object-cover"
              />

              <div className="p-4">
                <h3 className="text-lg font-semibold">{product.nome}</h3>
                <p className="text-gray-500">{product.descricao}</p>

                <div className="mt-2 flex justify-between items-center">
                  <p className="text-green-500 font-bold">
                    R$ {product.preco.toFixed(2)}
                  </p>

                  <button
                    className={`bg-[#383836] text-white px-3 py-1 rounded-md `}
                    onClick={() => {
                      setIsModalOpen(true);
                    }}
                  >
                    Adicionar
                  </button>
                </div>
              </div>

              <div className="p-2 bg-gray-100">
                <p className="text-sm font-semibold">Restrições:</p>
                <ul className="flex space-x-2">
                  {product.produto_restricoes.map((restricao) => (
                    <li key={restricao.tipo_restricoes.descricao}>
                      {restricao.tipo_restricoes.descricao}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-2 bg-white">
                <strong>
                  <h2
                    className={`${
                      showAddRequestTraditionalButton ? "visible" : "hidden"
                    }`}
                  >
                    Quantidade:{" "}
                    <span>{getQuantityById(Number(product.id))}</span>
                  </h2>
                </strong>
                <hr
                  className={`my-2 border-t border-gray-300 ${
                    showAddRequestTraditionalButton ? "visible" : "hidden"
                  }`}
                />
                <button
                  className={`bg-[#FEC619] px-3 py-2 text-white rounded block w-full ${
                    showAddRequestTraditionalButton ? "visible" : "hidden"
                  }`}
                  onClick={() => {
                    const index = requestTraditional.findIndex(
                      (item) => item.id === Number(product.id)
                    );

                    if (index !== -1) {
                      const value = requestTraditional.find(
                        (item) => item.id === Number(product.id)
                      );
                      const previousQuantity = value ? value.quantity : 0;

                      // Se o produto já estiver na sacola, substitua a quantidade
                      const updatedRequestTraditional = [...requestTraditional];
                      updatedRequestTraditional[index].quantity =
                        previousQuantity + 1;
                      setRequestTraditional(updatedRequestTraditional);
                      setQuantity(previousQuantity + 1);
                      setShowAddBagButton(true);
                    } else {
                      // Se o produto não estiver na sacola, adicione-o
                      setRequestTraditional((prev) => [
                        ...prev,
                        { id: Number(product.id), quantity: 1 },
                      ]);

                      setQuantity(1);
                      setShowAddBagButton(true);
                    }
                  }}
                >
                  Adicionar
                </button>
                <button
                  className={`bg-gray-500 px-3 py-2 text-white rounded block w-full mt-2 ${
                    showAddRequestTraditionalButton ? "visible" : "hidden"
                  }`}
                  onClick={() => {
                    const index = requestTraditional.findIndex(
                      (item) => item.id === Number(product.id)
                    );
                    if (index !== -1) {
                      setRequestTraditional((prev) =>
                        prev.filter((item) => item.id !== Number(product.id))
                      );
                    }
                  }}
                >
                  Remover
                </button>
                {/* Opções de agendamento */}
                <div
                  className={`mt-4 ${
                    showAddRequestSchedulingButton ? "visible" : "hidden"
                  }`}
                >
                  <h3 className="text-lg font-semibold mb-2">
                    Escolha o agendamento:
                  </h3>
                  <hr
                    className={`my-2 border-t border-gray-300 ${
                      showAddRequestSchedulingButton ? "visible" : "hidden"
                    }`}
                  />
                  <div>
                    {AvailabilityObj.map((day) => (
                      <div
                        key={day.day_week}
                        className="flex flex-wrap gap-2 mb-2"
                      >
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={
                              !!(
                                selectedValues[Number(product.id)] &&
                                selectedValues[Number(product.id)].some(
                                  (item) =>
                                    item.day === day.day_week &&
                                    item.quantity > 0
                                )
                              )
                            }
                            onChange={() => {
                              handleCheckboxChange(
                                Number(product.id),
                                day.day_week
                              );
                              setShowAddBagButton(true);
                            }}
                          />
                          <span className="text-base">
                            {mapDayOfWeekToName(day.day_week)}
                          </span>
                        </label>
                        {/* Opções de horários */}
                        <div>
                          <select
                            value={
                              selectedValues[Number(product.id)]?.find(
                                (item) => item.day === day.day_week
                              )?.hours || ""
                            }
                            onChange={(e) => {
                              handleSelectChange(
                                Number(product.id),
                                day.day_week,
                                e.target.value
                              );
                              setShowAddBagButton(true);
                            }}
                            className="w-full px-3 py-2 border rounded-md text-base"
                          >
                            <option value="">Horário</option>
                            {day.availability_hours.map((hourRange, index) => (
                              <option
                                key={`${hourRange.home_hour}-${hourRange.final_hour}`}
                                value={`${hourRange.home_hour} - ${hourRange.final_hour}`}
                              >{`${hourRange.home_hour} - ${hourRange.final_hour}`}</option>
                            ))}
                          </select>
                        </div>
                        <div className="bg-[#383836] px-2 py-2 rounded-md text-white">
                          <strong>
                            <h2>
                              <span>
                                {selectedValues[Number(product.id)]?.find(
                                  (item) => item.day === day.day_week
                                )?.quantity || 0}
                              </span>
                            </h2>
                          </strong>
                        </div>
                        <button
                          className="bg-[#FEC619] px-2 py-1 text-white rounded block w-full"
                          onClick={() => {
                            handleAddButtonClick(
                              Number(product.id),
                              day.day_week
                            );
                          }}
                        >
                          Adicionar
                        </button>
                        <button
                          className="bg-gray-500 px-2 py-1 text-white rounded block w-full"
                          onClick={() => {
                            handleRemoveButtonClick(
                              Number(product.id),
                              day.day_week
                            );
                          }}
                        >
                          Remover
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rodapé com botão "Sacola" */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-[#383836] text-white py-4 z-10  ${
          showAddBagButton ? "visible" : "hidden"
        }`}
      >
        <div className="container max-w-7xl mx-auto flex items-center justify-between">
          {/* Botão "Sacola" */}
          <button
            className={`bg-[#FEC619] px-6 py-3 text-white rounded block w-full`}
            onClick={() => {
              if (viewBagType === 1) {
                viewBag(1);
              } else {
                viewBag(2);
              }
            }}
          >
            Sacola
          </button>
        </div>
      </div>

      {/* Modal */}

      <AddToCartModal
        isShowing={isModalOpen}
        toggle={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default ProductsPage;
