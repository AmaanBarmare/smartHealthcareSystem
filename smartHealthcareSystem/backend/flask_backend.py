from flask import Flask, request, jsonify
from flask_cors import CORS 
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression

app = Flask(__name__)
CORS(app)

# Load and prepare the dataset
dfDiabetes = pd.read_csv('diabetes_prediction_dataset.csv')
dfDiabetes.replace({'Male': 1, 'Female': 0, 'Other': 2}, inplace=True)
selected_features_diabetes = ['gender', 'age', 'hypertension', 'heart_disease', 'bmi', 'blood_glucose_level', 'diabetes']
df_filtered_diabetes = dfDiabetes[selected_features_diabetes]
X = df_filtered_diabetes.drop('diabetes', axis=1)
y = df_filtered_diabetes['diabetes']

# Split the dataset into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Initialize and train the model
model_diabetes = LogisticRegression(max_iter=5000)
model_diabetes.fit(X_train, y_train)

# Load and prepare the dataset
dfObesity = pd.read_csv('obesity_data.csv')
dfObesity.replace({'Male': 1, 'Female': 0, "Normal weight": 1, "Overweight": 2, "Obese": 3, "Underweight": 0}, inplace=True)
selected_features_obesity = ['Age', 'Gender', 'Height', 'Weight', 'BMI', 'PhysicalActivityLevel', 'ObesityCategory']
df_filtered_obesity = dfObesity[selected_features_obesity]
X = df_filtered_obesity.drop('ObesityCategory', axis=1)
y = df_filtered_obesity['ObesityCategory']

# Split the dataset into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Initialize and train the model
model_obesity = LogisticRegression(max_iter=5000)
model_obesity.fit(X_train, y_train)

# API endpoint to get diabetes prediction
@app.route('/predict-diabetes', methods=['POST'])
def predict_diabetes():
    data = request.get_json()  # Get JSON data from request
    try:
        # Create a DataFrame from the input values
        input_data = pd.DataFrame({
            'gender': [data['gender']],
            'age': [data['age']],
            'hypertension': [data['hypertension']],
            'heart_disease': [data['heart_disease']],
            'bmi': [data['bmi']],
            'blood_glucose_level': [data['blood_glucose_level']]
        })
        
        # Make the prediction
        prediction = model_diabetes.predict_proba(input_data)[0][1]
        
        # Return the prediction result
        return jsonify({'result': prediction})
    except Exception as e:
        return jsonify({'error': str(e)})

# API endpoint to get obesity prediction
@app.route('/predict-obesity', methods=['POST'])
def predict_obesity():
    data = request.get_json() # Get JSON data from request
    try:
        bmi = (data['weight']*2.20462)*703/((data['height']*0.393701)**2)
        
        # Create a DataFrame from the input values
        input_data = pd.DataFrame({
            'Age': [data['age']],
            'Gender': [data['gender']],
            'Height': [data['height']],
            'Weight': [data['weight']],
            'BMI': [bmi],
            'PhysicalActivityLevel': [data['physicalactivitylevel']]
        })
        
        # Make the prediction
        prediction = model_obesity.predict(input_data)[0]
            
        # Return the prediction result
        return jsonify({'result': str(prediction), 'bmi': str(bmi)})
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
