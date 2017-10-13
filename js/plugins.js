// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Initialize Firebase
var config = {
    apiKey: "AIzaSyD03Za6GovvRDDkYDiu59oFIFbtwsnh4h0",
    authDomain: "car-lot-js-website.firebaseapp.com",
    databaseURL: "https://car-lot-js-website.firebaseio.com",
    projectId: "car-lot-js-website",
    storageBucket: "gs://car-lot-js-website.appspot.com/",
    messagingSenderId: "416354068942"
};
firebase.initializeApp(config);

// Place any jQuery/helper plugins in here.
