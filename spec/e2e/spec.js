require('./waitReady.js');

describe('Gitualize', function() {

  describe('The website in general', function() {

    beforeEach(function() {
      browser.get('http://localhost:3000');
    });

    it('should have the correct title', function() {
      expect(browser.getTitle()).toEqual('Gitualize');
    });

    it('GitHub icon should redirect to the GitHub repository', function(done) {
      $('#content > div > nav > div > ul > li > a > img').click();

      // wait for redirect to github by checking if a class is present in document
      browser.wait($(".is-copy-enabled").isPresent());

      browser.getCurrentUrl().then(function(url) {
        expect(url).toEqual('https://github.com/gitualize/gitualize');
        done();
      });

    });

  });
  

  describe('Landing Page', function() {
    beforeEach(function(){
      browser.get('http://localhost:3000');
    });

    it('should load the landing page', function() {
      browser.getCurrentUrl().then(function(url) {
        expect(url).toEqual('http://localhost:3000/#/');

        it('should display loading spinner and logo', function() {
          $('#content > div > div > img:nth-child(1)').getAttribute('src').then(function(src) {
            expect(src).toBe('http://localhost:3000/pics/octocat-spinner.svg');
          });

          $('#content > div > div > img:nth-child(3)').getAttribute('src').then(function(src) {
            expect(src).toBe('http://localhost:3000/pics/GitHub_Logo.png');
          });
        });

      });


    });

    // imlement dropdown testing here:
    it('should have a functional repo inupt form', function() {
      var inputField = $('#content > div > div > form > div:nth-child(1) > input');

      inputField.sendKeys('tchan247/');

      $('.btn-warning').getCssValue('background-color').then(function(style){
        expect(style).toEqual('rgba(240, 173, 78, 1)');

        inputField.sendKeys('blog-project');

        $('.btn-success').getCssValue('background-color').then(function(style){
          expect(style).toEqual('rgba(92, 184, 92, 1)');
        });
        
      });

    });

    it('should handle invalid repos', function(done) {
      $('.uiAutocomplete').sendKeys('tchan247/asdf');
      $('.uiAutocomplete').sendKeys(protractor.Key.ENTER);

      browser.wait($(".error-message").isPresent());

      browser.getCurrentUrl().then(function(url) {
        expect(url).toEqual('http://localhost:3000/#/?error=badRepo');
        done();
      });
    });

    it('should redirect to loading page when input works', function(done) {
      $('.uiAutocomplete').sendKeys('tchan247/blog-project');
      $('.uiAutocomplete').sendKeys(protractor.Key.ENTER);
      browser.getCurrentUrl().then(function(url) {
        expect(url).toEqual('http://localhost:3000/#/repo/tchan247/blog-project');
        done();
      });
    });

  });


  describe('Visualize page', function() {

    beforeAll(function(){
      browser.get('http://localhost:3000/');
      var inputField = $('#content > div > div > form > div:nth-child(1) > input');
      inputField.sendKeys('tchan247/blog-project');
      browser.sleep(1000);
      inputField.sendKeys(protractor.Key.ENTER);
    });

    it('should load the visualize page', function(done) {
      // additional waiting time for repo to load
      browser.sleep(7000);
      browser.wait($('#content > div > div > div > div:nth-child(3) > div.col-md-9.col-xs-9 > div').waitReady());
      browser.getCurrentUrl().then(function(url){
        expect(url).toBe('http://localhost:3000/#/repo/tchan247/blog-project');
        done();
      });
    });

    it('should play and pause', function() {
      // play
      $('#content > div > div > div > div:nth-child(4) > div.col-md-3.col-sm-4.col-xs-5 > div > div > button:nth-child(2)').click();

      // wait for javascript folder to appear
      var folder = $('#content > div > div > div > div:nth-child(3) > div.col-md-3.col-xs-3 > div > div > div:nth-child(6) > div > div:nth-child(3) > button');
      folder.waitReady();

      // pause
      $('#content > div > div > div > div:nth-child(4) > div.col-md-3.col-sm-4.col-xs-5 > div > div > button:nth-child(3)').click();

      expect(folder.getText()).toEqual('javascript');
    });

    it('display the correct paths', function() {
      // path root exists
      expect($('#content > div > div > div > div:nth-child(1) > div > div > button').isPresent()).toBeTruthy();
      
      // play
      $('#content > div > div > div > div:nth-child(4) > div.col-md-3.col-sm-4.col-xs-5 > div > div > button:nth-child(2) > span').click();

      // click this element
      $('#content > div > div > div > div:nth-child(3) > div.col-md-3.col-xs-3 > div > div > div:nth-child(6) > div > div:nth-child(3) > button').click();

      // pause
      $('#content > div > div > div > div:nth-child(4) > div.col-md-3.col-sm-4.col-xs-5 > div > div > button:nth-child(3) > span').click();

      // check if path is displayed correctly after going into folder
      expect($('#content > div > div > div > div:nth-child(1) > div > div > span:nth-child(4) > button').isPresent()).toBeTruthy();
    });

    it('should show correct files in a commit', function() {
      expect(
        $('#content > div > div > div > div:nth-child(3) > div.col-md-9.col-xs-9 > div > div > div:nth-child(2) > p > span:nth-child(2)').getText()
      ).toBe('script.js');
    });

    it('should display correct color for file status', function() {
      $('#content > div > div > div > div:nth-child(3) > div.col-md-9.col-xs-9 > div > div > div:nth-child(1) > div > button')
      .getCssValue('background-color').then(function(style){
        expect(style).toBe('rgba(154, 205, 50, 1)');
      });
    });

    // currently not working right now until we can check for elements removed
    xit('rewind', function() {
      // click rewind button
      $('#content > div > div > div > div:nth-child(4) > div.col-md-3.col-sm-4.col-xs-5 > div > div > button:nth-child(1) > span').click();

      browser.sleep(2000);
      expect(
        $('#content > div > div > div > div:nth-child(4) > div.text-center.col-md-2.col-sm-3.col-xs-3 > div > span:nth-child(1)').getText()
        ).toBe('0');

    });

    it('speed-up and slow-down', function() {
      browser.get('http://localhost:3000/#/repo/tchan247/blog-project');
      var slowDown = $('#content > div > div > div > div:nth-child(4) > div.col-md-3.col-sm-4.col-xs-5 > div > div > button:nth-child(4) > span');
      var speedUp = $('#content > div > div > div > div:nth-child(4) > div.col-md-3.col-sm-4.col-xs-5 > div > div > button:nth-child(5) > span');
      browser.wait($('#content > div > div > div > div:nth-child(4) > div.col-md-3.col-sm-4.col-xs-5 > div > div > button:nth-child(2) > span').waitReady());
      // click play button
      $('#content > div > div > div > div:nth-child(4) > div.col-md-3.col-sm-4.col-xs-5 > div > div > button:nth-child(2) > span').click();

      slowDown.click();
      slowDown.click();
      slowDown.click();

      expect(
        $('#content > div > div > div > div:nth-child(4) > div.text-center.col-md-1.col-sm-2.col-xs-2 > div > span:nth-child(1)')
        ).toBeTruthy('.25');

      speedUp.click();
      speedUp.click();
      speedUp.click();

      // temporary fix for making playbar reach end
      browser.sleep(15000);

      expect(
        $('#content > div > div > div > div:nth-child(4) > div.text-center.col-md-1.col-sm-2.col-xs-2 > div > span:nth-child(1)')
        .getText()
        ).toEqual('1');
    });

    it('should refresh the playbar', function() {
      browser.wait($('span.glyphicon-refresh').waitReady());

      $('span.glyphicon-refresh').click();

      expect(
          $('#content > div > div > div > div:nth-child(4) > div.text-center.col-md-2.col-sm-3.col-xs-3 > div > span:nth-child(1)')
          .getText()
        ).toBe('0');
    });

    // not sure why cannot get element containing 'index.html' in directory view
    xit('should see commit range in Gitualize view', function() {
      // click play button
      $('#content > div > div > div > div:nth-child(4) > div.col-md-3.col-sm-4.col-xs-5 > div > div > button:nth-child(2) > span').click();

      var index = $('#content > div > div > div > div:nth-child(3) > div.col-md-3.col-xs-3 > div > div > div:nth-child(5) > button');
      browser.wait(index.waitReady());

      // click pause button
      $('#content > div > div > div > div:nth-child(4) > div.col-md-3.col-sm-4.col-xs-5 > div > div > button:nth-child(3) > span').click();

      index.click();

      // click diffualize
      $('#content > div > div > div > div:nth-child(4) > div:nth-child(5) > button > span:nth-child(2)')
      .click();

      $('body > div:nth-child(6) > div > div.modal.fade.in > div > div').waitReady();

      browser.sleep(1000);
      
      // input commit range start
      $('body > div:nth-child(6) > div > div.modal.fade.in > div > div > div.modal-body > div > div > div > div:nth-child(1) > div > div > input')
      .sendKeys(3);

      // input commit range end
      $('body > div:nth-child(6) > div > div.modal.fade.in > div > div > div.modal-body > div > div > div > div:nth-child(2) > div > div > input')
      .sendKeys(4);
      
      // click diffualize button in modal
      $('body > div:nth-child(6) > div > div.modal.fade.in > div > div > div.modal-body > div > div > div > div:nth-child(3) > div > input')
      .click();

      expect(
        $('body > div:nth-child(15) > div > div.modal.fade.in > div > div > div.modal-body > div:nth-child(3) > div > pre > span:nth-child(3)')
        .waitReady()
        ).toBeTruthy();
    });

  });


  describe('About page', function() {
    beforeAll(function() {
      browser.get('http://localhost:3000/#/about');
    });

    it('should load the about page', function() {

      expect($('#content > div > div > p').isPresent()).toBeTruthy();
    });

  });

});

