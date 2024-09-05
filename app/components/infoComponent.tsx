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
          "lg:w-[50%] w-[85%] flex flex-col mt-5 bg-white-pattern rounded-3xl items-start pb-2"
      )}
    >
      <h3 className="w-full mt-5 ml-10 font-semibold lg:text-base text-sm">
        Información de envío
      </h3>
      <span className="border w-full border-slate-100 mt-1 mb-2" />
      {order.shipping && (
        <>
          <h5 className="lg:text-sm text-xs pl-10">
            {order.shipping.name || "No information provided"}
          </h5>
          <h5 className="lg:text-sm text-xs pl-10">
            {order.shipping.address1 || "No information provided"}
          </h5>
          {order.shipping.address2 && (
            <h5 className="lg:text-sm text-xs pl-10">
              {order.shipping.address2 || "No information provided"}
            </h5>
          )}
          <h5 className="lg:text-sm text-xs pl-10">
            {order.shipping.zip || "No information provided"}
          </h5>
          <h5 className="lg:text-sm text-xs pl-10">
            {order.shipping.city || "No information provided"}
          </h5>
          <h5 className="lg:text-sm text-xs pl-10">
            {order.shipping.province || "No information provided"}
          </h5>
          <h5 className="lg:text-sm text-xs pl-10">
            {order.shipping.phone || "No information provided"}
          </h5>
          <p className="text-xs text-black px-10 pt-5 items-center text-wrap w-full">
            Para cualquier modificación del envío, contactar con el <br />
            <span className="font-bold">+34 916 31 67 12</span> indicando el
            número localizador
          </p>
        </>
      )}
    </div>
  );
};
