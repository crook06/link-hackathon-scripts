import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

# Function to calculate Parkinson Volatility
def calculate_parkinson_volatility(high, low):
    return np.sqrt((1 / (4 * np.log(2))) * np.log(high / low) ** 2)

# Function to calculate EMA Volatility
def calculate_ema_volatility(returns, period=90):
    ema = pd.Series(returns).ewm(span=period, adjust=False).mean()
    # Check if the ema Series is empty or too short
    if ema.empty or len(ema) < period:
        return np.nan  # Return NaN if there's not enough data
    return ema.iloc[-1]

# Load your data from a CSV file
df = pd.read_csv('/content/Lido wstETH_30._08_2023_28_ 11_ 2023_historical_data_coinmarketcap.csv.csv')

# Convert 'high', 'low', and 'close' columns to numeric type
df['high'] = pd.to_numeric(df['high'], errors='coerce')
df['low'] = pd.to_numeric(df['low'], errors='coerce')
df['close'] = pd.to_numeric(df['close'], errors='coerce')

# Calculate Parkinson Volatility
df['Parkinson_Volatility'] = df.apply(lambda row: calculate_parkinson_volatility(row['high'], row['low']), axis=1)

# Calculate Daily Returns
df['Daily_Returns'] = df['close'].pct_change() * 100

# Calculate EMA Volatility for each row
df['EMA_Volatility'] = df['Daily_Returns'].rolling(window=90, min_periods=1).apply(calculate_ema_volatility)

# Plotting Parkinson Volatility
plt.figure(figsize=(10, 6))
plt.plot(df['Parkinson_Volatility'], label='Parkinson Volatility')
plt.title('Parkinson Volatility Over Time')
plt.xlabel('Time')
plt.ylabel('Volatility')
plt.legend()
plt.show()

# Plotting EMA Volatility
plt.figure(figsize=(10, 6))
plt.plot(df['EMA_Volatility'], label='EMA Volatility')
plt.title('EMA Volatility Over Time')
plt.xlabel('Time')
plt.ylabel('Volatility')
plt.legend()
plt.show()

# Save the results to a new CSV file if needed
# df.to_csv('path_to_save_results.csv', index=False)
