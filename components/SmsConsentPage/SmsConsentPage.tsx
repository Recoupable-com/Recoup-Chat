import {
  SmsPageHeader,
  SmsHeroSection,
  SmsHowItWorks,
  SmsFeatures,
  SmsPrivacyConsent,
  SmsCallToAction,
} from "./index";

export function SmsConsentPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SmsPageHeader />
      
      <div className="max-w-md mx-auto p-4 space-y-6">
        <SmsHeroSection />
        <SmsHowItWorks />
        <SmsFeatures />
        <SmsPrivacyConsent />
        <SmsCallToAction />
      </div>
    </div>
  );
}
