"use client";
import { useEffect, useState } from "react";
import { InputComponent } from "./components/inputComponent";
import { InfoComponent } from "./components/infoComponent";
import { options } from "@/placeholder/placeholder";
import { Order } from "@/types";
import { TrackingComponent2 } from "./components/trackingComponent2";

export default function Home() {
  const [order, setOrder] = useState<Order>({
    seguimientos: [],
    message: "",
    tracking: null,
    shipping: null,
  });
  const [index, setIndex] = useState<number>(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
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
    // Pending añadir idiomas
    <main className="flex min-h-screen flex-col items-center justify-center bg-black-pattern py-14">
      <InputComponent order={order} setOrder={setOrder} />
      {isMounted && order.seguimientos.length > 0 && (
        <>
          <TrackingComponent2 order={order} index={index} />
          <InfoComponent order={order} />
        </>
      )}
    </main>
  );
}
