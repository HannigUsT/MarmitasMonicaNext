import { HTMLAttributes, ReactNode } from "react";
import { User } from "next-auth";
import { AvatarProps } from "@radix-ui/react-avatar";
import { User as PrismaUser } from "@prisma/client";
import { UserFormData } from "@/lib/validators/user";

export interface Product {
  id: string;
  foto: string;
  nome: string;
  status: boolean;
  descricao: string;
  preco: number;
  produto_restricoes: {
    tipo_restricoes: {
      descricao: string;
    };
  }[];
}

export interface ProductS {
  id: string;
  foto: string;
  nome: string;
  status: boolean;
  descricao: string;
  preco: number;
  produto_restricoes: {
    tipo_restricoes: {
      descricao: string;
      id: number;
    };
  }[];
}

export interface LayoutProps {
  children: ReactNode;
}

export interface UserAccountNavProps extends HTMLAttributes<HTMLDivElement> {
  user: Pick<User, "name" | "image" | "email">;
  perfil?: number | null;
}

export interface UserAuthFormProps
  extends React.HTMLAttributes<HTMLDivElement> {
  userData: UserFormData;
}

export interface PartnerAuthFormProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export interface PartnerFinish extends React.HTMLAttributes<HTMLDivElement> {}

export interface UserAvatarProps extends AvatarProps {
  user: Pick<PrismaUser, "image" | "name">;
}

export interface UserLoginFormProps extends HTMLAttributes<HTMLDivElement> {}

export type UserSession = {
  name?: string;
  email?: string;
  image?: string;
  id?: string;
  perfil?: number;
  privacyPolicy?: number;
};

export interface Session {
  user: {
    name?: string;
    email?: string;
    image?: string;
    id: string;
    perfil?: number;
    privacyPolicy?: number;
  };
}

export type addressObj = {
  zip_code: String;
  public_place: String;
  neighborhood: String;
  complement: String;
  number: String;
};

export interface AvailabilityObj {
  day_week: number;
  availability_hours: {
    home_hour: String;
    final_hour: String;
  }[];
}

export interface ModalProps {
  isShowing: boolean;
  toggle: () => void;
}

export interface QuantityProduct {
  id: number;
  quantity: number;
}

export interface Partner {
  id: string;
  active: boolean;
  atividade_principal: string;
  bairro?: string | null;
  casa?: string | null;
  cep?: string;
  cnpj?: string | null;
  complemento?: string | null;
  data_abertura?: Date | null;
  data_cadastro?: Date | null;
  data_situacao_cadastral?: Date | null;
  data_situacao_especial?: Date | null;
  email_responsavel?: string | null;
  ente_federativo?: string | null;
  firstTime: boolean | null;
  localidade?: string | null;
  logotipo?: string | null;
  logradouro?: string | null;
  nome_empresarial?: string | null;
  nome_fantasia?: string | null;
  nome_responsavel?: string | null;
  porte?: string | null;
  situacao_cadastral?: string | null;
  situacao_especial?: string | null;
  telefone_responsavel?: string | null;
  uf?: string | null;
  usuario_id: string;
}
export type AddressObj = {
  zip_code: String;
  public_place: String;
  neighborhood: String;
  complement: String;
  number: String;
};

export interface ProductObj {
  id: number;
  name: string;
  description: string | null;
  price: number;
  quantity: number;
  image: string | null;
  scheduling:
    | {
        day: number;
        hours: string;
        quantity: number;
      }[]
    | null;
}

export interface ProductObjApi {
  id: number;
  name: string | null;
  description: string | null;
  price: number | null;
  quantity: number;
  image: string | null;
  scheduling:
    | {
        day: number;
        hours: string;
        quantity: number;
      }[]
    | null;
}

export interface SchedulingObj {
  day: number;
  scheduling: {
    product: number;
    hours: string;
    quantity: number;
  };
  status: number;
}

export interface Restaurant {
  id: String;
  logo: string | null;
  fantasy_name: string;
  partner_evaluation: number;
  food_type: string;
  availability: boolean;
}

export interface ToggleButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children?: ReactNode;
}

export type restaurantsObj = {
  id: String;
  fantasy_name: string | null;
  logo: string | null;
  availability: boolean;
  partner_evaluation: number;
  food_type: string;
};

export interface OrderItem {
  id: number;
  quantity: number;
}

export interface Scheduling {
  day: number;
  hours: string;
  quantity: number;
}

export interface OrderObj {
  id: number;
  partner: {
    name: string;
    id_partner: string;
    logo: string;
  };
  scheduling: {
    day: number;
    scheduling: {
      product: number;
      hours: string;
      quantity: number;
    }[];
    status: number;
  };
  amount: number;
  assessment: number;
  order_date: Date;
  status: String;
}

export interface OrderRetrieve {
  id: number;
  status: string | null;
  agendamento: string | null;
  valor_total: number | null;
  data_pedido: Date | null;
  user: {
    name: string | null;
    contato: string | null;
  };
  address: {
    cep: string | null | undefined;
    logradouro: string | null | undefined;
    bairro: string | null | undefined;
    localidade: string | null | undefined;
    uf: string | null | undefined;
    complemento: string | null | undefined;
    casa: string | null | undefined;
  };
}

export type Order = {
  id: OrderRetrieve["id"];
  agendamento: string;
};

export enum StatusEnum {
  "Pedido Recebido" = 0,
  "Pedido Aceito" = 1,
  "Pedido em Andamento" = 2,
  "Pedido Entregue" = 3,
  "Pedido Concluído" = 4,
}

export type ProductOrder = {
  id: number;
  nome: string;
  foto: string;
  preco: number;
  status: boolean;
  restricoes: {
    tipo_restricoes: {
      descricao: string;
    };
  }[];
};
export interface SchedulingObj2 {
  day: number;
  scheduling: {
    product: number;
    hours: string;
    quantity: number;
  }[];
  status: number;
}

export type Disponibilidade = {
  id: number;
  id_parceiro: string;
  dia_semana: number;
  horario_inicio: string;
  horario_fim: string;
  isActive: boolean;
};
