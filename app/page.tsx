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
    message: "",
    tracking: null,
    shipping: null,
  });
  const [index, setIndex] = useState<number>(1);
  useEffect(() => {
    setIsClient(true);
    const newindex = options.find(
      (option) => option.textid === order.message
    )?.idx;
    if (newindex) {
      setIndex(newindex);
    }
  }, [order]);
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black">
      <InputComponent order={order} setOrder={setOrder} />
      <TrackingComponent order={order} index={index} />
      <InfoComponent order={order} />
    </main>
  );
}
