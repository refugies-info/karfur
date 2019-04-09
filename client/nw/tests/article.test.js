module.exports = {
  '@disabled': false, 

  'article': function(browser) {
    return browser
      .url(browser.globals.url)
    .useXpath()
    .waitForElementVisible("//nav[@class='DesktopOnly']//a[@href='/articles']", browser.globals.timeout)
    .click("//nav[@class='DesktopOnly']//a[@href='/articles']")
    
      .waitForElementVisible("//a[normalize-space(text())='L’accueil des demandeurs d’asile']", browser.globals.timeout)
      .click("//a[normalize-space(text())='L’accueil des demandeurs d’asile']")
      .waitForElementVisible("//header[@class='Toolbar']//button[@class='dropdown-toggle btn btn-transparent' and ./i[@class='flag-icon flag-icon-fr']]", browser.globals.timeout)
      .click("//header[@class='Toolbar']//button[@class='dropdown-toggle btn btn-transparent' and ./i[@class='flag-icon flag-icon-fr']]")
      .waitForElementVisible("//button[@class='dropdown-item' and ./i[@id='af'] and contains(.,'پښتو')]/span", browser.globals.timeout)
      .click("//button[@class='dropdown-item' and ./i[@id='af'] and contains(.,'پښتو')]/span")
      .waitForElementVisible("//span[contains(@id,'tag-id-3')]", browser.globals.timeout)
      .moveToElement("//span[contains(@id,'tag-id-3')]", 0,0)
      .waitForElementVisible("//i[@id='edit-pencil-3']", browser.globals.timeout)
      .click("//i[@id='edit-pencil-3']")
      .waitForElementVisible("//div[contains(@class,'translation-modal')]//button[contains(text(),'Annuler')]", browser.globals.timeout)
      .assert.containsText("//div[@id='initialText']//span[@id='initial_9u2x6jtm3pf3r_9378147']", 'L’OFII est responsable du Premier accueil des demandeurs d’asile et gère le dispositif national d’accueil')
      .assert.containsText("//div[@id='translatedText']//span[@id='initial_9u2x6jtm3pf3r_9378147']", ' او د ملي استوګنې سیسټم اداره کوي')
      .click("//div[contains(@class,'translation-modal')]//button[contains(text(),'Annuler')]")
      .assert.containsText("//span[contains(@id,'tag-id-3')]", 'او د ملي استوګنې سیسټم اداره کوي')
      .end()
  },
  after: (browser) => {
      browser.end()
  }
};