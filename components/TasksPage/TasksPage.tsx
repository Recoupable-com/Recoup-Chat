"use client";

import { useArtistProvider } from "@/providers/ArtistProvider";
import { useScheduledActions } from "@/hooks/useScheduledActions";
import TasksList from "./TasksList";
import useAutoLogin from "@/hooks/useAutoLogin";

const TasksPage = () => {
  useAutoLogin();
  const { selectedArtist } = useArtistProvider();
  const artistAccountId = selectedArtist?.account_id as string | undefined;
  const { data, isLoading, isError } = useScheduledActions({
    artistAccountId,
  });

  const tasks = data ?? [];

  return (
    <div className="max-w-full md:max-w-[calc(100vw-200px)] grow py-8 px-6 md:px-12">
      <p className="text-center md:text-left font-plus_jakarta_sans_bold text-3xl mb-4">
        Tasks
      </p>
      <p className="text-base text-muted-foreground text-center md:text-left mb-8 font-light font-inter max-w-2xl">
        View and manage all the tasks for your selected artist.
      </p>

      <TasksList tasks={tasks} isLoading={isLoading} isError={isError} />
    </div>
  );
};

export default TasksPage;
