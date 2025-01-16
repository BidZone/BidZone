# BidZone

BidZone is a web application designed for hosting and participating in online auctions. It enables users to create auctions, bid on items and manage auction activities efficiently.

The demo application is deployed at [https://bidzone.onrender.com/](https://bidzone.onrender.com/).

## Table of Contents
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Contributors](#contributors)
- [License](#license)

## Features
- **User Authentication**: Register, log in, and manage user accounts.
- **Auction Management**: Create auctions with details like title, description, images, and starting price.
- **Bidding System**: Place bids on active auctions.
- **Auction Results**: Automatic announcement of auction winners.
- **Transaction Management**: Track auction results and payments.

## Technologies
- **Frontend**: React.js
- **Backend**: Django
- **Database**: PostgreSQL
- **Authentication**: JSON Web Tokens (JWT)
- **Deployment:** Render.com

## Installation

1. **Clone the repository**:
```bash
git clone https://github.com/BidZone/BidZone.git
```
2. **Navigate to the project directory**:
```bash
cd BidZone
```
3. **Set up the backend**:
- Navigate to the backend directory:
```bash
cd backend
```
- Create and activate a virtual environment:
```bash
python -m venv env
source env/bin/activate # On Windows: env\Scripts\activate
```
- Install dependencies:
```bash
pip install -r requirements.txt
```
- Create .env file with this content:
```bash
DB_HOST=dbhost
DB_NAME=dbname
DB_PASSWORD=dbpass
DB_PORT=dbport
DB_USER=dbuser
SECRET_KEY=django_secret_key
EMAIL_HOST=your_email_host
EMAIL_PORT=your_email_port
EMAIL_HOST_USER=your_email_host_user # usually email address
EMAIL_HOST_PASSWORD=your_email_host_password
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=cloudinary_api_key
API_SECRET=cloudinay_api_secret
FRONTEND_WEBSITE=http://localhost:3000 # for hosting on local machine
```
- Make migrations:
```bash
python manage.py makemigrations
```
- Apply migrations:
```bash
python manage.py migrate
```
- Start the backend server:
```bash
python manage.py runserver
```
4. **Set up the frontend**:
- Navigate to the frontend directory:
```bash
cd ../frontend
```
- Install dependencies:
```bash
npm install
```
- Create .env file with this content:
```bash
REACT_APP_API_BASE_URL=http://localhost:8000 # or your backend url
```
- Start the frontend development server:
```bash
npm start
```
## Usage

- Access the application at `http://localhost:3000`.
- Register a new account or log in with existing credentials.
- Create new auctions or browse and bid on existing ones.
- To access admin panel, go to `http://localhost:8000/admin`.

## Contributors
- **[Karlo Bogetić](https://github.com/BogeticKarlo)** - Frontend Developer
- **[Ante Goreta](https://www.github.com/goretante)** - Backend Developer & Database Architect
- **[Barti Kujundžić](https://github.com/KraljBarti)** - Documentation
- **[Marin Mesarić](https://www.github.com/marinmesaric)** - Frontend Developer

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/BidZone/BidZone/blob/main/LICENSE) file for details.