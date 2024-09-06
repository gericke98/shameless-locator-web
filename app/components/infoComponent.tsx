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
          "lg:w-[50%] w-[85%] flex flex-col mt-5 bg-white-pattern rounded-3xl items-start pt-4 pb-10"
      )}
    >
      <h3 className="w-full mt-5 ml-10 font-semibold lg:text-base text-sm uppercase">
        Información de envío
      </h3>
      <span className="border w-full border-slate-100 mt-1 mb-2" />

      {order.shipping && (
        <div className="w-full h-full flex flex-col pl-10">
          <h5 className="lg:text-base text-xs pl-14 mt-3">
            {order.shipping.name || "No information provided"}
          </h5>
          <h5 className="lg:text-base text-xs pl-14">
            {order.shipping.address1 || "No information provided"}
          </h5>
          {order.shipping.address2 && (
            <h5 className="lg:text-base text-xs pl-14">
              {order.shipping.address2 || "No information provided"}
            </h5>
          )}
          <h5 className="lg:text-base text-xs pl-14">
            {order.shipping.zip || "No information provided"}
          </h5>
          <h5 className="lg:text-base text-xs pl-14">
            {order.shipping.city || "No information provided"}
          </h5>
          <h5 className="lg:text-base text-xs pl-14">
            {order.shipping.province || "No information provided"}
          </h5>
          <h5 className="lg:text-base text-xs pl-14">
            {order.shipping.phone || "No information provided"}
          </h5>
          <p className="lg:text-sm text-xs text-black -pl-10 pt-5 items-center text-wrap w-full">
            Para cualquier modificación del envío, contactar con el
            <span className="font-bold"> +34 916 31 67 12</span> indicando el
            número localizador
          </p>
        </div>
      )}
    </div>
  );
};
