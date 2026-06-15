import { test, expect, resetStore, seedEventType } from '../fixtures';

test.describe('SC-A: Админский поток — Happy Path', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ request }) => {
    await resetStore(request);
  });

  test('SC-A-02: Создание типа события', async ({ page }) => {
    await page.goto('/admin/event-types/new');
    await expect(page.getByText('Новый тип события')).toBeVisible();

    await page.getByLabel('Название').fill('Встреча 1 час');
    await page.getByLabel('Описание').fill('Командная встреча');
    await page.getByLabel('Длительность (минуты)').fill('60');

    await page.getByRole('button', { name: 'Создать' }).click();

    await expect(page).toHaveURL(/\/admin\/event-types/);
    await expect(page.getByText('Встреча 1 час')).toBeVisible();
    await expect(page.getByText('Командная встреча')).toBeVisible();
    await expect(page.getByText('60').first()).toBeVisible();
  });

  test('SC-A-03: Редактирование типа события', async ({ page, request }) => {
    const { eventType } = await seedEventType(request, {
      name: 'Консультация 30 мин',
      durationMinutes: 30,
    });

    await page.goto(`/admin/event-types/${eventType.id}/edit`);
    await expect(page.getByText('Редактирование типа события')).toBeVisible();

    await page.getByLabel('Название').fill('Обновленная консультация');
    await page.getByRole('button', { name: 'Сохранить' }).click();

    await expect(page).toHaveURL(/\/admin\/event-types/);
    await expect(page.getByText('Обновленная консультация')).toBeVisible();
  });
});
