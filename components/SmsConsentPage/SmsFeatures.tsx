import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

export function SmsFeatures() {
  const features = [
    {
      title: "Instant Responses",
      description: "Get answers within seconds, not hours",
    },
    {
      title: "24/7 Availability",
      description: "Chat anytime, anywhere with your phone",
    },
    {
      title: "Conversation History",
      description: "All your SMS conversations are saved and accessible",
    },
    {
      title: "Smart & Contextual",
      description: "AI understands context and provides relevant answers",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Features
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {features.map((feature) => (
          <div key={feature.title} className="flex items-start gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <h3 className="font-medium">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
