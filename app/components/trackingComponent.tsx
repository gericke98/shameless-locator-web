import { cn } from "@/lib/utils";
import Logo from "@/public/LOGO_black.png";
import Image from "next/image";
import TickIcon from "@/public/tick.svg";
import { Order } from "@/types";
import Link from "next/link";
import { options } from "@/placeholder/placeholder";

type Props = {
  order: Order;
  index: number;
};

export const TrackingComponent = ({ order, index }: Props) => {
  return (
    <div
      className={cn(
        "hidden",
        order.message !== "" &&
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
        Número localizador: {order.tracking}
      </h4>
      <div className="flex flex-row w-full justify-between lg:px-20 lg:py-14 px-5 py-5 lg:gap-10 gap-2">
        {options.map((option) => (
          <div
            key={option.iconAlt}
            className="w-full h-full flex flex-col items-center justify-center "
          >
            <div className="relative flex items-center  justify-center w-full h-full min-h-12 min-w-10 rounded-full ">
              <Image
                src={option.idx < index ? TickIcon : option.iconSrc}
                alt={option.iconAlt}
                className={cn(
                  "border-2 border-stone-300 rounded-full lg:p-3 bg-white lg:w-[50px] lg:h-auto w-[35px] p-2 z-10",
                  order.message === option.textid &&
                    "bg-green-100 border-green-300",
                  option.idx < index && "bg-green-100 border-green-300",
                  option.textid === "INCIDENCIA" &&
                    order.message === "INCIDENCIA" &&
                    "bg-red-100 border-red-300"
                )}
              />
              {option.idx < options.length && (
                <>
                  <div
                    className={cn(
                      "absolute top-1/2 transform -translate-y-1/2 translate-x-1/4 left-full w-full h-0.5 bg-stone-300",
                      option.idx < index && "bg-green-300",
                      option.idx === options.length - 1 && "-translate-x-1/4"
                    )}
                  />
                  <div
                    className={cn(
                      "absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 left-full w-full h-0.5 bg-stone-300 z-1",
                      option.idx < index && "bg-green-300"
                    )}
                  />
                </>
              )}
            </div>
            <h3
              className={cn(
                "lg:text-xs text-xxs mt-2",
                order.message === option.text && "font-bold"
              )}
            >
              {option.text}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};
