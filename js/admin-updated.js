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
    this.firstImage = "";
    this.time = 0;
    this.firstImageURL = "";
    this.imageURLS = [];
    this.visible = true;
}
var allCars = [];
var origAllCars = [];
var searching = false;

var database = firebase.database();
var storageRef = firebase.storage().ref();
var carsRef = database.ref('/cars/');
var newFilesToAdd = [];

function stopProgressBar() {
    var progressBar = $('.progress');
    progressBar.addClass("invisible");
}

function startProgressBar() {
    var progressBar = $('.progress');
    progressBar.removeClass("invisible");
}

function sanitizeInput(input) {
    return input.replace(/[&\/\\#,+() $~%'":*?<>{}]/g, '');
}

function searchTextBoxListener() {

    $('#search').on('input', function(){



        var curSearch = $('#search').val();
        if(curSearch.length < 3) {
            allCars = origAllCars;
            searching = false;
            showAllCars();
        } else {
            searching = true;
            searchForCar(curSearch);
        }
    });
}

function forceSearch() {
    var curSearch = $('#search').val();
    searching = true;
    searchForCar(curSearch);
}

function searchForCar(searchText) {
    searchText = searchText.toUpperCase();
    var carsRef = database.ref('/cars/');
    var searchMake = carsRef.orderByChild('make')
        .startAt(searchText)
        .endAt(searchText+"\uf8ff");
    var searchModel = carsRef.orderByChild('model')
        .startAt(searchText)
        .endAt(searchText+"\uf8ff");
    var searchYear = carsRef.orderByChild('year')
        .startAt(searchText)
        .endAt(searchText+"\uf8ff");
    var searchColor = carsRef.orderByChild('color')
        .startAt(searchText)
        .endAt(searchText+"\uf8ff");

    allCars = [];
    searchMake.once('value').then(function (snapshot) {
        var carsData = snapshot.val();
        $.each(carsData, function(carID, carObject) {
            parseCarDataItem(carID, carObject);
        });
        showAllCars();
    });
    searchModel.once('value').then(function (snapshot) {
        var carsData = snapshot.val();
        $.each(carsData, function(carID, carObject) {
            parseCarDataItem(carID, carObject);
        });
        showAllCars();
    });
    searchYear.once('value').then(function (snapshot) {
        var carsData = snapshot.val();
        $.each(carsData, function(carID, carObject) {
            parseCarDataItem(carID, carObject);
        });
        showAllCars();
    });
    searchColor.once('value').then(function (snapshot) {
        var carsData = snapshot.val();
        $.each(carsData, function(carID, carObject) {
            parseCarDataItem(carID, carObject);
        });
        showAllCars();
    });
}


$( document ).ready(function() {
    console.log( "Initialized!" );
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            allCars = [];
            allCarsListener();
            searchTextBoxListener();
            //$('.modal').modal()
            //$('#modal1').modal('open')
        } else {
            window.location.href = "login.html";
        }
    });
});

function logOut() {
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
    }).catch(function(error) {
        // An error happened.
    });
}


function allCarsListener() {


    carsRef = database.ref('/cars/');
    carsRef.orderByChild("time").limitToLast(41).on('value', function(snapshot) {
        if(searching)
            return;

        var carsData = snapshot.val();
        $.each(carsData, function(carID, carObject) {
            parseCarDataItem(carID, carObject);
        });

        allCars = allCars.sort();

        origAllCars = allCars;
        showAllCars();
    });


}


function getCarFirstImage(carid, imageName, carCount) {
    if(imageName == null || imageName == "") return;
    storageRef.child('cars/'+carid+'/'+imageName).getDownloadURL().then(function(url) {
        var currentRow = $('#car-' + carCount);
        currentRow.find("td.imgpreview img").attr("src", url);
        allCars[carid].firstImageURL = url;
    }).catch(function(error) {
        console.log(error.message);
    });
}

function parseCarDataItem(carID, carObject) {
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
    car.firstImage = carObject["firstImage"];
    car.time = carObject["time"];
    car.mileage = carObject["mileage"];
    if(car.images){
        car.images = car.images.split(',');
    }

    if(car.firstImage == "") {
        car.firstImage = car.images[0];
    }

    Object.keys(car).forEach(function(key,index) {
        if(car[key] == undefined){
            car[key] = "";
        }
    });
    allCars[carID] = car;
}


function showAllCars() {
    var counter = 0;
    var currentRow;
    var car;
    for(var carID in allCars){
        car = allCars[carID];

        if(!car.visible) {
            continue;
        }

        currentRow = $('#car-' + counter);
        currentRow.removeClass('grey lighten-3');
        currentRow.attr("onclick","editCar('"+car.id+"')");
        currentRow.children("td.make").html(car.make);
        currentRow.children("td.model").html(car.model);
        currentRow.children("td.year").html(car.year);
        currentRow.children("td.color").html(car.color);
        getCarFirstImage(carID,car.firstImage, counter);
        counter ++;
    }

    for(var carID in allCars) {
        car = allCars[carID];
        if(car.visible) {
            continue;
        }
        currentRow = $('#car-' + counter);
        currentRow.addClass('grey lighten-3');
        currentRow.attr("onclick","editCar('"+car.id+"')");
        currentRow.children("td.make").html(car.make);
        currentRow.children("td.model").html(car.model);
        currentRow.children("td.year").html(car.year);
        currentRow.children("td.color").html(car.color);
        getCarFirstImage(carID,car.firstImage, counter);
        counter ++;
    }
    while(counter < 41) {
        currentRow = $('#car-' + counter);
        currentRow.removeClass('grey lighten-3');
        currentRow.attr("onclick","");
        currentRow.children("td.make").html("");
        currentRow.children("td.model").html("");
        currentRow.children("td.year").html("");
        currentRow.children("td.color").html("");
        currentRow.children("td.imgpreview").html("");
        counter ++;
    }

    stopProgressBar();
}




function addChip() {
    var input = $('#file-upload');
    document.getElementById("fileUploadForm").reset();
    input.change(function(e){
        //Get files
        var chipImageElement="";
        var chipImages = $('.car-chip-images');
        for (var i = 0; i < e.target.files.length; i++) {
            var fileName = e.target.files[i];
            newFilesToAdd.push(fileName);
            var idNumber = Math.floor((Math.random() * 100) + 1);
            chipImageElement += "<div class=\"chip " +idNumber +"\" id=\"";
            chipImageElement += fileName.name;
            chipImageElement += "\">";
            chipImageElement += "                            <img src=\"http:\/\/via.placeholder.com\/25x25\">";
            chipImageElement += fileName.name;
            chipImageElement += "                            <i class=\"delete material-icons\" onclick=\"deleteImage('";
            chipImageElement += idNumber;
            chipImageElement += "')\">close<\/i>";
            chipImageElement += "                        <\/div>";
        }
        input.off();
        chipImages.append(chipImageElement);
    });
    input.type = 'file';
    input.multiple = true;
    input.accept = "\"image/*\"";
    input.click();

}



function editCar(carID) {
    var isNewCar = false;
    var car;


    $('.modal-section').html(""); // Clear Modal
    checkNewCar();
    createModal();
    initializeModal();

    addChipsFromDatabase();

    function addImageInChip() {
            var i = 0;
           var chipImage = $('.car-chip-images').find("img");
            if(car.images){
                asyncLoop(0);
            }
            function asyncLoop(i) {
                if(i > car.images.length-1){return;}
                storageRef.child('cars/'+car.id+'/'+car.images[i]).getDownloadURL().then(function(url, imageName) {
                    var imageName = car.images[i];
                    chipImage[i].src = url;
                    return asyncLoop(++i);
                }).catch(function(error) {
                    console.log(error.message);
                });
            }
    }

    addImageInChip();



    function checkNewCar() {
        if(carID == undefined){
            isNewCar = true;
            car = new Car();
            car.id = "newCarID";
        } else {
            car = allCars[carID];
        }
    }



    function createModal() {
        var carElements="";
        carElements += "<div id=\"";
        carElements += car.id;
        carElements += "\" class=\"modal\">";
        carElements += "        <div class=\"modal-content\">";
        carElements += "            <h4>";
        if(isNewCar){
            carElements += "Submit new car";
        } else {
            carElements += car.year +" " + car.make + " " +car.model;
        }
        carElements += "            <\/h4>";
        carElements += "            <div class=\"row\">";
        carElements += "                <form class=\"col s12\">";
        carElements += "";
        carElements += "                    <div class=\"row\">";
        carElements += "                        <div class=\"input-field col s12 m6 l3\">";
        carElements += "                            <input value=\"";
        carElements += car.year;
        carElements += "\" id=\"year\" type=\"text\" class=\"validate\">";
        carElements += "                            <label for=\"year\">Year<\/label>";
        carElements += "                        <\/div>";
        carElements += "                        <div class=\"input-field col s12 m6 l3\">";
        carElements += "                            <input value=\"";
        carElements += car.make;
        carElements += "\" id=\"make\" type=\"text\" class=\"validate\">";
        carElements += "                            <label for=\"make\">Make<\/label>";
        carElements += "                        <\/div>";
        carElements += "                        <div class=\"input-field col s12 m6 l3\">";
        carElements += "                            <input value=\"";
        carElements += car.model;
        carElements += "\" id=\"model\" type=\"text\" class=\"validate\">";
        carElements += "                            <label for=\"model\">Model<\/label>";
        carElements += "                        <\/div>";
        carElements += "                        <div class=\"input-field col s12 m6 l3\">";
        carElements += "                            <input value=\"";
        carElements += car.vin;
        carElements += "\" id=\"vin\" type=\"text\" class=\"validate\">";
        carElements += "                            <label for=\"vin\">VIN<\/label>";
        carElements += "                        <\/div>";
        carElements += "                        <div class=\"input-field col s12 m6 l3\">";
        carElements += "                            <input value=\"";
        carElements += car.price;
        carElements += "\" id=\"price\" type=\"text\" class=\"validate\">";
        carElements += "                            <label for=\"price\">Price<\/label>";
        carElements += "                        <\/div>";
        carElements += "                        <div class=\"input-field col s12 m6 l3\">";
        carElements += "                            <input value=\"";
        carElements += car.doors;
        carElements += "\" id=\"doors\" type=\"text\" class=\"validate\">";
        carElements += "                            <label for=\"doors\">Doors<\/label>";
        carElements += "                        <\/div>";
        carElements += "                        <div class=\"input-field col s12 m6 l3\">";
        carElements += "                            <input value=\"";
        carElements += car.mileage;
        carElements += "\" id=\"mileage\" type=\"text\" class=\"validate\">";
        carElements += "                            <label for=\"mileage\">Mileage<\/label>";
        carElements += "                        <\/div>";
        carElements += "                        <div class=\"input-field col s12 m6 l3\">";
        carElements += "                            <input value=\"";
        carElements += car.color;
        carElements += "\" id=\"color\" type=\"text\" class=\"validate\">";
        carElements += "                            <label for=\"color\">Color<\/label>";
        carElements += "                        <\/div>";
        carElements += "                        <div class=\"input-field col s12 m6 l3\">";
        carElements += "                            <input value=\"";
        carElements += car.trans;
        carElements += "\" id=\"trans\" type=\"text\" class=\"validate\">";
        carElements += "                            <label for=\"trans\">Trans<\/label>";
        carElements += "                        <\/div>";
        carElements += "<div class=\"input-field col s12 m6 l3\">";
        carElements += "                            <input value=\"" +
            (car.firstImage ? car.firstImage : (car.images ? car.images[0] : "") ) +
            "\" id=\"firstImage\" type=\"text\" class=\"validate\">";
        carElements += "                            <label for=\"firstImage\">First Image<\/label>";
        carElements += "                        <\/div>";
        carElements += "                    <\/div>";

        carElements += "                    <div class=\"row\">";
        carElements += "                        <div class=\"input-field col s12\">";
        carElements += "                            <textarea id=\"features\" class=\"materialize-textarea\"><\/textarea>";
        carElements += "                            <label for=\"features\">Features<\/label>";
        carElements += "                        <\/div>";
        carElements += "                    <\/div>";
        carElements += "                    <div class=\"col s12\">";
        carElements += "                        <h6>Images<\/h6>";
        carElements += "                        <div class=\"car-chip-images\">";
        carElements += "";
        carElements += "                        <\/div>";
        carElements += "";
        carElements += "";
        carElements += "                        <a class=\"waves-effect waves-light btn-flat right\" onclick=\"addChip()\"><i class=\"large material-icons left\">add<\/i>ADD MORE<\/a>";
        carElements += "";
        carElements += "";
        carElements += "";
        carElements += "                    <\/div>";
        carElements += "                <\/form>";
        carElements += "            <\/div>";
        carElements += "        <\/div>";
        carElements += "        <div class=\"modal-footer\">";

        if(!isNewCar){
            var archiveText = (car.visible === true) ? "ARCHIVE" : "UNARCHIVE";
            var archiveBool = (car.visible === true) ? "false" : "true";
            carElements += "            <a href=\"#!\" class=\"modal-action waves-effect waves-green btn-flat\" onclick=\"toggleArchive('";
            carElements += car.id +','+ archiveBool;
            carElements += "')\">";
            carElements += "                "+archiveText;
            carElements += "            <\/a>";
        }
        carElements += "            <a href=\"#!\" class=\"modal-action waves-effect waves-green btn-flat\" onclick=\"submitEditCar('";
        carElements += car.id;
        carElements += "')\">SAVE CHANGES<\/a>";
        carElements += "        <\/div>";
        carElements += "    <\/div>";
        $('.modal-section').append(carElements);
        $('#'+car.id).find('.materialize-textarea').val(car.features);
    }

    function addChipsFromDatabase() {
        var chipImageElement="";
        var chipImages = $('.car-chip-images');

        for (var image in car.images) {
            var idNumber = Math.floor((Math.random() * 100) + 1);
            chipImageElement += "<div class=\"chip " +idNumber +"\" id=\"";
            chipImageElement += car.images[image];
            chipImageElement += "\">";
            chipImageElement += "                            <img src=\"http:\/\/via.placeholder.com\/25x25\">";
            chipImageElement += car.images[image];
            chipImageElement += "                            <i class=\"delete material-icons\" onclick=\"deleteImage('";
            chipImageElement += idNumber;
            chipImageElement += "')\">close<\/i>";
            chipImageElement += "                    <br> <br>    <\/div>";
        }

        chipImages.append(chipImageElement);
    }

    function initializeModal() {
        var carModel = $('#'+car.id);
        configureModalOptions();
        carModel.modal('open');
        Materialize.updateTextFields();
        carModel.find('.materialize-textarea').trigger('autoresize');
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
}

function deleteImage(imageNumber) {
    var chip = $('.'+imageNumber);
    chip.remove();
}

function toggleArchive(carIDandArchive) {
    carIDandArchive = carIDandArchive.split(',');
    var carID = carIDandArchive[0];
    var archive = (carIDandArchive[1] == 'true')

    var form = $('#'+carID).find( "form" );
    var features = form.find('.materialize-textarea').val();
    var make = $('#make').val();
    var year = $('#year').val();
    var color = $('#color').val();
    var model = $('#model').val();
    var vin = $('#vin').val();
    var doors = $('#doors').val();
    var price = $('#price').val();
    var mileage = $('#mileage').val();
    var trans = $('#trans').val();




    var carRef = database.ref('cars/' + carID);
    carRef.update({
        make:  make,
        year: year,
        color : color,
        model: model,
        vin : vin,
        doors: doors,
        price: price,
        mileage: mileage,
        trans: trans,
        visible : archive,
        features: features
    }).then(function () {
        var carModel = $('#'+carID);
        carModel.modal('close');
    });

}


function submitEditCar(carID) {
    var isNewCar = false;
    startProgressBar();

    var form = $('#'+carID).find( "form" );
    var features = form.find('.materialize-textarea').val();
    var make = $('#make').val().toUpperCase();
    var year = $('#year').val();
    var color = $('#color').val().toUpperCase();
    var model = $('#model').val().toUpperCase();
    var vin = $('#vin').val();
    var doors = $('#doors').val();
    var price = $('#price').val();
    var mileage = $('#mileage').val();
    var trans = $('#trans').val();
    var firstImage = $('#firstImage').val() != null ? $('#firstImage').val() : "";
    var imagesInput = [];
    var imagesToUpload = [];



    if(carID.valueOf() == "newCarID"){
        var idNumber = Math.floor((Math.random() * 100000) + 1);
        isNewCar = true;
        carID = sanitizeInput(year + color + make + model + '_'+ idNumber);
    }


    var chips = form.find('.chip');
    for(var i = 0; i<chips.length;i++){
        imagesInput[i] = chips[i].id;
    }


    var carRef = database.ref('cars/' + carID);
    var curTime = Date.now();
    if(isNewCar){
        carRef.set({
            make:  make,
            year: year,
            color : color,
            model: model,
            vin : vin,
            price: price,
            mileage: mileage,
            doors: doors,
            firstImage : firstImage,
            trans: trans,
            time: curTime,
            visible : true,
            features: features
        }).then(function () {
            uploadImages();
        });

    } else {
        carRef.update({
            make:  make,
            year: year,
            color : color,
            model: model,
            vin : vin,
            doors: doors,
            price: price,
            mileage: mileage,
            firstImage : firstImage,
            time: curTime,
            trans: trans,
            visible : true,
            features: features
        }).then(function () {
            uploadImages();
        });
    }

    var searchText = $('#search');
    searchText.val("");
    Materialize.updateTextFields();



    function uploadImages() {
        if(!isNewCar) {
            database.ref('cars/' + carID+'/images').once('value').then(function(snapshot) {
                var images = snapshot.val();
                var originalImages = [];
                if(images) {
                    originalImages= images.split(",");
                }
                var matchingImages = [];
                for(var carImage in imagesInput) {
                    if (originalImages.indexOf(imagesInput[carImage]) > -1) {
                        matchingImages.push(imagesInput[carImage]);
                    } else {
                        imagesToUpload.push(imagesInput[carImage]);
                    }
                }
                images = matchingImages.join(',');


                database.ref('cars/' + carID+'/images/').set(images).then(function () {
                    uploadNewImages();
                })
            });


        } else {
            imagesToUpload = imagesInput;
            uploadNewImages();
        }
    }


    function uploadNewImages() {
        var imageFiles = [];

        // Loops thru the images to upload and the new files to add to find matching files to names.
        for(var image in imagesToUpload) {
            for(var imgToUp in newFilesToAdd) {
                if(newFilesToAdd[imgToUp].name.valueOf() == imagesToUpload[image]) {
                    imageFiles.push(newFilesToAdd[imgToUp]);
                }
            }
        }

        // Compresses the imagefile objects and then uploads those to the server
        for(var imageFile in imageFiles) {
            new ImageCompressor(imageFiles[imageFile], {
                quality: .6,
                maxWidth: 800,
                maxHeight: 800,
                minWidth: 300,
                minHeight: 300,
                success(result) {
                    uploadImageAsPromise(result);
                },
                error(e) {
                    showCarEditErrorMessage(e.message);
                },
            });



        }

        var carModel = $('#'+carID);
        if(isNewCar) {
            carModel =$('#newCarID');
            carModel.modal('close');
        } else {
            carModel.modal('close');
        }

        function uploadImageAsPromise (imageFile) {
            return new Promise(function (resolve, reject) {
                var fileName = sanitizeInput(imageFile.name);
                startProgressBar();

                var storageRef = this.storageRef.child('cars/' + carID + '/' + fileName);
                var uploadTask = storageRef.put(imageFile);


                //Update progress bar
                uploadTask.on('state_changed',
                    function progress(snapshot) {
                        var percentage = snapshot.bytesTransferred / snapshot.totalBytes * 100;
                        setProgressBarPercent(percentage)
                    },
                    function error(err) {
                        showCarEditErrorMessage(err.message);
                    },
                    function complete() {
                        var downloadURL = uploadTask.snapshot.downloadURL;

                        database.ref('cars/' + carID + '/images').once('value').then(function (snapshot) {
                            var images = snapshot.val();
                            images = (images) ? images + "," + fileName : fileName;
                            database.ref('cars/' + carID + '/images/').set(images).then(function () {
                                stopProgressBar();
                            });
                        });
                    }
                );
            });
        }
    }





    //var images = $('#model').val();



    stopProgressBar();
}

function showCarEditErrorMessage(message) {
    var errorMessageContainer = $('.car-edit-error-message');
    errorMessageContainer.html(message);
}

function setProgressBarPercent(percent) {
    var progessBar = $('#control-panel-text');
    progessBar.html("Control Panel - Uploading... " + percent + "%");
    if(percent > 99){
        progessBar.html("Control Panel");
    }
}
