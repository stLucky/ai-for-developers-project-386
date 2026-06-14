import { useBookings, useCancelBooking } from "@/api/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { FileText, User, Mail, CheckCircle2, XCircle, Calendar, AlertTriangle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

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

  if (!booking) return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-pulse text-muted-foreground">Загрузка...</div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link to="/admin/bookings">
            <ArrowLeft className="size-5" />
          </Link>
        </Button>
        <div className="p-2 rounded-lg bg-primary/10">
          <FileText className="size-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
          Детали бронирования
        </h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 animate-stagger">
        <Card className="border-0 neumorphic-sm">
          <CardHeader className="flex flex-row items-center gap-3 pb-4">
            <User className="size-5 text-primary" />
            <CardTitle>Информация о госте</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <User className="size-4 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Имя</div>
                <div className="font-medium">{booking.guestName}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Mail className="size-4 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Email</div>
                <div className="font-medium">{booking.guestEmail}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 neumorphic-sm">
          <CardHeader className="flex flex-row items-center gap-3 pb-4">
            <Calendar className="size-5 text-primary" />
            <CardTitle>Детали бронирования</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="text-xs text-muted-foreground">Статус</div>
              <span className={booking.status === "confirmed" 
                ? "inline-flex items-center gap-1 text-green-600 bg-green-50 dark:bg-green-950 px-2 py-1 rounded-full text-xs font-medium" 
                : "inline-flex items-center gap-1 text-red-600 bg-red-50 dark:bg-red-950 px-2 py-1 rounded-full text-xs font-medium"
              }>
                {booking.status === "confirmed" ? <CheckCircle2 className="size-3" /> : <XCircle className="size-3" />}
                {booking.status === "confirmed" ? "Подтверждено" : "Отменено"}
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Calendar className="size-4 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Создано</div>
                <div className="font-medium">{format(new Date(booking.createdAt), "dd.MM.yyyy HH:mm", { locale: ru })}</div>
              </div>
            </div>
            {booking.notes && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <AlertTriangle className="size-4 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-xs text-muted-foreground">Заметки</div>
                  <div className="font-medium">{booking.notes}</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {booking.status === "confirmed" && (
        <div className="flex justify-end">
          <Button variant="destructive" onClick={handleCancel} className="neumorphic-sm gap-2">
            <XCircle className="size-4" />
            Отменить бронирование
          </Button>
        </div>
      )}
    </div>
  );
}
