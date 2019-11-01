# Google Calendar Cloud Function

A Firebase Cloud Function that adds a calendar event to a Google account's Calendar.

### OAuth2 

OAuth2 credentials for the user should be generated, along with the user's refresh token, should be saved in file called ```functions/credentials.json```. The contents of the file should be in the below format:
```
{
    "web": {
        "client_id":"CLIENT_ID.apps.googleusercontent.com",
        "project_id":"PROJECT_ID",
        "auth_uri":"https://accounts.google.com/o/oauth2/auth",
        "token_uri":"https://www.googleapis.com/oauth2/v3/token",
        "auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs",
        "client_secret":"CLIENT_SECRET",
        "redirect_uris":["https://developers.google.com/oauthplayground"]
    },
    "access_token": "ACCESS_TOKEN", 
    "scope": "https://www.googleapis.com/auth/calendar", 
    "token_type": "Bearer", 
    "expires_in": 3600, 
    "refresh_token": "REFRESH_TOKEN"
}
```

The credentials are generated in the Google Cloud Console and the details to how to generate your specific cloud function's credentials can be found in the more detailed article [here](https://medium.com/@smccartney09/integrating-firebase-cloud-functions-with-google-calendar-api-9a5ac042e869).

### Deploying the Cloud Function

Once the correct credentials are generated and stored in your project in the same directory as your ```index.js``` file, you can deploy your function in the cmd line by running the command ```firebase deploy --only functions``` in your project's root directory. This will deploy the cloud function ```addEventToCalendar``` with an HTTP endpoint.

NOTE: You may need to log in to your specific Firebase project using the ```firebase login``` command before deploying.

### Testing the Cloud Function

The easiest way to test that the cloud function is successfully deployed is to access your project's corresponding Google Cloud Console dashboard. There, you can access all Cloud Functions associated with your Firebase project with general information like the function's metadata/overview, HTTP endpoint, source code, and an area to test the endpoint.

In the ```Testing``` tab, set the triggering event to a JSON object similar to the following:
```
{
  "eventName": "Firebase Event",
  "description": "This is a sample description",
  "startTime": "2018-12-01T10:00:00",
  "endTime": "2018-12-01T13:00:00"
}
```

Clicking the ```Test the Function``` button will execute your Cloud Function with the above request body. If successful, you should receive a response similar to the following: 
```
{  
   "kind":"calendar#event",
   "etag":"ETAG",
   "id":"ID",
   "status":"confirmed",
   "htmlLink":"https://www.google.com/calendar/event?eid=EID",
   "created":"2018-10-13T16:00:12.000Z",
   "updated":"2018-10-13T16:00:12.436Z",
   "summary":"Firebase Event",
   "description":"This is a sample descriptio",
   "creator":{  
      "email":"YOUR_EMAIL@gmail.com",
      "displayName":"YOUR NAME",
      "self":true
   },
   "organizer":{  
      "email":"YOUR_EMAIL@gmail.com",
      "displayName":"YOUR NAME",
      "self":true
   },
   "start":{  
      "dateTime":"2018-12-01T10:00:00-04:00",
      "timeZone":"EST"
   },
   "end":{  
      "dateTime":"2018-12-01T13:00:00-04:00",
      "timeZone":"EST"
   },
   "iCalUID":"ICAL_UID@google.com",
   "sequence":0,
   "reminders":{  
      "useDefault":true
   }
}
```

With this successful response, you can begin using your Cloud Function in many different ways.
