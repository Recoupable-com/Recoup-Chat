import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone } from "lucide-react";

export function SmsHowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Send a Message",
      description: "Text any question to our SMS number",
    },
    {
      number: "2",
      title: "AI Processing",
      description: "Our AI analyzes your message and generates a response",
    },
    {
      number: "3",
      title: "Get Your Answer",
      description: "Receive a helpful response via SMS",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5" />
          How it Works
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {steps.map((step) => (
          <div key={step.number} className="flex gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-semibold text-blue-600">
                {step.number}
              </span>
            </div>
            <div>
              <h3 className="font-medium">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
