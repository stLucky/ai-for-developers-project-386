import { useOwner } from "@/api/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

export function AdminDashboard() {
  const { data: owner, isLoading } = useOwner();

  if (isLoading) return <div>Загрузка...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Администрирование</h1>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Профиль владельца</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div><strong>Имя:</strong> {owner?.name}</div>
            <div><strong>Email:</strong> {owner?.email}</div>
            <div><strong>Часовой пояс:</strong> {owner?.timezone}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Управление</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link to="/admin/event-types" className="block text-primary hover:underline">
              Типы событий
            </Link>
            <Link to="/admin/bookings" className="block text-primary hover:underline">
              Бронирования
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
