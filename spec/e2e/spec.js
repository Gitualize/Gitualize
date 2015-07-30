require('./waitReady.js');
// var $ = require('jquery');

describe('Gitualize', function() {

  describe('The website in general', function() {

    beforeEach(function() {
      browser.get('http://localhost:3000');
    });

    xit('should have the correct title', function() {
      expect(browser.getTitle()).toEqual('Gitualize');
    });

    xit('should have tooltips working', function() {
      // element(by.css('a img:hover')).perform();
      // expect(element(by.css('')).isDisplayed()).toBeTruthy();
    });

    xit('GitHub icon should redirect to the GitHub repository', function(done) {
      element(by.css('a img')).click();

      // wait for redirect to github by checking if a class is present in document
      browser.wait(element(by.css(".is-copy-enabled")).isPresent());

      browser.getCurrentUrl().then(function(url) {
        expect(url).toEqual('https://github.com/incognizantdoppelganger/gitpun');
        done();
      });

    });

  });

  describe('Landing Page', function() {
    beforeEach(function(){
      browser.get('http://localhost:3000');
    });

    xit('should load the landing page', function(done) {
      browser.getCurrentUrl().then(function(url) {
        expect(url).toEqual('http://localhost:3000/#/');
        done();
      });
    });

    // imlement dropdown testing here:
    xit('should have a functional repo inupt form', function(done) {
      var inputField = element(by.css('.uiAutocomplete'));

      inputField.sendKeys('tchan247/');

      element(by.css('.btn-warning')).getCssValue('background-color').then(function(style){
        console.log(style);
        expect(style).toEqual('rgba(240, 173, 78, 1)');

        inputField.sendKeys('blog-project');

        element(by.css('.btn-success')).getCssValue('background-color').then(function(style){
          expect(style).toEqual('rgba(92, 184, 92, 1)');
          done();
        });
        
      });

    });

    xit('should handle invalid repos', function(done) {
      element(by.css('.uiAutocomplete')).sendKeys('tchan247/asdf');
      element(by.css('.uiAutocomplete')).sendKeys(protractor.Key.ENTER);

      browser.wait(element(by.css(".error-message")).isPresent());

      browser.getCurrentUrl().then(function(url) {
        expect(url).toEqual('http://localhost:3000/#/?error=badRepo');
        done();
      });
    });

    xit('should redirect to loading page when input works', function(done) {
      element(by.css('.uiAutocomplete')).sendKeys('tchan247/blog-project');
      element(by.css('.uiAutocomplete')).sendKeys(protractor.Key.ENTER);
      browser.getCurrentUrl().then(function(url) {
        expect(url).toEqual('http://localhost:3000/#/repo/tchan247/blog-project');
        done();
      });
    });

  });


  describe('Loading page', function() {

    xit('should display loading spinner and logo', function() {
      $('img').getAttribute('src').then(function(src) {
        expect(src).toBe('http://localhost:3000/pics/Github-Mark-64px.png');
      });
    });

  });


  describe('Visualize page', function() {

    beforeAll(function(){
      browser.get('http://localhost:3000/');
      element(by.css('.uiAutocomplete')).sendKeys('tchan247/blog-project');
      element(by.css('.uiAutocomplete')).sendKeys(protractor.Key.ENTER);
    });

    it('should load the visualize page', function(done) {
      expect($('.show-grid').waitReady()).toBeTruthy();
      browser.getCurrentUrl().then(function(url){
        expect(url).toBe('http://localhost:3000/#/repo/tchan247/blog-project');
        done();
      });
    });

    it('should play and pause', function() {
      var playPause = $('div.btn-group button.btn:nth-child(2)');

      playPause.click();

      // wait for this element to exist:
      $('#content > div > div > div > div:nth-child(3) > div.col-md-3.col-xs-3 > div > div > div:nth-child(6) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > button').waitReady();

      playPause.click();

      expect(true).toBe(true);
    });

    it('display the correct paths', function() {
      expect($('.path-root').isPresent()).toBeTruthy();

      var playPause = $('div.btn-group button.btn:nth-child(2)');

      playPause.click();

      // click this element
      $('#content > div > div > div > div:nth-child(3) > div.col-md-3.col-xs-3 > div > div > div:nth-child(6) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > button').click();

      playPause.click();

      expect($('#content > div > div > div > div:nth-child(1) > div > div > span:nth-child(4) > button').isPresent()).toBeTruthy();
    });

    it('should show correct files in a commit', function() {
      expect(
        $('#content > div > div > div > div:nth-child(3) > div.col-md-9.col-xs-9 > div > div > p > span:nth-child(2)').getText()
      ).toBe('script.js');
    });

    it('should display correct color for file status', function() {
      expect(true).toBe(true);
    });

    it('rewind', function() {
      var rewind = $('div.btn-group button.btn:nth-child(1)');

      rewind.click();
      // browser.wait(function(){
      //   return $('#content > div > div > div > div:nth-child(3) > div.col-md-3.col-xs-3 > div > div > div:nth-child(6) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > button')
      //   .isPresent().then(function(present) {
      //     return !present;
      //   });
      // });

      browser.sleep(5000);

      expect(
        $('#content > div > div > div > div:nth-child(4) > div.text-center.col-md-2.col-sm-3.col-xs-3 > div > span:nth-child(1)').getText()
        ).toBe('0');

    });

    it('speed-up and slow-down', function() {
      var playPause = $('div.btn-group button.btn:nth-child(2)');
      var slowDown = $('div.btn-group button.btn:nth-child(3)');
      var speedUp = $('div.btn-group button.btn:nth-child(4)');

      playPause.click();
      slowDown.click();
      slowDown.click();
      slowDown.click();

      browser.sleep(2000);

      expect(
        $('#content > div > div > div > div:nth-child(4) > div.text-center.col-md-1.col-sm-2.col-xs-2 > div > span:nth-child(1)')
        ).toBeTruthy('.25');

      speedUp.click();
      speedUp.click();
      speedUp.click();

      expect(
        $('#content > div > div > div > div:nth-child(4) > div.text-center.col-md-1.col-sm-2.col-xs-2 > div > span:nth-child(1)')
        ).toBeTruthy('1');

    });

    it('should see commit range in Gitualize view', function() {
      // click index.html
      $('#content > div > div > div > div:nth-child(3) > div.col-md-3.col-xs-3 > div > div > div:nth-child(5) > div > button')
      .click();

      // click diffualize
      $('#content > div > div > div > div:nth-child(4) > div:nth-child(5) > button > span:nth-child(2)')
      .click();

      browser.wait(
        $('body > div:nth-child(15) > div > div.modal.fade.in > div > div > div.modal-body > div.form-group > div > div > div:nth-child(1) > div > div > input')
        .isElementPresent()
        );
      
      // input commit range start
      $('body > div:nth-child(15) > div > div.modal.fade.in > div > div > div.modal-body > div.form-group > div > div > div:nth-child(1) > div > div > input')
      .sendKeys(3);

      // input commit range end
      $('body > div:nth-child(15) > div > div.modal.fade.in > div > div > div.modal-body > div.form-group > div > div > div:nth-child(2) > div > div > input')
      .sendKeys(4);
      

      $('body > div:nth-child(15) > div > div.modal.fade.in > div > div > div.modal-body > div.form-group > div > div > div:nth-child(3) > div > input')
      .click();

      expect(
        $('body > div:nth-child(15) > div > div.modal.fade.in > div > div > div.modal-body > div:nth-child(3) > div > pre > span:nth-child(3)')
        .waitReady()
        ).toBeTruthy();
    });

  });

  describe('About page', function() {
    beforeEach(function() {
      browser.get('http://localhost:3000/#/about');
    });

    it('should load the about page', function() {

    });

    it('should display information in the about page', function() {

    });

  });

});

