import Link from "next/link";

interface LegalProps {
  className?: string;
}

const Legal = ({ className = "mt-6 mb-4" }: LegalProps) => (
  <div className={`text-xs text-gray-500 ${className}`.trim()}>
    <Link href="/privacy" className="underline hover:text-gray-700">
      Privacy Policy
    </Link>
    <span className="mx-2">|</span>
    <Link href="/terms" className="underline hover:text-gray-700">
      Terms of Service
    </Link>
  </div>
);

export default Legal;
