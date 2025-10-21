import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

export function SmsHeroSection() {
  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <MessageSquare className="h-8 w-8 text-blue-600" />
        </div>
        <CardTitle className="text-xl">Chat with Recoup via SMS</CardTitle>
        <CardDescription>
          Get instant AI-powered responses to your questions through text
          messaging
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
