import { Rocket } from "lucide-react";
import { PageHeader } from "./page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ComingSoon({
  title,
  subtitle,
  phase,
  points,
}: {
  title: string;
  subtitle: string;
  phase: string;
  points: string[];
}) {
  return (
    <>
      <PageHeader title={title} subtitle={subtitle} />
      <Card>
        <CardContent className="flex flex-col items-center py-16 text-center">
          <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Rocket className="size-7" />
          </div>
          <Badge tone="primary" className="mb-3">{phase}</Badge>
          <h3 className="text-lg font-semibold">Coming next in the build</h3>
          <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
            {points.map((p) => <li key={p}>• {p}</li>)}
          </ul>
        </CardContent>
      </Card>
    </>
  );
}
