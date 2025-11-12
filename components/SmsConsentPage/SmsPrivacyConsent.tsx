import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import Link from "next/link";

export function SmsPrivacyConsent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Privacy & Consent
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          By sending an SMS to our number, you consent to receive automated
          responses from Recoup. Standard messaging rates may apply.
        </p>
        <p className="text-sm text-muted-foreground">
          We respect your privacy and only use your phone number to provide SMS
          responses. You can opt out at any time by replying &quot;STOP&quot;.
        </p>
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>To opt out:</strong> Reply &quot;STOP&quot; to any message
            to unsubscribe from SMS communications.
          </p>
        </div>
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground mb-2">
            For more information, please review our:
          </p>
          <div className="flex gap-4">
            <Link
              href="/terms"
              className="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy"
              className="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
