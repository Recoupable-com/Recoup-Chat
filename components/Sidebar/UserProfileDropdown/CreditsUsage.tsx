import { usePaymentProvider } from "@/providers/PaymentProvider";
import { AnimatedCircularProgressBar } from "@/components/ui/animated-circular-progress-bar";

const CreditsUsage = () => {
  const { totalCredits, credits, isLoading } = usePaymentProvider();

  return (
    <div className="px-2 py-1.5">
      <div className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-2">
        <AnimatedCircularProgressBar
          max={totalCredits}
          min={0}
          value={credits}
          gaugePrimaryColor="hsl(var(--primary))"
          gaugeSecondaryColor="hsl(var(--muted))"
          className="size-3"
          hideText
        />
        Credits
      </div>

      <div className="space-y-1 text-xs">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Total</span>
          <span className="font-medium">{totalCredits.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Remaining</span>
          {isLoading ? (
            <div className="h-4 w-8 bg-muted animate-pulse rounded" />
          ) : (
            <span className="font-medium">{credits.toLocaleString()}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreditsUsage;
