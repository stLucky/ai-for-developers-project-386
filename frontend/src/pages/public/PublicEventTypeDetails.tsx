import { usePublicEventType, useSlots, useCreateBooking, usePublicOwner } from "@/api/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { format, addDays, startOfDay, endOfDay, startOfToday } from "date-fns";
import { ru } from "date-fns/locale";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Clock, ArrowLeft } from "lucide-react";

const schema = z.object({
  guestName: z.string().min(1, "Обязательное поле"),
  guestEmail: z.string().email("Некорректный email"),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;
type Step = "date" | "time" | "form";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function PublicEventTypeDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: eventType } = usePublicEventType(id || "");
  const { data: owner } = usePublicOwner();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [step, setStep] = useState<Step>("date");
  const [avatarError, setAvatarError] = useState(false);
  const createBooking = useCreateBooking();

  const from = format(startOfDay(selectedDate), "yyyy-MM-dd'T'00:00:00'Z'");
  const to = format(endOfDay(selectedDate), "yyyy-MM-dd'T'23:59:59'Z'");
  const { data: slots } = useSlots(id || "", from, to);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const isDateDisabled = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const today = startOfToday();
    const max = addDays(today, 13);
    if (d < today) return true;
    if (d > max) return true;
    return false;
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
    setSelectedSlotId(null);
    setStep("time");
  };

  const handleSlotSelect = (slotId: string) => {
    setSelectedSlotId(slotId);
    setStep("form");
  };

  const handleBack = () => {
    if (step === "form") {
      setStep("time");
      setSelectedSlotId(null);
    } else if (step === "time") {
      setStep("date");
      setSelectedSlotId(null);
    }
  };

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

  if (!eventType || !owner)
    return (
      <div className="flex justify-center py-12">
        <div className="animate-pulse text-muted-foreground">Загрузка...</div>
      </div>
    );

  const selectedSlot = availableSlots.find((s) => s.id === selectedSlotId);

  return (
    <div className="flex justify-center">
      <div className="bg-background rounded-xl shadow-lg border overflow-hidden w-full max-w-[900px]">
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr]">
          {/* Left sidebar */}
          <div className="bg-muted/30 p-6 border-b md:border-b-0 md:border-r flex flex-col gap-6">
            {/* Avatar */}
            <div className="flex items-center gap-3">
              <div className="relative size-12 rounded-full overflow-hidden bg-secondary flex items-center justify-center shrink-0 border">
                {owner.avatar && !avatarError ? (
                  <img
                    src={owner.avatar}
                    alt={owner.name}
                    className="size-full object-cover"
                    onError={() => setAvatarError(true)}
                  />
                ) : (
                  <span className="text-sm font-medium text-muted-foreground">
                    {getInitials(owner.name)}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">{owner.name}</span>
                <span className="text-xs text-muted-foreground">Организатор</span>
              </div>
            </div>

            <div className="h-px bg-border" />

            {/* Event info */}
            <div className="flex flex-col gap-3">
              <h1 className="text-xl font-semibold text-foreground">
                {eventType.name}
              </h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="size-4" />
                <span>{eventType.durationMinutes} мин</span>
              </div>
              {eventType.description && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {eventType.description}
                </p>
              )}
            </div>
          </div>

          {/* Right content */}
          <div className="p-6 flex flex-col gap-6">
            {/* Step 1: Date */}
            {step === "date" && (
              <div className="flex flex-col gap-4">
                <h2 className="text-lg font-medium text-foreground">
                  Выберите дату
                </h2>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={isDateDisabled}
                  autoFocus
                  className="mx-auto"
                />
              </div>
            )}

            {/* Step 2: Time */}
            {step === "time" && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleBack}
                    className="size-8"
                  >
                    <ArrowLeft className="size-4" />
                  </Button>
                  <div>
                    <h2 className="text-lg font-medium text-foreground">
                      Выберите время
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {format(selectedDate, "EEEE, d MMMM", { locale: ru })}
                    </p>
                  </div>
                </div>
                {availableSlots.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {availableSlots.map((slot) => (
                      <Button
                        key={slot.id}
                        variant="outline"
                        className="justify-start w-full h-11"
                        onClick={() => handleSlotSelect(slot.id)}
                      >
                        {format(new Date(slot.startTime), "HH:mm")}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Нет доступных слотов на выбранную дату
                  </div>
                )}
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  className="self-start"
                >
                  <ArrowLeft className="size-4 mr-2" />
                  Назад
                </Button>
              </div>
            )}

            {/* Step 3: Form */}
            {step === "form" && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleBack}
                    className="size-8"
                  >
                    <ArrowLeft className="size-4" />
                  </Button>
                  <div>
                    <h2 className="text-lg font-medium text-foreground">
                      Оформление бронирования
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {selectedSlot
                        ? `${format(selectedDate, "EEEE, d MMMM", { locale: ru })} в ${format(
                            new Date(selectedSlot.startTime),
                            "HH:mm"
                          )}`
                        : ""}
                    </p>
                  </div>
                </div>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col gap-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="guestName">Имя</Label>
                    <Input id="guestName" {...register("guestName")} />
                    {errors.guestName && (
                      <p className="text-sm text-destructive">
                        {errors.guestName.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guestEmail">Email</Label>
                    <Input
                      id="guestEmail"
                      type="email"
                      {...register("guestEmail")}
                    />
                    {errors.guestEmail && (
                      <p className="text-sm text-destructive">
                        {errors.guestEmail.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Заметки</Label>
                    <Input id="notes" {...register("notes")} />
                  </div>
                  <Button type="submit" className="w-full">
                    Забронировать
                  </Button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
