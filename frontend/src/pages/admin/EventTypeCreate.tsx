import { useCreateEventType } from "@/api/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().min(1, "Обязательное поле").max(100, "Максимум 100 символов"),
  description: z.string().max(500, "Максимум 500 символов").optional(),
  durationMinutes: z.number().min(1, "Минимум 1 минута").max(480, "Максимум 480 минут"),
});

type FormData = z.infer<typeof schema>;

export function EventTypeCreate() {
  const createEventType = useCreateEventType();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await createEventType.mutateAsync(data);
      toast.success("Тип события создан");
      navigate("/admin/event-types");
    } catch {
      toast.error("Ошибка при создании");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Новый тип события</h1>
      <Card>
        <CardHeader>
          <CardTitle>Информация</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Название</Label>
              <Input id="name" {...register("name")} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <Input id="description" {...register("description")} />
              {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="durationMinutes">Длительность (минуты)</Label>
              <Input id="durationMinutes" type="number" {...register("durationMinutes", { valueAsNumber: true })} />
              {errors.durationMinutes && <p className="text-sm text-destructive">{errors.durationMinutes.message}</p>}
            </div>
            <Button type="submit">Создать</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
