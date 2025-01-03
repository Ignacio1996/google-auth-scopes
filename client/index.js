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
