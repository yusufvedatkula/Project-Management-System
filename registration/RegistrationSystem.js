const form = document.getElementById('regForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword')

const usernameError = document.getElementById('usernameError');
const passwordError = document.getElementById('passwordError');
const resultMessage = document.getElementById('resultMessage');

const togglePasswordButton = document.getElementById('togglePasswordButton');
const toggleConfirmButton = document.getElementById('toggleConfirmButton');

togglePasswordButton.addEventListener ('click', function () {
    const isPassword = passwordInput.type === 'password';

    passwordInput.type = isPassword ? 'text' : 'password';
    togglePasswordButton.textContent = isPassword ? 'Hide' : 'Show';
});

toggleConfirmButton.addEventListener ('click', function () {
    const isConfirmPassword = confirmPasswordInput.type === 'password';

    confirmPasswordInput.type = isConfirmPassword ? 'text' : 'password';
    toggleConfirmButton.textContent = isConfirmPassword ? 'Hide' : 'Show';
});

form.addEventListener('submit', function (event) {
    event.preventDefault();
    console.log('Submit button was clicked!');

    usernameError.textContent = '';
    passwordError.textContent = '';
    confirmError
    resultMessage.textContent = '';

    const username = usernameInput.value;
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value

    let isValid = true;


    if (!username.toLowerCase().endsWith('@make-it-all.com')) {
        usernameError.textContent = 'Username must be your work email.'
        isValid = false;
    }

    const hasMinLength = password.length >= 8;
    const hasNumber = /\d/.test(password);

    if (!hasMinLength || !hasNumber) {
        passwordError.textContent = 'Password must be at least 8 characters and contain a number.';
        isValid = false;
    }


    if (password !== confirmPassword) {
        confirmError.textContent = 'Passwords must match'
        isValid = false;
    }

    if (isValid) {
        resultMessage.textContent = `Welcome, ${username}!`;
        usernameInput.value = '';
        passwordInput.value = '';
        confirmPasswordInput.value = '';
    }
    

});


