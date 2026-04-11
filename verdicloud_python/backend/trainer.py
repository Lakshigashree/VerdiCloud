import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import joblib
import os

class TrainingAgent:
    """
    TrainingAgent handles the automated Machine Learning pipeline, including
    data preprocessing, categorical encoding, and model serialization.
    """
    def __init__(self, csv_path):
        """
        Initializes the training agent with dataset and model artifact paths.
        """
        self.csv_path = csv_path
        self.model_path = 'carbon_model.pkl'

    def train(self):
        """
        Executes the end-to-end training workflow with robust data cleaning.
        """
        print("🤖 [Trainer Agent]: Loading Nordic Energy Dataset for analysis...")
        
        if not os.path.exists(self.csv_path):
            print(f"❌ Error: Dataset not found at {self.csv_path}")
            return

        # Load historical telemetry
        df = pd.read_csv(self.csv_path)

        # 1. CATEGORICAL ENCODING
        # Mapping string-based days to numerical integers (0-6)
        day_map = {
            'Monday': 0, 'Tuesday': 1, 'Wednesday': 2, 'Thursday': 3,
            'Friday': 4, 'Saturday': 5, 'Sunday': 6
        }
        
        # Transform the 'day_of_week' column if it contains string labels
        if df['day_of_week'].dtype == 'object':
            print("⚙️ [Trainer Agent]: Encoding categorical day names to integers...")
            df['day_of_week'] = df['day_of_week'].map(day_map)

        # 2. DATA NUMERICALIZATION
        # Ensuring all features and targets are float/int types
        df['hour'] = pd.to_numeric(df['hour'], errors='coerce')
        df['co2_emission_g'] = pd.to_numeric(df['co2_emission_g'], errors='coerce')

        # 3. DATA CLEANING
        # Dropping any rows with missing or corrupted values post-conversion
        initial_count = len(df)
        df = df.dropna(subset=['hour', 'day_of_week', 'co2_emission_g'])
        print(f"🧹 [Trainer Agent]: Cleaned {initial_count - len(df)} rows. {len(df)} samples remaining.")

        # 4. MODEL SELECTION & TRAINING
        # Features: Temporal markers (Hour/Day) | Target: Carbon Intensity
        X = df[['hour', 'day_of_week']]
        y = df['co2_emission_g']

        print(f"🧠 [Trainer Agent]: Training Random Forest Regressor on numerical feature matrix...")
        
        # Utilize 50 estimators for an optimized bias-variance tradeoff
        model = RandomForestRegressor(n_estimators=50, random_state=42)
        model.fit(X.values, y.values)

        # 5. ARTIFACT SERIALIZATION
        # Saving the trained model for real-time inference in the production API
        joblib.dump(model, self.model_path)
        print(f"✅ [Trainer Agent]: Model successfully serialized to {self.model_path}")

if __name__ == "__main__":
    # Dynamic Path Resolution for environment-agnostic execution
    base_dir = os.path.dirname(os.path.abspath(__file__))
    csv_file_path = os.path.join(base_dir, 'energy_consumption_grid.csv')
    
    agent = TrainingAgent(csv_file_path)
    agent.train()