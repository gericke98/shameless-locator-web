"use client";
import BoxIcon from "@/public/package_2_24dp_FILL0_wght400_GRAD0_opsz24.svg";
import MailIcon from "@/public/mail_24dp_FILL0_wght400_GRAD0_opsz24.svg";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { FormInputType } from "@/types";
export const FormInput = ({ name, title, icon }: FormInputType) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setValue(value);
  };
  const [value, setValue] = useState<string>("");
  return (
    <div className="w-full h-8">
      <h6 className="bg-slate-200 rounded-t-lg text-xxs pl-4 pt-2 text-slate-600 focus:text-slate-800">
        {title}
      </h6>
      <div
        className={cn(
          "w-full h-full pl-4 flex items-center bg-slate-200 border-b-2 border-[#868687] focus:border-[#383839]",
          icon ? "flex-row" : "flex-col"
        )}
      >
        {icon && (
          <Image
            src={name === "order" ? BoxIcon : MailIcon}
            alt={name === "order" ? "Order Icon" : "Mail Icon"}
            width={15}
            height={15}
          />
        )}
        {name === "order" && (
          <p className="text-xs font-light pl-4 inline-block text-gray-800">
            #
          </p>
        )}
        <input
          type="text"
          name={name}
          className={cn(
            "h-full w-full bg-slate-200 text-base lg:text-sm text-black font-light focus:outline-none",
            icon && name === "order" && "pl-1",
            icon && name !== "order" && "pl-4"
          )}
          value={value}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};
