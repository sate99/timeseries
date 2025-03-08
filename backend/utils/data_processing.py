import pandas as pd
from models.models import RawData, CleanedData, AnalysisData
from config import db

def process_file(df):
    try:
        # Validate Columns
        expected_columns = ["Date", "Number of Sales", "Region"]
        if list(df.columns) != expected_columns:
            return {'error': f'Expected columns: {expected_columns}, but got {list(df.columns)}'}

        # Store Raw Data as Received
        for _, row in df.iterrows():
            try:
                raw_entry = RawData(
                    date=row['Date'],
                    number_of_sales=row['Number of Sales'],
                    region=row['Region']
                )
                db.session.add(raw_entry)
            except Exception as e:
                print(f"Error inserting into RawData: {e}")

        db.session.commit()

        # Clean Data
        df['Date'] = pd.to_datetime(df['Date'], errors='coerce')
        df['Number of Sales'] = pd.to_numeric(df['Number of Sales'], errors='coerce')
        
        # Drop rows with invalid dates or number of sales
        df = df.dropna(subset=['Date', 'Number of Sales'])
        
        # Convert number of sales to integer and drop rows with negative sales numbers
        df['Number of Sales'] = df['Number of Sales'].astype(int)
        df = df[df['Number of Sales'] >= 0]

        # Store Cleaned Data
        for _, row in df.iterrows():
            try:
                cleaned_entry = CleanedData(
                    date=row['Date'].date(),
                    number_of_sales=row['Number of Sales'],
                    region=row['Region']
                )
                db.session.add(cleaned_entry)
            except Exception as e:
                print(f"Error inserting into CleanedData: {e}")

        db.session.commit()

        # Compute Moving Average, Trend, Mean, and Median
        df['Moving_Avg'] = df['Number of Sales'].rolling(window=3, min_periods=1).mean()
        df['Trend'] = df['Number of Sales'].diff()
        mean_sales = float(df['Number of Sales'].mean())
        median_sales = float(df['Number of Sales'].median())

        # Store Analysis Data
        for _, row in df.iterrows():
            try:
                analysis_entry = AnalysisData(
                    date=row['Date'].date(),
                    region=row['Region'],
                    moving_average=float(row['Moving_Avg']) if pd.notnull(row['Moving_Avg']) else None,
                    trend=float(row['Trend']) if pd.notnull(row['Trend']) else None,
                    mean_sales=mean_sales,
                    median_sales=median_sales
                )
                db.session.add(analysis_entry)
            except Exception as e:
                print(f"Error inserting into AnalysisData: {e}")

        db.session.commit()

        return {'message': 'File processed successfully'}
    except Exception as e:
        return {'error': str(e)}

def get_filtered_data(filter_type):
    try:
        # Retrieve data from AnalysisData table
        data = AnalysisData.query.all()
        df = pd.DataFrame([{
            'date': d.date,
            'region': d.region,
            'moving_average': d.moving_average,
            'trend': d.trend,
            'mean_sales': d.mean_sales,
            'median_sales': d.median_sales
        } for d in data])

        # Convert date column to datetime
        df['date'] = pd.to_datetime(df['date'], errors='coerce')
        df.dropna(subset=['date'], inplace=True)

        if filter_type == 'daily':
            filtered_data = df.groupby('date').agg({
                'moving_average': 'mean',
                'trend': 'mean',
                'mean_sales': 'mean',
                'median_sales': 'mean'
            }).reset_index()
        elif filter_type == 'weekly':
            df['week'] = df['date'].dt.to_period('W').astype(str)
            filtered_data = df.groupby('week').agg({
                'moving_average': 'mean',
                'trend': 'mean',
                'mean_sales': 'mean',
                'median_sales': 'mean'
            }).reset_index()
        elif filter_type == 'monthly':
            df['month'] = df['date'].dt.to_period('M').astype(str)
            filtered_data = df.groupby('month').agg({
                'moving_average': 'mean',
                'trend': 'mean',
                'mean_sales': 'mean',
                'median_sales': 'mean'
            }).reset_index()
        else:
            return {'error': 'Invalid filter type'}

        return filtered_data.to_dict(orient='records')
    except Exception as e:
        return {'error': str(e)}

def get_cleaned_data():
    try:
        # Retrieve data from CleanedData table
        data = CleanedData.query.all()
        cleaned_data = [{
            'date': d.date,
            'number_of_sales': d.number_of_sales,
            'region': d.region
        } for d in data]
        return cleaned_data
    except Exception as e:
        return {'error': str(e)}