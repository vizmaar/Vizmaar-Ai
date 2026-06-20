import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <p className="text-8xl font-bold gradient-text mb-4">404</p>
      <h1 className="text-2xl font-bold text-foreground mb-2">Page Not Found</h1>
      <p className="text-muted max-w-md mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex gap-3">
        <Link href="/">
          <Button><Home className="h-4 w-4" /> Go Home</Button>
        </Link>
        <Link href="/tools">
          <Button variant="outline"><ArrowLeft className="h-4 w-4" /> Browse Tools</Button>
        </Link>
      </div>
    </div>
  );
}
