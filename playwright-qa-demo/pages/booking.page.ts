import type { Locator, Page } from '@playwright/test';

/** POM owns interactions and locators; assertions stay in tests. */
export class BookingPage {
  readonly name: Locator;
  readonly date: Locator;
  readonly time: Locator;
  readonly submit: Locator;
  readonly result: Locator;

  constructor(private readonly page: Page) {
    this.name = page.getByRole('textbox', { name: 'Customer name' });
    this.date = page.getByLabel('Appointment slot');
    this.time = page.getByLabel('Time');
    this.submit = page.getByRole('button', { name: 'Book appointment' });
    this.result = page.getByRole('status');
  }

  async goto() { await this.page.goto('/'); }
  async book({ name, date, time }: { name: string; date: string; time: string }) {
    await this.name.fill(name);
    await this.date.fill(date);
    await this.time.selectOption(time);
    await this.submit.click();
  }
}
