# Shadertoy Desktop
A desktop viewer and renderer for Shadertoy.

# Setting up
Step 1: Clone the repo and install the dependancies.
```shell
$ git clone <repo url>
$ npm install
```

Step 2: Attain a Shadertoy API key.

1. Create (or log into) a Shadertoy account.
2. Go to https://www.shadertoy.com/myapps/.
3. Create a new app.
4. Copy the 'App Key'.
5. Execute the command ```$ echo '{ "apiKey": "< KEY >" }' >> api-key.json```, replacing < KEY > with your app key.

Step 3: Launch the application.
```shell
$ npm start
```