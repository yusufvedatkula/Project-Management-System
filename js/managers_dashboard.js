// Find the button in the HTML
const button = document.getElementById("myButton");

// Find the paragraph where the message will appear
const message = document.getElementById("message");

// Run this code whenever the button is clicked
button.addEventListener("click", function () {
    message.textContent = "You clicked the button! JavaScript is working.";
});