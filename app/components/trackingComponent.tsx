"use client";
import { cn } from "@/lib/utils";
import Logo from "@/public/LOGO_black.png";
import Image from "next/image";
import TickIcon from "@/public/tick.svg";
import { EnvEstado, NewEnvEstado, Order } from "@/types";
import Link from "next/link";
import { options } from "@/placeholder/placeholder";
import { useEffect, useState } from "react";

type Props = {
  order: Order;
  index: number;
};

type NewSeguimiento = Omit<EnvEstado, "D_FEC_HORA_ALTA"> & {
  D_FEC_HORA_ALTA: string[];
};

export const TrackingComponent = ({ order, index }: Props) => {
  const [change, setChanged] = useState(false);
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

    const formattedDay = date.getDate();
    const formattedMonth = date.toLocaleString("default", { month: "long" });
    const formattedHours = date.getHours();
    const formattedMinutes = date.getMinutes().toString().padStart(2, "0");

    return `${formattedDay} ${formattedMonth} ${formattedHours}:${formattedMinutes}`;
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
          "lg:w-[50%] w-[75%] flex flex-col mt-16 mb-0 bg-white items-center rounded-3xl"
      )}
    >
      <Link href="https://shamelesscollective.com">
        <Image
          src={Logo}
          alt="Logo"
          width={150}
          height={150}
          className="mt-5"
        />
      </Link>
      <h3 className="w-full mt-5 ml-10 font-semibold lg:text-base text-sm">
        Localiza tu paquete
      </h3>
      <span className="border w-full border-slate-100 mt-1" />
      <h4 className="w-full mt-1 ml-10 font-normal lg:text-sm text-xs">
        Número localizador:
      </h4>
      <h4 className="w-full mt-1 ml-10 font-normal lg:text-sm text-xs">
        {order.tracking}
      </h4>
      <div className="flex lg:flex-row flex-col w-full justify-between lg:px-20 lg:py-14 px-5 py-5 lg:gap-10 gap-2">
        {reorganizedSeguimientos.map((option) => (
          <div
            key={option.iconAlt}
            className="w-full h-full flex lg:flex-col flex-row lg:items-center items-stretch lg:justify-center justify-stretch"
          >
            <div className="relative flex lg:flex-row flex-col lg:items-center items-start justify-center w-full h-full min-h-12 lg:min-w-10 rounded-full basis-1/6 ">
              <Image
                src={option.idx < index ? TickIcon : option.iconSrc}
                alt={option.iconAlt}
                className={cn(
                  "border-2 border-stone-300 rounded-full lg:p-3 bg-white lg:w-[50px] lg:h-auto w-[35px] p-2 z-10",
                  option.idx < index && "bg-green-100 border-green-300",
                  option.textid === "INCIDENCIA" && "bg-red-100 border-red-300"
                )}
              />
              {option.idx < options.length - 1 && (
                <>
                  <div
                    className={cn(
                      "absolute lg:top-1/2 top-full left-4 transform lg:-translate-y-1/2 lg:-translate-x-1/3 -translate-y-1/2 lg:left-full lg:w-full w-0.5 lg:h-0.5 h-full bg-stone-300",
                      option.idx < index && "bg-green-300",
                      option.idx === options.length - 2 && "-translate-x-1/4"
                    )}
                  />
                  <div
                    className={cn(
                      "absolute lg:top-1/2 top-full left-4 transform lg:-translate-y-1/2 lg:-translate-x-1/3 lg:left-full lg:w-full w-0.5 lg:h-0.5 h-full bg-stone-300 z-1",
                      option.idx < index && "bg-green-300"
                    )}
                  />
                </>
              )}
            </div>
            <div className="flex items-center flex-col flex-1 justify-start">
              <h3
                className={cn(
                  "lg:text-xs text-xxs mt-2",
                  order.seguimientos.slice(-1)[0].V_COD_TIPO_EST ===
                    option.idx.toString() && "font-bold"
                )}
              >
                {option.text}
              </h3>
              <div className="flex flex-col items-center gap-2">
                {option.D_FEC_HORA_ALTA.map((fecha) => (
                  <h4
                    key={fecha}
                    className={cn(
                      "lg:text-xs text-xxs mt-2 lg:text-center text-left",
                      order.seguimientos.slice(-1)[0].V_COD_TIPO_EST ===
                        option.idx.toString() && "font-bold"
                    )}
                  >
                    {fecha}
                  </h4>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
