"use client";

import { PrivyProvider as Privy } from "@privy-io/react-auth";

export default function PrivyProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Use preview app ID for Vercel preview deployments, otherwise use production app ID
  // This allows preview deployments to work without needing to whitelist specific URLs
  const appId = process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview'
    ? (process.env.NEXT_PUBLIC_PRIVY_APP_ID_PREVIEW || process.env.NEXT_PUBLIC_PRIVY_APP_ID)
    : process.env.NEXT_PUBLIC_PRIVY_APP_ID;

  return (
    <Privy
      appId={appId as string}
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
