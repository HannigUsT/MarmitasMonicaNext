import { z } from "zod";

export const addressValidator = z.object({
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
});

export const addressObj = z.object({
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
});

export type AddressFormData = z.infer<typeof addressObj>;
