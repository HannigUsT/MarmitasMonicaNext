import { z } from "zod";
import validator from "validator";
import { cpf } from "cpf-cnpj-validator";

export const userSchemaForm = z
  .object({
    pessoa: z.object({
      nome: z
        .string()
        .min(1, { message: "Mínimo de 3 caracteres." })
        .max(80, { message: "Máximo de 80 caracteres." }),
      dataNascimento: z.coerce
        .date({
          required_error: "Data de Nascimento é obrigatoria.",
          invalid_type_error: "Data de nascimento deve ser do tipo data",
        })
        .max(new Date(), { message: "Insira uma data válida." })
        .min(new Date("1900-01-01"), {
          message: "Insira uma data válida.",
        })
        .refine(
          (date) => {
            const ageDifMs = Date.now() - date.getTime();
            const ageDate = new Date(ageDifMs);
            const age = Math.abs(ageDate.getUTCFullYear() - 1970);
            return age >= 18;
          },
          { message: "Você deve ter pelo menos 18 anos de idade." }
        ),
      contato: z
        .string()
        .min(11, {
          message: "O contato deve ser um número de celular válido.",
        })
        .max(11, {
          message: "O contato deve ser um número de celular válido.",
        })
        .refine(validator.isMobilePhone, {
          message: "O contato deve ser um número de celular válido.",
        }),
      cpf: z.string().refine((value) => cpf.isValid(value), {
        message: "Por favor, insira um cpf válido.",
      }),
    }),
    endereco: z.object({
      cep: z.string().min(8, { message: "Por favor, informe um CEP válido." }),
      logradouro: z
        .string()
        .min(1, { message: "Por favor, informe um Logradouro válido." }),
      bairro: z
        .string()
        .min(1, { message: "Por favor, informe uma Bairro válido." }),
      localidade: z
        .string()
        .min(1, { message: "Por favor, informe uma Localidade válido." }),
      uf: z
        .string()
        .min(2, { message: "Por favor, informe uma UF válida." })
        .max(2, { message: "Por favor, informe uma UF válida." }),
      complemento: z
        .string()
        .min(1, { message: "Mínimo de 3 caracteres." })
        .max(80, { message: "Máximo de 80 caracteres." })
        .toUpperCase(),
      casa: z
        .string()
        .min(1, { message: "Mínimo de 3 caracteres." })
        .max(80, { message: "Máximo de 80 caracteres." })
        .toUpperCase(),
    }),
  })
  .transform((field) => ({
    pessoa: {
      nome: field.pessoa.nome,
      dataNascimento: field.pessoa.dataNascimento,
      contato: field.pessoa.contato,
      cpf: field.pessoa.cpf,
    },
    endereco: {
      cep: field.endereco.cep,
      logradouro: field.endereco.logradouro,
      bairro: field.endereco.bairro,
      localidade: field.endereco.localidade,
      uf: field.endereco.uf,
      complemento: field.endereco.complemento,
      casa: field.endereco.casa,
    },
  }));

export type UserFormData = z.infer<typeof userSchemaForm>;

export const userValidator = z.object({
  nome: z
    .string()
    .min(1, { message: "Mínimo de 3 caracteres." })
    .max(80, { message: "Máximo de 80 caracteres." }),
  dataNascimento: z.coerce
    .date({
      required_error: "Data de Nascimento é obrigatoria.",
      invalid_type_error: "Data de nascimento deve ser do tipo data",
    })
    .max(new Date(), { message: "Insira uma data válida." })
    .min(new Date("1900-01-01"), {
      message: "Insira uma data válida.",
    })
    .refine(
      (date) => {
        const ageDifMs = Date.now() - date.getTime();
        const ageDate = new Date(ageDifMs);
        const age = Math.abs(ageDate.getUTCFullYear() - 1970);
        return age >= 18;
      },
      { message: "Você deve ter pelo menos 18 anos de idade." }
    ),
  contato: z
    .string()
    .min(11, {
      message: "O contato deve ser um número de celular válido.",
    })
    .max(11, {
      message: "O contato deve ser um número de celular válido.",
    })
    .refine(validator.isMobilePhone, {
      message: "O contato deve ser um número de celular válido.",
    }),
  cpf: z.string().refine((value) => cpf.isValid(value), {
    message: "Por favor, insira um cpf válido.",
  }),
});
