// spec.js
describe('Protractor Test for PussyCat', function () {
	it('should have a title', function () {
		browser.get("http://127.0.0.1:8080/");

		expect(browser.getTitle()).toEqual("Dashboard");
	});
});