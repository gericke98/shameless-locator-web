"use client";
import { cn } from "@/lib/utils";
import Logo from "@/public/LOGO_black.png";
import Image from "next/image";
import TickIcon from "@/public/tick.svg";
import { EnvEstado, Order } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type Props = {
  order: Order;
  index: number;
};

type NewSeguimiento = Omit<EnvEstado, "D_FEC_HORA_ALTA"> & {
  D_FEC_HORA_ALTA: string[];
};

export const TrackingComponent2 = ({ order, index }: Props) => {
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
          "lg:w-[50%] w-[85%] flex flex-col bg-white items-center rounded-3xl"
      )}
    >
      <div className="flex flex-col items-center w-full h-full mt-4 mb-0">
        <Link href="https://shamelesscollective.com">
          <Image
            src={Logo}
            alt="Logo"
            width={150}
            height={150}
            className="mt-5"
          />
        </Link>
        <h3 className="w-full mt-5 ml-10 font-semibold lg:text-lg text-sm">
          Localiza tu paquete
        </h3>
        <span className="border w-full border-slate-100 mt-1" />
        <h4 className="w-full mt-1 ml-10 font-semibold lg:text-base text-xs">
          Número localizador:
        </h4>
        <h4 className="w-full mt-1 ml-10 font-normal lg:text-sm text-xs">
          {order.tracking}
        </h4>
      </div>
      <div className="flex flex-col w-full justify-between lg:px-20 lg:py-14 px-5 py-5 lg:gap-10 gap-2">
        {reorganizedSeguimientos.map((option) => (
          <div
            key={option.textid}
            className="w-full h-full flex flex-row lg:items-center items-stretch lg:justify-center justify-stretch"
          >
            <div className="relative flex flex-col items-start justify-center w-full h-full min-h-30">
              <div className="w-full h-full flex flex-row items-center">
                <Image
                  src={option.idx < index ? TickIcon : option.iconSrc}
                  alt={option.iconAlt}
                  className={cn(
                    "border-2 border-stone-300 rounded-full bg-white lg:w-[50px] w-[34px] p-2 z-10",
                    Number(option.idx) < index + 1 &&
                      "bg-green-100 border-green-300",
                    option.idx > 3 && "bg-red-100 border-red-300"
                  )}
                />
                <div className="w-full h-full flex flex-col items-start justify-center ml-3">
                  <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                      <AccordionTrigger>
                        <h3
                          className={cn(
                            "lg:text-sm text-xs",
                            order.seguimientos.slice(-1)[0].V_COD_TIPO_EST ===
                              option.idx.toString() && "font-bold"
                          )}
                        >
                          {option.text}
                        </h3>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="w-full h-full flex flex-col justify-between">
                          {option.D_FEC_HORA_ALTA.map((fecha) => (
                            <h4
                              key={fecha}
                              className={cn(
                                "lg:text-xs text-xxs mt-2 lg:text-center text-left",
                                order.seguimientos.slice(-1)[0]
                                  .V_COD_TIPO_EST === option.idx.toString() &&
                                  "font-bold"
                              )}
                            >
                              {fecha}
                            </h4>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
              {option.idx < index && (
                <>
                  <div
                    className={cn(
                      "absolute top-full lg:left-6 left-4 transform -translate-y-1/2 w-0.5 h-full bg-stone-300",
                      Number(option.idx) < index && "bg-green-300",
                      Number(option.idx) > 3 && "bg-red-300"
                    )}
                  />
                  <div
                    className={cn(
                      "absolute top-full lg:left-6 left-4 transform w-0.5 h-full bg-stone-300 z-1",
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
