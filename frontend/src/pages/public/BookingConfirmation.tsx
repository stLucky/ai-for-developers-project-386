import { usePublicBooking } from "@/api/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

export function BookingConfirmation() {
  const { id } = useParams<{ id: string }>();
  const { data: booking, isLoading } = usePublicBooking(id || "");

  if (isLoading) return <div>Загрузка...</div>;
  if (!booking) return <div>Бронирование не найдено</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-center">Бронирование подтверждено</h1>

      <Card>
        <CardHeader>
          <CardTitle>Детали</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div><strong>Имя:</strong> {booking.guestName}</div>
          <div><strong>Email:</strong> {booking.guestEmail}</div>
          <div><strong>Статус:</strong> {booking.status === "confirmed" ? "Подтверждено" : "Отменено"}</div>
          <div><strong>Создано:</strong> {format(new Date(booking.createdAt), "dd.MM.yyyy HH:mm", { locale: ru })}</div>
          {booking.notes && <div><strong>Заметки:</strong> {booking.notes}</div>}
        </CardContent>
      </Card>
    </div>
  );
}
