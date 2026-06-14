import { useBookings, useEventTypes } from "@/api/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
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
        <Select value={eventTypeId} onChange={(e) => setEventTypeId(e.target.value)}>
          <option value="">Все типы событий</option>
          {eventTypes?.map((et) => (
            <option key={et.id} value={et.id}>{et.name}</option>
          ))}
        </Select>
        <Select value={status} onChange={(e) => setStatus(e.target.value as any)}>
          <option value="">Все статусы</option>
          <option value="confirmed">Подтверждено</option>
          <option value="cancelled">Отменено</option>
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
                    <Link to={`/admin/bookings/${b.id}`}>
                      <Button variant="outline" size="sm">Детали</Button>
                    </Link>
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
