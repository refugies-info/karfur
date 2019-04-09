module.exports = {
  '@disabled': false,  

  'traduction': function(browser) {
    return browser
      .url(browser.globals.url)
    .useXpath()
      .waitForElementVisible("//a[@class='makeItRed' and normalize-space(text())='Se connecter']", browser.globals.timeout)
      .click("//a[@class='makeItRed' and normalize-space(text())='Se connecter']")
    .useCss()
      .waitForElementVisible("form input#username", browser.globals.timeout)
      .setValue("input#username", "Traducteur1")
      .waitForElementVisible("form input#password", browser.globals.timeout)
      .setValue("input#password", "xxxxxx")
    .useXpath()
      .click("//button[@type='button' and normalize-space(text())='Se connecter']")
      .waitForElementVisible("//nav[@class='DesktopOnly']//a[@href='/backend']", browser.globals.timeout)
      .click("//nav[@class='DesktopOnly']//a[@href='/backend']")
    .useCss()
      .waitForElementVisible(".DrawerToggle", browser.globals.timeout)
      .click(".DrawerToggle")
    .useXpath()
      .waitForElementVisible("//a[@href='/backend/user-dashboard']", browser.globals.timeout)
      .click("//a[@href='/backend/user-dashboard']",()=>{
        browser.expect.element("//div[@class='DrawerToggle']").to.be.visible
      })
      .waitForElementVisible("//div[@class='react-joyride__overlay']", browser.globals.timeout)
      .assert.elementNotPresent("//div[@class='Backdrop']")
      .click("//div[@id='react-joyride-step-0']//button[@title='Close']",()=>{
        browser.assert.elementPresent("//div[@id='react-joyride-step-1']")
      })
      .waitForElementVisible("//tr[contains(.,'Pachto')]//td[contains(.,'Voir les thèmes')]//button[1]", browser.globals.timeout)
      .click("//tr[contains(.,'Pachto')]//td[contains(.,'Voir les thèmes')]//button[1]")
      .waitForElementVisible("//tr[contains(.,'Les motifs de retrait de l')]/td[1]", browser.globals.timeout)
      .getLocationInView("//tr[contains(.,'accueil des demandeurs d’asile')]", (result)=> {
        browser.execute('scrollTo(' + result.value.x +', '+result.value.y+')')
        .click("//tr[contains(.,'Les motifs de retrait de l')]/td[1]")
      })
      //.moveToElement("//tr[contains(.,'accueil des demandeurs d’asile", 0,0)
      
      .waitForElementVisible("//div[contains(@class,'traduction-container')]//span[@id='target_9u2pdjtk39q6x_1320206']", 2*browser.globals.timeout)
      // .click("//div[contains(@class,'traduction-container')]//span[@id='target_9u2pdjtk39q6x_1320206']")
      // .setValue("//div[contains(@class,'traduction-container')]//span[@id='target_9u2pdjtk39q6x_1320206']", "Ceci est un test")
      // .getLocationInView("//div[contains(@class,'traduction-container')]//div[@id='title_texte_final']/h1", (result)=> {
      //   browser.execute('scrollTo(' + result.value.x +', '+result.value.y+')')
      //   .click("//div[contains(@class,'traduction-container')]//div[@id='title_texte_final']/h1")
      //   .keys('my cv text my cv text my cv text my cv text'.split(''))
      // })
      //.sendKeys("//div[contains(@class,'traduction-container')]//div[@id='title_texte_final']/h1", "t")
      // .keys('my cv text my cv text my cv text my cv text'.split(''))
      // .clearValue("//div[contains(@class,'traduction-container')]//div[@id='title_texte_final']/h1")
      // .setValue("//div[contains(@class,'traduction-container')]//div[@id='title_texte_final']/h1", "Test dans le titre")
      //.execute("document.querySelector('title_texte_final').innerText='yoplait'")
      .click("//div[@class='card-header-actions']/a[@href='#article-container']")
      .waitForElementVisible("//div[@class='container']//div[contains(@class,'post-title-block')]//h1", browser.globals.timeout)
      .assert.containsText("//div[@class='container']//div[contains(@class,'post-title-block')]//h1", 'ADA د وتلو لاملونه')
      .assert.containsText("//div[@id='rendered-article']//span[@id='target_9u2pdjtk39q6x_1320206']", 'نافذ پر 1 راغلل')
      .getLocationInView("//div[contains(@class,'traduction-container')]//button[contains(.,'Passer') and contains(@class,'btn-danger')]", (result)=> {
        browser.execute('scrollTo(' + result.value.x +', '+result.value.y+')')
        .click("//div[contains(@class,'traduction-container')]//button[contains(.,'Passer') and contains(@class,'btn-danger')]")
        .end();
      });
  },
  after: (browser) => {
      browser.end()
  }
};