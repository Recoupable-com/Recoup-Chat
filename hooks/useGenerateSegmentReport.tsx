import { useUserProvider } from "@/providers/UserProvder";
import { useFunnelReportProvider } from "@/providers/FunnelReportProvider";
import { useRouter } from "next/navigation";

const useGenerateSegmentReport = () => {
  const { isPrepared } = useUserProvider();
  const { setIsLoadingReport } = useFunnelReportProvider();
  const { push } = useRouter();

  const handleGenerateReport = async (segmentId: string) => {
    if (!isPrepared()) return;

    setIsLoadingReport(true);
    push(`/segment/${segmentId}`);
    return;
  };

  return {
    handleGenerateReport,
  };
};

export default useGenerateSegmentReport;
