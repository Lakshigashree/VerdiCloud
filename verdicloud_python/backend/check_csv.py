import pandas as pd
df = pd.read_csv('verdicloud_python/backend/energy_consumption_grid.csv', nrows=5)
print("Columns in your CSV are:", df.columns.tolist())