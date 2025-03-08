from config import db

# Define Tables
class RawData(db.Model):
    __tablename__ = 'raw_data'
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String, nullable=False)  # Store raw date as string
    number_of_sales = db.Column(db.String, nullable=False)  # Store raw number of sales as string
    region = db.Column(db.String(50), nullable=False)
    uploaded_at = db.Column(db.DateTime, server_default=db.func.current_timestamp())

class CleanedData(db.Model):
    __tablename__ = 'cleaned_data'
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    number_of_sales = db.Column(db.Integer, nullable=False)
    region = db.Column(db.String(50), nullable=False)
    cleaned_at = db.Column(db.DateTime, server_default=db.func.current_timestamp())

class AnalysisData(db.Model):
    __tablename__ = 'analysis_data'
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    region = db.Column(db.String(50), nullable=False)
    moving_average = db.Column(db.Float)
    trend = db.Column(db.Float)
    mean_sales = db.Column(db.Float)
    median_sales = db.Column(db.Float)
    analyzed_at = db.Column(db.DateTime, server_default=db.func.current_timestamp())