# Time Series Data Upload & Visualization

This project is a full-stack application for uploading, processing, and visualizing time series data. The backend is built with Flask, and the frontend is built with React.

## Features

- Upload CSV or Excel files containing time series data
- Process and clean the uploaded data
- Visualize the cleaned and analyzed data
- Filter data based on time intervals (daily, weekly, monthly)

## Technologies Used

- Flask
- React
- PostgreSQL

## Prerequisites

- Python 3.9.6
- Node.js 20.10.0
- Yarn
- PostgreSQL database

## Setup

### Backend

1. **Navigate to the backend directory**:
    ```sh
    cd /Users/satendra/sate99/Time-Series-Analysis-Full-Stack-App/backend
    ```

2. **Create and activate a virtual environment**:
    ```sh
    python3 -m venv venv
    source venv/bin/activate
    ```

3. **Install the dependencies**:
    ```sh
    pip install --upgrade pip setuptools wheel
    pip install -r requirements.txt
    ```

4. **Create a `.env` file**:
    ```sh
    touch .env
    ```

5. **Add environment variables to the `.env` file**:
    Open the `.env` file in a text editor and add the following content:
    ```plaintext
    DATABASE_URI=postgresql://username:password@host:port/database_name
    ```

6. **Set up the database**:

    Ensure you have a PostgreSQL database set up and update the database URI in the `.env` file.

7. **Run the Flask application**:
    ```sh
    python app.py
    ```

### Frontend

1. **Navigate to the frontend directory**:
    ```sh
    cd /Users/satendra/sate99/Time-Series-Analysis-Full-Stack-App/frontend
    ```

2. **Install the dependencies**:
    ```sh
    yarn install
    ```

3. **Create a `.env` file**:
    ```sh
    touch .env
    ```

4. **Add environment variables to the `.env` file**:
    Open the `.env` file in a text editor and add the following content:
    ```plaintext
    REACT_APP_API_BASE_URL=http://127.0.0.1:5000/api
    ```

5. **Start the React application**:
    ```sh
    yarn start
    ```

## API Endpoints

### Upload & Process Data

- **URL**: `/api/upload`
- **Method**: `POST`
- **Description**: Upload and process a CSV or Excel file containing time series data.

### Fetch Cleaned Data

- **URL**: `/api/cleaned-data`
- **Method**: `GET`
- **Description**: Fetch the cleaned data for visualization.

### Fetch Analyzed Data for Charts with Filter Support

- **URL**: `/api/filtered-data`
- **Method**: `GET`
- **Description**: Fetch the analyzed data for charts with filter support (daily, weekly, monthly).

## Configuration

### Flask Configuration

The Flask configuration can be set in the `config.py` file. You can also use environment variables to configure the application.

### Environment Variables

Create a `.env` file in the backend directory to set environment variables. For example:

```plaintext
DATABASE_URI=postgresql://username:password@host:port/database_name
```

Create a `.env` file in the frontend directory to set environment variables. For example:

```plaintext
REACT_APP_API_BASE_URL=http://127.0.0.1:5000/api
```

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some feature'`)
5. Push to the branch (`git push origin feature-branch`)
6. Open a pull request

## License

This project is licensed under the MIT License.
