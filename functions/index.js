const {google} = require('googleapis');
const OAuth2Client = google.auth.OAuth2; 
// const calendar = google.calendar('v3');
const functions = require('firebase-functions');

const fs = require('fs'); 
const readline = require('readline'); 
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly']; 
const TOKEN_PATH = './credentials.json';

exports.getListOfCalendars = functions.https.onRequest((request, response) => {
    const credentials = readCredentials();
    console.log('Credentials');
    console.log(credentials);

    const data = authorize(credentials, listEvents);

    if (!data) {
        response.status(500).send('Got here before authenticating');
    } else {
        response.status(200).send(data);
    }
});

function readCredentials() {
    try {   
        const content = fs.readFileSync('client_secret.json');  
        return JSON.parse(content); 
    } catch (err) {   
        return console.log('Error loading client secret file:', err); 
    }
}

function authorize(credentials, callback) {   
    const {client_secret, client_id, redirect_uris} = credentials.web;   
    let token = {};   
    const oAuth2Client = new OAuth2Client(client_id, client_secret, redirect_uris[0]);

      // Check if we have previously stored a token.   
    try {
        token = fs.readFileSync(TOKEN_PATH);   
    } catch (err) {
        return getAccessToken(oAuth2Client, callback);   
    }   
    oAuth2Client.setCredentials(JSON.parse(token));   
    callback(oAuth2Client); 
}

function getAccessToken(oAuth2Client, callback) {   
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,   
    });   
    console.log('Authorize this app by visiting this url:', authUrl);   
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,   
    });   
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return callback(err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            try {
                fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
                console.log('Token stored to', TOKEN_PATH);
            } catch (err) {
                console.error(err);
            }
        callback(oAuth2Client);
        });   
    }); 
}

function listEvents(auth) {   
    const calendar = google.calendar({version: 'v3', auth});   
    calendar.events.list({
        calendarId: 'primary',
        timeMin: (new Date()).toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',   
    }, (err, {data}) => {
        if (err) return console.log('The API returned an error: ' + err);
        
        const events = data.items;
        if (events.length) {
            return events;      
        } else {
          console.log('No upcoming events found.');
          return 'No events but success';
        }   
    });
} 