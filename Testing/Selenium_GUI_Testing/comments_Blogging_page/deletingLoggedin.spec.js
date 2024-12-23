// Generated by Selenium IDE
const { Builder, By, Key, until } = require('selenium-webdriver')
const assert = require('assert')

describe('Deleting_Logged_in', function() {
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
  it('Deleting_Logged_in', async function() {
    await driver.get("http://localhost:5173/blog/blog-useTGxCeexDmgZwRlIJzzCT4")
    await driver.manage().window().setRect({ width: 1050, height: 652 })
    await driver.findElement(By.linkText("Sign In")).click()
    await driver.findElement(By.name("email")).sendKeys("siddhantg86@gmail.com")
    await driver.findElement(By.name("password")).sendKeys("Siddhant@186")
    await driver.findElement(By.id("formElement")).click()
    await driver.findElement(By.css(".mt-14")).click()
    await driver.findElement(By.css("div:nth-child(6) .w-full > .blog-title")).click()
    await driver.executeScript("window.scrollTo(0,0)")
    await driver.findElement(By.css(".flex:nth-child(10) .w-10:nth-child(3) > .fi")).click()
    await driver.findElement(By.css("div:nth-child(9) .p-2:nth-child(3)")).click()
    await driver.findElement(By.css(".flex-none > .w-full")).click()
    await driver.findElement(By.css(".object-cover")).click()
    await driver.findElement(By.css(".font-bold")).click()
  })
})
