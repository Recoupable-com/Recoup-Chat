import { useTikTokAnalysisProvider } from "@/providers/TIkTokAnalysisProvider";
import Icon from "@/components/Icon";
import LucideIcon from "@/components/LucideIcon";
import decreaseCredits from "@/lib/supabase/decreaseCredits";
import { useUserProvider } from "@/providers/UserProvder";
import { v4 as uuidV4 } from "uuid";
import { useChatProvider } from "@/providers/ChatProvider";
import useCredits from "@/hooks/useCredits";
import { usePaymentProvider } from "@/providers/PaymentProvider";

const Segments = () => {
  const { append } = useChatProvider();
  const { segments, result } = useTikTokAnalysisProvider();
  const { userData, isPrepared } = useUserProvider();
  useCredits();
  const {
    toggleModal,
    setSuccessCallbackParams,
    hasCredits,
    subscriptionActive,
    isCreditChecking,
  } = usePaymentProvider();

  const handleGenerateReport = (segmentName: string) => {
    append(
      {
        id: uuidV4(),
        role: "user",
        content: `Please create a tiktok fan segment report for ${result.id} using this segment ${segmentName}.`,
      },
      true,
    );
  };

  const payNow = async (segmentName: string) => {
    if (!isPrepared()) return;
    if (isCreditChecking) return;
    if (!hasCredits && !subscriptionActive) {
      setSuccessCallbackParams(new URLSearchParams({ segmentName }).toString());
      toggleModal();
      return;
    }
    if (!subscriptionActive) await decreaseCredits(userData?.id);
    handleGenerateReport(segmentName);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 pt-4 gap-3">
      {segments.map((segment) => (
        <button
          className="w-full border-grey-light border-[1px] rounded-md px-3 py-2 flex gap-2 items-center shadow-grey"
          type="button"
          key={segment?.name}
          onClick={() => payNow(segment?.name)}
        >
          {segment?.icon ? (
            <LucideIcon name={segment.icon} />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <Icon name="logo-xs" />
          )}

          <p className="font-bold text-xs text-center">
            {segment?.name} {`(${segment?.count})`}
          </p>
        </button>
      ))}
    </div>
  );
};

export default Segments;
