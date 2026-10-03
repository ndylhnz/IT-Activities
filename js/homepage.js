$(function () {

    const loggedIn = sessionStorage.getItem("wwLoggedIn") === "true";
    const username = sessionStorage.getItem("wwUsername");

    const welcomeMessage = $("#welcomeMessage");

    if (loggedIn && username) {
        welcomeMessage.text("Welcome, " + username + "!");
    } else {
        welcomeMessage.text("Welcome to Wuthering Waves!");
    }

    $("#logoutLink").on("click", function (event) {
        event.preventDefault();

        sessionStorage.removeItem("wwLoggedIn");
        sessionStorage.removeItem("wwUsername");

        window.location.href = "index.html";
    });
});
