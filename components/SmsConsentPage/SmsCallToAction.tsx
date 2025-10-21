import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

export function SmsCallToAction() {
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardContent className="pt-6">
        <div className="text-center space-y-4">
          <h3 className="font-semibold text-lg">Ready to Get Started?</h3>
          <p className="text-sm text-gray-600">
            Send your first message to our SMS number and experience
            AI-powered conversations on your phone.
          </p>
          <div className="space-y-2">
            <Button className="w-full" size="lg">
              <MessageSquare className="h-4 w-4 mr-2" />
              Start SMS Chat
            </Button>
            <p className="text-xs text-gray-500">
              SMS number will be provided after setup
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
