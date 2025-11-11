import { Icons } from "@/components/Icon/resolver";

const GenericSuccess = ({
  image,
  name,
  message,
  children,
}: {
  image?: string;
  name: string;
  message: string;
  children?: React.ReactNode;
}) => {

  return (
    <div className="flex items-center space-x-3 p-2 rounded bg-gray-50 dark:bg-dark-bg-secondary border border-gray-200 dark:border-dark-border my-1 text-gray-800 dark:text-gray-200 w-fit max-w-[17rem] md:rounded-xl">
      <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-dark-bg-tertiary flex items-center justify-center overflow-hidden shrink-0">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={name}
            width={32}
            height={32}
            className="h-full w-full object-cover"
          />
        ) : (
          <Icons.CheckIcon />
        )}
      </div>

      <div className="flex-grow min-w-0 overflow-hidden">
        <p className="font-medium text-sm truncate dark:text-white">{name}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{message}</p>
        {children}
      </div>
    </div>
  );
};

export default GenericSuccess;
