import { Mail, Phone } from "lucide-react";
import { Provider } from "@/types/types";
import { COLORS } from "@/lib/color";

interface ContactInfoProps {
  provider: Provider;
}

export default function ContactInfo({ provider }: ContactInfoProps) {
  return (
    <section
      className={`flex flex-col gap-3 text-sm ${COLORS.subText} ${COLORS.accentBg} rounded-xl px-4 py-3 backdrop-blur-sm`}
      aria-label="Contact information"
    >
      <div className="flex items-center gap-3">
        <Mail className="h-5 w-5 text-[#8B4513] flex-shrink-0" aria-hidden="true" />
        <span className="sr-only">Email: </span>
        <a
          href={`mailto:${provider.email}`}
          className="hover:underline focus:outline-none focus:ring-2 focus:ring-[#FF6B6B] truncate transition-colors"
          tabIndex={0}
        >
          {provider.email}
        </a>
      </div>
      {provider.phone && (
        <div className="flex items-center gap-3">
          <Phone className="h-5 w-5 text-[#8B4513] flex-shrink-0" aria-hidden="true" />
          <span className="sr-only">Phone: </span>
          <a
            href={`tel:${provider.phone}`}
            className="hover:underline focus:outline-none focus:ring-2 focus:ring-[#FF6B6B] truncate transition-colors"
            tabIndex={0}
          >
            {provider.phone}
          </a>
        </div>
      )}
    </section>
  );
}