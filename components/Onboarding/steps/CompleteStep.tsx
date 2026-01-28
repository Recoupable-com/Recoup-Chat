"use client";

interface CompleteStepProps {
  onNext: () => void;
  onBack: () => void;
}

export default function CompleteStep({ onNext, onBack }: CompleteStepProps) {
  void onBack; // Not typically used at completion
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <h2 className="text-xl font-semibold mb-4">Complete Step</h2>
      <p className="text-muted-foreground mb-6">Placeholder for Complete Step</p>
      <button
        onClick={onNext}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-xl"
      >
        Go to Dashboard
      </button>
    </div>
  );
}
