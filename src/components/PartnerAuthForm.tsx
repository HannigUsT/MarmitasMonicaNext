"use client";

import axios from "axios";
import { cn } from "@/lib/utils/utils";
import { ChangeEvent, FC, useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { useMutation } from "@tanstack/react-query";
import { PartnerFormData, partnerResolver } from "@/lib/validators/partner";
import { PartnerAuthFormProps } from "@/types/@types";
import { AddressFormData } from "@/lib/validators/address";
import { Select } from "@/components/ui/Select";

const PartnerAuthForm: FC<PartnerAuthFormProps> = ({ className, ...props }) => {
  const { toast } = useToast();

  const [partnerAtividadeSecundaria, setPartnerAtividadeSecundaria] =
    useState<string>();
  const [partnerSituacaoCadastral, setPartnerSituacaoCadastral] =
    useState<string>();
  const [partnerSituacaoEspecial, setPartnerSituacaoEspecial] =
    useState<string>();
  const [partnerPorte, setPartnerPorte] = useState<string>();
  const [partnerLogotipo, setPartnerLogotipo] = useState<File>();

  const { handleSubmit, register, watch, setValue, formState } = useForm<
    PartnerFormData & AddressFormData
  >({
    criteriaMode: "all",
    mode: "all",
    resolver: zodResolver(partnerResolver),
    defaultValues: {
      partner: {
        cnpj: "",
        nome_empresarial: "",
        nome_fantasia: "",
        nome_responsavel: "",
        telefone_responsavel: "",
        email_responsavel: "",
        atividade_principal: "",
        data_abertura: new Date(),
        data_situacao_cadastral: new Date(),
        data_situacao_especial: new Date(),
        ente_federativo: "",
      },
      address: {
        cep: "",
        logradouro: "",
        bairro: "",
        localidade: "",
        uf: "",
        complemento: "",
        casa: "",
      },
    },
  });

  const cep = watch("address.cep");

  const handleSetData = useCallback(
    (data: {
      logradouro: string;
      bairro: string;
      localidade: string;
      uf: string;
    }) => {
      setValue("address.logradouro", data.logradouro);
      setValue("address.bairro", data.bairro);
      setValue("address.localidade", data.localidade);
      setValue("address.uf", data.uf);
    },
    [setValue]
  );

  const handleFetchAddress = useCallback(
    async (cep: string) => {
      const { data } = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      handleSetData(data);
    },
    [handleSetData]
  );

  useEffect(() => {
    setValue("address.cep", cep);
    if (cep.length != 8) return;
    handleFetchAddress(cep);
  }, [handleFetchAddress, setValue, cep]);

  const { mutate: partnerSubmit, isLoading } = useMutation({
    mutationFn: async ({
      partner,
      address,
    }: PartnerFormData & AddressFormData) => {
      if (partner !== undefined && address !== undefined) {
        const payload: PartnerFormData & AddressFormData = {
          partner,
          address,
        };

        const formData = new FormData();

        if (partnerAtividadeSecundaria !== undefined) {
          partner.atividade_secundaria = partnerAtividadeSecundaria;
          formData.append("atividade_secundaria", partnerAtividadeSecundaria);
        }

        if (partnerSituacaoCadastral !== undefined) {
          partner.situacao_cadastral = partnerSituacaoCadastral;
          formData.append("situacao_cadastral", partnerSituacaoCadastral);
        }

        if (partnerSituacaoEspecial !== undefined) {
          partner.situacao_especial = partnerSituacaoEspecial;
          formData.append("situacao_especial", partnerSituacaoEspecial);
        }

        if (partnerPorte !== undefined) {
          partner.porte = partnerPorte;
          formData.append("porte", partnerPorte);
        }

        if (partnerLogotipo !== undefined) {
          partner.logotipo = partnerLogotipo;
          formData.append("logotipo", partnerLogotipo);
        }

        const { data } = await axios.post(`/api/partner/`, payload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        return data;
      }
    },
    onError: () => {
      return toast({
        title: "Aconteceu algo de errado.",
        description:
          "Erro ao fazer solicitação de cadastro de parceiro, por favor tente novamente mais tarde.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      return toast({
        description: "Sua solicitação foi criada com sucesso.",
      });
    },
  });

  return (
    <div className={cn("flex flex-col", className)} {...props}>
      <form
        className="border p-2 rounded sm:w-[300px] bg-gray-100"
        onSubmit={handleSubmit((e) => partnerSubmit(e))}
      >
        <div className="border p-2 rounded w-full mb-2 text-center">
          <Input
            type="number"
            placeholder="CNPJ"
            {...register("partner.cnpj")}
            className="border p-2 rounded w-full mb-2"
            helperText={formState.errors.partner?.cnpj?.message}
          />

          <Input
            type="text"
            placeholder="Razão Social"
            {...register("partner.nome_empresarial")}
            className="border p-2 rounded w-full mb-2"
            helperText={formState.errors.partner?.nome_empresarial?.message}
          />

          <Input
            type="text"
            placeholder="Nome Fantasia"
            {...register("partner.nome_fantasia")}
            className="border p-2 rounded w-full mb-2"
            helperText={formState.errors.partner?.nome_fantasia?.message}
          />

          <Input
            type="text"
            placeholder="Nome do Responsável"
            {...register("partner.nome_responsavel")}
            className="border p-2 rounded w-full mb-2"
            helperText={formState.errors.partner?.nome_responsavel?.message}
          />

          <Input
            type="text"
            placeholder="Telefone do Responsável"
            {...register("partner.telefone_responsavel")}
            className="border p-2 rounded w-full mb-2"
            helperText={formState.errors.partner?.telefone_responsavel?.message}
          />

          <Input
            type="text"
            placeholder="Email do Responsável"
            {...register("partner.email_responsavel")}
            className="border p-2 rounded w-full mb-2"
            helperText={formState.errors.partner?.email_responsavel?.message}
          />

          <Input
            type="text"
            placeholder="Ente Federativo"
            {...register("partner.ente_federativo")}
            className="border p-2 rounded w-full mb-2"
            helperText={formState.errors.partner?.ente_federativo?.message}
          />

          <div className="border p-2 rounded w-full mb-2 text-center">
            Data da Abertura
            <Input
              type="date"
              placeholder="Data da Abertura"
              {...register("partner.data_abertura")}
              className="border p-2 rounded w-full mb-2"
              helperText={formState.errors.partner?.data_abertura?.message}
            />
          </div>

          <Select
            options={[
              "Microempresa (ME)",
              "Empresa de Pequeno Porte (EPP)",
              "Empresa de médio porte (EMP)",
              "Grandes empresas (GE)",
            ]}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
              setPartnerPorte(e.target.value);
            }}
            value={partnerPorte}
            placeholder="Porte"
            className="border p-2 rounded w-full mb-2"
            helperText={formState.errors.partner?.porte?.message}
          />

          <div className="border p-2 rounded w-full mb-2">
            <p className="text-lg font-medium">Logotipo</p>
            <Input
              className="max-w-full"
              type="file"
              onChange={(e) => setPartnerLogotipo(e.target.files?.[0])}
            />
          </div>
        </div>

        <Input
          type="text"
          placeholder="Atividade Principal"
          {...register("partner.atividade_principal")}
          className="border p-2 rounded w-full mb-2"
          helperText={formState.errors.partner?.atividade_principal?.message}
        />
        <Input
          type="text"
          placeholder="Atividade Secundaria"
          onChange={(e) => setPartnerAtividadeSecundaria(e.target.value)}
          className="border p-2 rounded w-full mb-2"
          helperText={formState.errors.partner?.atividade_secundaria?.message}
        />
        <div className="border p-2 rounded w-full mb-2 text-center">
          <Input
            type="text"
            placeholder="Situação Cadastral"
            onChange={(e) => setPartnerSituacaoCadastral(e.target.value)}
            className="border p-2 rounded w-full mb-2"
            helperText={formState.errors.partner?.situacao_cadastral?.message}
          />
          Data da Situação Cadatral
          <Input
            type="date"
            placeholder="Data da Situação Cadastral"
            {...register("partner.data_situacao_cadastral")}
            className="border p-2 rounded w-full mb-2"
            helperText={
              formState.errors.partner?.data_situacao_cadastral?.message
            }
          />
          <Input
            type="text"
            placeholder="Situação Especial"
            onChange={(e) => setPartnerSituacaoEspecial(e.target.value)}
            className="border p-2 rounded w-full mb-2"
            helperText={formState.errors.partner?.situacao_especial?.message}
          />
          Data da Situação Especial
          <Input
            type="date"
            placeholder="Data da Situação Especial"
            {...register("partner.data_situacao_especial")}
            className="border p-2 rounded w-full mb-2"
            helperText={
              formState.errors.partner?.data_situacao_especial?.message
            }
          />
        </div>
        <div className="border p-2 rounded w-full mb-2 text-center">
          Endereço
          <Input
            type="number"
            placeholder="CEP"
            {...register("address.cep")}
            className="border p-2 rounded w-full mb-2"
            helperText={formState.errors.address?.cep?.message}
          />
          <Input
            type="text"
            placeholder="Logradouro"
            {...register("address.logradouro")}
            className="border p-2 rounded w-full mb-2"
            helperText={formState.errors.address?.logradouro?.message}
          />
          <Input
            type="text"
            placeholder="Bairro"
            {...register("address.bairro")}
            className="border p-2 rounded w-full mb-2"
            helperText={formState.errors.address?.bairro?.message}
          />
          <Input
            type="text"
            placeholder="Localidade"
            {...register("address.localidade")}
            className="border p-2 rounded w-full mb-2"
            helperText={formState.errors.address?.localidade?.message}
          />
          <Input
            type="text"
            placeholder="UF"
            {...register("address.uf")}
            className="border p-2 rounded w-full mb-2"
            helperText={formState.errors.address?.uf?.message}
          />
          <Input
            type="text"
            placeholder="Complemento"
            {...register("address.complemento")}
            className="border p-2 rounded w-full mb-2"
            helperText={formState.errors.address?.complemento?.message}
          />
          <Input
            type="text"
            placeholder="Casa"
            {...register("address.casa")}
            className="border p-2 rounded w-full mb-2"
            helperText={formState.errors.address?.casa?.message}
          />
        </div>
        <Button
          isLoading={isLoading}
          type="submit"
          size="sm"
          className="w-full mt-2"
          disabled={!formState.isValid}
        >
          {isLoading ? null : ""}
          Enviar para analise
        </Button>
      </form>
    </div>
  );
};

export default PartnerAuthForm;
