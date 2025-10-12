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
import { ComposioProvider } from "./ComposioProvider";

const queryClient = new QueryClient();

const Providers = ({ children }: { children: React.ReactNode }) => (
  <WagmiProvider>
    <QueryClientProvider client={queryClient}>
      <PrivyProvider>
        <MiniKitProvider>
          <MiniAppProvider>
            <ComposioProvider>
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
            </ComposioProvider>
          </MiniAppProvider>
        </MiniKitProvider>
      </PrivyProvider>
    </QueryClientProvider>
  </WagmiProvider>
);

export default Providers;
