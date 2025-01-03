const express = require("express");

const app = express();
const port = 8080;

require("dotenv").config();

// replacement for cors
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/authlink", async (req, res) => {
  generateAuthUrl()
    .then((authUrl) => {
      res.json({ authUrl: authUrl });
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to generate auth URL" });
    });
});

const generateAuthUrl = async () => {
  console.log("generating auth url");
  const scopes = [
    "profile",
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/drive",
  ];

  const baseUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const scopesString = scopes.join(" ");
  const accessType = "offline";
  const prompt = "consent";
  const responseType = "code";

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = "http://localhost:8080/redirect";
  const scope = scopesString;

  // make sure url has no spaces
  const url = `${baseUrl}?access_type=${accessType}&scope=${scope}&prompt=${prompt}&response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectUri}`;

  return url;
};

// Next code snippet will come here
app.get("/redirect", async (req, res) => {
  // Extract the code from the query parameters
  const code = req.query.code;

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code: req.query.code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_SECRET,
      redirect_uri: "http://localhost:8080/redirect",
      grant_type: "authorization_code",
    }),
  });

  const data = await response.json();
  const tokens = data;

  console.log("tokens :>> ", tokens.access_token);

  const url = "https://oauth2.googleapis.com/token&code=" + tokens.access_token;

  // navigate back to your client with the access token
  const redirectUrl = `http://localhost:3000/?token=${tokens.access_token}&refresh_token=${tokens.refresh_token}`;
  res.redirect(redirectUrl);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
