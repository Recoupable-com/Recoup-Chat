interface ConnectorsErrorBannerProps {
  error: string | null;
}

export function ConnectorsErrorBanner({ error }: ConnectorsErrorBannerProps) {
  if (!error) return null;

  return (
    <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
      {error}
    </div>
  );
}
