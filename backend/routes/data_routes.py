from flask import Blueprint, request, jsonify
import pandas as pd
import mimetypes
import chardet
from sqlalchemy import text
from config import db
from models.models import RawData, CleanedData, AnalysisData
from utils.data_processing import process_file

data_bp = Blueprint('data', __name__)

# Endpoint: Upload & Process Data
@data_bp.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Check file type
    mime_type, _ = mimetypes.guess_type(file.filename)
    valid_mime_types = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
    if mime_type not in valid_mime_types:
        return jsonify({'error': 'Invalid file type. Please upload a CSV or Excel file.'}), 400

    try:
        # Detect file encoding
        raw_data = file.read()
        result = chardet.detect(raw_data)
        encoding = result['encoding']

        # Read the file with the detected encoding
        file.seek(0)  # Reset file pointer to the beginning
        if mime_type == 'text/csv':
            df = pd.read_csv(file, encoding=encoding)
        else:
            df = pd.read_excel(file)

        response = process_file(df)
        if 'error' in response:
            return jsonify(response), 400

        return jsonify(response), 200

    except Exception as e:
        print(f"Critical Error in /upload: {e}")
        return jsonify({'error': str(e)}), 500

# Endpoint: Fetch Cleaned & Analyzed Data for Charts
@data_bp.route('/api/cleaned-data', methods=['GET'])
def get_cleaned_data():
    try:
        result = db.session.execute(text("SELECT * FROM analysis_data"))
        data = [dict(row) for row in result.mappings()]
        return jsonify(data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Endpoint: Filter Data Based on Time Delta (Daily, Weekly, Monthly)
@data_bp.route('/api/filtered-data', methods=['GET'])
def get_filtered_data():
    try:
        filter_type = request.args.get('type', 'daily')

        result = db.session.execute(text("SELECT date, number_of_sales, region FROM cleaned_data"))
        data = pd.DataFrame(result.fetchall(), columns=['date', 'number_of_sales', 'region'])

        data['date'] = pd.to_datetime(data['date'], errors='coerce')
        data.dropna(subset=['date'], inplace=True)

        if filter_type == 'daily':
            filtered_data = data.groupby('date')['number_of_sales'].sum().reset_index()
        elif filter_type == 'weekly':
            data['Week'] = data['date'].dt.to_period('W').astype(str)
            filtered_data = data.groupby('Week')['number_of_sales'].sum().reset_index()
        elif filter_type == 'monthly':
            data['Month'] = data['date'].dt.to_period('M').astype(str)
            filtered_data = data.groupby('Month')['number_of_sales'].sum().reset_index()
        else:
            return jsonify({'error': 'Invalid filter type'}), 400

        return jsonify(filtered_data.to_dict(orient='records')), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500