const form = document.getElementById('form')
const firstname_input = document.getElementById('firstname-input')
const email_input = document.getElementById('email-input')
const password_input = document.getElementById('password-input')
const repeat_password_input = document.getElementById('repeat-password-input')
const error_message = document.getElementById('error-message')

// ---- Demo "database" (localStorage) ----
const USERS_KEY = 'demoUsers'
const SESSION_KEY = 'demoSession'

// Only staff emails can sign up (see getSignupFormErrors)
const COMPANY_DOMAIN = '@make-it-all.co.uk'

const DEMO_USER = { firstname: 'Demo', email: 'demo' + COMPANY_DOMAIN, password: 'password123' }

function getUsers(){
  let users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')

  // Browsers that used older versions still have the old demo accounts saved, so remove them
  users = users.filter(u => u.email !== 'demo@example.com' && u.email !== 'demo@make-it-all.com')

  // Make sure the demo account always exists, not just on the very first visit
  if(!users.some(u => u.email === DEMO_USER.email)){
    users.unshift(DEMO_USER)
  }

  localStorage.setItem(USERS_KEY, JSON.stringify(users))
  return users
}

function saveUser(user){
  const users = getUsers()
  users.push(user)
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function startSession(user){
  localStorage.setItem(SESSION_KEY, JSON.stringify({ firstname: user.firstname, email: user.email }))
  window.location.href = '../my-tasks/my-tasks.html'   // land on My tasks after logging in
}

// ---- Form handling ----
form.addEventListener('submit', (e) => {
  // We handle everything in JS, so never let the form submit normally
  e.preventDefault()

  const isSignup = firstname_input != null
  const email = email_input.value.trim().toLowerCase()
  const password = password_input.value

  const errors = isSignup
    ? getSignupFormErrors(firstname_input.value.trim(), email, password, repeat_password_input.value)
    : getLoginFormErrors(email, password)

  if(errors.length > 0){
    error_message.innerText = errors.join(". ")
    return
  }

  if(isSignup){
    if(getUsers().some(u => u.email === email)){
      showError('An account with this email already exists', [email_input])
      return
    }
    const user = { firstname: firstname_input.value.trim(), email, password }
    saveUser(user)
    startSession(user)
  } else {
    const user = getUsers().find(u => u.email === email && u.password === password)
    if(!user){
      showError('Incorrect email or password', [email_input, password_input])
      return
    }
    startSession(user)
  }
})

function showError(message, inputs){
  error_message.innerText = message
  inputs.forEach(input => input.parentElement.classList.add('incorrect'))
}

function getSignupFormErrors(firstname, email, password, repeatPassword){
  let errors = []

  if(firstname === '' || firstname == null){
    errors.push('Firstname is required')
    firstname_input.parentElement.classList.add('incorrect')
  }
  if(email === '' || email == null){
    errors.push('Email is required')
    email_input.parentElement.classList.add('incorrect')
  }
  // use the cleaned-up email (trimmed, lowercase), not the raw input
  else if(!email.endsWith(COMPANY_DOMAIN)){
    errors.push('Email must be a ' + COMPANY_DOMAIN + ' address')
    email_input.parentElement.classList.add('incorrect')
  }
  if(password === '' || password == null){
    errors.push('Password is required')
    password_input.parentElement.classList.add('incorrect')
  }
  else if(password.length < 8){
    errors.push('Password must have at least 8 characters')
    password_input.parentElement.classList.add('incorrect')
  }
  else if(!/\d/.test(password)){
    errors.push('Password must contain at least one number')
    password_input.parentElement.classList.add('incorrect')
  }
  else if(!/[^\w\s]/.test(password)){
    errors.push('Password must contain at least one symbol, e.g. ! ? # @')
    password_input.parentElement.classList.add('incorrect')
  }
  if(password !== repeatPassword){
    errors.push('Password does not match repeated password')
    password_input.parentElement.classList.add('incorrect')
    repeat_password_input.parentElement.classList.add('incorrect')
  }

  return errors
}

function getLoginFormErrors(email, password){
  let errors = []

  if(email === '' || email == null){
    errors.push('Email is required')
    email_input.parentElement.classList.add('incorrect')
  }
  if(password === '' || password == null){
    errors.push('Password is required')
    password_input.parentElement.classList.add('incorrect')
  }

  return errors
}

const allInputs = [firstname_input, email_input, password_input, repeat_password_input].filter(input => input != null)

allInputs.forEach(input => {
  input.addEventListener('input', () => {
    // Clear the red highlight on every field and the message once the user edits anything
    allInputs.forEach(i => i.parentElement.classList.remove('incorrect'))
    error_message.innerText = ''
  })
})
