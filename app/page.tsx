"use client";
import { useEffect, useState } from "react";
import { InputComponent } from "./components/inputComponent";
import { TrackingComponent } from "./components/trackingComponent";
import { InfoComponent } from "./components/infoComponent";
import { options } from "@/placeholder/placeholder";
import { Order } from "@/types";

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [order, setOrder] = useState<Order>({
    seguimientos: [],
    message: "",
    tracking: null,
    shipping: null,
  });
  const [index, setIndex] = useState<number>(0);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (order.seguimientos.length > 0) {
      const newindex = options.find(
        (option) =>
          option.idx === Number(order.seguimientos.slice(-1)[0].V_COD_TIPO_EST)
      )?.idx;
      if (newindex) {
        setIndex(newindex);
      }
    }
  }, [order]);
  return (
    <main className="flex lg:min-h-screen flex-col items-center justify-center bg-black">
      <InputComponent order={order} setOrder={setOrder} />
      {order.seguimientos.length > 0 && (
        <TrackingComponent order={order} index={index} />
      )}

      <InfoComponent order={order} />
    </main>
  );
}
