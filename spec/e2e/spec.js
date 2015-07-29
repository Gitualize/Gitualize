describe('Gitualize', function() {

  describe('The website in general', function() {

    beforeEach(function() {
      browser.get('http://localhost:3000');
    });

    it('should have the correct title', function() {
      expect(browser.getTitle()).toEqual('Gitualize');
    });

    it('should have tooltips working', function() {
    });

    it('GitHub icon should redirect to the GitHub repository', function(done) {
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

    it('should load the landing page', function(done) {
      browser.getCurrentUrl().then(function(url) {
        expect(url).toEqual('http://localhost:3000/#/');
        done();
      });
    });

    // imlement dropdown testing here:
    it('should have a functional repo inupt form', function(done) {
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

    it('should redirect to loading page when input works', function(done) {
      element(by.css('.uiAutocomplete')).sendKeys(protractor.Key.ENTER);
      browser.wait(element(by.css(".is-copy-enabled")).isPresent());

      browser.getCurrentUrl().then(function(url) {
        expect(url).toEqual('http://localhost:3000/#/repo/tchan');
        done();
      });

    });

    it('should handle invalid repos', function(done) {
      element(by.css('.uiAutocomplete')).sendKeys('tchan247/asdf');
      element(by.css('.uiAutocomplete')).sendKeys(protractor.Key.ENTER);

      browser.wait(element(by.css(".error-message")).isPresent());

      browser.getCurrentUrl().then(function(url) {
        expect(url).toEqual('http://localhost:3000/#/?error=badRepo');
        done();
      });
    });

  });


  describe('Visualize page', function() {

    it('should load the visualize page', function() {
      browser.get('http://localhost:3000/');
    });

    it('display the correct paths', function() {

    });

    it('should display the playbar', function() {

    });

    it('should play and pause', function() {

    });

    it('rewind', function() {

    });

    it('speed-up and slow-down', function() {

    });

    it('should see commit range in Gitualize view', function() {

    });

    it('should show correct files in a commit', function() {

    });

    it('should display correct color for file status', function() {

    });

  });


  describe('Loading page', function() {

    it('should display the loading page', function() {
      browser.get('http://localhost:3000/');
    });

    it('should display loading spinner and logo', function() {

    });

    it('should redirect to visualize once repo is loaded', function() {

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

