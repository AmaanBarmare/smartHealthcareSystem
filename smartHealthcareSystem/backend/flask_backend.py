from flask import Flask, request, jsonify
from flask_cors import CORS
from flask import send_file
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
import matplotlib.pyplot as plt
import io
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Load and prepare the dataset
dfDiabetes = pd.read_csv('diabetes_prediction_dataset.csv')
dfDiabetes.replace({'Male': 1, 'Female': 0, 'Other': 2}, inplace=True)
selected_features_diabetes = ['gender', 'age', 'hypertension', 'heart_disease', 'bmi', 'blood_glucose_level', 'diabetes']
df_filtered_diabetes = dfDiabetes[selected_features_diabetes]
X = df_filtered_diabetes.drop('diabetes', axis=1)
y = df_filtered_diabetes['diabetes']

# Split the dataset into training and testing sets
X_train_d, X_test_d, y_train_d, y_test_d = train_test_split(X, y, test_size=0.2, random_state=42)

# Initialize and train the model
model_diabetes = LogisticRegression(max_iter=5000)
model_diabetes.fit(X_train_d, y_train_d)

# Load and prepare the dataset
dfObesity = pd.read_csv('obesity_data.csv')
dfObesity.replace({'Male': 1, 'Female': 0, "Normal weight": 1, "Overweight": 2, "Obese": 3, "Underweight": 0}, inplace=True)
selected_features_obesity = ['Age', 'Gender', 'Height', 'Weight', 'BMI', 'PhysicalActivityLevel', 'ObesityCategory']
df_filtered_obesity = dfObesity[selected_features_obesity]
X = df_filtered_obesity.drop('ObesityCategory', axis=1)
y = df_filtered_obesity['ObesityCategory']

# Split the dataset into training and testing sets
X_train_o, X_test_o, y_train_o, y_test_o = train_test_split(X, y, test_size=0.2, random_state=42)

# Initialize and train the model
model_obesity = LogisticRegression(max_iter=5000)
model_obesity.fit(X_train_o, y_train_o)

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

@app.route('/get_model_plot_obesity', methods=['GET'])
def get_model_plot_obesity():
    # Create a plot with multiple features against Obesity
    fig, axs = plt.subplots(2, 2, figsize=(10, 8))  # 2x2 subplot grid

    # Scatter plot for Age vs Obesity
    axs[0, 0].scatter(X_test_o['Age'], y_test_o, color='blue', label='Data Points')
    axs[0, 0].set_xlabel('Age')
    axs[0, 0].set_ylabel('Obesity Category')
    axs[0, 0].set_title('Age vs Obesity Category')

    # Scatter plot for BMI vs Obesity
    axs[0, 1].scatter(X_test_o['BMI'], y_test_o, color='green', label='Data Points')
    axs[0, 1].set_xlabel('BMI')
    axs[0, 1].set_ylabel('Obesity Category')
    axs[0, 1].set_title('BMI vs Obesity Category')

    # Scatter plot for Weight vs Obesity
    axs[1, 0].scatter(X_test_o['Weight'], y_test_o, color='red', label='Data Points')
    axs[1, 0].set_xlabel('Weight')
    axs[1, 0].set_ylabel('Obesity Category')
    axs[1, 0].set_title('Weight vs Obesity Category')

    # Scatter plot for Height vs Obesity
    axs[1, 1].scatter(X_test_o['Height'], y_test_o, color='red', label='Data Points')
    axs[1, 1].set_xlabel('Height')
    axs[1, 1].set_ylabel('Obesity Category')
    axs[1, 1].set_title('Height vs Obesity Category')

    # Adjust layout to avoid overlap
    plt.tight_layout()

    # Convert plot to PNG image in memory
    png_image = io.BytesIO()
    FigureCanvas(fig).print_png(png_image)
    png_image.seek(0)

    # Return the image as a response
    return send_file(png_image, mimetype='image/png')

@app.route('/get_model_plot_diabetes', methods=['GET'])
def get_model_plot_diabetes():
    # Create a plot with multiple features against Obesity
    fig, axs = plt.subplots(2, 2, figsize=(10, 8))  # 2x2 subplot grid

    # Scatter plot for Age vs Obesity
    axs[0, 0].scatter(X_test_d['age'], y_test_d, color='blue', label='Data Points')
    axs[0, 0].set_xlabel('Age')
    axs[0, 0].set_ylabel('Diabetes Category')
    axs[0, 0].set_title('Age vs Diabetes Category')

    # Scatter plot for BMI vs Obesity
    axs[0, 1].scatter(X_test_d['bmi'], y_test_d, color='green', label='Data Points')
    axs[0, 1].set_xlabel('BMI')
    axs[0, 1].set_ylabel('Diabetes Category')
    axs[0, 1].set_title('BMI vs Diabetes Category')

    # Scatter plot for Weight vs Obesity
    axs[1, 0].scatter(X_test_d['blood_glucose'], y_test_d, color='red', label='Data Points')
    axs[1, 0].set_xlabel('Blood Glucose')
    axs[1, 0].set_ylabel('Diabetes Category')
    axs[1, 0].set_title('Blood Glucose vs Diabetes Category')

    axs[1,1].axis('off')

    # Adjust layout to avoid overlap
    plt.tight_layout()

    # Convert plot to PNG image in memory
    png_image = io.BytesIO()
    FigureCanvas(fig).print_png(png_image)
    png_image.seek(0)

    # Return the image as a response
    return send_file(png_image, mimetype='image/png')

if __name__ == '__main__':
    app.run(debug=True)
