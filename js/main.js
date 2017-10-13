function Car() {
    this.id = "";
    this.make = "";
    this.model = "";
    this.year = "";
    this.color = "";
    this.vin = "";
    this.doors = "";
    this.price = "";
    this.trans = ""
    this.features= "";
    this.mileage = "";
    this.images = "";
    this.imageURLS = [];
    this.visible = true;
}

var allCars = [];
var origAllCars = [];
var searching = false;

var database = firebase.database();
var carsRef = database.ref('/cars/');
var storageRef = firebase.storage().ref();

$( document ).ready(function() {
    console.log( "Initialized!" );
    //pullAllCars();
    loadAllCars();
    searchTextBoxListener();
});



function showAllCars() {
    var carsContainer = $('.cars-container');
    carsContainer.html("");
    var carElement="";
    for(var carID in allCars){
        var car = allCars[carID];
        if(!car.visible) {
            continue;
        }
        carElement += "<div class=\"car-box\">";
        carElement += "                    <div class=\"row\">";
        carElement += "                        <div class=\"col s12\">";
        carElement += "                            <div class=\"card-panel waves-effect waves-orange\" onclick=\"viewCar('";
        carElement += carID;
        carElement += "')\">";
        carElement += "                                <div class=\"row\">";
        carElement += "                                    <div class=\"col s4 l2 m2\">";
        carElement += "                                        <img id=\"img-"+carID+"\" class=\"responsive-img circle card-image\" src=\"http:\/\/via.placeholder.com\/100x100\">";
        carElement += "                                    <\/div>";
        carElement += "                                    <div class=\"col s7 l9 m9\">";
        carElement += "                                        <p class=\"bold flow-text\">";
        carElement += "                                            "+car.year + " " +car.make + " " +car.model;
        carElement += "<br>";
        carElement += "                                            "+car.price;
        carElement += "                                        <\/p>";
        carElement += "                                        <p class=\"flow-text truncate\">";
        carElement += "                                          "+ car.features;
        carElement += "                                        <\/p>";
        carElement += "                                    <\/div>";
        carElement += "                                <\/div>";
        carElement += "                            <\/div>";
        carElement += "                        <\/div>";
        carElement += "                    <\/div>";
        carElement += "                <\/div>";
    }
    carsContainer.append(carElement);
    stopProgressBar();
}

function loadAllCars() {
    carsRef = database.ref('/cars/');
    carsRef.once('value').then(function(snapshot) {

        var carsData = snapshot.val();
        allCars = [];
        $.each(carsData, function(carID, carObject) {
            var car = new Car();
            car.id = carID;
            car.make = carObject["make"];
            car.model = carObject["model"];
            car.year = carObject["year"];
            car.color = carObject["color"];
            car.features = carObject["features"];
            car.images = carObject["images"];
            car.vin = carObject["vin"];
            car.doors = carObject["doors"];
            car.visible = carObject["visible"];
            car.price = carObject["price"];
            car.trans = carObject["trans"];
            car.mileage = carObject["mileage"];
            if(car.images){
                car.images = car.images.split(',');
            }
            Object.keys(car).forEach(function(key,index) {
                if(car[key] == undefined){
                    car[key] = "";
                }
            });
            allCars[carID] = car;
            origAllCars[carID] = car;
        });
        showAllCars();
        var counter = 0;
        for(var car in allCars){
            counter++;
        }
        loadPreLoadedCarImages();
        loadCarImages(0, counter);

    });

    function loadCarImages(position, counter) {
        var localPos = 0;
        for(var carID in allCars){
            if(position > counter) { break;}
            if(position > localPos){
                localPos++;
                continue;
            }
            var car = allCars[carID];
            if(car.images && !car.imageURLS[0]){
                storageRef.child('cars/'+car.id+'/'+car.images[0]).getDownloadURL().then(function(url) {
                    var img = document.getElementById('img-'+car.id);
                    img.src = url;
                    allCars[car.id].imageURLS[0] = url;
                    loadCarImages(++position, counter);
                    stopProgressBar();
                }).catch(function(error) {
                    console.log(error.message);
                });
                break;
            } else {
                loadCarImages(++position, counter);
            }
        }



    }
}

function loadPreLoadedCarImages(){
    for(var carID in allCars) {
        var car = allCars[carID];
        if(car.imageURLS){
            var img = document.getElementById('img-'+car.id);
            if(car.imageURLS[0]){
                img.src = car.imageURLS[0];
            } else {
                img.src = "http://via.placeholder.com/100x100";
            }
        }
    }
}

function viewCar(carID) {
    var car = allCars[carID];

    var carModal = $('.car-modal');
    carModal.html(""); // Clear Modal

    createModal();
    initializeModal();

    addImagesToModal();

    function createModal() {
        var carElements="";
        carElements += "<div id=\"";
        carElements += car.id;
        carElements += "\" class=\"modal modal-fixed-footer\">";
        carElements += "        <div class=\"modal-content\">";
        carElements += "                            <div class=\"modal-content modal-text\">";
        carElements += "                                <h5>";
        carElements += car.year + " " + car.make + " " + car.model;
        carElements += "<\/h5>";
        carElements += "                                <p class=\"flow-text\">";
        carElements += "                                    Doors: ";
        carElements += car.doors;
        carElements += "<br>";
        carElements += "                                    VIN: ";
        carElements += car.vin;
        carElements += "<br>";
        carElements += "                                    Color: ";
        carElements += car.color;
        carElements += "<br>";
        carElements += "                                    Mileage: ";
        carElements += car.mileage;
        carElements += "<br>";
        carElements += "                                    Transmission: ";
        carElements += car.trans;
        carElements += "<br>";
        carElements += "                                    Features: ";
        carElements += car.features;
        carElements += "                                <\/p>";
        carElements += "                            <div class=\"carousel carousel-slider car-images\" data-indicators=\"true\">";
        carElements += "                                <div class=\"carousel-fixed-item center white-text\" >";
        carElements += "                                    Click or Swipe to see the next images";
        carElements += "                                <\/div>";
        carElements += "";
        carElements += "";
        carElements += "";
        carElements += "                            <\/div>";
        carElements += "";
        carElements += "                            <\/div>";
        carElements += "";
        carElements += "";
        carElements += "                    <\/div>";
        carElements += "                    <div class=\"modal-footer\">";
        carElements += "                        <a href=\"#!\" class=\"modal-action modal-close waves-effect waves-green btn-flat left-align \">GO BACK<\/a>";
        carElements += "                        <a href=\"tel:+18138040555\" class=\"modal-action modal-close waves-effect waves-green btn-flat \">CALL<\/a>";
        carElements += "                    <\/div>";
        carElements += "                <\/div>";
        carModal.append(carElements);
    }

    function initializeModal() {
        var carModel = $('#'+car.id);
        $('.modal').modal();
        configureModalOptions();
        carModel.modal('open');
        function configureModalOptions() {
            var modal = $('.modal');
            modal.modal();
            carModel.modal({
                    dismissible: true, // Modal can be dismissed by clicking outside of the modal
                    opacity: .5, // Opacity of modal background
                    inDuration: 150, // Transition in duration
                    outDuration: 100, // Transition out duration
                    startingTop: '4%', // Starting top style attribute
                    endingTop: '10%', // Ending top style attribute
                    ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
                        //
                    },
                    complete: function() {
                        newFilesToAdd = [];
                    } // Callback for Modal close
                }
            );
        }
    }
    function addImagesToModal() {
        var carImages = $('.car-images');
            var i = 0;
            for(var carImage in car.images){
                storageRef.child('cars/'+car.id+'/'+car.images[carImage]).getDownloadURL().then(function(url, imageName) {
                    $('.carousel').carousel('destroy');
                    var anchorString="";
                    anchorString += "<a class=\"carousel-item\" href=\"#four!\"><img src=\"";
                    anchorString += url;
                    anchorString += "\"><\/a>";
                    carImages.append(anchorString);
                    $('.carousel.carousel-slider').carousel({fullWidth: true});
                }).catch(function(error) {
                    console.log(error.message);
                });
            }
        }
}

function goToNextImage() {
    $('.carousel').carousel('next');
}

function sanitizeInput(input) {
    return input.replace(/[&\/\\#,+() $~%'":*?<>{}]/g, '');
}

function stopProgressBar() {
    var progressBar = $('.progress');
    progressBar.addClass("invisible");
}

function startProgressBar() {
    var progressBar = $('.progress');
    progressBar.removeClass("invisible");
}

function searchTextBoxListener() {

    $('#search').on('input', function(){



        var searchText = $('#search').val();
        if(!searching) {
            searching = true;
        }

        if(!searchText && searching) {
            searching = false;
            allCars = origAllCars;
            showAllCars();
            loadPreLoadedCarImages();
            return;
        }

        var matchingCars = [];
        for(var carID in origAllCars) {
            searchText = sanitizeInput(searchText).toLowerCase();
            var car = origAllCars[carID];
            if(car.make.toLowerCase().indexOf(searchText) !== -1 ||
                car.model.toLowerCase().indexOf(searchText) !== -1 ||
                car.year.toLowerCase().indexOf(searchText) !== -1 ||
                car.color.toLowerCase().indexOf(searchText) !== -1
            ){
                matchingCars[carID] = car;
            }
        }

        allCars = matchingCars;
        showAllCars();
        loadPreLoadedCarImages();
    });
}
