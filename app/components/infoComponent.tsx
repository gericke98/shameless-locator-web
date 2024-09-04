import { cn } from "@/lib/utils";
import { Order } from "@/types";

type Props = {
  order: Order;
};
export const InfoComponent = ({ order }: Props) => {
  return (
    <div
      className={cn(
        "hidden",
        order.message !== "" &&
          "lg:w-[50%] w-[85%] flex flex-col mt-5 bg-white rounded-3xl items-start pb-2"
      )}
    >
      <h3 className="w-full mt-5 ml-10 font-semibold lg:text-base text-sm">
        Información de envío
      </h3>
      <span className="border w-full border-slate-100 mt-1 mb-2" />
      {order.shipping && (
        <>
          <h5 className="lg:text-sm text-xs pl-10">{order.shipping?.name}</h5>
          <h5 className="lg:text-sm text-xs pl-10">
            {order.shipping?.address1}
          </h5>
          {order.shipping?.address2 && (
            <h5 className="lg:text-sm text-xs pl-10">
              {order.shipping?.address2}
            </h5>
          )}
          <h5 className="lg:text-sm text-xs pl-10">{order.shipping?.zip}</h5>
          <h5 className="lg:text-sm text-xs pl-10">{order.shipping?.city}</h5>
          <h5 className="lg:text-sm text-xs pl-10">
            {order.shipping?.province}
          </h5>
          <h5 className="lg:text-sm text-xs pl-10">{order.shipping?.phone}</h5>
          <p className="text-xs text-black px-10 pt-5 items-center text-wrap w-full">
            Para cualquier modificación del envío, contactar con
            hello@shamelesscollective.com indicando el número de pedido
          </p>
        </>
      )}
    </div>
  );
};
