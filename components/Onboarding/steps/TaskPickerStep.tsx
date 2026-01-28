"use client";

interface TaskPickerStepProps {
  onNext: () => void;
  onBack: () => void;
}

export default function TaskPickerStep({ onNext, onBack }: TaskPickerStepProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <h2 className="text-xl font-semibold mb-4">Task Picker Step</h2>
      <p className="text-muted-foreground mb-6">Placeholder for Task Picker Step</p>
      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="px-4 py-2 border border-input rounded-xl"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-xl"
        >
          Run it now
        </button>
      </div>
    </div>
  );
}
