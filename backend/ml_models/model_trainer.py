import os
import pandas as pd
import numpy as np
import joblib
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.model_selection import train_test_split

# Create directory
os.makedirs("pretrained_models", exist_ok=True)

# Generate Synthetic Data
np.random.seed(42)
n_samples = 1000

# Features
sleep_hours = np.random.normal(7, 1.5, n_samples)
study_hours = np.random.normal(5, 2, n_samples)
dsa_hours = np.random.normal(2, 1, n_samples)
break_hours = np.random.normal(1.5, 0.8, n_samples)
gym = np.random.choice([0, 1], p=[0.4, 0.6], size=n_samples)

# Targets
# Productivity Score (Regression 0-100)
prod_score = (sleep_hours * 5) + (study_hours * 6) + (dsa_hours * 5) + (gym * 10) - (np.abs(break_hours - 2) * 5)
prod_score = np.clip(prod_score + np.random.normal(0, 5, n_samples), 0, 100)

# Burnout Risk (Classification 0: Low, 1: Moderate, 2: High)
workload = study_hours + dsa_hours
burnout_risk = np.where(
    (workload > 8) & (sleep_hours < 6) & (break_hours < 1), 2,
    np.where((workload > 5) & (break_hours < 2), 1, 0)
)

data = pd.DataFrame({
    'sleep_hours': sleep_hours,
    'study_hours': study_hours,
    'dsa_hours': dsa_hours,
    'break_hours': break_hours,
    'gym': gym,
    'prod_score': prod_score,
    'burnout_risk': burnout_risk
})

X = data[['sleep_hours', 'study_hours', 'dsa_hours', 'break_hours', 'gym']]

# Train Productivity Regressor
y_prod = data['prod_score']
regressor = RandomForestRegressor(n_estimators=100, random_state=42)
regressor.fit(X, y_prod)
joblib.dump(regressor, 'pretrained_models/productivity_regressor.pkl')

# Train Burnout Classifier
y_burnout = data['burnout_risk']
classifier = RandomForestClassifier(n_estimators=100, random_state=42)
classifier.fit(X, y_burnout)
joblib.dump(classifier, 'pretrained_models/burnout_classifier.pkl')

print("Models generated and saved in pretrained_models/ directory.")
