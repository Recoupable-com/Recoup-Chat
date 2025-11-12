import {
  SmsPageHeader,
  SmsHeroSection,
  SmsHowItWorks,
  SmsFeatures,
  SmsPrivacyConsent,
} from "./index";

export function SmsConsentPage() {
  return (
    <div className="min-h-screen bg-muted">
      <SmsPageHeader />
      
      <div className="max-w-md mx-auto p-4 space-y-6">
        <SmsHeroSection />
        <SmsHowItWorks />
        <SmsFeatures />
        <SmsPrivacyConsent />
      </div>
    </div>
  );
}
