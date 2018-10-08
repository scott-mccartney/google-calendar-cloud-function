const functions = require('firebase-functions');
const {google} = require('googleapis');
const calendar = google.calendar('v3');

exports.getListOfCalendars = functions.https.onRequest((request, response) => {
    // calendar.calendarList.list();
    // response.send(calendar.calendarList.list());
    response.send('Hello from getListOfCalendars()');
});
