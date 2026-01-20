import Link from "next/link";
import { Plug } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

const ConnectorsMenuItem = () => {
  return (
    <DropdownMenuItem asChild className="cursor-pointer">
      <Link href="/settings/connectors">
        <Plug className="h-4 w-4" />
        Connectors
      </Link>
    </DropdownMenuItem>
  );
};

export default ConnectorsMenuItem;
