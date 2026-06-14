import { useBookings, useEventTypes } from "@/api/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link } from "react-router-dom";
import { useState } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

export function BookingsList() {
  const { data: eventTypes } = useEventTypes();
  const [eventTypeId, setEventTypeId] = useState("");
  const [status, setStatus] = useState<"" | "confirmed" | "cancelled">("");

  const { data: bookings, isLoading } = useBookings(
    eventTypeId || status ? { eventTypeId: eventTypeId || undefined, status: status || undefined } : undefined
  );

  if (isLoading) return <div>Загрузка...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Бронирования</h1>

      <div className="flex gap-4">
        <Select value={eventTypeId} onValueChange={(v) => setEventTypeId(v)}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Все типы событий" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Все типы событий</SelectItem>
            {eventTypes?.map((et) => (
              <SelectItem key={et.id} value={et.id}>{et.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={(v) => setStatus(v as "" | "confirmed" | "cancelled")}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Все статусы" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Все статусы</SelectItem>
            <SelectItem value="confirmed">Подтверждено</SelectItem>
            <SelectItem value="cancelled">Отменено</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Список</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Гость</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Создано</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings?.map((b) => (
                <TableRow key={b.id}>
                  <TableCell>{b.guestName}</TableCell>
                  <TableCell>{b.guestEmail}</TableCell>
                  <TableCell>
                    <span className={b.status === "confirmed" ? "text-green-600" : "text-red-600"}>
                      {b.status === "confirmed" ? "Подтверждено" : "Отменено"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {format(new Date(b.createdAt), "dd.MM.yyyy HH:mm", { locale: ru })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/admin/bookings/${b.id}`}>Детали</Link>
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
