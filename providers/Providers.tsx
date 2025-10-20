"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PrivyProvider from "./PrivyProvider";
import { UserProvider } from "./UserProvder";
import { ArtistProvider } from "./ArtistProvider";
import { ConversationsProvider } from "./ConversationsProvider";
import { FunnelReportProvider } from "./FunnelReportProvider";
import { PaymentProvider } from "./PaymentProvider";
import { SidebarExpansionProvider } from "./SidebarExpansionContext";
import { MiniKitProvider } from "./MiniKitProvider";
import WagmiProvider from "./WagmiProvider";
import { MiniAppProvider } from "./MiniAppProvider";

const queryClient = new QueryClient();

const Providers = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <WagmiProvider>
      <PrivyProvider>
        <MiniKitProvider>
          <MiniAppProvider>
            <UserProvider>
              <FunnelReportProvider>
                <ArtistProvider>
                  <SidebarExpansionProvider>
                    <ConversationsProvider>
                      <PaymentProvider>{children}</PaymentProvider>
                    </ConversationsProvider>
                  </SidebarExpansionProvider>
                </ArtistProvider>
              </FunnelReportProvider>
            </UserProvider>
          </MiniAppProvider>
        </MiniKitProvider>
      </PrivyProvider>
    </WagmiProvider>
  </QueryClientProvider>
);

export default Providers;
