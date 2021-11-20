var clock = document.getElementsByTagName("h3");
var secondsLeft = 10;
var start = document.getElementsByClassName("start-button");

start[0].addEventListener("click", function() {
    timerInterval = setInterval(function() {
        secondsLeft--;
        clock[0].textContent = (secondsLeft + " seconds left");
        if(secondsLeft <= 0) {
            clearInterval(timerInterval);
            displayMessage();
        }
    }, 1000);
    
});

function displayMessage() {
    clock[0].textContent = "WE'RE DONE";
}
