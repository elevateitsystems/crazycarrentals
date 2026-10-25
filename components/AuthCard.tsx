import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuthCard({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <Card className="w-full max-w-md rounded-2xl border-border p-2 shadow-lg">
        <CardHeader className="pb-4 text-center">
          <Link href="/" className="mb-2 text-xs font-medium text-muted-foreground hover:text-foreground">
            ← Back to website
          </Link>
          <CardTitle className="text-2xl font-bold tracking-tight">{title}</CardTitle>
          <CardDescription className="mt-2 text-sm text-muted-foreground">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          {children}
          {footer && <div className="mt-6 space-y-2 border-t border-border pt-5 text-center text-sm text-muted-foreground">{footer}</div>}
        </CardContent>
      </Card>
    </div>
  );
}

export const authInput = "h-11 rounded-lg";
export const authLabel = "text-xs font-semibold uppercase text-muted-foreground";
