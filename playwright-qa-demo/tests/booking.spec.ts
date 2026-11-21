import { test, expect } from '@playwright/test';
import { BookingPage } from '../pages/booking.page';

// Each test receives a fresh browser context and page. The sandbox state resets per page load.
test.describe('Appointment booking — deterministic sandbox', () => {
  test('QA-001 confirms a valid available appointment', async ({ page }) => {
    const booking = new BookingPage(page);
    await booking.goto();
    await booking.book({ name: 'Sample Customer', date: '2030-06-15', time: '11:00' });
    await expect(booking.result).toHaveText('Booking confirmed for Sample Customer');
  });

  test('QA-002 rejects an already booked time slot', async ({ page }) => {
    const booking = new BookingPage(page);
    await booking.goto();
    await booking.book({ name: 'Sample Customer', date: '2030-06-15', time: '10:00' });
    await expect(booking.result).toHaveText('This time slot is already booked');
  });

  test('QA-003 validates the required customer name', async ({ page }) => {
    const booking = new BookingPage(page);
    await booking.goto();
    await booking.book({ name: '', date: '2030-06-15', time: '11:00' });
    await expect(booking.result).toHaveText('Customer name is required');
  });

  test('QA-004 rejects a past appointment date', async ({ page }) => {
    const booking = new BookingPage(page);
    await booking.goto();
    await booking.book({ name: 'Sample Customer', date: '2020-01-01', time: '11:00' });
    await expect(booking.result).toHaveText('Appointment must be in the future');
  });
});
