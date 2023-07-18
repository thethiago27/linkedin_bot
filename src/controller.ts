import { Page } from 'puppeteer'

export class Controller {
  private page: Page

  constructor(page: Page) {
    this.page = page
  }

  public async queryInputAndType(
    selector: string,
    text: string,
  ): Promise<void> {
    await this.page.waitForSelector(selector)
    await this.page.type(selector, text)
  }

  public async queryAndClick(selector: string): Promise<void> {
    await this.page.waitForSelector(selector)
    await this.page.click(selector)
  }

  public async pressEnterKey(): Promise<void> {
    await this.page.keyboard.press('Enter')
  }
}
