from fastapi import APIRouter
from pydantic import BaseModel
import joblib
import os
import numpy as np

router = APIRouter(prefix="/api/ml", tags=["Machine Learning"])

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "..", "ml_models", "pretrained_models")
PROD_MODEL_PATH = os.path.join(MODELS_DIR, "productivity_regressor.pkl")
BURN_MODEL_PATH = os.path.join(MODELS_DIR, "burnout_classifier.pkl")

# Load Models
try:
    prod_regressor = joblib.load(PROD_MODEL_PATH)
    burn_classifier = joblib.load(BURN_MODEL_PATH)
except:
    prod_regressor = None
    burn_classifier = None

class PredictionInput(BaseModel):
    sleep_hours: float
    study_hours: float
    dsa_hours: float
    break_hours: float
    gym: int

@router.post("/predict")
async def predict_outcomes(data: PredictionInput):
    if not prod_regressor or not burn_classifier:
        return {"error": "Models not trained. Please run model_trainer.py"}
    
    features = np.array([[
        data.sleep_hours,
        data.study_hours,
        data.dsa_hours,
        data.break_hours,
        data.gym
    ]])
    
    prod_score = prod_regressor.predict(features)[0]
    burnout_risk = burn_classifier.predict(features)[0]
    
    risk_mapping = {0: "Low", 1: "Moderate", 2: "High"}
    
    return {
        "predicted_productivity": round(prod_score, 1),
        "predicted_burnout_risk_level": risk_mapping.get(burnout_risk, "Unknown"),
        "predicted_burnout_risk_score": int(burnout_risk) * 50 # heuristic percentage
    }
