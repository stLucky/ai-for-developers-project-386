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
import { Clock, ArrowLeft, Circle, Loader2 } from "lucide-react";

const schema = z.object({
  guestName: z.string().min(1, "Обязательное поле"),
  guestEmail: z.string().email("Некорректный email"),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;
type Step = "slots" | "form";

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
  const [step, setStep] = useState<Step>("slots");
  const [avatarError, setAvatarError] = useState(false);
  const createBooking = useCreateBooking();

  const from = format(startOfDay(selectedDate), "yyyy-MM-dd'T'00:00:00'Z'");
  const to = format(endOfDay(selectedDate), "yyyy-MM-dd'T'23:59:59'Z'");
  const { data: slots, isPending: slotsPending } = useSlots(id || "", from, to);

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
  };

  const handleSlotSelect = (slotId: string) => {
    setSelectedSlotId(slotId);
    setStep("form");
  };

  const handleBack = () => {
    setStep("slots");
    setSelectedSlotId(null);
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
      <div className="bg-background rounded-xl shadow-lg border overflow-hidden w-full max-w-[980px]">
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr_280px] min-h-[500px]">
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

          {/* Center + Right content */}
          {step === "slots" ? (
            <>
              {/* Center: Calendar */}
              <div className="p-6 flex flex-col gap-4 border-b md:border-b-0 md:border-r">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={isDateDisabled}
                  autoFocus
                  showOutsideDays={true}
                  locale={ru}
                  className="mx-auto"
                  classNames={{
                    root: "w-full",
                    month: "w-full",
                    month_caption: "flex items-center justify-center h-10 text-base font-medium mb-6",
                    nav: "absolute inset-x-0 top-0 flex w-full items-center justify-between px-2 h-10",
                    button_previous: "flex items-center justify-center h-8 w-8 rounded-md border bg-background hover:bg-muted",
                    button_next: "flex items-center justify-center h-8 w-8 rounded-md border bg-background hover:bg-muted",
                    month_grid: "w-full border-collapse",
                    weekdays: "flex gap-1 mb-2 w-full",
                    weekday: "flex-1 text-center text-xs text-muted-foreground font-normal",
                    week: "flex w-full gap-1 mb-1",
                    day: "flex items-center justify-center relative aspect-square h-full w-full p-0 text-center",
                    day_button: "w-full h-full rounded-lg font-normal text-sm",
                    selected: "rounded-lg",
                    today: "rounded-lg",
                    outside: "text-muted-foreground/40",
                    disabled: "text-muted-foreground/40",
                    hidden: "invisible",
                  }}
                  formatters={{
                    formatCaption: (month, options) => {
                      const formatted = format(month, "LLLL yyyy", { locale: options?.locale || ru });
                      return formatted.charAt(0).toUpperCase() + formatted.slice(1);
                    },
                  }}
                />
              </div>

              {/* Right: Slots */}
              <div className="p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-medium">
                    {format(selectedDate, "EEEE, d MMMM", { locale: ru }).replace(/^./, str => str.toUpperCase())}
                  </h3>
                </div>
                <div className="flex flex-col gap-2 overflow-y-auto max-h-[400px] scrollbar-hide">
                  {slotsPending ? (
                    <div className="flex flex-col items-center justify-center py-8 gap-2 text-muted-foreground text-sm">
                      <Loader2 className="size-5 animate-spin" />
                      <span>Загрузка слотов...</span>
                    </div>
                  ) : availableSlots.length > 0 ? (
                    availableSlots.map((slot) => (
                      <Button
                        key={slot.id}
                        variant="outline"
                        className="justify-start w-full h-11 gap-2 rounded-lg border bg-background hover:bg-muted"
                        onClick={() => handleSlotSelect(slot.id)}
                      >
                        <Circle className="size-2 fill-green-500 text-green-500" />
                        <span className="text-sm font-medium">
                          {format(new Date(slot.startTime), "HH:mm")}
                        </span>
                      </Button>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      Нет доступных слотов
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            /* Form replaces center + right */
            <div className="md:col-span-2 p-6 flex flex-col gap-4">
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
                className="flex flex-col gap-4 max-w-md"
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
  );
}
