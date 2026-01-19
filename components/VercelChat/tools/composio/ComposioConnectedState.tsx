import { CheckCircle } from "lucide-react";

interface ComposioConnectedStateProps {
  displayName: string;
}

/**
 * Component shown when a connector is successfully connected.
 */
export function ComposioConnectedState({
  displayName,
}: ComposioConnectedStateProps) {
  return (
    <div className="flex flex-col space-y-2 p-4 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 my-2 max-w-md">
      <div className="flex items-center space-x-2">
        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
        <span className="font-medium text-green-800 dark:text-green-200">
          {displayName} Connected
        </span>
      </div>
      <p className="text-sm text-green-700 dark:text-green-300">
        Your {displayName} account is connected and ready to use.
      </p>
    </div>
  );
}
