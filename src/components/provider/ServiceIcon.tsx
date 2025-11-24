"use client";

import { 
  MdOutlineCleaningServices, 
  MdOutlinePets, 
  MdChildCare
} from "react-icons/md";
import { LuCookingPot } from "react-icons/lu";

type ServiceIconProps = {
  serviceName: string;
  size?: number;
  className?: string;
};

export function ServiceIcon({ serviceName, size = 32, className = "" }: ServiceIconProps) {
  const iconClass = `text-[#BFA181] ${className}`;
  
  switch (serviceName.toLowerCase()) {
    case "cleaning":
      return <MdOutlineCleaningServices className={iconClass} style={{ width: size, height: size }} />;
    case "pet sitting":
    case "petcare":
      return <MdOutlinePets className={iconClass} style={{ width: size, height: size }} />;
    case "child care":
    case "babysitting":
      return <MdChildCare className={iconClass} style={{ width: size, height: size }} />;
    case "cooking":
      return <LuCookingPot className={iconClass} style={{ width: size, height: size }} />;
    default:
      return (
        <div 
          className={`rounded-full bg-[#F5E8D3] flex items-center justify-center text-[#BFA181] font-bold ${className}`}
          style={{ width: size, height: size }}
        >
          {serviceName?.[0]?.toUpperCase() || "?"}
        </div>
      );
  }
}

