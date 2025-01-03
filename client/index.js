const login = async () => {
  const req = await fetch("http://localhost:8080/authLink", {
    method: "GET",
  });
  const data = await req.json();
  console.log("redirecting to ", data.authUrl);

  // Redirect to the authLink
  window.location.href = data.authUrl;
  document.getElementById("#login").innerHTML = "Logged in!";
};

const checkIfLoggedIn = async () => {
  console.log("Checking if logged in...");
  const { token } = useToken();
  if (token) {
    document.getElementById("login").innerHTML = "Logged in!";
    document.getElementsByClassName(
      "authenticated-container"
    )[0].style.display = "block";
  } else {
    document.getElementById("login").innerHTML = "Login";
  }
};

const useToken = () => {
  const token = new URLSearchParams(window.location.search).get("token");
  const refreshToken = new URLSearchParams(window.location.search).get(
    "refresh_token"
  );
  console.log("token :>> ", token, "refreshToken :>>", refreshToken);
  return { token, refreshToken };
};

// execute function on render
checkIfLoggedIn();

const createGoogleSpreadsheet = async () => {
  const { token } = useToken();
  const url = "https://sheets.googleapis.com/v4/spreadsheets";
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  // Spreadsheet properties
  const spreadsheetData = {
    properties: {
      title: "My New Spreadsheet",
    },
  };

  const request = await fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(spreadsheetData),
  });

  const data = await request.json();

  if (data.spreadsheetId) {
    console.log("spreadsheet created");
  } else {
    console.log("error creating spreadsheet");
  }
};

const getGoogleCalendarsList = async () => {
  const { token } = useToken();
  const url = "https://www.googleapis.com/calendar/v3/users/me/calendarList";
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const request = await fetch(url, {
    method: "GET",
    headers: headers,
  });

  const data = await request.json();

  if (data) {
    console.log("got calendars list", data);
  } else {
    console.log("error getting calendars list");
  }
};
