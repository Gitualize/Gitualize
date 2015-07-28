describe('Gitualize', function() {

  describe('The general website', function() {

    it('should have a title', function() {
      browser.get('http://localhost:3000');
      expect(browser.getTitle()).toEqual('Gitualize');
    });

    it('should have tooltips in the navigation bar', function() {
      browser.get('http://localhost:3000');
    });

    it('GitHub icon should redirect to the GitHub repository', function() {
      browser.get('http://localhost:3000');
    });

    it('should display the navigation bar in the landing page', function() {
      browser.get('http://localhost:3000');
    });

    it('should display the navigation bar in the visualize page', function() {

    });

    it('should display the navigation bar in the landing page', function() {

    });

    it('should display the navigation bar in the about page', function() {

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

    it('should have instructions', function() {

    });

    it('should display tooltips', function() {

    });

  });


  describe('Visualize page', function() {

    it('should load the visualize page', function() {
      browser.get('http://localhost:3000/');
    });

    it('should display the committer ', function() {

    });

    it('should display the commit message', function() {

    });

    it('should display the directory tree', function() {

    });

    it('should display the folder view', function() {

    });

    it('display the correct paths', function() {

    });

    it('should display the playbar', function() {

    });

    it('should display the playbar options and info', function() {

    });

    it('should play and pause', function() {

    });

    it('speed-up and slow-down', function() {

    });

    it('rewind', function() {

    });

    it('should display Gitualize view', function() {

    });

    it('should see commit range in Gitualize view', function() {

    });

    it('should show correct files in a commit', function() {

    });

    it('should display correct color for file status', function() {

    });

    it('should display tooltips', function() {

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

