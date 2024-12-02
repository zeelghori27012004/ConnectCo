// Generated by Selenium IDE
const { Builder, By, Key, until } = require('selenium-webdriver')
const assert = require('assert')

describe('Like_Not_Logged_in', function() {
  this.timeout(30000)
  let driver
  let vars
  beforeEach(async function() {
    driver = await new Builder().forBrowser('chrome').build()
    vars = {}
  })
  afterEach(async function() {
    await driver.quit();
  })
  it('Like_Not_Logged_in', async function() {
    await driver.get("http://localhost:5173/blog/flowerhv8HLFPJWh51cFZuLUI9f/")
    await driver.manage().window().setRect({ width: 1050, height: 652 })
    await driver.findElement(By.css("div:nth-child(4) .w-full > .blog-title")).click()
    await driver.executeScript("window.scrollTo(0,0)")
    {
      const element = await driver.findElement(By.css(".flex:nth-child(5) .w-10:nth-child(1) > .fi"))
      await driver.actions({ bridge: true }).moveToElement(element).clickAndHold().perform()
    }
    {
      const element = await driver.findElement(By.css(".flex:nth-child(5) .w-10:nth-child(1) > .fi"))
      await driver.actions({ bridge: true }).moveToElement(element).perform()
    }
    {
      const element = await driver.findElement(By.css(".flex:nth-child(5) .w-10:nth-child(1) > .fi"))
      await driver.actions({ bridge: true }).moveToElement(element).release().perform()
    }
    await driver.findElement(By.css(".flex:nth-child(5) > .gap-3")).click()
    await driver.findElement(By.css(".flex:nth-child(5) .w-10:nth-child(1) > .fi")).click()
  })
})