"use client";

import { useUserProvider } from "@/providers/UserProvder";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { useScheduledActions } from "@/hooks/useScheduledActions";
import ScheduledActionsList from "./ScheduledActionsList";

const ScheduledActionsPage = () => {
  const { userData } = useUserProvider();
  const { selectedArtist } = useArtistProvider();

  const accountId = userData?.id as string | undefined;
  const artistAccountId = selectedArtist?.account_id as string | undefined;

  const { data, isLoading, isError } = useScheduledActions({
    accountId,
    artistAccountId,
  });

  const actions = data?.actions ?? [];

  return (
    <div className="max-w-full md:max-w-[calc(100vw-200px)] grow py-8 px-6 md:px-12">
      <p className="text-center md:text-left font-plus_jakarta_sans_bold text-3xl mb-4">
        Tasks
      </p>
      <p className="text-lg text-gray-500 text-center md:text-left mb-8 font-light font-inter max-w-2xl">
        <span className="sm:hidden">View and manage all the tasks setup for your selected artist.</span>
        <span className="hidden sm:inline">View and manage all the tasks setup for your selected artist.</span>
      </p>

      <ScheduledActionsList
        actions={actions}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
};

export default ScheduledActionsPage;
