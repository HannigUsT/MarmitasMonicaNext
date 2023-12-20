"use client";

import axios, { AxiosError } from "axios";
import { cn } from "@/lib/utils/utils";
import { FC, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/use-toast";
import { Icons } from "./ui/Icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { useMutation } from "@tanstack/react-query";
import { userSchemaForm } from "@/lib/validators/user";
import { UserFormData } from "@/lib/validators/user";
import { UserAuthFormProps, UserSession } from "@/types/@types";
import { signOut } from "next-auth/react";

const UserAuthForm: FC<UserAuthFormProps> = ({
  userData,
  className,
  ...props
}) => {
  const { toast } = useToast();
  const { handleSubmit, register, watch, setValue, formState } =
    useForm<UserFormData>({
      criteriaMode: "all",
      mode: "all",
      resolver: zodResolver(userSchemaForm),
      defaultValues: {
        pessoa: {
          nome: "",
          dataNascimento: new Date(),
          contato: "",
          cpf: "",
        },
        endereco: {
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

  const cep = watch("endereco.cep");

  const handleSetData = useCallback(
    (data: {
      logradouro: string;
      bairro: string;
      localidade: string;
      uf: string;
    }) => {
      setValue("endereco.logradouro", data.logradouro);
      setValue("endereco.bairro", data.bairro);
      setValue("endereco.localidade", data.localidade);
      setValue("endereco.uf", data.uf);
    },
    [setValue]
  );

  useEffect(() => {
    if (userData) {
      setValue("pessoa.nome", userData.pessoa.nome);
      setValue("pessoa.contato", userData.pessoa.contato);
      setValue("pessoa.cpf", userData.pessoa.cpf);
      setValue("endereco.cep", userData.endereco.cep);
      setValue("endereco.logradouro", userData.endereco.logradouro);
      setValue("endereco.bairro", userData.endereco.bairro);
      setValue("endereco.localidade", userData.endereco.localidade);
      setValue("endereco.uf", userData.endereco.uf);
      setValue("endereco.complemento", userData.endereco.complemento);
      setValue("endereco.casa", userData.endereco.casa);
    }
  }, [userData, setValue]);

  const handleFetchAddress = useCallback(
    async (cep: string) => {
      const { data } = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      handleSetData(data);
    },
    [handleSetData]
  );

  useEffect(() => {
    setValue("endereco.cep", cep);
    if (cep.length != 8) return;
    handleFetchAddress(cep);
  }, [handleFetchAddress, setValue, cep]);

  const { mutate: updateUser, isLoading } = useMutation({
    mutationFn: async ({ pessoa, endereco }: UserFormData) => {
      let privacyPolicy = sessionStorage.getItem("privacyPolicy");
      if (
        privacyPolicy === "true" &&
        pessoa !== undefined &&
        endereco !== undefined
      ) {
        let privacyPolicy = 1;
        const payload: UserFormData & UserSession = {
          pessoa,
          endereco,
          privacyPolicy,
        };
        const { data } = await axios.patch(`/api/user/`, payload);
        return data;
      }
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        return toast({
          title: "Error na solicitação para o servidor.",
          description: "Bad Request.",
          variant: "destructive",
        });
      }
      return toast({
        title: "Aconteceu algo de errado.",
        description: "Usuario não foi atualizado, por favor tente novamente.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        description: "Usuário foi atualizado com sucesso.",
        variant: "default",
      });
      document.cookie.split(";").forEach((cookie) => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.slice(0, eqPos) : cookie;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`;
      });
      window.sessionStorage.clear();
      window.localStorage.clear();
      signOut({
        callbackUrl: `${window.location.origin}/sign-in`,
      });
    },
  });

  return (
    <div className={cn("flex flex-col", className)} {...props}>
      <form
        className="border p-2 rounded sm:w-[300px] bg-gray-100"
        onSubmit={handleSubmit((e) => updateUser(e))}
      >
        <Input
          type="text"
          placeholder="Nome Completo"
          {...register("pessoa.nome")}
          className="border p-2 rounded w-full mb-2"
          helperText={formState.errors.pessoa?.nome?.message}
        />

        <div className="border p-2 rounded w-full mb-2 text-center">
          Data de Nascimento
          <Input
            placeholder="Data de Nascimento"
            type="date"
            {...register("pessoa.dataNascimento")}
            className="border p-2 rounded w-full mb-2"
            helperText={formState.errors.pessoa?.dataNascimento?.message}
            defaultValue={
              userData.pessoa.dataNascimento !== null
                ? new Date(userData.pessoa.dataNascimento)
                    .toISOString()
                    .split("T")[0]
                : ""
            }
          />
        </div>

        <Input
          type="tel"
          placeholder="Telefone celular"
          {...register("pessoa.contato")}
          className="border p-2 rounded w-full mb-2"
          helperText={formState.errors.pessoa?.contato?.message}
        />
        <Input
          type="number"
          placeholder="CPF"
          {...register("pessoa.cpf")}
          className="border p-2 rounded w-full mb-2"
          helperText={formState.errors.pessoa?.cpf?.message}
        />
        <Input
          type="number"
          placeholder="CEP"
          {...register("endereco.cep")}
          className="border p-2 rounded w-full mb-2"
          helperText={formState.errors.endereco?.cep?.message}
        />
        <Input
          type="text"
          placeholder="Logradouro"
          {...register("endereco.logradouro")}
          className="border p-2 rounded w-full mb-2"
          helperText={formState.errors.endereco?.logradouro?.message}
        />
        <Input
          type="text"
          placeholder="Bairro"
          {...register("endereco.bairro")}
          className="border p-2 rounded w-full mb-2"
          helperText={formState.errors.endereco?.bairro?.message}
        />
        <Input
          type="text"
          placeholder="Localidade"
          {...register("endereco.localidade")}
          className="border p-2 rounded w-full mb-2"
          helperText={formState.errors.endereco?.localidade?.message}
        />
        <Input
          type="text"
          placeholder="UF"
          {...register("endereco.uf")}
          className="border p-2 rounded w-full mb-2"
          helperText={formState.errors.endereco?.uf?.message}
        />
        <Input
          type="text"
          placeholder="Complemento"
          {...register("endereco.complemento")}
          className="border p-2 rounded w-full mb-2"
          helperText={formState.errors.endereco?.complemento?.message}
        />
        <Input
          type="text"
          placeholder="Casa"
          {...register("endereco.casa")}
          className="border p-2 rounded w-full mb-2"
          helperText={formState.errors.endereco?.casa?.message}
        />
        <Button
          isLoading={isLoading}
          type="submit"
          size="sm"
          className="w-full mt-2"
          onClick={() => {}}
          disabled={!formState.isValid}
        >
          {isLoading ? null : <Icons.google className="h-4 w-4 mr-2" />}
          Google
        </Button>
      </form>
    </div>
  );
};

export default UserAuthForm;
