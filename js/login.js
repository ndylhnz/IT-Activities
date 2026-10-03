$(function () {
    // Static credentials required by the jQuery assessment.
    const VALID_USERNAME = "admin";
    const VALID_PASSWORD = "12345";

    // Login lockout: the counter exists only while this page is open.
    // Reloading the page resets failedAttempts, as requested.
    const MAX_ATTEMPTS = 3;
    const LOCKOUT_SECONDS = 30;
    let failedAttempts = 0;
    let lockoutTimer = null;
    let remainingSeconds = 0;

    // If already authenticated, go directly to the protected homepage.
    if (sessionStorage.getItem("wwLoggedIn") === "true") {
        window.location.replace("homepage.html");
        return;
    }

    const loginForm = $("#loginForm");
    const loginButton = loginForm.find("button[type='submit']");
    const loginStatus = $("#loginStatus");

    function setStatus(message, type) {
        loginStatus
            .removeClass("form-error success-message status-message")
            .addClass(type + " status-message")
            .text(message)
            .show();
    }

    function startLockout() {
        remainingSeconds = LOCKOUT_SECONDS;
        loginButton.prop("disabled", true).text(`Locked (${remainingSeconds}s)`);
        $("#login-username, #login-password").prop("disabled", true);

        setStatus(
            `Too many failed login attempts. Please wait ${remainingSeconds} seconds.`,
            "form-error"
        );

        lockoutTimer = setInterval(function () {
            remainingSeconds--;

            if (remainingSeconds <= 0) {
                clearInterval(lockoutTimer);
                lockoutTimer = null;
                failedAttempts = 0;
                loginButton.prop("disabled", false).text("Login");
                $("#login-username, #login-password").prop("disabled", false);
                setStatus("You can try logging in again.", "success-message");
                return;
            }

            loginButton.text(`Locked (${remainingSeconds}s)`);
            setStatus(
                `Too many failed login attempts. Please wait ${remainingSeconds} seconds.`,
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
                minlength: "Username must be at least 3 characters.",
                maxlength: "Username must not exceed 20 characters."
            },
            password: {
                required: "Password is required.",
                minlength: "Password must be at least 5 characters.",
                maxlength: "Password must not exceed 32 characters."
            }
        },
        errorElement: "span",
        errorClass: "form-error",

        // Validate while the user types so minimum/maximum and format
        // feedback appears immediately instead of waiting for Submit.
        onkeyup: function (element) {
            this.element(element);
        },
        onfocusout: function (element) {
            this.element(element);
        },

        submitHandler: function (form) {
            if (lockoutTimer) {
                return false;
            }

            const username = $.trim($(form).find("[name='username']").val());
            const password = $(form).find("[name='password']").val();

            if (username === VALID_USERNAME && password === VALID_PASSWORD) {
                failedAttempts = 0;
                sessionStorage.setItem("wwLoggedIn", "true");
                sessionStorage.setItem("wwUsername", username);
                window.location.href = "homepage.html";
                return false;
            }

            failedAttempts++;
            const attemptsLeft = MAX_ATTEMPTS - failedAttempts;

            if (failedAttempts >= MAX_ATTEMPTS) {
                startLockout();
            } else {
                setStatus(
                    `Invalid username or password. ${attemptsLeft} attempt${attemptsLeft === 1 ? "" : "s"} remaining.`,
                    "form-error"
                );
            }

            return false;
        }
    });

    // Keep credential errors visible while the user types so jQuery Validation
    // can replace them immediately with the correct field-level message.
    loginForm.on("input", "input", function () {
        if (!lockoutTimer) {
            // Re-run validation immediately for the field being edited.
            loginForm.validate().element(this);
            // Clear the previous submit-level credential message.
            if (loginStatus.hasClass("form-error") && !$(this).hasClass("error")) {
                loginStatus.hide().text("").removeClass("form-error success-message status-message");
            }
        }
    });
});
