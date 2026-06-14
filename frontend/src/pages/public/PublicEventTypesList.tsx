import { usePublicEventTypes } from "@/api/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

export function PublicEventTypesList() {
  const { data: eventTypes, isLoading } = usePublicEventTypes();

  if (isLoading) return <div>Загрузка...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-center">Доступные типы встреч</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {eventTypes?.map((et) => (
          <Link key={et.id} to={`/public/event-types/${et.id}`}>
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle>{et.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {et.description && <p className="text-muted-foreground">{et.description}</p>}
                <p className="text-sm">Длительность: {et.durationMinutes} мин</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
