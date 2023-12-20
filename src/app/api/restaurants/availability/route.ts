import { db } from "@/lib/db";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id")?.toString();
  try {
    const results = await db.disponibilidade.findMany({
      where: {
        id_parceiro: id,
      },
    });

    const convertToTimeArray = (start: Date, end: Date) => {
      const timeArray = [];
      const startTime = new Date(start).getTime();
      const endTime = new Date(end).getTime();
      const timeInterval = 60 * 60 * 1000; // 1 hora em milissegundos

      for (let time = startTime; time <= endTime; time += timeInterval) {
        const formattedTime = new Date(time);
        const hours = formattedTime.getUTCHours().toString().padStart(2, "0");
        const minutes = formattedTime.getMinutes().toString().padStart(2, "0");

        // Adicionando 1 hora ao horário final
        const endFormattedTime = new Date(time + timeInterval);
        const endHours = endFormattedTime
          .getUTCHours()
          .toString()
          .padStart(2, "0");
        const endMinutes = endFormattedTime
          .getMinutes()
          .toString()
          .padStart(2, "0");

        const timeObj = {
          home_hour: `${hours}:${minutes}`,
          final_hour: `${endHours}:${endMinutes}`,
        };

        timeArray.push(timeObj);
      }

      return timeArray;
    };

    const availability = results.map((item) => ({
      day_week: item.dia_semana,
      availability_hours: convertToTimeArray(
        item.horario_inicio,
        item.horario_fim
      ),
    }));

    return new Response(JSON.stringify(availability));
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: `Erro na solicitação GET: ${error}`,
        success: false,
      })
    );
  }
}
