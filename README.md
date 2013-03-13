Synopsis
========

JsAddressBook is a JavaScript application to demonstrate advanced
JavaScript features without advanced JavaScript frameworks.

The application demonstrates:
* Server sent events
* Local storage
* Offline support
* Basic responsive design (TODO)
* TODO: Server restart without losing data

A simple demonstration of the application would be:

1. Install Node JS from http://nodejs.org (only first time)
2. On the command line, start the application with "node server.js"
3. Open Firefox and go to http://localhost:1337
4. Validate that there is a list of addresses
5. Enter a new address and press add
6. Verify that the new address shows up (BUG: This is delayed because of the setInterval used to post data to the server)
7. Open Chrome and go to http://localhost:1337
8. Verify that the same people show in both browsers
9. Add a person in Chrome
10. Verify that the person is showed in Firefox
11. STOP THE SERVER
12. Refresh both browsers, verify that they still show the data
13. Add a person in Chrome, verify that there is an error message
14. RESTART THE SERVER
15. Verify that the new person shows up in both browsers automatically
16. Verify that the list of people remains after refreshing
17. Verify that the list of people remains after clearing the browser cache


What you can add during the workshop:
* Offline search capabilities
* Use sammyjs for bookmarkable search
* Use jQuery for updating document and AJAX calls
* Use amplify.js instead of ServerSentEvents
* Use KnockoutJs or backbone.js for the page structure
* Use Jasmine to test the application
