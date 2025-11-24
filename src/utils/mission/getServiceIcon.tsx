import React from "react";
import { MdOutlineCleaningServices, MdOutlinePets, MdChildCare } from "react-icons/md";
import { LuCookingPot } from "react-icons/lu";

export function getServiceIcon(serviceName: string): React.ReactNode {
  switch (serviceName) {
    case "Cleaning":
      return <MdOutlineCleaningServices className="text-[#BFA181] w-8 h-8" />;
    case "Pet Sitting":
      return <MdOutlinePets className="text-[#BFA181] w-8 h-8" />;
    case "Child Care":
      return <MdChildCare className="text-[#BFA181] w-8 h-8" />;
    case "Cooking":
      return <LuCookingPot className="text-[#BFA181] w-8 h-8" />;
    default:
      return (
        <div className="w-8 h-8 rounded-full bg-[#F5E8D3] flex items-center justify-center text-[#BFA181] font-bold">
          {serviceName?.[0] || "?"}
        </div>
      );
  }
}

