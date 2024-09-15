from flask import Flask, request, jsonify
from flask_cors import CORS
from flask import send_file
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
import matplotlib.pyplot as plt
import io
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report
from matplotlib.gridspec import GridSpec

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

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

dfBreastC = pd.read_csv('breast_cancer_data.csv')
dfBreastC.replace({'M': 1, 'B': 0}, inplace=True)
selected_features_BreastC = ['radius_mean', 'texture_mean', 'smoothness_mean', 'compactness_mean', 'symmetry_mean', 'diagnosis']
df_filtered_BreastC = dfBreastC[selected_features_BreastC]
X = df_filtered_BreastC.drop('diagnosis', axis=1)
y = df_filtered_BreastC['diagnosis']

# Split the dataset into training and testing sets
X_train_bc, X_test_bc, y_train_bc, y_test_bc = train_test_split(X, y, test_size=0.2, random_state=42)

# Initialize and train the model
model_breastC = LogisticRegression(max_iter=5000)
model_breastC.fit(X_train_bc, y_train_bc)

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
    
@app.route('/predict-breast-cancer', methods=['POST'])
def predict_breast_cancer():
    data = request.get_json()  # Get JSON data from request
    try:
        # Create a DataFrame from the input values
        input_data = pd.DataFrame({
            'radius_mean': [data['radius_mean']], 
            'texture_mean': [data['texture_mean']],
            'smoothness_mean': [data['smoothness_mean']], 
            'compactness_mean': [data['compactness_mean']], 
            'symmetry_mean': [data['symmetry_mean']], 
        })
        
        # Make the prediction
        prediction = model_breastC.predict_proba(input_data)[0][1]
        
        # Return the prediction result
        return jsonify({'result': prediction})
    except Exception as e:
        print('you fuckin dumbass: ' + str(e))
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
    fig = plt.figure(figsize=(12, 8))

    # Create GridSpec layout with 2 rows and 2 columns
    gs = GridSpec(2, 2, figure=fig)

    # Define 3 subplots and leave the 4th one empty
    ax1 = fig.add_subplot(gs[0, 0])  # Top left
    ax2 = fig.add_subplot(gs[0, 1])  # Top right
    ax3 = fig.add_subplot(gs[1, :])  # Full-width on the bottom row

    # Scatter plot for Age vs Obesity
    ax1.scatter(X_test_d['age'], y_test_d, color='blue', label='Data Points')
    ax1.set_xlabel('Age')
    ax1.set_ylabel('Diabetes Category')
    ax1.set_title('Age vs Diabetes Category')

    # Scatter plot for BMI vs Obesity
    ax2.scatter(X_test_d['bmi'], y_test_d, color='green', label='Data Points')
    ax2.set_xlabel('BMI')
    ax2.set_ylabel('Diabetes Category')
    ax2.set_title('BMI vs Diabetes Category')

    # Scatter plot for Weight vs Obesity
    ax3.scatter(X_test_d['blood_glucose_level'], y_test_d, color='red', label='Data Points')
    ax3.set_xlabel('Blood Glucose Level')
    ax3.set_ylabel('Diabetes Category')
    ax3.set_title('Blood Glucose Level vs Diabetes Category')

    # Adjust layout to avoid overlap
    plt.tight_layout()

    # Convert plot to PNG image in memory
    png_image = io.BytesIO()
    FigureCanvas(fig).print_png(png_image)
    png_image.seek(0)

    # Return the image as a response
    return send_file(png_image, mimetype='image/png')

@app.route('/get_model_plot_bc', methods=['GET'])
def get_model_plot_breast_cancer():
    # Create a plot with multiple features against Obesity
    fig = plt.figure(figsize=(12, 8))

    # Create GridSpec layout with 2 rows and 2 columns
    gs = GridSpec(3, 2, figure=fig)

    # Define 3 subplots and leave the 4th one empty
    ax1 = fig.add_subplot(gs[0, 0])  # Top left
    ax2 = fig.add_subplot(gs[0, 1])  # Top right
    ax3 = fig.add_subplot(gs[1, 0])  # Top left
    ax4 = fig.add_subplot(gs[1, 1])  # Top right
    ax5 = fig.add_subplot(gs[2, :])  # Full-width on the bottom row

    # Scatter plot for Age vs Obesity
    ax1.scatter(X_test_bc['radius_mean'], y_test_bc, color='blue', label='Data Points')
    ax1.set_xlabel('Radius Mean')
    ax1.set_ylabel('Breast Cancer Category')
    ax1.set_title('Radius Mean vs Breast Cancer Category')

    # Scatter plot for BMI vs Obesity
    ax2.scatter(X_test_bc['texture_mean'], y_test_bc, color='green', label='Data Points')
    ax2.set_xlabel('Texture Mean')
    ax2.set_ylabel('Breast Cancer Category')
    ax2.set_title('Texture Mean vs Breast Cancer Category')

    # Scatter plot for Weight vs Obesity
    ax3.scatter(X_test_bc['compactness_mean'], y_test_bc, color='red', label='Data Points')
    ax3.set_xlabel('Compactness Mean')
    ax3.set_ylabel('Breast Cancer Category')
    ax3.set_title('Compactness Mean vs Breast Cancer Category')

    ax4.scatter(X_test_bc['smoothness_mean'], y_test_bc, color='green', label='Data Points')
    ax4.set_xlabel('Smoothness Mean')
    ax4.set_ylabel('Breast Cancer Category')
    ax4.set_title('Smoothness Mean vs Breast Cancer Category')

    # Scatter plot for Weight vs Obesity
    ax5.scatter(X_test_bc['symmetry_mean'], y_test_bc, color='red', label='Data Points')
    ax5.set_xlabel('Symmetry Mean')
    ax5.set_ylabel('Breast Cancer Category')
    ax5.set_title('Symmetry Mean vs Breast Cancer Category')

    # Adjust layout to avoid overlap
    plt.tight_layout()

    # Convert plot to PNG image in memory
    png_image = io.BytesIO()
    FigureCanvas(fig).print_png(png_image)
    png_image.seek(0)

    # Return the image as a response
    return send_file(png_image, mimetype='image/png')

@app.after_request
def apply_cors(response):
    response.headers["Access-Control-Allow-Origin"] = "http://localhost:5173"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS, PUT, DELETE"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return response

@app.route('/accuracy_score', methods=['GET'])
def accuracy_d():
    try:
        y_pred = model_diabetes.predict(X_test_d)
        accuracy = model_diabetes.accuracy_score(y_test_d, y_pred)
        
        # Return the prediction result
        return accuracy
    except Exception as e:
        print('you fuckin dumbass: ' + str(e))
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
