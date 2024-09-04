"use client";
import { cn } from "@/lib/utils";
import Logo from "@/public/LOGO_black.png";
import Image from "next/image";
import TickIcon from "@/public/tick.svg";
import { EnvEstado, Order } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";

type Props = {
  order: Order;
  index: number;
};

type NewSeguimiento = Omit<EnvEstado, "D_FEC_HORA_ALTA"> & {
  D_FEC_HORA_ALTA: string[];
};

export const TrackingComponent2 = ({ order, index }: Props) => {
  const [change, setChanged] = useState(false);
  const [boxText, setBoxText] = useState<string>(
    "Ya hemos recibido tu pedido y se está preparando!"
  );
  const [reorganizedSeguimientos, setReorganizedSeguimientos] = useState<
    NewSeguimiento[]
  >([]);
  function formatDate(dateStr: string) {
    const [datePart, timePart] = dateStr.split(" ");
    const [month, day, year] = datePart.split("/");
    const [hours, minutes, seconds] = timePart.split(":");

    const date = new Date(
      `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
    );

    const formattedDay = date.getDate().toString().padStart(2, "0");
    const formattedMonth = date.toLocaleString("default", { month: "short" });
    const formattedHours = date.getHours().toString().padStart(2, "0");
    const formattedMinutes = date.getMinutes().toString().padStart(2, "0");

    return `${formattedDay} ${formattedMonth}\n${formattedHours}:${formattedMinutes}`;
  }

  function defineBoxText(id: string, dateStr: string) {
    // En el caso de no estar entregado, se entregará el día siguiente
    if (Number(id) < 2) {
      return `Tu pedido está en camino y llegará mañana entre las 10:00 y las 19:00.\nPara concertar un horario preferente de entrega, contactar con 916 31 67 12 indicando el número localizador`;
    } else if (Number(id) === 2) {
      return `Tu pedido está en reparto y llegará hoy entre las 10:00 y las 19:00.\nPara concertar un horario preferente de entrega, contactar con 916 31 67 12 indicando el número localizador`;
    } else if (Number(id) === 3) {
      return `Tu pedido ya ha sido entregado el ${dateStr}`;
    } else if (Number(id) > 3) {
      return `Tu pedido está en incidencia. Contactar con el teléfono 916 31 67 12 indicando el número localizador para más información`;
    } else {
      return "Ya hemos recibido tu pedido y se está preparando!";
    }
  }
  useEffect(() => {
    if (!change) {
      setChanged(true);
      const formattedSeguimientos = order.seguimientos.map((item) => {
        if (!item.formatted) {
          return {
            ...item,
            D_FEC_HORA_ALTA: formatDate(item.D_FEC_HORA_ALTA),
            formatted: true,
          };
        }
        return item;
      });
      const text = defineBoxText(
        order.seguimientos[order.seguimientos.length - 1].V_COD_TIPO_EST,
        order.seguimientos[order.seguimientos.length - 1].D_FEC_HORA_ALTA
      );
      setBoxText(text);
      const reorganized = formattedSeguimientos.reduce((acc, item) => {
        if (!acc[item.V_COD_TIPO_EST]) {
          acc[item.V_COD_TIPO_EST] = {
            ...item,
            D_FEC_HORA_ALTA: [item.D_FEC_HORA_ALTA],
            formatted: true,
          };
        } else {
          acc[item.V_COD_TIPO_EST].D_FEC_HORA_ALTA.push(item.D_FEC_HORA_ALTA);
        }
        return acc;
      }, {} as { [key: string]: NewSeguimiento });

      setReorganizedSeguimientos(Object.values(reorganized));
    }
  }, [order.seguimientos, change]);
  return (
    <div
      className={cn(
        "hidden",
        order.seguimientos.length &&
          "lg:w-[50%] w-[85%] flex flex-col bg-white items-center rounded-3xl"
      )}
    >
      <div className="flex flex-col items-center w-full h-full mt-2 mb-0 px-5">
        <Link href="https://shamelesscollective.com">
          <Image
            src={Logo}
            alt="Logo"
            width={150}
            height={150}
            className="mt-5"
          />
        </Link>
        <h3 className="w-full mt-2 text-sm tracking-wider text-center">
          Localiza tu envío
        </h3>
        <span className="border w-full border-slate-100 mt-1" />
        <div className="h-full w-full flex flex-col justify-center items-center mt-2 py-4 px-4 rounded-sm bg-blue-100">
          <h4 className="w-full lg:text-sm text-xs text-center">
            <span className="font-semibold">Número localizador</span>:{" "}
            {order.tracking}
          </h4>
          <h5 className="lg:text-sm text-xs text-center">{boxText}</h5>
        </div>
      </div>
      <div className="flex flex-col w-full justify-between lg:px-10 lg:py-6 px-5 py-5 lg:gap-10 gap-2">
        {reorganizedSeguimientos.map((option) => (
          <div
            key={option.textid}
            className="w-full h-full flex flex-row lg:items-center items-stretch lg:justify-center justify-stretch"
          >
            <div className="relative flex flex-col items-start justify-center w-full h-full min-h-30">
              <div className="w-full h-full flex flex-row items-center">
                <h2 className="lg:text-xs text-xxs lg:w-16 w-15 lg:mr-2">
                  {option.D_FEC_HORA_ALTA.slice(-1)}
                </h2>
                <Image
                  src={option.idx < index ? TickIcon : option.iconSrc}
                  alt={option.iconAlt}
                  className={cn(
                    "border-2 border-stone-300 rounded-full bg-white lg:w-[40px] w-[34px] p-2 z-10",
                    Number(option.idx) < index + 1 &&
                      "bg-green-100 border-green-300",
                    option.idx > 3 && "bg-red-100 border-red-300"
                  )}
                />
                <div className="w-full h-full flex flex-col items-start justify-center ml-3">
                  <h3
                    className={cn(
                      "lg:text-sm text-xxs",
                      order.seguimientos.slice(-1)[0].V_COD_TIPO_EST ===
                        option.idx.toString() && "font-bold"
                    )}
                  >
                    {option.text}
                  </h3>
                </div>
              </div>
              {option.idx < index && (
                <>
                  <div
                    className={cn(
                      "absolute top-full lg:left-20 left-16 transform -translate-y-1/2 w-0.5 h-full bg-stone-300",
                      Number(option.idx) < index && "bg-green-300",
                      Number(option.idx) > 3 && "bg-red-300"
                    )}
                  />
                  <div
                    className={cn(
                      "absolute top-full lg:left-20 left-16 transform w-0.5 h-full bg-stone-300 z-1",
                      Number(option.idx) < index + 1 && "bg-green-300",
                      Number(option.idx) > 3 && "bg-red-300"
                    )}
                  />
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
