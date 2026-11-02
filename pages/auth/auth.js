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

// Every account has a role: 'employee' or 'manager'.
// The role is stored with the account, never chosen by the user, 
// so nobody can make themselves a manager. Sign up always creates an employee. 
// For this prototype the manager account is pre-set; in Part 2 an admin will assign the manager role.
const DEMO_USERS = [
  { firstname: 'Sam',  email: 'employee' + COMPANY_DOMAIN, password: 'Employee1', role: 'employee' },
  { firstname: 'Alex', email: 'manager'  + COMPANY_DOMAIN, password: 'Manager1',  role: 'manager' }
]

// Demo accounts from older versions of the prototype, removed if a browser still has them
const OLD_DEMO_EMAILS = ['demo@example.com', 'demo@make-it-all.com', 'demo' + COMPANY_DOMAIN]

function getUsers(){
  let users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')

  users = users.filter(u => !OLD_DEMO_EMAILS.includes(u.email))

  // accounts created before roles existed become employees
  users.forEach(u => { if(!u.role) u.role = 'employee' })

  // make sure both demo accounts always exist, with their correct details
  DEMO_USERS.forEach(demo => {
    users = users.filter(u => u.email !== demo.email)
    users.unshift(demo)
  })

  localStorage.setItem(USERS_KEY, JSON.stringify(users))
  return users
}

function saveUser(user){
  const users = getUsers()
  users.push(user)
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function startSession(user){
  // the role goes into the session, so every page knows what this user may see
  localStorage.setItem(SESSION_KEY, JSON.stringify({ firstname: user.firstname, email: user.email, role: user.role }))
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
    // new accounts are always employees; managers are set up separately via the admin interface which is not part of this prototype
    const user = { firstname: firstname_input.value.trim(), email, password, role: 'employee' }
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

// ---- Form validation ----
function showError(message, inputs){
  error_message.innerText = message
  inputs.forEach(input => input.parentElement.classList.add('incorrect'))
}

// Returns an array of error messages, or an empty array if no errors
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
