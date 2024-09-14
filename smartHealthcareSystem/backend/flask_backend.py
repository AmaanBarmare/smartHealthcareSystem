from flask import Flask, request, jsonify
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression

app = Flask(__name__)

# Load and prepare the dataset
df = pd.read_csv('diabetes_prediction_dataset.csv')
df.replace({'Male': 1, 'Female': 0, 'Other': 2}, inplace=True)
selected_features = ['gender', 'age', 'hypertension', 'heart_disease', 'bmi', 'blood_glucose_level', 'diabetes']
df_filtered = df[selected_features]
X = df_filtered.drop('diabetes', axis=1)
y = df_filtered['diabetes']

# Split the dataset into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Initialize and train the model
model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)

# API endpoint to get diabetes prediction
@app.route('/predict', methods=['POST'])
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
        prediction = model.predict(input_data)
        
        # Return the prediction result
        if prediction == 1:
            return jsonify({'result': 'high risk'})
        else:
            return jsonify({'result': 'low risk'})
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
