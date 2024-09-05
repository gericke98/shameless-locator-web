"use client";
import BeatLoader from "react-spinners/BeatLoader";
import { useFormStatus } from "react-dom";

export const Button = () => {
  const { pending } = useFormStatus();
  return (
    <button
      className="bg-slate-300 py-4 rounded-full hover:bg-blue-400 focus:bg-blue-400 flex items-center justify-center"
      type="submit"
      disabled={pending}
      aria-busy={pending}
    >
      {pending ? <BeatLoader /> : "Buscar pedido"}
    </button>
  );
};
