/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import axios, { AxiosError } from "axios";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Partner } from "@/types/@types";
import { useRouter } from "next/navigation";

const keyMappings: Record<string, string> = {
  // active: "Usuário Ativo",
  atividade_principal: "Atividade Principal",
  atividade_secundaria: "Atividade Secundaria",
  cnpj: "CNPJ",
  data_abertura: "Data de Abertura",
  porte: "Porte",
  data_cadastro: "Data de Cadastro",
  situacao_cadastral: "Situação Cadastral",
  data_situacao_cadastral: "Data da Situação Cadastral",
  situacao_especial: "Situação Especial",
  data_situacao_especial: "Data da Situação Especial",
  email_responsavel: "E-mail do Responsável",
  ente_federativo: "Ente Federativo",
  nome_empresarial: "Nome Empresarial",
  nome_responsavel: "Nome do Responsável",
  telefone_responsavel: "Telefone do Responsável",
  cep: "CEP",
  localidade: "Localidade",
  logradouro: "Logradouro",
  uf: "UF",
  bairro: "Bairro",
  casa: "Número da Casa",
  complemento: "Complemento",
  // nome_fantasia: "Nome Fantasia",
  // logotipo: "Logotipo",
  // firstTime: "Primeira Vez",
  // id: "ID",
  // usuario_id: "ID do Usuário",
};

const AdminPage = () => {
  const { toast } = useToast();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [noPartners, setNoPartners] = useState<boolean>(false);
  const [count, setCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get<Partner[]>("/api/partner");
        if (response.status === 402) {
          setNoPartners(true);
        } else {
          setNoPartners(false);
          setPartners(response.data);
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          return toast({
            description:
              "Nenhuma nova solicitação de parceiros no momento, tente novamente mais tarde.",
            variant: "destructive",
          });
        }
        return toast({
          title: "Aconteceu algo de errado.",
          description: "Aconteceu algum erro estranho.",
          variant: "destructive",
        });
      }
    })();
  }, [count]);

  const handleAccept = async (partner: Partner) => {
    try {
      setSelectedPartner(partner);
      if (selectedPartner === null || undefined) {
        return toast({
          title: "Aconteceu algo de errado.",
          description: "Aconteceu algum erro estranho.",
          variant: "destructive",
        });
      }
      selectedPartner.active = true;
      selectedPartner.firstTime = true;
      const payload = {
        ...partner,
      };
      const { data } = await axios.patch(`/api/admin`, payload);
      if (data === "OK") {
        router.refresh();
      }
      setCount(count + 1);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error) {
          return toast({
            title: "Aconteceu algo de errado.",
            description: "Erro 500",
            variant: "destructive",
          });
        }
      }
    }
  };

  const handleReject = async (partner: Partner) => {
    try {
      setSelectedPartner(partner);
      if (selectedPartner === null || undefined) {
        return toast({
          title: "Aconteceu algo de errado.",
          description: "Aconteceu algum erro estranho.",
          variant: "destructive",
        });
      } else {
        const { data } = await axios.post(`/api/admin`, { ...partner });
        if (data === "OK") {
          router.refresh();
        }
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error) {
          return toast({
            title: "Aconteceu algo de errado.",
            description: "Erro 500",
            variant: "destructive",
          });
        }
      }
    }
  };

  const closeModal = () => {
    setSelectedPartner(null);
  };

  const formatDate = (date: Date | undefined | null): string => {
    if (!date) return "";
    const formattedDate = new Date(date).toLocaleDateString("pt-BR");
    return formattedDate;
  };

  return (
    <div className="max-w-4xl mx-auto py-12">
      {noPartners ? null : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="border p-4 mb-4 cursor-pointer relative"
              onClick={() => setSelectedPartner(partner)}
            >
              <h2 className="text-2xl font-bold mb-2 text-center">
                {partner.nome_empresarial || partner.nome_fantasia}
              </h2>
              {partner.logotipo && (
                <div className="mb-2">
                  <Image
                    className="rounded-full"
                    width={150}
                    height={150}
                    src={partner.logotipo}
                    alt="Logotipo"
                  />
                </div>
              )}
              <div className="absolute inset-0 bg-gray-800 bg-opacity-50 blur opacity-0 transition-opacity duration-300"></div>
              <div className="absolute inset-0 text-white flex items-center justify-center opacity-0 transition-opacity duration-300">
                <p>Clique para ver mais</p>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Modal */}
      {selectedPartner && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 max-w-md relative modal-content">
            {Object.entries(selectedPartner).map(
              ([key, value]) =>
                keyMappings[key] &&
                value !== null &&
                value !== undefined &&
                value !== "" &&
                key !== "firstTime" && (
                  <div key={key} className="mb-2">
                    <p className="font-semibold">{keyMappings[key]}</p>
                    <p>
                      {key === "active"
                        ? value
                          ? "Sim"
                          : "Não"
                        : key === "data_abertura" ||
                          key === "data_cadastro" ||
                          key === "data_situacao_cadastral" ||
                          key === "data_situacao_especial"
                        ? formatDate(value)
                        : value}
                    </p>
                  </div>
                )
            )}
            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleAccept(selectedPartner)}
                className="bg-green-500 text-white px-4 py-2"
              >
                Aceitar
              </button>
              <button
                onClick={() => handleReject(selectedPartner)}
                className="bg-red-500 text-white px-4 py-2"
              >
                Recusar
              </button>
            </div>
            <button
              onClick={closeModal}
              className="absolute top-0 right-0 m-4 bg-gray-500 text-white px-2 py-1"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
