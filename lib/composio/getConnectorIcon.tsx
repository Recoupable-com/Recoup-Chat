import {
  SiGooglesheets,
  SiGoogledrive,
  SiGoogledocs,
  SiGooglecalendar,
  SiGmail,
  SiSlack,
  SiGithub,
  SiNotion,
  SiLinear,
  SiJira,
  SiAirtable,
  SiHubspot,
  SiSupabase,
  SiX,
} from "@icons-pack/react-simple-icons";
import { Link2, Mail, Globe } from "lucide-react";

/**
 * Get branded icon for a connector.
 * Uses Simple Icons for brand logos, falls back to Lucide for others.
 */
export function getConnectorIcon(slug: string, size = 24): React.ReactNode {
  const iconProps = { size, className: "shrink-0" };

  const icons: Record<string, React.ReactNode> = {
    googlesheets: <SiGooglesheets {...iconProps} color="#34A853" />,
    googledrive: <SiGoogledrive {...iconProps} color="#4285F4" />,
    googledocs: <SiGoogledocs {...iconProps} color="#4285F4" />,
    googlecalendar: <SiGooglecalendar {...iconProps} color="#4285F4" />,
    gmail: <SiGmail {...iconProps} color="#EA4335" />,
    outlook: <Mail size={size} className="shrink-0 text-[#0078D4]" />,
    slack: <SiSlack {...iconProps} color="#4A154B" />,
    github: (
      <SiGithub {...iconProps} className="shrink-0 dark:text-white" />
    ),
    notion: (
      <SiNotion {...iconProps} className="shrink-0 dark:text-white" />
    ),
    linear: <SiLinear {...iconProps} color="#5E6AD2" />,
    jira: <SiJira {...iconProps} color="#0052CC" />,
    airtable: <SiAirtable {...iconProps} color="#18BFFF" />,
    hubspot: <SiHubspot {...iconProps} color="#FF7A59" />,
    supabase: <SiSupabase {...iconProps} color="#3FCF8E" />,
    twitter: <SiX {...iconProps} className="shrink-0 dark:text-white" />,
    perplexityai: (
      <Globe size={size} className="shrink-0 text-[#20B8CD]" />
    ),
  };

  return (
    icons[slug] || (
      <Link2 size={size} className="shrink-0 text-muted-foreground" />
    )
  );
}
