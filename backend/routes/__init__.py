from flask import Blueprint

# Import the blueprint from data_routes
from .data_routes import data_bp

# Create a list of blueprints to be registered
blueprints = [data_bp]

def register_blueprints(app):
    """Register all blueprints with the Flask app."""
    for blueprint in blueprints:
        app.register_blueprint(blueprint)