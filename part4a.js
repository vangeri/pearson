function submitTrainWreckForm(e) {
    var hasErrors = checkErrors();

    /* Hide results */
    document.getElementById("result").style.display = "none";

    if(!hasErrors) {
        renderResult();
    }

    e.preventDefault();
    return false;
}

function checkErrors() {
    var trainASpeedField = document.getElementById("trainA-speed"),
        trainBSpeedField = document.getElementById("trainB-speed"),
        townDistanceField = document.getElementById("town-distance"),
        trainBDelayField = document.getElementById("train-delay"),
        trainASpeed = trainASpeedField.value,
        trainBSpeed = trainBSpeedField.value,
        townDistance = townDistanceField.value,
        trainBDelay = trainBDelayField.value,
        errorMessage = [];

    if (trainASpeed) {
        trainASpeedField.classList.remove("error");
    } else {
        trainASpeedField.classList.add("error");
        errorMessage.push("Enter a valid number for train A speed in miles per hour");
    }
    
    if (trainBSpeed) {
        trainBSpeedField.classList.remove("error");
    } else {
        trainBSpeedField.classList.add("error");
        errorMessage.push("Enter a valid number for train B speed in miles per hour");
    }
    
    if (townDistance) {
        townDistanceField.classList.remove("error");
    } else {
        townDistanceField.classList.add("error");
        errorMessage.push("Enter a valid number for distance between the towns in mules");
    }
    
    if (trainBDelay) {
        trainBDelayField.classList.remove("error");
    } else {
        trainBDelayField.classList.add("error");
        errorMessage.push("Enter a valid number for train be delay in minutes");
    }

    renderErrorMessage(errorMessage);

    return (errorMessage.length > 0);
}

function renderErrorMessage(messageArray) {
    var errorHtml = '<p>Fix the following errors and try again</p><ul>';
    if (messageArray.length > 0) {
        messageArray.forEach(function(element) {
           errorHtml += '<li>' + element + '</li>';
        });
        errorHtml += '</ul>';

        document.getElementById("formError").innerHTML = errorHtml;
        document.getElementById("formError").style.display = 'block';
    } else {
        document.getElementById("formError").style.display = 'none';
    }
} 

function renderResult() {
    var trainASpeedField = document.getElementById("trainA-speed"),
        trainBSpeedField = document.getElementById("trainB-speed"),
        townDistanceField = document.getElementById("town-distance"),
        trainBDelayField = document.getElementById("train-delay"),
        trainASpeed = parseFloat(trainASpeedField.value),
        trainBSpeed = parseFloat(trainBSpeedField.value),
        townDistance = parseFloat(townDistanceField.value),
        trainBDelay = parseFloat(trainBDelayField.value)/60;

    var crashDistance = (trainASpeed *  (townDistance + trainBSpeed * trainBDelay)) / (trainASpeed + trainBSpeed),
        crashDistancePercent = (crashDistance / townDistance) * 100;

    document.getElementsByClassName("pr-results__bar--a")[0].style.flexBasis = crashDistancePercent + "%";

    document.getElementsByClassName("crash-distance")[0].innerHTML = Math.round(crashDistance * 100) / 100;
    document.getElementsByClassName("crash-time")[0].innerHTML = Math.round(((crashDistance / trainASpeed)*60) * 100) / 100; 

    document.getElementById("result").style.display = "block";
}


var trainWreckForm = document.getElementById("trainWreckForm");
trainWreckForm.addEventListener("submit", submitTrainWreckForm);
