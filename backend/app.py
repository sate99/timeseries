from flask import Flask
from config import create_app, db
from routes import register_blueprints
from models import models  # Ensure models are imported

# Create the Flask application using the factory function
app = create_app()

# Register Blueprints
register_blueprints(app)

def create_all_tables():
    with app.app_context():
        db.create_all()

# Run the application
if __name__ == '__main__':
    # Create database tables within the application context if they do not exist
    create_all_tables()
    # Start the Flask development server
    app.run(debug=True)