"use client";

import { PrivyProvider as Privy } from "@privy-io/react-auth";

export default function PrivyProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Determine which Privy app ID to use based on environment
  // NEXT_PUBLIC_VERCEL_ENV is set by Vercel: 'production', 'preview', or 'development'
  const isPreview = process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview';
  
  // Use preview app ID for preview deployments, fallback to production app ID
  const appId = isPreview
    ? (process.env.NEXT_PUBLIC_PRIVY_APP_ID_PREVIEW || process.env.NEXT_PUBLIC_PRIVY_APP_ID)
    : process.env.NEXT_PUBLIC_PRIVY_APP_ID;

  // Validate app ID is present
  if (!appId) {
    console.error('❌ Missing Privy app ID. Check environment variables:', {
      isPreview,
      hasPreviewId: !!process.env.NEXT_PUBLIC_PRIVY_APP_ID_PREVIEW,
      hasProductionId: !!process.env.NEXT_PUBLIC_PRIVY_APP_ID,
      vercelEnv: process.env.NEXT_PUBLIC_VERCEL_ENV
    });
    throw new Error('Missing required NEXT_PUBLIC_PRIVY_APP_ID environment variable');
  }

  return (
    <Privy
      appId={appId}
      config={{
        appearance: {
          theme: "light",
          accentColor: "#003199",
          logo: "/Recoup_Icon_Wordmark_Black.svg",
        },
        loginMethods: ["email"],
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
      }}
    >
      {children}
    </Privy>
  );
}
