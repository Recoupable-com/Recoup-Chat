import { ENTERPRISE_DOMAINS } from "../consts";
import extractDomain from "../email/extractDomain";

/**
 * Returns true if the provided email belongs to a known enterprise domain.
 */
const isEnterprise = (email: string): boolean => {
  if (!email) return false;
  const domain = extractDomain(email);
  if (!domain) return false;
  return ENTERPRISE_DOMAINS.has(domain);
};

export default isEnterprise;
