import { db } from "@/lib/db";
import { restaurantsObj } from "@/types/@types";
import { getDay, getHours, getMinutes } from "date-fns";

export async function GET() {
  const results = await db.parceiros.findMany({
    include: {
      disponibilidade: true,
      avaliacao_parceiro: {
        select: {
          avaliacao: true,
        },
      },
      parceiros_comida: {
        include: {
          tipo_comida: true,
        },
      },
    },
    where: {
      active: true,
    },
  });
  const resultsWithValues: restaurantsObj[] = results.map((parceiro) => {
    const partnerReviews = parceiro.avaliacao_parceiro;
    const totalReviews = partnerReviews.reduce(
      (acumulador, avaliacao) => acumulador + avaliacao.avaliacao,
      0
    );
    const medianReviews = totalReviews / partnerReviews.length;

    const availability = parceiro.disponibilidade;
    let dayAvailability = true;

    const currentDate = new Date();
    const dayOfCurrentWeek = getDay(currentDate);
    const currentTime = getHours(currentDate);
    const currentMinutes = getMinutes(currentDate);

    const horarioDoDia = availability.find(
      (horario) => horario.dia_semana === dayOfCurrentWeek
    );

    if (horarioDoDia) {
      const horaInicio = getHours(horarioDoDia.horario_inicio);
      const minutosInicio = getMinutes(horarioDoDia.horario_inicio);
      const horaFim = getHours(horarioDoDia.horario_fim);
      const minutosFim = getMinutes(horarioDoDia.horario_fim);

      if (
        (currentTime > horaInicio ||
          (currentTime === horaInicio && currentMinutes >= minutosInicio)) &&
        (currentTime < horaFim ||
          (currentTime === horaFim && currentMinutes <= minutosFim))
      ) {
        dayAvailability = true;
      } else {
        dayAvailability = false;
      }
    } else {
      dayAvailability = false;
    }
    const type_food = parceiro.parceiros_comida
      .map((comida) => comida.tipo_comida.descricao)
      .join(", ");

    return {
      id: parceiro.id,
      fantasy_name: parceiro.nome_fantasia,
      logo: parceiro.logotipo,
      partner_evaluation: medianReviews,
      availability: dayAvailability,
      food_type: type_food,
    };
  });

  return new Response(JSON.stringify(resultsWithValues));
}
