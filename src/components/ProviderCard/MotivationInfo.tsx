import { Provider } from "@/types/types";
import { COLORS } from "@/lib/color";

interface MotivationInfoProps {
  provider: Provider;
}

export default function MotivationInfo({ provider }: MotivationInfoProps) {
  if (!provider.why) return null;

  return (
    <section
      className={`${COLORS.accentBg} rounded-xl px-4 py-3 backdrop-blur-sm`}
      aria-label="Provider motivation"
    >
      <p className={`text-xs italic ${COLORS.headerText} text-center break-words line-clamp-3 tracking-wide`}>
        “{provider.why}”
      </p>
    </section>
  );
}