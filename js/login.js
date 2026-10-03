$(function () {

    const VALID_USERNAME = "admin";
    const VALID_PASSWORD = "12345";


    const MAX_ATTEMPTS = 3;
    const LOCKOUT_SECONDS = 30;

    let failedAttempts = 0;
    let lockoutTimer = null;
    let remainingSeconds = 0;

    const loginForm = $("#loginForm");
    const loginButton = loginForm.find("button[type='submit']");
    const loginStatus = $("#loginStatus");

    const usernameInput = $("#login-username");
    const passwordInput = $("#login-password");

    function setStatus(message, type) {

        loginStatus
            .removeClass("form-error success-message status-message")
            .addClass(type + " status-message")
            .text(message)
            .show();
    }


    function clearStatus() {

        loginStatus
            .hide()
            .text("")
            .removeClass("form-error success-message status-message");
    }

    function startLockout() {

        remainingSeconds = LOCKOUT_SECONDS;

        // Disable login button
        loginButton
            .prop("disabled", true)
            .text(`Locked (${remainingSeconds}s)`);

        // Disable inputs while locked
        usernameInput.prop("disabled", true);
        passwordInput.prop("disabled", true);

        setStatus(
            `Too many incorrect login attempts. Please wait ${remainingSeconds} seconds.`,
            "form-error"
        );


        lockoutTimer = setInterval(function () {

            remainingSeconds--;

            if (remainingSeconds <= 0) {

                clearInterval(lockoutTimer);
                lockoutTimer = null;

                // Reset attempts after lockout
                failedAttempts = 0;

                // Enable form again
                loginButton
                    .prop("disabled", false)
                    .text("Login");

                usernameInput.prop("disabled", false);
                passwordInput.prop("disabled", false);

                clearStatus();

                return;
            }


            // Update countdown
            loginButton.text(`Locked (${remainingSeconds}s)`);

            setStatus(
                `Too many incorrect login attempts. Please wait ${remainingSeconds} seconds.`,
                "form-error"
            );

        }, 1000);
    }

    loginForm.validate({

        rules: {

            username: {
                required: true,
                minlength: 3,
                maxlength: 20
            },

            password: {
                required: true,
                minlength: 5,
                maxlength: 32
            }

        },


        messages: {

            username: {

                required: "Username is required.",

                minlength:
                    "Username must be at least 3 characters.",

                maxlength:
                    "Username must not exceed 20 characters."
            },


            password: {

                required:
                    "Password is required.",

                minlength:
                    "Password must be at least 5 characters.",

                maxlength:
                    "Password must not exceed 32 characters."
            }

        },


        // Use span elements for validation errors
        errorElement: "span",

        errorClass: "form-error",

        onkeyup: function (element) {

            this.element(element);

        },


        onfocusout: function (element) {

            this.element(element);

        },

        submitHandler: function (form) {

            // Prevent submission while locked
            if (lockoutTimer) {
                return false;
            }


            const username =
                $.trim($(form).find("[name='username']").val());

            const password =
                $(form).find("[name='password']").val();

            if (
                username === VALID_USERNAME &&
                password === VALID_PASSWORD
            ) {

                // Reset failed attempts
                failedAttempts = 0;

                // Store successful login session
                sessionStorage.setItem(
                    "wwLoggedIn",
                    "true"
                );

                sessionStorage.setItem(
                    "wwUsername",
                    username
                );


                // Go to homepage
                window.location.href = "homepage.html";

                return false;
            }


            failedAttempts++;

            const attemptsLeft =
                MAX_ATTEMPTS - failedAttempts;

            if (failedAttempts >= MAX_ATTEMPTS) {

                startLockout();

                return false;
            }

            setStatus(
                `Invalid username or password. ${attemptsLeft} attempt${attemptsLeft === 1 ? "" : "s"} remaining.`,
                "form-error"
            );


            return false;
        }

    });

    loginForm.on(
        "input",
        "input",
        function () {

            if (lockoutTimer) {
                return;
            }


            loginForm.validate().element(this);

            if (
                loginStatus.hasClass("form-error") &&
                $(this).hasClass("error")
            ) {
                return;
            }


            clearStatus();
        }
    );

});
