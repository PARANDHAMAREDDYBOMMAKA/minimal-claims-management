# Minimal Claims Management Platform

This project is a minimal claims management platform designed for both patients and insurers. It allows patients to submit and track claims, while insurers can review and manage these claims.

## Features

### Patient Side
- **Submit a Claim**: A form to capture Name, Email, Claim Amount, Description, and upload a document (e.g., receipt or prescription).
- **View Claims**: A dashboard displaying submitted claims with status (Pending, Approved, Rejected), submission date, and approved amount (if applicable).

### Insurer Side
- **Claims Dashboard**: View all submitted claims with filters for status (Pending, Approved, Rejected), date, and claim amount.
- **Manage Claims**: A review panel to view claim details and uploaded documents, update claim status (Approve/Reject) with approved amount, and leave comments.

### Shared Features
- **Authentication**: Basic login for patients and insurers.
- **API Development**: Endpoints for submitting, fetching, and updating claims.
- **Database**: Store claims with fields such as ID, Name, Email, Claim Amount, Description, Status, Submission Date, and Insurer Comments.

## Tech Stack
- **Frontend**: React.js
- **Backend**: Node.js (NestJS)
- **Database**: MongoDB

## Getting Started

### Prerequisites
- Node.js
- npm or yarn
- MongoDB

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/PARANDHAMAREDDYBOMMAKA/minimal-claims-management
    cd minimal-claims-management
    ```

2. Set up the backend:
    ```sh
    cd backend
    npm install
    ```

3. Set up the frontend:
    ```sh
    cd ../frontend
    npm install
    ```

### Configuration

1. Backend:
    - Create a `.env` file in the `backend` directory and add the following environment variables:
        ```env
        MONGO_URI=mongodb://localhost:27017/claims-management
        JWT_SECRET=your_jwt_secret
        JWT_EXPIRES_IN=1d
        PORT=3000
        ```

### Running the Application

1. Start the backend server:
    ```sh
    cd backend
    npm run start:dev
    ```

2. Start the frontend development server:
    ```sh
    cd ../frontend
    npm run dev
    ```

3. Open your browser and navigate to `http://localhost:5173` to access the application.

### Testing

1. Backend:
    ```sh
    cd backend
    npm run test
    ```

2. Frontend:
    ```sh
    cd ../frontend
    npm run test
    ```

## Screenshots

### Landing Page
![Landing Page 1](screenshots/landingpage1.png)
![Landing Page 2](screenshots/landingpage2.png)

### Registration
![Register 1](screenshots/register1.png)
![Register 2](screenshots/register2.png)
![Register 3](screenshots/register3.png)

### Login
![Login](screenshots/login.png)

### Patient Dashboard
![Patient Dashboard](screenshots/patientdashboard.png)

### Submit Claim Form
![Submit Claim Form](screenshots/submitclaimform.png)

### Insurer Dashboard
![Insurer Dashboard](screenshots/insurerdashboard.png)

### Claim Review Form
![Claim Review Form](screenshots/claimreviewform.png)
