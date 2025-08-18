const ScheduledActionsPage = () => {
  return (
    <div className="max-w-full md:max-w-[calc(100vw-200px)] grow py-8 px-6 md:px-12">
      <p className="text-center md:text-left font-plus_jakarta_sans_bold text-3xl mb-4">
        Scheduled Actions
      </p>
      <p className="text-lg text-gray-500 text-center md:text-left mb-8 font-light font-inter max-w-2xl">
        <span className="sm:hidden">
          Schedule actions to be performed at a specific time.
        </span>
        <span className="hidden sm:inline">
          Schedule actions to be performed at a specific time.
        </span>
      </p>
    </div>
  );
};

export default ScheduledActionsPage;
