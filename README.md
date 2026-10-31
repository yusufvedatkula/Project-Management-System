# Make-It-All Hub — Project Management System

A team project: a simple project management system for Make-It-All staff, built with plain HTML, CSS and JavaScript.

## How to run

Open `index.html` in a browser (or use the VS Code **Live Server** extension). It takes you to the login page.

Demo account: `demo@make-it-all.co.uk` / `password123`

## Folder structure

Each page lives in its own folder under `pages/`, with its HTML, CSS and JavaScript side by side and named after the page.

```
index.html                     Entry point — redirects to the login page
pages/
  auth/                        Log in and sign up
    login.html
    signup.html
    auth.css                   Shared by login, signup and home
    auth.js                    Form validation, demo accounts and session
  home/
    home.html                  Shown after logging in; links to every page
  my-tasks/
    my-tasks.html
    my-tasks.css               Also used by the Knowledge Base page
    my-tasks.js
  team-tasks/
    team-tasks.html
    team-tasks.css
    team-tasks.js
  knowledge-base/
    knowledge-base.html
    knowledge-base.css
    knowledge-base.js
  managers-dashboard/
    managers-dashboard.html
    managers-dashboard.css
    managers-dashboard.js
  shared/                      Used by several pages
    session.js                 Checks who is logged in, fills the sidebar, log out
    sample-team.js             Sample team and assigned tasks (Team tasks + Manager's dashboard)
```

## Page flow

`index.html` → **Log in** / **Sign up** → **Home** → My tasks · Team tasks · Knowledge Base · Manager's dashboard

## Conventions

- File and folder names are lowercase with hyphens: `my-tasks.html`, not `myTasks.html` or `my_tasks.html`.
- A page's CSS and JS files share the page's name and sit in the same folder.
- Links between pages are relative, e.g. `../home/home.html`.

## Contributing

1. `git checkout main && git pull`
2. `git checkout -b feature/short-description`
3. Commit, `git push -u origin feature/short-description`, then open a pull request into `main`.
