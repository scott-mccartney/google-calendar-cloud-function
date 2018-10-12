/*
 * A Firebase Cloud Function that uses Google OAuth2 to 
 * manage a Google user's calendar.
 * 
 * @Author: Scott McCartney
 * @Twitter: @skittlesMc9
 * @Github: https://github.com/scott-mccartney/google-calendar-cloud-function
 */
const {google} = require('googleapis');
const OAuth2 = google.auth.OAuth2; 
const calendar = google.calendar('v3');
const functions = require('firebase-functions');
const admin = require('firebase-admin');

const fs = require('fs'); 

const GOOGLE_CREDENTIALS_FILE_PATH = '../credentials.json';

admin.initializeApp(functions.config().firebase);

function addEvent(auth) {
    const response = calendar.events.insert({
        auth: auth,
        calendarId: 'primary',
        resource: {
          'summary': 'Event 3',
          'description': 'Sample description',
          'start': {
            'dateTime': '2018-11-11T14:00:00',
            'timeZone': 'EST',
          },
          'end': {
            'dateTime': '2018-11-11T15:00:00',
            'timeZone': 'EST',
          },
        },
      }, function(err, res) {
        if (err) {
          console.log('Error: ' + err);
          return;
        }
        console.log(res);
        return res;
      });

      return response;
}

function cloudFunction() {
    const googleCredentials = JSON.parse(fs.readFileSync(GOOGLE_CREDENTIALS_FILE_PATH));
    const oAuth2Client = new OAuth2(
        googleCredentials.web.client_id,
        googleCredentials.web.client_secret,
        googleCredentials.web.redirect_uris[0]
    );

    oAuth2Client.setCredentials({
        refresh_token: googleCredentials.refresh_token
    });
    addEvent(oAuth2Client);
}

cloudFunction();

// exports.addEventToCalendar = functions.https.onRequest((request, response) => {
//     admin.storage().bucket().getFiles('credentials.json').then(file => {
//         const googleCredentials = {};   // Read from Google Cloud Storage bucket
//         const oAuth2Client = new OAuth2(
//             googleCredentials.web.client_id,
//             googleCredentials.web.client_secret,
//             googleCredentials.web.redirect_uris[0]
//         );

//         oAuth2Client.setCredentials({
//             refresh_token: googleCredentials.refresh_token
//         });
//         addEvent(oAuth2Client).then(res => {
//             response.status(200).send(res);
//             return;
//         }).catch(err => {
//             response.send(500).send('Error adding event: ' + err.message);
//             console.log(err);
//             return;  
//         });
//         return;
//     }).catch(err => {
//         response.send(500).send('Error reading credentials: ' + err.message);
//         console.log(err);
//         return;
//     });
// });
