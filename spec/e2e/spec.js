describe('Gitualize', function() {

  describe('The website in general', function() {

    it('should have the correct title', function() {
      browser.get('http://localhost:3000');
      expect(browser.getTitle()).toEqual('Gitualize');
    });

    it('GitHub icon should redirect to the GitHub repository', function(done) {
      browser.get('http://localhost:3000');

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

    it('should load the landing page', function() {
      
    });

    it('should have a functional repo inupt form', function() {

    });

    it('should redirect to loading page when input works', function() {

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

