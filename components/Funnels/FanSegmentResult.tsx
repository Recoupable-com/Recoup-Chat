import ThoughtSteps from "./ThoughtSteps";
import AnalysisPlan from "./AnalysisPlan";
import Icon from "@/components/Icon";
import ScrapingCaption from "./ScrapingCaption";
import { useFunnelAnalysisProvider } from "@/providers/FunnelAnalysisProvider";
import isScraping from "@/lib/agent/isScraping";
import InputHandles from "./InputHandle";

const FanSegmentResult = () => {
  const { isCheckingHandles, handles, agentsStatus, isInitializing, hasError } =
    useFunnelAnalysisProvider();

  return (
    <>
      <div
        className={`flex gap-3 ${isScraping(agentsStatus) || isCheckingHandles || hasError ? "items-center" : "items-start"}`}
      >
        <div className="border border-gray rounded-full p-2">
          <Icon name="logo-xs" />
        </div>
        <ScrapingCaption />
      </div>
      <div className="pl-11 pt-2">
        {isCheckingHandles ? (
          <>{Object.keys(handles).length > 0 && <InputHandles />}</>
        ) : (
          <>{isInitializing ? <AnalysisPlan /> : <ThoughtSteps />}</>
        )}
      </div>
    </>
  );
};

export default FanSegmentResult;
