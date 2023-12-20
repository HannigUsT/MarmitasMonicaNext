"use client";

import { useState } from "react";
import { Disponibilidade } from "@/types/@types";
import { mapDayOfWeekToName } from "@/lib/utils/utils";

interface DayInputProps {
  dayOfWeek: number;
  onChange: (
    dayOfWeek: number,
    isActive: boolean,
    startTime: string,
    endTime: string
  ) => void;
  isActive: boolean;
}

const PartnerSettings = () => {
  const [disponibilidade, setDisponibilidade] = useState<Disponibilidade[]>([]);
  const [funcionalidadeEmAndamento, setFuncionalidadeEmAndamento] =
    useState(true);

  const updateAvailability = (
    dayOfWeek: number,
    isActive: boolean,
    startTime: string,
    endTime: string
  ) => {
    if (funcionalidadeEmAndamento) {
      // Adicione a animação de erro aqui
      return;
    }

    const updatedDisponibilidade = disponibilidade.map((d) => {
      if (d.dia_semana === dayOfWeek) {
        return {
          ...d,
          isActive,
          horario_inicio: startTime,
          horario_fim: endTime,
        };
      }
      return d;
    });
    setDisponibilidade(updatedDisponibilidade);
  };

  const renderDayInputs = () => {
    return Array.from({ length: 7 }, (_, index) => {
      const dayOfWeek = index + 1;
      const dayAvailability = disponibilidade.find(
        (d) => d.dia_semana === dayOfWeek
      ) || {
        isActive: false,
        horario_inicio: "09:00:00",
        horario_fim: "17:00:00",
      };

      return (
        <DayInput
          key={dayOfWeek}
          dayOfWeek={dayOfWeek}
          onChange={(day, value, startTime, endTime) =>
            updateAvailability(day, value, startTime, endTime)
          }
          isActive={dayAvailability.isActive}
        />
      );
    });
  };

  const DayInput: React.FC<DayInputProps> = ({
    dayOfWeek,
    onChange,
    isActive,
  }) => {
    const dayName = mapDayOfWeekToName(dayOfWeek);

    return (
      <div className="flex items-center space-x-4">
        <label className="text-lg">{dayName}</label>
        <input
          type="checkbox"
          onChange={(event) =>
            onChange(dayOfWeek, event.target.checked, "09:00:00", "17:00:00")
          }
          checked={isActive}
          disabled={funcionalidadeEmAndamento}
        />
        <input
          type="time"
          placeholder="Início"
          style={{ width: "100px" }}
          onChange={(event) =>
            onChange(dayOfWeek, isActive, event.target.value, "")
          }
          disabled={funcionalidadeEmAndamento}
        />
        <input
          type="time"
          placeholder="Término"
          style={{ width: "100px" }}
          onChange={(event) =>
            onChange(dayOfWeek, isActive, "", event.target.value)
          }
          disabled={funcionalidadeEmAndamento}
        />
      </div>
    );
  };

  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Configurações</h1>
        <h1 className="text-2xl font-semibold tracking-tight">
          Alterar Disponibilidade
        </h1>
        {funcionalidadeEmAndamento && (
          <div className="text-red-500 font-bold">
            Funcionalidade em andamento
          </div>
        )}
        {renderDayInputs()}
      </div>
    </div>
  );
};

export default PartnerSettings;
