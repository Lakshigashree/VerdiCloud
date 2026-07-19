import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import joblib
import os
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score


class TrainingAgent:
    """
    TrainingAgent handles ML pipeline: preprocessing, training, evaluation, saving model.
    """

    def __init__(self, csv_path):
        self.csv_path = csv_path
        self.model_path = 'carbon_model.pkl'

    def train(self):

        print("🤖 Loading Energy Dataset...")

        if not os.path.exists(self.csv_path):
            print(f"❌ Dataset not found: {self.csv_path}")
            return

        df = pd.read_csv(self.csv_path)

        day_map = {
            'Monday': 0, 'Tuesday': 1, 'Wednesday': 2,
            'Thursday': 3, 'Friday': 4, 'Saturday': 5, 'Sunday': 6
        }

        if df['day_of_week'].dtype == 'object':
            print("⚙️ Encoding day_of_week...")
            df['day_of_week'] = df['day_of_week'].map(day_map)

        df['hour'] = pd.to_numeric(df['hour'], errors='coerce')
        df['co2_emission_g'] = pd.to_numeric(df['co2_emission_g'], errors='coerce')

        initial_count = len(df)
        df = df.dropna(subset=['hour', 'day_of_week', 'co2_emission_g'])

        print(f"🧹 Cleaned {initial_count - len(df)} rows")

        X = df[['hour', 'day_of_week']]
        y = df['co2_emission_g']

        X_train, X_test, y_train, y_test = train_test_split(
            X.values, y.values, test_size=0.2, random_state=42
        )

        model = RandomForestRegressor(n_estimators=50, random_state=42)
        model.fit(X_train, y_train)

        y_pred = model.predict(X_test)

        mae = mean_absolute_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)

        print("\n📊 MODEL PERFORMANCE METRICS")
        print("MAE:", round(mae, 4))
        print("R2 Score:", round(r2, 4))

        joblib.dump(model, self.model_path)
        print(f"✅ Model saved to {self.model_path}")


if __name__ == "__main__":

    base_dir = os.path.dirname(os.path.abspath(__file__))
    csv_file_path = os.path.join(base_dir, 'energy_consumption_grid.csv')

    agent = TrainingAgent(csv_file_path)
    agent.train()