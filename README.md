# ![RealWorld Example App](logo.png)

> ### Django REST Framework + Angular codebase containing real world examples (CRUD, auth, advanced patterns, etc) that adheres to the [RealWorld](https://github.com/gothinkster/realworld) spec and API.


### [Demo](https://thanhdev.pythonanywhere.com/)&nbsp;&nbsp;&nbsp;&nbsp;[RealWorld](https://github.com/gothinkster/realworld)


This codebase was created to demonstrate a fully fledged fullstack application built with **Django REST Framework + Angular** including CRUD operations, authentication, routing, pagination, and more.

We've gone to great lengths to adhere to the **Django REST Framework + Angular** community styleguides & best practices.

For more information on how to this works with other frontends/backends, head over to the [RealWorld](https://github.com/gothinkster/realworld) repo.


# How it works

> See how the Medium.com clone (called Conduit) is built using Django REST Framework and Angular.

# Getting started

## Prerequisites
Ensure you have Python 3 and Node.js installed on your system. The current project dependency versions are:
- Python 3.10
- Node.js 18.5.0

## Installation
### 1. Frontend: Choose 1 of 2 ways below:
- Install frontend dependencies and start frontend locally:
```shell
npm --prefix=frontend install
npm --prefix=frontend start
```
This command will install and start the Angular development server. You can access the Angular application through your web browser at `http://localhost:4200`.

- Install and build frontend as static files (Choose this if you don't want to make any changes to Frontend project):
```shell
npm --prefix=frontend install
npm --prefix=frontend run build
```

### 2. Backend:
- Set up a virtual environment
```shell
# Install environment and dependencies
python3 -m venv .venv
source .venv/bin/activate

# or use this command on Windows
python3 -m venv .venv
.venv/Scripts/activate
```

- Install backend dependencies:
```shell
pip install -r backend/requirements.txt
```

- Apply database migrations:
```shell
# Apply migrations
python backend/manage.py migrate
```

- Run the Django development server:
```shell
# Run server
python backend/manage.py runserver
```

Now, your local server should be running, and you can access this Django/Angular application through your web browser at http://localhost:8000.
