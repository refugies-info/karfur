module.exports = {
  '@disabled': false,  

  'editeur': function(browser) {
    return browser
      .url(browser.globals.url)
   .useXpath()
      .waitForElementVisible("//nav[@class='DesktopOnly']//a[@href='/editeur']", browser.globals.timeout)
      .click("//nav[@class='DesktopOnly']//a[@href='/editeur']")
    .useCss()
      .waitForElementVisible("form input#username", browser.globals.timeout)
      .setValue("input#username", "Soufiane")
      .waitForElementVisible("form input#password", browser.globals.timeout)
      .setValue("input#password", "xxxxxx")
    .useXpath()
      .click("//button[@type='button' and normalize-space(text())='Se connecter']")

      .waitForElementVisible("//nav[@class='DesktopOnly']//a[@href='/editeur']", browser.globals.timeout)
      .click("//nav[@class='DesktopOnly']//a[@href='/editeur']")
      
      .waitForElementVisible("//div[@class='card-header']//input", browser.globals.timeout)
      .setValue("//div[@class='card-header']//input", "Bonjour gros")
      .setValue("//div[@class='DraftEditor-editorContainer']//div[contains(@class,'public-DraftEditor-content')]", "Hello")
      .assert.containsText("//div[@class='DraftEditor-editorContainer']//div[contains(@class,'public-DraftEditor-content')]", 'Hello')
      .end();
  },
  after: (browser) => {
      browser.end()
  }
};