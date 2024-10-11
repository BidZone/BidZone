# BidZone

**BidZone** is a web application for hosting and participating in online auctions. This project enables users to create auctions, bid on items, and manage auction activities in a secure and efficient manner.

## Table of Contents
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Contributors](#contributors)
- [License](#license)

## Features

- **User Authentication**: Users can register, log in, and manage their accounts.
- **Auction Management**: Sellers can create auctions with details like title, description, images, and starting price.
- **Bidding System**: Registered users can place bids on active auctions.
- **Notifications**: Users receive real-time notifications when they are outbid or when an auction ends.
- **Auction Results**: Automatic announcement of auction winners once the auction ends.
- **Transaction Management**: Support for tracking auction results and payments (optional).
- **Admin Panel**: Admins can manage auctions and users.
- **User History**: Users can track their auction participation history.
  
## Technologies

- **Frontend**: React, Bootstrap
- **Backend**: Django (Django REST Framework)
- **Database**: PostgreSQL
- **Authentication**: Django Allauth (or other authentication libraries)
- **Notifications**: Websockets/REST API
- **Deployment**: Docker (optional)

## Installation

### Prerequisites

- Python 3.x
- Node.js (with npm)
- PostgreSQL

### Backend Setup

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/bidzone.git
    cd bidzone
    ```

2. Create a virtual environment and activate it:
    ```bash
    python -m venv env
    source env/bin/activate   # On Windows use `env\Scripts\activate`
    ```

3. Install the backend dependencies:
    ```bash
    pip install -r requirements.txt
    ```

4. Set up PostgreSQL:
    - Create a new PostgreSQL database.
    - Update the database settings in `settings.py`:
      ```python
      DATABASES = {
          'default': {
              'ENGINE': 'django.db.backends.postgresql',
              'NAME': 'your_db_name',
              'USER': 'your_db_user',
              'PASSWORD': 'your_db_password',
              'HOST': 'localhost',
              'PORT': '5432',
          }
      }
      ```

5. Run migrations:
    ```bash
    python manage.py migrate
    ```

6. Start the Django development server:
    ```bash
    python manage.py runserver
    ```

### Frontend Setup

1. Navigate to the frontend directory:
    ```bash
    cd frontend
    ```

2. Install frontend dependencies:
    ```bash
    npm install
    ```

3. Start the React development server:
    ```bash
    npm start
    ```

## Usage

- Navigate to `http://localhost:3000` to access the React frontend.
- Use `http://localhost:8000/admin` for the Django admin panel.
- Users can register, log in, and participate in auctions from the user interface.

## API Documentation

The Django REST API provides endpoints for managing auctions, users, and bids. You can explore the API using tools like Postman or the Django REST Framework’s browsable API.

Some core endpoints:
- `POST /api/register/`: Register a new user.
- `POST /api/login/`: Log in to the platform.
- `GET /api/auctions/`: List all active auctions.
- `POST /api/auctions/create/`: Create a new auction (requires authentication).
- `POST /api/bids/`: Place a bid on an auction (requires authentication).

For detailed API documentation, refer to the `api_docs.md` file.

## Contributors

- **Karlo Bogetić** - Developer
- **Ante Goreta** - Developer
- **Barti Kujundžić** - Developer
- **Marin Mesarić** - Developer

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
