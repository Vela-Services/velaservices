import React from "react";
import { UserProfile } from "@/types/types";
import { 
  IoCartOutline, 
  IoCardOutline,
  IoBusinessOutline,
  IoPeopleOutline,
  IoHelpCircleOutline,
  IoDocumentTextOutline
} from "react-icons/io5";
import Link from "next/link";

interface ProfileQuickLinksProps {
  profile: UserProfile | null;
}

export function ProfileQuickLinks({ profile }: ProfileQuickLinksProps) {
  const isProvider = profile?.role === "provider";
  const isCustomer = profile?.role === "customer";
  const isAdmin = profile?.role === "admin";

  const links = [
    ...(isCustomer || isProvider ? [{
      label: "My Orders",
      href: "/orders",
      icon: IoCartOutline,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
    }] : []),
    ...(isProvider ? [{
      label: "Provider Dashboard",
      href: "/dashboard",
      icon: IoBusinessOutline,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
    }] : []),
    ...(isProvider ? [{
      label: "My Services",
      href: "/providerServices",
      icon: IoDocumentTextOutline,
      color: "from-indigo-500 to-blue-500",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-700",
    }] : []),
    ...(isCustomer ? [{
      label: "Browse Services",
      href: "/customerServices",
      icon: IoCardOutline,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
    }] : []),
    ...(isAdmin ? [{
      label: "Admin Panel",
      href: "/admin",
      icon: IoPeopleOutline,
      color: "from-red-500 to-orange-500",
      bgColor: "bg-red-50",
      textColor: "text-red-700",
    }] : []),
    {
      label: "FAQ",
      href: isProvider ? "/providerFaq" : "/faq",
      icon: IoHelpCircleOutline,
      color: "from-gray-500 to-slate-500",
      bgColor: "bg-gray-50",
      textColor: "text-gray-700",
    },
  ];

  if (links.length === 0) return null;

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 mb-2 px-1">Quick Links</h3>
      <div className="grid grid-cols-2 gap-2">
        {links.map((link, index) => {
          const Icon = link.icon;
          return (
            <Link
              key={index}
              href={link.href}
              className={`${link.bgColor} rounded-lg p-2.5 border border-white/50 shadow-sm hover:shadow-md transition-all duration-200 group`}
            >
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${link.color} flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0`}>
                  <Icon className="text-white" size={16} />
                </div>
                <span className={`${link.textColor} font-medium text-xs flex-1 truncate`}>
                  {link.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

