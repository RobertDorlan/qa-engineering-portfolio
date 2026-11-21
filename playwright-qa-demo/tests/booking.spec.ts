import { test, expect } from '@playwright/test';
import { BookingPage } from '../pages/booking.page';

const available = { name: 'Sample Customer', date: '2030-06-15', time: '11:00' };
const occupied = { ...available, time: '10:00' };

// Each test receives a fresh browser context and page. The sandbox state resets per page load.
test.describe('Appointment booking — deterministic sandbox', () => {
  test('QA-001 confirms a valid available appointment', async ({ page }) => {
    const booking = new BookingPage(page);
    await booking.goto();
    await booking.book(available);
    await expect(booking.result).toHaveText('Booking confirmed for Sample Customer');
  });

  test('QA-002 rejects an already booked time slot', async ({ page }) => {
    const booking = new BookingPage(page);
    await booking.goto();
    await booking.book(occupied);
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
  test('QA-005 prevents a duplicate booking within the same session', async ({ page }) => {
    const booking = new BookingPage(page);
    await booking.goto();
    await booking.book(available);
    await expect(booking.result).toHaveText('Booking confirmed for Sample Customer');
    await booking.book({ ...available, name: 'Another Customer' });
    await expect(booking.result).toHaveText('This time slot is already booked');
  });

  test('QA-006 rejects whitespace-only customer names', async ({ page }) => {
    const booking = new BookingPage(page);
    await booking.goto();
    await booking.book({ ...available, name: '   ' });
    await expect(booking.result).toHaveText('Customer name is required');
  });

  test('QA-007 rejects an empty appointment date', async ({ page }) => {
    const booking = new BookingPage(page);
    await booking.goto();
    await booking.book({ ...available, date: '' });
    await expect(booking.result).toHaveText('Appointment must be in the future');
  });

  test('QA-008 validates the customer name before checking availability', async ({ page }) => {
    const booking = new BookingPage(page);
    await booking.goto();
    await booking.book({ ...occupied, name: '' });
    await expect(booking.result).toHaveText('Customer name is required');
  });

});
