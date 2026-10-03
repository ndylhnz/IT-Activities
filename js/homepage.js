$(function () {
    const loggedIn = sessionStorage.getItem("wwLoggedIn") === "true";

    // The landing page is protected by the successful login session.
    if (!loggedIn) {
        window.location.replace("index.html");
        return;
    }

    const username = sessionStorage.getItem("wwUsername") || "user";
    $("#welcomeMessage").text("Welcome, " + username + "!");

    $("#logoutLink").on("click", function (event) {
        event.preventDefault();
        sessionStorage.removeItem("wwLoggedIn");
        sessionStorage.removeItem("wwUsername");
        window.location.href = "index.html";
    });
});
