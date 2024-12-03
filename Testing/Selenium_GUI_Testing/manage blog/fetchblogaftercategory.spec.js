// Generated by Selenium IDE
const { Builder, By, Key, until } = require('selenium-webdriver')
const assert = require('assert')

describe('fetch blog after category', function() {
  this.timeout(30000)
  let driver
  let vars
  beforeEach(async function() {
    driver = await new Builder().forBrowser('chrome').usingServer('http://localhost:4444/wd/hub').build()
    vars = {}
  })
  afterEach(async function() {
    await driver.quit();
  })
  it('fetch blog after category', async function() {
    // Test name: fetch blog after category
    // Step # | name | target | value | comment
    // 1 | open | https://connectco.netlify.app/ |  | 
    await driver.get("https://connectco.netlify.app/")
    // 2 | setWindowSize | 1398x792 |  | 
    await driver.manage().window().setRect({ width: 1398, height: 792 })
    // 3 | click | linkText=Sign In |  | 
    await driver.findElement(By.linkText("Sign In")).click()
    // 4 | click | name=email |  | 
    await driver.findElement(By.name("email")).click()
    // 5 | type | name=email | pareshpatel@gmail.com | 
    await driver.findElement(By.name("email")).sendKeys("pareshpatel@gmail.com")
    // 6 | type | name=password | Paresh123 | 
    await driver.findElement(By.name("password")).sendKeys("Paresh123")
    // 7 | click | css=.mt-14 |  | 
    await driver.findElement(By.css(".mt-14")).click()
    // 8 | click | css=.tag:nth-child(8) |  | 
    await driver.findElement(By.css(".tag:nth-child(8)")).click()
    // 9 | click | css=div:nth-child(2) > .flex > .w-full > .blog-title |  | 
    await driver.findElement(By.css("div:nth-child(2) > .flex > .w-full > .blog-title")).click()
    // 10 | click | css=.w-12 > .w-full |  | 
    await driver.findElement(By.css(".w-12 > .w-full")).click()
    // 11 | click | css=#root > div |  | 
    await driver.findElement(By.css("#root > div")).click()
    // 12 | doubleClick | css=#root > div |  | 
    {
      const element = await driver.findElement(By.css("#root > div"))
      await driver.actions({ bridge: true}).doubleClick(element).perform()
    }
    // 13 | click | css=.w-12 > .w-full |  | 
    await driver.findElement(By.css(".w-12 > .w-full")).click()
    // 14 | click | css=.text-left > .text-dark-grey |  | 
    await driver.findElement(By.css(".text-left > .text-dark-grey")).click()
    // 15 | close |  |  | 
    await driver.close()
  })
})