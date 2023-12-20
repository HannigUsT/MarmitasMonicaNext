import { z } from "zod";

const MAX_FILE_SIZE = 500000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const ProductValidator = z.object({
  name: z.string().min(1).max(55, { message: "Máximo de 55 caracteres." }),
  image: z
    .any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, {
      message: "Tamanho maximo de 5MB.",
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file?.type), {
      message:
        "Apenas arquivos nos formatos .jpg, .jpeg, .png and .webp são suportados.",
    }),
  description: z.string().max(255, { message: "Máximo de 255 caracteres." }),
  restrictions: z.array(z.string()),
  price: z.number().refine((value) => value !== null && value > 0, {
    message: "Preço mínimo é 0.",
  }),
  status: z.number(),
});

export const ProValidator = z.object({
  name: z.string().min(1).max(55, { message: "Máximo de 55 caracteres." }),
  description: z.string().max(255, { message: "Máximo de 255 caracteres." }),
  restrictions: z.array(z.string()),
  price: z.number().refine((value) => value !== null && value > 0, {
    message: "Preço mínimo é 0.",
  }),
  status: z.number(),
});

export type ProductCreationRequest = z.infer<typeof ProductValidator>;
