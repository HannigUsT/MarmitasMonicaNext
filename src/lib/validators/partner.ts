import { z } from "zod";
import { cnpj } from "cpf-cnpj-validator";
import validator from "validator";

const MAX_FILE_SIZE = 500000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const partnerSchemaForm = z.object({
  partner: z.object({
    id: z.string().nullable(),
    usuario_id: z.string().min(1, { message: "Campo obrigatório." }),
    cnpj: z
      .string()
      .nullable()
      .refine((value) => !value || cnpj.isValid(value), {
        message: "Por favor, insira um CNPJ válido.",
      }),
    data_abertura: z.coerce
      .date({
        required_error: "Data de Abertura é obrigatoria.",
        invalid_type_error: "Data de nascimento deve ser do tipo data",
      })
      .max(new Date(), { message: "Insira uma data válida." })
      .min(new Date("1900-01-01"), {
        message: "Insira uma data válida.",
      }),
    nome_fantasia: z
      .string()
      .min(1, { message: "Mínimo de 1 caractere." })
      .max(80, { message: "Máximo de 80 caracteres." })
      .nullable(),
    nome_empresarial: z
      .string()
      .min(1, { message: "Mínimo de 1 caractere." })
      .max(80, { message: "Máximo de 80 caracteres." })
      .nullable(),
    atividade_principal: z
      .string()
      .min(1, { message: "Mínimo de 1 caractere." })
      .max(80, { message: "Máximo de 80 caracteres." })
      .nullable(),
    ente_federativo: z
      .string()
      .min(1, { message: "Mínimo de 1 caractere." })
      .max(80, { message: "Máximo de 80 caracteres." })
      .nullable(),
    data_situacao_cadastral: z.date().nullable(),
    data_situacao_especial: z.date().nullable(),
    data_cadastro: z.date().nullable(),
    usuario: z
      .string()
      .min(1, { message: "Campo obrigatório." })
      .max(1, { message: "erro" }),
    disponibilidade: z.array(z.string()).nullable(),
    produto: z.array(z.string()).nullable(),
    parceiros_comida: z.array(z.string()).nullable(),
    pedido: z.array(z.string()).nullable(),
    avaliacao_parceiro: z.array(z.string()).nullable(),
    nome_responsavel: z
      .string()
      .min(1, { message: "Mínimo de 1 caractere." })
      .max(245, { message: "Máximo de 245 caracteres." })
      .nullable(),
    telefone_responsavel: z
      .string()
      .min(11, {
        message: "O contato deve ser um número de celular válido.",
      })
      .max(11, {
        message: "O contato deve ser um número de celular válido.",
      })
      .refine(validator.isMobilePhone, {
        message: "O contato deve ser um número de celular válido.",
      })
      .nullable(),
    email_responsavel: z
      .string()
      .email({ message: "Insira um email válido." })
      .nullable(),
    atividade_secundaria: z
      .string()
      .min(1, { message: "Mínimo de 1 caractere." })
      .max(80, { message: "Máximo de 80 caracteres." })
      .nullable(),
    logotipo: z
      .any()
      .refine((file) => file?.size <= MAX_FILE_SIZE, {
        message: "Tamanho maximo de 5MB.",
      })
      .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file?.type), {
        message:
          "Apenas arquivos nos formatos .jpg, .jpeg, .png and .webp são suportados.",
      })
      .nullable(),
    porte: z
      .string()
      .min(1, { message: "Mínimo de 3 caracteres." })
      .max(80, { message: "Máximo de 80 caracteres." })
      .toUpperCase()
      .nullable(),
    situacao_cadastral: z
      .string()
      .min(1, { message: "Mínimo de 1 caractere." })
      .max(80, { message: "Máximo de 80 caracteres." })
      .nullable(),
    situacao_especial: z
      .string()
      .min(1, { message: "Mínimo de 1 caractere." })
      .max(80, { message: "Máximo de 80 caracteres." })
      .nullable(),
  }),
});

export const partnerResolver = z
  .object({
    partner: z.object({
      cnpj: z
        .string()
        .nullable()
        .refine((value) => !value || cnpj.isValid(value), {
          message: "Por favor, insira um CNPJ válido.",
        }),
      nome_fantasia: z
        .string()
        .min(1, { message: "Mínimo de 1 caractere." })
        .max(80, { message: "Máximo de 80 caracteres." })
        .nullable(),
      nome_empresarial: z
        .string()
        .min(1, { message: "Mínimo de 1 caractere." })
        .max(80, { message: "Máximo de 80 caracteres." })
        .nullable(),
      nome_responsavel: z
        .string()
        .min(1, { message: "Mínimo de 1 caractere." })
        .max(245, { message: "Máximo de 245 caracteres." })
        .nullable(),
      telefone_responsavel: z
        .string()
        .min(11, {
          message: "O contato deve ser um número de celular válido.",
        })
        .max(11, {
          message: "O contato deve ser um número de celular válido.",
        })
        .refine(validator.isMobilePhone, {
          message: "O contato deve ser um número de celular válido.",
        })
        .nullable(),
      email_responsavel: z
        .string()
        .email({ message: "Insira um email válido." })
        .nullable(),
      atividade_principal: z
        .string()
        .min(3, "Mínimo de 3 caracteres.")
        .max(80, "Máximo de 80 caracteres.")
        .toUpperCase(),
      data_abertura: z.coerce
        .date({})
        .min(new Date("1900-01-01"), "Insira uma data de abertura válida.")
        .max(new Date(), "Insira uma data de abertura válida."),
      data_situacao_cadastral: z.coerce
        .date({})
        .min(
          new Date("1900-01-01"),
          "Insira uma data de situação cadastral válida."
        )
        .max(new Date(), "Insira uma data de situação cadastral válida."),
      data_situacao_especial: z.coerce
        .date({})
        .min(
          new Date("1900-01-01"),
          "Insira uma data de situação especial válida."
        )
        .max(new Date(), "Insira uma data de situação especial válida.")
        .nullable(),
      ente_federativo: z
        .string()
        .min(1, "Mínimo de 1 caractere.")
        .max(80, "Máximo de 80 caracteres."),
    }),
    address: z.object({
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
    partner: {
      cnpj: field.partner.cnpj,
      nome_fantasia: field.partner.nome_fantasia,
      nome_empresarial: field.partner.nome_empresarial,
      nome_responsavel: field.partner.nome_responsavel,
      telefone_responsavel: field.partner.telefone_responsavel,
      email_responsavel: field.partner.email_responsavel,
      atividade_principal: field.partner.atividade_principal,
      data_abertura: field.partner.data_abertura,
      data_situacao_cadastral: field.partner.data_situacao_cadastral,
      data_situacao_especial: field.partner.data_situacao_especial,
      ente_federativo: field.partner.ente_federativo,
    },
    address: {
      cep: field.address.cep,
      logradouro: field.address.logradouro,
      bairro: field.address.bairro,
      localidade: field.address.localidade,
      uf: field.address.uf,
      complemento: field.address.complemento,
      casa: field.address.casa,
    },
  }));

export const partnerValidator = z.object({
  usuario_id: z.string().min(1, { message: "Campo obrigatório." }),
  cnpj: z
    .string()
    .nullable()
    .refine((value) => !value || cnpj.isValid(value), {
      message: "Por favor, insira um CNPJ válido.",
    }),
  nome_fantasia: z
    .string()
    .min(1, { message: "Mínimo de 1 caractere." })
    .max(80, { message: "Máximo de 80 caracteres." })
    .nullable(),
  nome_empresarial: z
    .string()
    .min(1, { message: "Mínimo de 1 caractere." })
    .max(80, { message: "Máximo de 80 caracteres." })
    .nullable(),
  atividade_secundaria: z
    .string()
    .min(1, { message: "Mínimo de 1 caractere." })
    .max(80, { message: "Máximo de 80 caracteres." })
    .nullable(),
  situacao_cadastral: z
    .string()
    .min(1, { message: "Mínimo de 1 caractere." })
    .max(80, { message: "Máximo de 80 caracteres." })
    .nullable(),
  situacao_especial: z
    .string()
    .min(1, { message: "Mínimo de 1 caractere." })
    .max(80, { message: "Máximo de 80 caracteres." })
    .nullable(),
  data_cadastro: z.date().nullable(),
  usuario: z
    .string()
    .min(1, { message: "Campo obrigatório." })
    .max(1, { message: "erro" }),
  disponibilidade: z.array(z.string()).nullable(),
  produto: z.array(z.string()).nullable(),
  parceiros_comida: z.array(z.string()).nullable(),
  pedido: z.array(z.string()).nullable(),
  avaliacao_parceiro: z.array(z.string()).nullable(),
  nome_responsavel: z
    .string()
    .min(1, { message: "Mínimo de 1 caractere." })
    .max(245, { message: "Máximo de 245 caracteres." })
    .nullable(),
  telefone_responsavel: z
    .string()
    .min(11, {
      message: "O contato deve ser um número de celular válido.",
    })
    .max(11, {
      message: "O contato deve ser um número de celular válido.",
    })
    .refine(validator.isMobilePhone, {
      message: "O contato deve ser um número de celular válido.",
    })
    .nullable(),
  email_responsavel: z
    .string()
    .email({ message: "Insira um email válido." })
    .nullable(),
  atividade_principal: z
    .string()
    .min(8, { message: "Por favor, informe um CEP válido." }),
  data_abertura: z.coerce
    .date({})
    .max(new Date(), { message: "Insira uma data válida." })
    .min(new Date("1900-01-01"), {
      message: "Insira uma data válida.",
    }),
  data_situacao_cadastral: z.coerce
    .date({})
    .max(new Date(), { message: "Insira uma data válida." })
    .min(new Date("1900-01-01"), {
      message: "Insira uma data válida.",
    }),
  data_situacao_especial: z.coerce
    .date({})
    .max(new Date(), { message: "Insira uma data válida." })
    .min(new Date("1900-01-01"), {
      message: "Insira uma data válida.",
    }),
  ente_federativo: z
    .string()
    .min(1, { message: "Mínimo de 1 caractere." })
    .max(80, { message: "Máximo de 80 caracteres." }),
  logotipo: z
    .any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, {
      message: "Tamanho maximo de 5MB.",
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file?.type), {
      message:
        "Apenas arquivos nos formatos .jpg, .jpeg, .png and .webp são suportados.",
    }),
  porte: z
    .string()
    .min(1, { message: "Mínimo de 3 caracteres." })
    .max(80, { message: "Máximo de 80 caracteres." })
    .toUpperCase(),
});

export type PartnerFormData = z.infer<typeof partnerSchemaForm>;
