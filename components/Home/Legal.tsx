import Link from "next/link";

interface LegalProps {
  className?: string;
}

const Legal = ({ className = "mt-6 mb-4" }: LegalProps) => (
  <div className={`text-xs text-gray-500 ${className}`.trim()}>
    <Link
      href="https://recoupable.com/privacy-policy"
      className="underline hover:text-gray-700"
      target="_blank"
      rel="noopener noreferrer"
    >
      Privacy Policy
    </Link>
    <span className="mx-2">|</span>
    <Link
      href="https://recoupable.com/terms-of-service"
      className="underline hover:text-gray-700"
      target="_blank"
      rel="noopener noreferrer"
    >
      Terms of Service
    </Link>
  </div>
);

export default Legal;
