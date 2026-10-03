$(function () {
    const registerForm = $("#registerForm");

    registerForm.validate({
        rules: {
            full_name: {
                required: true,
                minlength: 2,
                maxlength: 80
            },
            email: {
                required: true,
                email: true,
                maxlength: 254
            },
            username: {
                required: true,
                minlength: 3,
                maxlength: 20
            },
            password: {
                required: true,
                minlength: 5,
                maxlength: 32
            },
            confirm_password: {
                required: true,
                minlength: 5,
                maxlength: 32,
                equalTo: "#register-password"
            }
        },
        messages: {
            full_name: {
                required: "Full name is required.",
                minlength: "Name must be at least 2 characters.",
                maxlength: "Name must not exceed 80 characters."
            },
            email: {
                required: "Email address is required.",
                email: "Please enter a valid email address.",
                maxlength: "Email must not exceed 254 characters."
            },
            username: {
                required: "Username is required.",
                minlength: "Username must be at least 3 characters.",
                maxlength: "Username must not exceed 20 characters."
            },
            password: {
                required: "Password is required.",
                minlength: "Password must be at least 5 characters.",
                maxlength: "Password must not exceed 32 characters."
            },
            confirm_password: {
                required: "Please confirm your password.",
                minlength: "Confirmation must be at least 5 characters.",
                maxlength: "Confirmation must not exceed 32 characters.",
                equalTo: "Passwords do not match."
            }
        },
        errorElement: "span",
        errorClass: "form-error",

        onkeyup: function (element) {
            this.element(element);

            if (element.name === "password") {
                const confirmation = $("#confirm-password")[0];
                if (confirmation && $(confirmation).val() !== "") {
                    this.element(confirmation);
                }
            }
        },
        onfocusout: function (element) {
            this.element(element);
        },

        submitHandler: function () {
            $("#registerStatus")
                .removeClass("form-error")
                .addClass("success-message status-message")
                .text("Registration details are valid! Your account is ready. Please log in with the static assessment account: admin / 12345.")
                .show();

            registerForm[0].reset();
            registerForm.validate().resetForm();
            registerForm.find("input").removeClass("valid error");
            return false;
        }
    });
});
