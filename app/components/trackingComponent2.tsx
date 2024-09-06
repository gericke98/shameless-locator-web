"use client";
import { cn } from "@/lib/utils";
import Logo from "@/public/LOGO_black.png";
import Image from "next/image";
import TickIcon from "@/public/tick2.svg";
import { Order, NewSeguimiento, ShippingInfo } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import { optionsui } from "@/placeholder/placeholder";

type Props = {
  order: Order;
  index: number;
};

export const TrackingComponent2 = ({ order, index }: Props) => {
  console.log(order.shipping);
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

  function addLaborDay(dateStr: string, numberDays: number): string {
    // Parse the date string
    const dateParts = dateStr.split(/[/ :]/);
    const month = parseInt(dateParts[0], 10) - 1;
    const day = parseInt(dateParts[1], 10);
    const year = parseInt(dateParts[2], 10);
    const hours = parseInt(dateParts[3], 10);
    const minutes = parseInt(dateParts[4], 10);
    const seconds = parseInt(dateParts[5], 10);

    let date = new Date(year, month, day, hours, minutes, seconds);

    // Add one day
    date.setDate(date.getDate() + numberDays);

    // Check if the next day falls on a weekend and adjust
    if (date.getDay() === 6) {
      // Saturday
      date.setDate(date.getDate() + 2);
    } else if (date.getDay() === 0) {
      // Sunday
      date.setDate(date.getDate() + 1);
    }

    // Format the new date back to the same string format
    const newDateStr = [
      ("0" + (date.getMonth() + 1)).slice(-2), // Ensure month is 2 digits
      ("0" + date.getDate()).slice(-2), // Ensure day is 2 digits
      date.getFullYear(),
      ("0" + date.getHours()).slice(-2), // Ensure hours are 2 digits
      ("0" + date.getMinutes()).slice(-2), // Ensure minutes are 2 digits
      ("0" + date.getSeconds()).slice(-2), // Ensure seconds are 2 digits
    ].join("/");

    return `${("0" + date.getDate()).slice(-2)}/${(
      "0" +
      (date.getMonth() + 1)
    ).slice(-2)}`;
  }

  function defineBoxText(id: string, dateStr: string, shipping: ShippingInfo) {
    if (shipping?.country === "Spain") {
      const newDate = addLaborDay(dateStr, 1);
      // Caso de envío nacional
      const messages: { [key: string]: string } = {
        "0": `Tu pedido está en preparación y llegará el ${addLaborDay(
          dateStr,
          1
        )} entre las 10:00 y las 19:00.`,
        "1": `Tu pedido está en camino y llegará el ${addLaborDay(
          dateStr,
          1
        )} entre las 10:00 y las 19:00.`,
        "2": "Tu pedido está en reparto y llegará hoy entre las 10:00 y las 19:00.",
        "3": `Tu pedido ya ha sido entregado el ${addLaborDay(dateStr, 0)}.`,
        default:
          "Tu pedido está en incidencia. Contacta con el teléfono 916 31 67 12 indicando el número localizador para más información.",
      };
      return messages[id] ?? messages["default"];
      // En el caso de no estar entregado, se entregará el día siguiente
    } else if (shipping?.country !== "Spain") {
      // Caso de envío internacional
      const messages: { [key: string]: string } = {
        "0": `Tu pedido está en preparación y llegará el ${addLaborDay(
          dateStr,
          4
        )} entre las 10:00 y las 19:00.`,
        "1": `Tu pedido está en camino y llegará el ${addLaborDay(
          dateStr,
          4
        )} entre las 10:00 y las 19:00.`,
        "2": "Tu pedido está en reparto y llegará hoy entre las 10:00 y las 19:00.",
        "3": `Tu pedido ya ha sido entregado el ${addLaborDay(dateStr, 0)}.`,
        default:
          "Tu pedido está en incidencia. Contacta con el teléfono 916 31 67 12 indicando el número localizador para más información.",
      };
      return messages[id] ?? messages["default"];
      // En el caso de no estar entregado, se entregará el día siguiente
    } else {
      const messages: { [key: string]: string } = {
        "0": "Tu pedido está en preparación y llegará mañana entre las 10:00 y las 19:00.",
        "1": "Tu pedido está en camino y llegará mañana entre las 10:00 y las 19:00.",
        "2": "Tu pedido está en reparto y llegará hoy entre las 10:00 y las 19:00.",
        "3": `Tu pedido ya ha sido entregado el ${dateStr}.`,
        default:
          "Tu pedido está en incidencia. Contacta con el teléfono 916 31 67 12 indicando el número localizador para más información.",
      };
      return messages[id] ?? messages["default"];
    }
  }
  useEffect(() => {
    const formattedSeguimientos = order.seguimientos.map((item) => ({
      ...item,
      D_FEC_HORA_ALTA: formatDate(item.D_FEC_HORA_ALTA),
    }));
    const lastSeguimiento = order.seguimientos[order.seguimientos.length - 1];
    setBoxText(
      defineBoxText(
        lastSeguimiento.V_COD_TIPO_EST,
        lastSeguimiento.D_FEC_HORA_ALTA,
        order.shipping
      )
    );

    const reorganized = formattedSeguimientos.reduce((acc, item) => {
      // Confirmo que exista el valor
      acc[item.V_COD_TIPO_EST] = acc[item.V_COD_TIPO_EST] || {
        ...item,
        D_FEC_HORA_ALTA: [], // Initialize as an empty array
      };
      const formattedDate = Array.isArray(item.D_FEC_HORA_ALTA)
        ? item.D_FEC_HORA_ALTA[0] // In case it's already an array, take the first element
        : item.D_FEC_HORA_ALTA;
      if (formattedDate) {
        acc[item.V_COD_TIPO_EST].D_FEC_HORA_ALTA.push(formattedDate);
      }

      return acc;
    }, {} as { [key: string]: NewSeguimiento });
    const reorganizedValues = Object.values(reorganized);
    if (reorganizedValues.length > 3) {
      setReorganizedSeguimientos(reorganizedValues);
    } else {
      const mergedArray = optionsui.map((option) => {
        // Check if the idx exists in array1, otherwise default
        const foundItem = reorganizedValues.find(
          (obj) => obj.idx === option.idx
        );
        if (foundItem) {
          // Merge the found item (preserving any keys from array1)
          return foundItem;
        } else {
          // Add missing properties for items not found in array1
          return {
            V_COD_TIPO_EST: option.idx.toString(), // Assign empty if not found
            D_FEC_HORA_ALTA: [""], // Empty array
            formatted: true, // Assuming default false for formatted
            ...option, // Spread the properties from array2
          };
        }
      });
      setReorganizedSeguimientos(mergedArray);
    }
  }, [order.seguimientos]);
  return (
    <div
      className={cn(
        "hidden",
        order.seguimientos.length &&
          "lg:w-[50%] w-[85%] flex flex-col bg-white-pattern py-6 items-center rounded-3xl"
      )}
    >
      <div className="flex flex-col items-center w-full h-full px-10">
        <Link href="https://shamelesscollective.com">
          <Image
            src={Logo}
            alt="Logo"
            width={150}
            height={150}
            className="mt-5"
          />
        </Link>
        <h3 className="w-full mt-2 text-sm text-center uppercase tracking-wide font-bold">
          Localiza tu envío
        </h3>
        <span className="border w-full border-slate-200 mt-1" />
        <div className="h-full w-full flex flex-col justify-center items-center mt-2 py-4 px-4 rounded-lg bg-white shadow-md">
          <h4 className="w-full lg:text-sm text-xs text-center">
            <span className="font-semibold">Número localizador</span>:{" "}
            {order.tracking}
          </h4>
          <h5 className="lg:text-sm text-xs mt-2 font-bold text-blue-700 text-center">
            {boxText}
          </h5>
        </div>
      </div>
      <div className="flex flex-col w-full justify-between items-center lg:px-14 lg:py-6 px-10 py-5 lg:gap-10 gap-4">
        {reorganizedSeguimientos.map((option) => (
          <div
            key={option.textid}
            className="w-full h-full flex flex-row items-center justify-center"
          >
            <div className="relative flex flex-col items-start justify-center w-full h-full min-h-30 lg:px-1">
              <div className="w-full h-full flex flex-row items-center">
                <h2 className="lg:text-xs text-xxs lg:min-w-16 min-w-12 lg:mr-2">
                  {option.D_FEC_HORA_ALTA.slice(-1)}
                </h2>
                <Image
                  src={option.idx < index ? TickIcon : option.iconSrc}
                  alt={option.iconAlt}
                  className={cn(
                    " border-white rounded-full bg-white lg:w-[48px] w-[35px] z-10 p-2 shadow-md",
                    Number(option.idx) < index + 1 &&
                      "bg-green-300 border-green-300",
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
              {option.idx < 3 && (
                <>
                  <div
                    className={cn(
                      "absolute top-full lg:left-24 left-16 transform -translate-y-1/2 w-0.5 h-full bg-slate-100",
                      Number(option.idx) < index && "bg-green-300",
                      Number(option.idx) > 3 && "bg-red-300"
                    )}
                  />
                  <div
                    className={cn(
                      "absolute top-full lg:left-24 left-16 transform w-0.5 h-full bg-slate-100 z-1",
                      Number(option.idx) < index && "bg-green-300",
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
