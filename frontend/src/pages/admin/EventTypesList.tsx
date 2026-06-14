import { useEventTypes, useDeleteEventType } from "@/api/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export function EventTypesList() {
  const { data: eventTypes, isLoading } = useEventTypes();
  const deleteEventType = useDeleteEventType();

  const handleDelete = async (id: string) => {
    try {
      await deleteEventType.mutateAsync(id);
      toast.success("Тип события удален");
    } catch {
      toast.error("Ошибка при удалении");
    }
  };

  if (isLoading) return <div>Загрузка...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Типы событий</h1>
        <Link to="/admin/event-types/new">
          <Button>Создать</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Список</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Название</TableHead>
                <TableHead>Описание</TableHead>
                <TableHead>Длительность (мин)</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {eventTypes?.map((et) => (
                <TableRow key={et.id}>
                  <TableCell>{et.name}</TableCell>
                  <TableCell>{et.description || "—"}</TableCell>
                  <TableCell>{et.durationMinutes}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Link to={`/admin/event-types/${et.id}/edit`}>
                      <Button variant="outline" size="sm">Редактировать</Button>
                    </Link>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(et.id)}>
                      Удалить
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
