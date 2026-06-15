import { test, expect, resetStore, seedEventType, seedBooking, getSlots, selectTomorrow } from '../fixtures';

test.describe('SC-G: Гостевой поток — Happy Path', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ request }) => {
    await resetStore(request);
  });

  test('SC-G-01: Просмотр списка типов событий', async ({ page, request }) => {
    await seedEventType(request, {
      name: 'Консультация 30 мин',
      description: 'Индивидуальная консультация',
      durationMinutes: 30,
    });
    await seedEventType(request, {
      name: 'Встреча 1 час',
      description: 'Командная встреча',
      durationMinutes: 60,
    });

    await page.goto('/public');
    await expect(page.getByText('Доступные типы встреч')).toBeVisible();
    await expect(page.getByText('Консультация 30 мин').first()).toBeVisible();
    await expect(page.getByText('Индивидуальная консультация').first()).toBeVisible();
    await expect(page.getByText('Встреча 1 час').first()).toBeVisible();
    await expect(page.getByText('Командная встреча').first()).toBeVisible();
    await expect(page.getByText('Длительность: 30 мин').first()).toBeVisible();
    await expect(page.getByText('Длительность: 60 мин').first()).toBeVisible();
  });

  test('SC-G-02: Выбор типа события, даты и слота', async ({ page, request }) => {
    const { eventType } = await seedEventType(request, {
      name: 'Консультация 30 мин',
      durationMinutes: 30,
    });

    await page.goto(`/public/event-types/${eventType.id}`);
    await expect(page.getByRole('heading', { name: 'Консультация 30 мин' })).toBeVisible();
    await expect(page.getByText('30 мин').first()).toBeVisible();

    await selectTomorrow(page);

    // Wait for the first slot button (e.g., "09:00") to appear
    await expect(page.locator('button').filter({ hasText: /^\d{2}:\d{2}$/ }).first()).toBeVisible();

    // Click the first available slot
    const firstSlot = page.locator('button').filter({ hasText: /^\d{2}:\d{2}$/ }).first();
    await firstSlot.click();

    // Assert the booking form is shown
    await expect(page.getByText('Оформление бронирования')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Забронировать' })).toBeVisible();
  });

  test('SC-G-03: Успешное бронирование', async ({ page, request }) => {
    const { eventType } = await seedEventType(request, {
      name: 'Консультация 30 мин',
      durationMinutes: 30,
    });

    await page.goto(`/public/event-types/${eventType.id}`);
    await selectTomorrow(page);

    await expect(page.locator('button').filter({ hasText: /^\d{2}:\d{2}$/ }).first()).toBeVisible();
    const firstSlot = page.locator('button').filter({ hasText: /^\d{2}:\d{2}$/ }).first();
    await firstSlot.click();

    await expect(page.getByText('Оформление бронирования')).toBeVisible();

    await page.getByLabel('Имя').fill('Иван Петров');
    await page.getByLabel('Email').fill('ivan@example.com');
    await page.getByLabel('Заметки').fill('Хочу обсудить проект');

    await page.getByRole('button', { name: 'Забронировать' }).click();

    await expect(page.getByText('Бронирование успешно!')).toBeVisible();
    await expect(page).toHaveURL(/\/public\/bookings\/.+/);
    await expect(page.getByText('Бронирование подтверждено')).toBeVisible();
    await expect(page.getByText('Иван Петров')).toBeVisible();
    await expect(page.getByText('ivan@example.com')).toBeVisible();
    await expect(page.getByText('Подтверждено', { exact: true })).toBeVisible();
  });

  test('SC-G-04: Просмотр подтверждения бронирования', async ({ page, request }) => {
    const { eventType } = await seedEventType(request, {
      name: 'Консультация 30 мин',
      durationMinutes: 30,
    });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const from = tomorrow.toISOString().split('T')[0] + 'T00:00:00Z';
    const to = tomorrow.toISOString().split('T')[0] + 'T23:59:59Z';

    const slots = await getSlots(request, eventType.id, from, to);
    const firstSlot = slots[0];

    const { booking } = await seedBooking(request, {
      slotId: firstSlot.id,
      guestName: 'Иван Петров',
      guestEmail: 'ivan@example.com',
      notes: 'Хочу обсудить проект',
    });

    await page.goto(`/public/bookings/${booking.id}`);
    await expect(page.getByText('Бронирование подтверждено')).toBeVisible();
    await expect(page.getByText('Иван Петров')).toBeVisible();
    await expect(page.getByText('ivan@example.com')).toBeVisible();
    await expect(page.getByText('Подтверждено', { exact: true })).toBeVisible();
  });
});
