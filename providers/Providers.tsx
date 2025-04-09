"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChatProvider } from "./ChatProvider";
import PrivyProvider from "./PrivyProvider";
import { UserProvider } from "./UserProvder";
import { ArtistProvider } from "./ArtistProvider";
import { ConversationsProvider } from "./ConversationsProvider";
import { FunnelReportProvider } from "./FunnelReportProvider";
import { PaymentProvider } from "./PaymentProvider";
import { MessagesProvider } from "./MessagesProvider";
import { PromptsProvider } from "./PromptsProvider";
import { FunnelAnalysisProvider } from "./FunnelAnalysisProvider";
import { ChatOptionsProvider } from "./ChatOptionsProvider";

const queryClient = new QueryClient();

const Providers = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <PrivyProvider>
      <UserProvider>
        <FunnelReportProvider>
          <ArtistProvider>
            <ConversationsProvider>
              <PromptsProvider>
                <MessagesProvider>
                  <ChatProvider>
                    <PaymentProvider>
                      <FunnelAnalysisProvider>
                        <ChatOptionsProvider>
                          {children}
                        </ChatOptionsProvider>
                      </FunnelAnalysisProvider>
                    </PaymentProvider>
                  </ChatProvider>
                </MessagesProvider>
              </PromptsProvider>
            </ConversationsProvider>
          </ArtistProvider>
        </FunnelReportProvider>
      </UserProvider>
    </PrivyProvider>
  </QueryClientProvider>
);

export default Providers;
