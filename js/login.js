$( document ).ready(function() {
    console.log( "Initialized!" );

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            window.location.href = "admin.html";
        } else {
            // No user is signed in.
        }
    });
});


$(function() {
    function AttemptLogin() {
        var email = $('#email').val();
        var password = $('#password').val();



        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
            // Handle Errors here.
            updateErrorMessage(error);
        });

        function updateErrorMessage(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            if(error !== "") {
                $('#error-text').html(errorCode + ": <br>" + errorMessage);
            }
        }
    }

    $('#login-form').on("submit",function(e) {
        e.preventDefault();
        $('#error-text').html("");
        AttemptLogin();
    });
});
