import { usePublicEventType, useSlots, useCreateBooking } from "@/api/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/datepicker";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { format, addDays, startOfDay, endOfDay, startOfToday } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

const schema = z.object({
  guestName: z.string().min(1, "Обязательное поле"),
  guestEmail: z.string().email("Некорректный email"),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function PublicEventTypeDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: eventType } = usePublicEventType(id || "");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const createBooking = useCreateBooking();

  const from = format(startOfDay(selectedDate), "yyyy-MM-dd'T'00:00:00'Z'");
  const to = format(endOfDay(selectedDate), "yyyy-MM-dd'T'23:59:59'Z'");
  const { data: slots } = useSlots(id || "", from, to);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    if (!selectedSlotId) {
      toast.error("Выберите слот");
      return;
    }
    try {
      const result = await createBooking.mutateAsync({
        slotId: selectedSlotId,
        ...data,
      });
      toast.success("Бронирование успешно!");
      navigate(`/public/bookings/${result.id}`);
    } catch {
      toast.error("Ошибка при бронировании. Возможно, слот уже занят.");
    }
  };

  const availableSlots = slots?.filter((s) => s.isAvailable) || [];

  if (!eventType) return <div>Загрузка...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{eventType.name}</h1>
      {eventType.description && <p className="text-muted-foreground">{eventType.description}</p>}
      <p className="text-sm">Длительность: {eventType.durationMinutes} мин</p>

      <Card>
        <CardHeader>
          <CardTitle>Выберите дату</CardTitle>
        </CardHeader>
        <CardContent>
          <DatePicker
            date={selectedDate}
            onDateChange={(date) => date && setSelectedDate(date)}
            fromDate={startOfToday()}
            toDate={addDays(startOfToday(), 13)}
          />
        </CardContent>
      </Card>

      {availableSlots.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Доступные слоты</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {availableSlots.map((slot) => (
                <Button
                  key={slot.id}
                  variant={selectedSlotId === slot.id ? "default" : "outline"}
                  onClick={() => setSelectedSlotId(slot.id)}
                >
                  {format(new Date(slot.startTime), "HH:mm")}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Нет доступных слотов на выбранную дату
          </CardContent>
        </Card>
      )}

      {selectedSlotId && (
        <Card>
          <CardHeader>
            <CardTitle>Оформление бронирования</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="guestName">Имя</Label>
                <Input id="guestName" {...register("guestName")} />
                {errors.guestName && <p className="text-sm text-destructive">{errors.guestName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="guestEmail">Email</Label>
                <Input id="guestEmail" type="email" {...register("guestEmail")} />
                {errors.guestEmail && <p className="text-sm text-destructive">{errors.guestEmail.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Заметки</Label>
                <Input id="notes" {...register("notes")} />
              </div>
              <Button type="submit">Забронировать</Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
