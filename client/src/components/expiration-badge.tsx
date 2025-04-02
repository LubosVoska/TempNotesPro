import { Clock, AlarmClock } from "lucide-react";
import { formatExpiration } from "@/lib/store";

interface ExpirationBadgeProps {
  expiresAt: number;
}

export function ExpirationBadge({ expiresAt }: ExpirationBadgeProps) {
  const { text, isExpiringSoon } = formatExpiration(expiresAt);

  return (
    <div
      className={`text-xs flex items-center space-x-1 mt-auto pt-2 border-t ${
        isExpiringSoon
          ? "text-orange-500 border-gray-100 dark:border-gray-800"
          : "text-gray-500 dark:text-gray-400 border-gray-100 dark:border-gray-800"
      }`}
    >
      {isExpiringSoon ? (
        <>
          <AlarmClock className="h-3 w-3" />
          <span>
            Expires soon: <span className="font-medium">{text} left</span>
          </span>
        </>
      ) : (
        <>
          <Clock className="h-3 w-3" />
          <span>
            Expires in: <span className="font-medium text-secondary-500">{text}</span>
          </span>
        </>
      )}
    </div>
  );
}
