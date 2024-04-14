# ![RealWorld Example App](logo.png)

> ### Django REST Framework + Angular codebase containing real world examples (CRUD, auth, advanced patterns, etc) that adheres to the [RealWorld](https://github.com/gothinkster/realworld) spec and API.


### [Demo](https://demo.realworld.io/)&nbsp;&nbsp;&nbsp;&nbsp;[RealWorld](https://github.com/gothinkster/realworld)


This codebase was created to demonstrate a fully fledged fullstack application built with **Django REST Framework + Angular** including CRUD operations, authentication, routing, pagination, and more.

We've gone to great lengths to adhere to the **Django REST Framework + Angular** community styleguides & best practices.

For more information on how to this works with other frontends/backends, head over to the [RealWorld](https://github.com/gothinkster/realworld) repo.


# How it works

> Describe the general architecture of your app here

# Getting started

## Prerequisites
- Python 3.10
- Node.js 18.5.0

## Installation
```shell
# Install environment and dependencies
python3 -m venv .venv
source .venv/bin/activate # or `.venv/Scripts/activate` on Windows
pip install -r backend/requirements.txt

# Apply migrations
python backend/manage.py migrate

# Install and build frontend
npm --prefix=frontend install
npm --prefix=frontend run build

# Run server
python backend/manage.py runserver
```
