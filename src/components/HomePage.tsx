/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Button from "@mui/joy/Button";
import FilterListIcon from "@mui/icons-material/FilterList";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Restaurant } from "@/types/@types";
import { useToast } from "@/hooks/use-toast";

const Home = ({ ...session }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const sessao = session.session;
    if (sessao === null) {
      //
    } else if (sessao.user.privacyPolicy === 0) {
      router.push("/settings");
    }
  }, []);

  useEffect(() => {
    axios
      .get("/api/restaurants")
      .then((response) => {
        setRestaurants(response.data); // Atu
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

  const chooseProduct = async (
    id: String,
    name_restaurants: String,
    availability: number
  ) => {
    router.push(
      "/restaurants/products?id=" +
        id +
        "&name_restaurants=" +
        name_restaurants +
        "&availability=" +
        availability
    );
  };

  return (
    <>
      {/* Barra marrom */}
      <div className="fixed top-[72px] inset-x-0 bg-[#383836] text-white py-2 z-10">
        <div className="container max-w-7xl h-full mx-auto flex items-center justify-between gap-2">
          {/* Botão de Escolher Cidades */}
          <Button size="lg" color="neutral">
            <LocationOnOutlinedIcon /> Cidade
          </Button>
          {/* Botão de Filtrar */}
          <Button size="lg" color="neutral" onClick={() => setOpen(true)}>
            Filtrar
            <FilterListIcon className="MuiSvgIcon-root" />
          </Button>
        </div>
      </div>

      {/* Seção de Restaurantes */}
      <div className="container max-w-7xl mx-auto p-4 mt-[72px] md:mt-0 z-1">
        {/* Adicionando margem superior */}
        <h1 className="text-2xl font-bold text-gray-800">Restaurantes</h1>
        {restaurants.map((restaurante) => (
          <div
            key={String(restaurante.id)}
            onClick={() =>
              chooseProduct(
                restaurante.id,
                restaurante.fantasy_name,
                restaurante.availability ? 1 : 0
              )
            }
            className="flex flex-col md:flex-row lg:flex-row xl:flex-row mb-4 p-4 border rounded"
          >
            {/* Nome Fantasia (centralizado) */}
            <h2 className="bg-[#383836] text-lg font-bold mb-2 md:text-center md:flex-1 md:mb-0 md:mr-4 lg:text-center lg:flex-1 lg:mb-0 lg:mr-4 text-white p-2 rounded-md">
              {restaurante.fantasy_name}
            </h2>
            {/* Imagem do restaurante (abaixo da badge) */}
            <div className="relative w-full md:w-48 lg:w-48 xl:w-48 h-40 md:h-32 lg:h-32 xl:h-32 mb-4 md:mb-0 lg:mb-0 xl:mb-0 lg:mt-4 xl:mt-4">
              <Image
                src={
                  restaurante.logo == null || restaurante.logo == ""
                    ? "/icopequeno.ico"
                    : restaurante.logo
                }
                alt={`Logo ${restaurante.fantasy_name}`}
                layout="fill"
                objectFit="cover"
                className="rounded-md"
              />
            </div>
            {/* Badge de Disponibilidade (à direita) */}
            <span
              className={`text-white py-1 px-2 rounded self-end ${
                restaurante.availability
                  ? "bg-green-500"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              {restaurante.availability ? "Aberto" : "Fechado"}
            </span>
            {/* Informações do restaurante (à direita) */}
            <div className="flex flex-col flex-1 md:ml-4 lg:ml-4 xl:ml-4">
              <p className="mb-2 text-lg">
                Avaliação:{" "}
                <span className="text-[#C9AB00]">
                  {restaurante.partner_evaluation
                    ? restaurante.partner_evaluation.toFixed(1)
                    : 0.0}
                </span>
              </p>
              <p className="mb-2 text-gray-700">
                Tipo de Comidas: {restaurante.food_type}
              </p>
            </div>
            <button
              onClick={() =>
                chooseProduct(
                  restaurante.id,
                  restaurante.fantasy_name,
                  restaurante.availability ? 1 : 0
                )
              }
              className="bg-[#FEC619] px-3 py-2 text-white rounded"
            >
              Escolher
            </button>
          </div>
        ))}
      </div>
    </>
  );
};
export default Home;
