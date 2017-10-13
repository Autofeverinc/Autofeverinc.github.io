function Car() {
    this.id = "";
    this.make = "";
    this.model = "";
    this.year = 0;
    this.color = "";
    this.vin = "";
    this.doors = "";
    this.price = "";
    this.trans = ""
    this.features= "";
    this.images = "";
    this.imageURLS = "";
}


String.prototype.count=function(s1) {
    return (this.length - this.replace(new RegExp(s1,"g"), '').length) / s1.length;
}


var allCars = [];

var database = firebase.database();
var storageRef = firebase.storage().ref();


$( document ).ready(function() {
    console.log( "Initialized!" );


    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            pullAllCars();
        } else {
            window.location.href = "login.html";
        }
    });
});


function pullAllCars() {
    return database.ref('/cars/').once('value').then(function(snapshot) {
        var carsData = snapshot.val();



        $.each(carsData, function(carID, carObject) {
            var car = new Car();
            car.id = carID;
            car.make = carObject["Make"];
            car.model = carObject["Model"];
            car.year = carObject["Year"];
            car.color = carObject["Color"];
            car.features = carObject["Features"];
            car.images = carObject["Images"];

            function fetchImageURL(carID, image) {
                storageRef.child('cars/'+carID+'/'+image).getDownloadURL().then(function(url) {
                    return url;
                }).catch(function(error) {
                    console.log(error.message);
                    return null;
                });
            }

            if(car.images){
                car.images = car.images.split(",");
                for(var i = 0; i<car.images;i++){
                    car.imageURLS[i] = fetchImageURL(carID, car.images[i]);
                }
            }
            allCars[carID] = car;
        });
        showAllCars();
        stopProgressBar();
        loadCarImages();




    });
}

// function fetchAllImageURLs() {
//     for(var carID in allCars) {
//         var car = allCars[carID];
//         if(car.images){
//             var carD = car.id;
//             for(var i=0; i< car.images.length;i++) {
//                 storageRef.child('cars/'+car.id+'/'+car.images[i]).getDownloadURL().then(function(url) {
//                     this.allCars[carD].imageURLS[i] = url;
//                 }).catch(function(error) {
//                     console.log(error.message);
//                 });
//             }
//         }
//     }
// }

function showAllCars() {
    var carsContainer = $('.cars-container');
    carsContainer.html("");
    var carElements = "";
    for(var carID in allCars){
        var car = allCars[carID];
        carElements += "            <div class=\"card-panel waves-effect waves-green car-list-item\" onclick=\"editCar('";
        carElements += car.id;
        carElements += "')\">";
        carElements += "                <div class=\"row\">";
        carElements += "                    <div class=\"col l2 s4 m2\">";
        carElements += "                        <img id=\"img-"+carID+"\" src=\"http:\/\/via.placeholder.com\/100x100\">";
        carElements += "                    <\/div>";
        carElements += "                    <div class=\"col s6 m9\">";
        carElements += "                        <div class=\"flow-text\">";
        carElements += "                            <h6>";
        carElements += "                                " + car.year +" "+ car.make +" "+ car.model;
        carElements += "                            <\/br>";
        carElements += "                                " + car.color;
        carElements += "                            <\/h6>";
        carElements += "                            <h6 class=\"flow-text truncate\">";
        carElements += "                                "+(car.features ? car.features : "N/A");
        carElements += "                            <\/h6>";
        carElements += "                        <\/div>";
        carElements += "                    <\/div>";
        carElements += "                    <div class=\"col s1\">";
        carElements += "                        <p class=\"flow-text grey-text\"><i class=\"material-icons\">mode_edit<\/i><\/p>";
        carElements += "                    <\/div>";
        carElements += "                <\/div>";
        carElements += "            <\/div>";
    }
    carsContainer.append(carElements);
}

function stopProgressBar() {
    var progressBar = $('.progress');
    progressBar.addClass("invisible");
}

function startProgressBar() {
    var progressBar = $('.progress');
    progressBar.removeClass("invisible");
}

function loadCarImages() {
    for(var carID in allCars){
        var car = allCars[carID];
        if(car.images){
            var carD = car.id;
            storageRef.child('cars/'+car.id+'/'+car.images[0]).getDownloadURL().then(function(url) {
                var img = document.getElementById('img-'+carD);
                img.src = url;
            }).catch(function(error) {
                console.log(error.message);
            });
        }
    }

}

function editCar(carID) {

    clearModals();
    createModal();
    initializeModal();


    addImageChips();

    function clearModals() {
        $('.modal-section').html("");
    }

    function createModal() {
        var car = allCars[carID];
        var modalElements="";
        modalElements += "<div id=\"";
        modalElements += carID;
        modalElements += "\" class=\"modal modal-fixed-footer\">";
        modalElements += "        <div class=\"modal-content\">";
        modalElements += "            <h4>";
        modalElements += car.year + " " + car.make + " " + car.model;
        modalElements += "                        <div class=\"car-edit-error-message red-text\">";
        modalElements += "";
        modalElements += "<\/div>";
        modalElements += "            <\/h4>";
        modalElements += "            <div class=\"row\">";
        modalElements += "                <form class=\"col s12\">";
        modalElements += "                    <div class=\"row\">";
        modalElements += "                        <div class=\"input-field col s12\">";
        modalElements += "                            <input value=\"";
        modalElements += car.year;
        modalElements += "\" id=\"year\" type=\"text\" class=\"validate\">";
        modalElements += "                            <label for=\"year\">Year<\/label>";
        modalElements += "                        <\/div>";
        modalElements += "                    <\/div>";
        modalElements += "                    <div class=\"row\">";
        modalElements += "                        <div class=\"input-field col s12\">";
        modalElements += "                            <input value=\"";
        modalElements += car.make;
        modalElements += "\" id=\"make\" type=\"text\" class=\"validate\">";
        modalElements += "                            <label for=\"make\">Make<\/label>";
        modalElements += "                        <\/div>";
        modalElements += "                    <\/div>";
        modalElements += "                    <div class=\"row\">";
        modalElements += "                        <div class=\"input-field col s12\">";
        modalElements += "                            <input value=\"";
        modalElements += car.model;
        modalElements += "\" id=\"model\" type=\"text\" class=\"validate\">";
        modalElements += "                            <label for=\"model\">Model<\/label>";
        modalElements += "                        <\/div>";
        modalElements += "                    <\/div>";
        modalElements += "                    <div class=\"row\">";
        modalElements += "                        <div class=\"input-field col s12\">";
        modalElements += "                            <input value=\"";
        modalElements += car.color;
        modalElements += "\" id=\"color\" type=\"text\" class=\"validate\">";
        modalElements += "                            <label for=\"color\">Color<\/label>";
        modalElements += "                        <\/div>";
        modalElements += "                    <\/div>";
        modalElements += "                    <div class=\"row\">";
        modalElements += "                        <div class=\"input-field col s12\">";
        modalElements += "                            <textarea id=\"features\" class=\"materialize-textarea\"><\/textarea>";
        modalElements += "                            <label for=\"features\">Features<\/label>";
        modalElements += "                        <\/div>";
        modalElements += "                    <\/div>";
        modalElements += "                    <div class=\"col s12\">";
        modalElements += "                        <h6>Images<\/h6>";
        modalElements += "                        ";
        modalElements += "<div class=\"progress hide\">";
        modalElements += "      <div class=\"determinate image-upload\" style=\"width: 70%\"><\/div>";
        modalElements += "  <\/div>";
        modalElements += "                        ";
        modalElements += "                        <div class=\"car-chip-images\">";


        // Some loop to add all the chips


        modalElements += "";
        modalElements += "<\/div>";
        modalElements += "";
        modalElements += "";
        modalElements += "                                                <a class=\"waves-effect waves-light btn-flat right\" onclick=\"uploadImage('" +
            carID+ "')\"><i class=\"large material-icons left\">add<\/i>ADD MORE<\/a>";
        modalElements += "                    <\/div>";
        modalElements += "                <\/form>";
        modalElements += "            <\/div>";
        modalElements += "        <\/div>";
        modalElements += "        <div class=\"modal-footer\">";
        modalElements += "            <a href=\"#!\" class=\"modal-action modal-close waves-effect waves-green btn-flat\" onclick=\"submitCarChanges('";
        modalElements += car.id;
        modalElements += "')\">SAVE CHANGES<\/a>";        modalElements += "        <\/div>";
        modalElements += "    <\/div>";
        $('.modal-section').append(modalElements);
        $('#'+carID).find('.materialize-textarea').val(car.features);
    }

    function configureModalOptions(carID, carModel) {
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
                    //
                } // Callback for Modal close
            }
        );

    }

    function initializeModal() {
        var carModel = $('#'+carID);
        configureModalOptions(carID , carModel);
        carModel.modal('open');
        Materialize.updateTextFields();
        carModel.find('.materialize-textarea').trigger('autoresize');
    }

    function addImageChips() {
        var car = allCars[carID];
        var i = 0;
        if(car.images){
            asyncLoop(0);
        }
        function asyncLoop(i) {
            if(i > car.images.length-1){return;}
            storageRef.child('cars/'+car.id+'/'+car.images[i]).getDownloadURL().then(function(url, imageName) {
                var imageName = car.images[i];
                car.imageURLS[i] = url;
                addChip(carID, imageName, url, i);
                return asyncLoop(++i);
            }).catch(function(error) {
                console.log(error.message);
            });
        }

    }


}

function createNewCar() {
    var idNumber = Math.floor((Math.random() * 100000) + 1);
    var make = $('#make').val();
    var year = $('#year').val();
    var color = $('#color').val();
    var model = $('#model').val();
    submitCarChanges();
}

function submitCarChanges(carID) {
    startProgressBar();
    var form = $('#'+carID).find( "form" );
    var features = form.find('.materialize-textarea').val();
    var make = $('#make').val();
    var year = $('#year').val();
    var color = $('#color').val();
    var model = $('#model').val();
    database.ref('cars/' + carID).update({
        Make:  make,
        Year: year,
        Color : color,
        Model: model,
        Features: features
    });
    console.log("Changed car: "+carID);
    stopProgressBar();
    pullAllCars();
}


function addChip(carID, fileName, picLocation, count) {
    var chipImages = $('.car-chip-images');
    var chipImageElement="";
    chipImageElement += "<div class=\"chip\" id=\"";
    chipImageElement += "fileName";
    chipImageElement += "\">";
    chipImageElement += "                            <img src=\"" +picLocation+"\">";
    chipImageElement += fileName;
    chipImageElement += "                            <i class=\"delete material-icons\" onclick=\"deleteImage('";
    chipImageElement += carID+","+"chip-image"+count+","+fileName;
    chipImageElement += "')\">close<\/i>";
    chipImageElement += "                        <\/div>";
    chipImages.append(chipImageElement);
}

function deleteImage(carIDChipIDFileName) {
    carIDChipIDFileName = carIDChipIDFileName.split(',');
    var carID = carIDChipIDFileName[0];
    var chipID = carIDChipIDFileName[1];
    var fileName = carIDChipIDFileName[2];

    var deleteRef = storageRef.child('cars/'+carID+'/'+fileName);
    deleteRef.delete().then(function() {
        var chip =  $('.'+chipID);
        chip.hide();
        database.ref('cars/' + carID+'/Images').once('value').then(function(snapshot) {
            var images = snapshot.val();
            images = images.replace(fileName, "");
            if(images.count(',') < 2){
                images = images.replace(',', "");
            }
            console.log(database.ref('cars/' + carID+'/Images/').set(images));
        });
    }).catch(function(error) {
       console.log(error.message);
    });
}

function uploadImage(carID) {
    var input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.click();
    input.addEventListener('change', function(e){
        //Get files
        for (var i = 0; i < e.target.files.length; i++) {
            var imageFile = e.target.files[i];

            uploadImageAsPromise(imageFile);
        }
    });

    function uploadImageAsPromise (imageFile) {
        return new Promise(function (resolve, reject) {
            var progessBar = $('.image-upload');
            var fileName= sanitizeInput(imageFile.name);
            progessBar.parent().toggleClass("hide");

            var storageRef = this.storageRef.child('cars/'+carID+'/'+fileName);
            var uploadTask = storageRef.put(imageFile);



            //Update progress bar
            uploadTask.on('state_changed',
                function progress(snapshot){
                    var percentage = snapshot.bytesTransferred / snapshot.totalBytes * 100;
                    progessBar.width(percentage + '%');
                },
                function error(err){
                    showCarEditErrorMessage(err.message);
                },
                function complete(){
                    var downloadURL = uploadTask.snapshot.downloadURL;
                    progessBar.parent().toggleClass("hide");
                    var idNumber = Math.floor((Math.random() * 100000) + 1);
                    addChip(carID, fileName, downloadURL, idNumber);

                    database.ref('cars/' + carID+'/Images').once('value').then(function(snapshot) {
                        var images = snapshot.val();
                        images = (images) ? images + "," + fileName: fileName;
                        console.log(database.ref('cars/' + carID+'/Images/').set(images));
                    });
                }
            );
        });
    }

}

function showCarEditErrorMessage(message) {
    var errorMessageContainer = $('.car-edit-error-message');
    errorMessageContainer.html(message);

}

function sanitizeInput(input) {
    return input.replace(/[&\/\\#,+() $~%'":*?<>{}]/g, '');
}
