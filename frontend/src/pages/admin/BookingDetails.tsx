import { useBookings, useCancelBooking } from "@/api/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

export function BookingDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: bookings } = useBookings();
  const cancelBooking = useCancelBooking();
  const booking = bookings?.find((b) => b.id === id);

  const handleCancel = async () => {
    if (!id) return;
    try {
      await cancelBooking.mutateAsync(id);
      toast.success("Бронирование отменено");
    } catch {
      toast.error("Ошибка при отмене");
    }
  };

  if (!booking) return <div>Загрузка...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Детали бронирования</h1>

      <Card>
        <CardHeader>
          <CardTitle>Информация</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div><strong>Гость:</strong> {booking.guestName}</div>
          <div><strong>Email:</strong> {booking.guestEmail}</div>
          <div><strong>Статус:</strong> {booking.status === "confirmed" ? "Подтверждено" : "Отменено"}</div>
          <div><strong>Создано:</strong> {format(new Date(booking.createdAt), "dd.MM.yyyy HH:mm", { locale: ru })}</div>
          {booking.notes && <div><strong>Заметки:</strong> {booking.notes}</div>}

          {booking.status === "confirmed" && (
            <Button variant="destructive" onClick={handleCancel} className="mt-4">
              Отменить бронирование
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
