import { Lightbulb } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { AtsResult } from "@/lib/types";

export function AtsScorePanel({ result }: { result: AtsResult }) {
  return (
    <div className="space-y-4">
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-base">ATS Score: {result.score}/100</CardTitle>
          <CardDescription>
            Estimativa de quão bem seu currículo é lido por sistemas de triagem automatizada.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {result.categories.map((category) => (
            <div key={category.name}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{category.name}</span>
                <span className="font-medium">{category.score}</span>
              </div>
              <Progress value={category.score} aria-label={category.name} />
            </div>
          ))}
        </CardContent>
      </Card>

      {result.recommendations.length ? (
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Melhorias recomendadas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {result.recommendations.map((rec, index) => (
              <div key={index} className="flex gap-3 rounded-lg bg-muted p-3">
                <Lightbulb className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden />
                <div>
                  <p className="text-sm font-medium">{rec.title}</p>
                  <p className="text-sm text-muted-foreground">{rec.detail}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
