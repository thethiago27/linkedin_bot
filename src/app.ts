import { Browser, launch, Page } from 'puppeteer'
import config from '../config.json'
import { Controller } from './controller'
import LoginError from './shared/error/types/login-error'

const App = async () => {
  const { LINKEDIN_URL, LINKEDIN_EMAIL, LINKEDIN_PASSWORD } = config

  const browser: Browser = await launch({
    headless: false,
    defaultViewport: null,
    // Pass HTTP headers to the browser instance. headerObj will overwrite
    // the default headers.
    args: [
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process',
    ],
  })

  const page: Page = await browser.newPage()
  await page.goto(LINKEDIN_URL)

  const controller = new Controller(page)

  await App.login(controller, LINKEDIN_EMAIL, LINKEDIN_PASSWORD)
  await App.search(controller)
  await page.waitForNavigation()
  await App.openMoreFilters(controller)
  await App.selectPeriod(controller)
}

App.search = async (controller: Controller) => {
  const JOBS_BUTTON_SELECTOR = '#global-nav > div > nav > ul > li:nth-child(3)'
  const JOBS_SEARCH_INPUT_SELECTOR = '[id^="jobs-search-box-keyword-id"]'
  const JOBS_SEARCH_LOCATION_SELECTOR = '[id^="jobs-search-box-location-id"]'

  await controller.queryAndClick(JOBS_BUTTON_SELECTOR)
  await controller.queryInputAndType(
    JOBS_SEARCH_INPUT_SELECTOR,
    'Software Engineer',
  )
  await controller.queryInputAndType(JOBS_SEARCH_LOCATION_SELECTOR, 'Brazil')

  await controller.pressEnterKey()
}

App.openMoreFilters = async (controller: Controller) => {
  try {
    const MORE_FILTERS_SELECTOR = 'div.relative.mr2'

    await controller.queryAndClick(MORE_FILTERS_SELECTOR)
  } catch (e) {
    console.log(e)
    throw new Error('Error while trying to open more filters')
  }
}

App.selectPeriod = async (controller: Controller) => {
  const SELECT_LAST_24_HOURS = '[id^="advanced-filter-timePostedRange-r86400"]'

  await controller.queryAndClick(SELECT_LAST_24_HOURS)
}

App.login = async (controller: Controller, email: string, password: string) => {
  try {
    const INPUT_EMAIL_SELECTOR = 'input[name="session_key"]'
    const INPUT_PASSWORD_SELECTOR = 'input[name="session_password"]'
    const BUTTON_SUBMIT_SELECTOR = 'button[type="submit"]'

    await controller.queryInputAndType(INPUT_EMAIL_SELECTOR, email)
    await controller.queryInputAndType(INPUT_PASSWORD_SELECTOR, password)
    await controller.queryAndClick(BUTTON_SUBMIT_SELECTOR)
  } catch (error) {
    throw new LoginError('Error while trying to login')
  }
}

App()
