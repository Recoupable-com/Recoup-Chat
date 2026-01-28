"use client";

interface RunningStepProps {
  onNext: () => void;
  onBack: () => void;
}

export default function RunningStep({ onNext, onBack }: RunningStepProps) {
  void onBack; // Not typically used during running
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <h2 className="text-xl font-semibold mb-4">Running Step</h2>
      <p className="text-muted-foreground mb-6">Placeholder for Running Step</p>
      <button
        onClick={onNext}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-xl"
      >
        Skip (for testing)
      </button>
    </div>
  );
}
