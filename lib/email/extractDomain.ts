const extractDomain = (email: string): string | null => {
  const atIndex = email.lastIndexOf("@");
  if (atIndex === -1) return null;
  return email.slice(atIndex + 1).toLowerCase();
};

export default extractDomain;
