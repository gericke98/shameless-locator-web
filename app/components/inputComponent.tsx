"use client";
import Image from "next/image";
import Logo from "@/public/LOGO_black.png";
import Link from "next/link";
import { FormInput } from "../../components/formInput";
import { getOrder } from "@/actions/order";
import { useFormState } from "react-dom";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { Order } from "@/types";
import { Button } from "./button";

type Props = {
  order: Order;
  setOrder: React.Dispatch<React.SetStateAction<Order>>;
};
export const InputComponent = ({ order, setOrder }: Props) => {
  const { toast } = useToast();
  const initialState = order;
  const [state, formAction] = useFormState(getOrder, initialState);

  useEffect(() => {
    if (state?.message === "Please enter a valid email address") {
      toast({
        variant: "destructive",
        title: "Introduce un correo electrónico válido",
        description:
          "Introduce el correo electrónico con el que realizaste el pedido",
      });
    } else if (state?.message === "Please enter a valid order number") {
      toast({
        variant: "destructive",
        title: "Introduce un número de pedido válido",
        description:
          "El número de pedido no lleva # y está compuesto por 5 números",
      });
    } else if (state?.message === "Your order is being prepared") {
      toast({
        variant: "destructive",
        title: "Tu pedido se está preparando para enviarse",
        description:
          "Tu pedido se está preparando para enviarse y recibirás un correo electrónico con el número de seguimiento en las próximas horas",
      });
    } else if (state?.message !== "" && state) {
      setOrder(state as Order);
    }
  }, [toast, state, setOrder]);
  return (
    <div
      className={cn(
        "bg-white flex flex-col lg:w-[30%] w-[85%] rounded-3xl items-center py-5 lg:px-6 px-4",
        order.message !== "" && "hidden"
      )}
    >
      <div className="flex flex-col items-center mt-5">
        <Image src={Logo} alt="Logo" width={150} height={150} />
        <span className="border-y w-full border-slate-200 mt-2" />
        <h5 className="text-xs mt-2 mb-10 text-slate-500 tracking-wide">
          LOCALIZA TU PEDIDO
        </h5>
        <h5 className="text-sm text-slate-600">
          Introduce los datos de tu pedido original para iniciar el proceso.
        </h5>
        <form className="mt-5 w-full flex flex-col gap-8" action={formAction}>
          <FormInput name="order" title="Número de pedido" icon={true} />
          <FormInput name="email" title="Email" icon={true} />
          <h6 className="text-xxs text-black mt-5">
            Al continuar, confirmas que aceptas los{" "}
            <span>
              <Link
                href="https://shamelesscollective.com/pages/return-and-exchanges"
                className="text-blue-400 border-b border-blue-400 font-bold"
              >
                Términos y Condiciones
              </Link>
            </span>
            ,{" "}
            <span>
              <Link
                href="https://shamelesscollective.com/pages/return-and-exchanges"
                className="text-blue-400 border-b border-blue-400 font-bold"
              >
                Política de privacidad y
              </Link>
            </span>{" "}
            <span>
              <Link
                href="https://shamelesscollective.com/pages/return-and-exchanges"
                className="text-blue-400 border-b border-blue-400 font-bold"
              >
                la Política de cookies
              </Link>
            </span>
          </h6>
          <Button />
        </form>
      </div>
    </div>
  );
};
