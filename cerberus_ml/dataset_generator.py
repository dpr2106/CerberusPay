import numpy as np
import pandas as pd
import json
import uuid
import random
from datetime import datetime, timedelta

def generate_synthetic_transactions(num_records=10000, fraud_ratio=0.06, random_seed=42):
    """
    Generates realistic payment transaction records for training & held-out testing.
    Includes normal customer behavior and 4 distinct fraud attack vectors:
    1. Card Testing Burst (Velocity anomaly)
    2. Impossible Geolocation Velocity (Geo-jump)
    3. High-Value Device Fingerprint Drift
    4. Friendly Fraud / Chargeback Return Abuse
    """
    np.random.seed(random_seed)
    random.seed(random_seed)
    
    cities = ["Bangalore", "Mumbai", "Delhi", "Hyderabad", "Chennai", "Pune", "Kolkata", "London", "Singapore", "New York"]
    categories = ["electronics", "apparel", "crypto_gift_card", "gaming_credits", "groceries", "travel", "saas_subscription"]
    device_types = ["mobile_ios", "mobile_android", "desktop_chrome", "desktop_firefox", "headless_browser"]
    
    data = []
    base_time = datetime.now() - timedelta(days=30)
    
    for i in range(num_records):
        is_fraud = 1 if (np.random.rand() < fraud_ratio) else 0
        tx_id = f"TXN_{uuid.uuid4().hex[:10].upper()}"
        user_id = f"USR_{np.random.randint(1000, 9999)}"
        timestamp = base_time + timedelta(minutes=np.random.randint(1, 43200))
        
        category = np.random.choice(categories, p=[0.2, 0.25, 0.1, 0.1, 0.2, 0.1, 0.05])
        
        if is_fraud == 0:
            # Normal authentic user behavior
            amount = float(np.random.exponential(scale=1800) + 150)
            velocity_1h = int(np.random.poisson(lam=1.2))
            geo_distance_km = float(np.random.exponential(scale=15))
            device_trust_score = float(np.random.beta(a=8, b=2))
            is_proxy_vpn = 1 if np.random.rand() < 0.03 else 0
            card_fails_24h = int(np.random.choice([0, 1, 2], p=[0.92, 0.06, 0.02]))
            hour_of_day = timestamp.hour
            user_account_age_days = int(np.random.randint(30, 800))
            is_new_shipping_address = 1 if np.random.rand() < 0.08 else 0
        else:
            # Fraudulent vector patterns
            attack_type = np.random.choice(["burst", "geo_jump", "high_ticket_proxy", "account_takeover"])
            
            if attack_type == "burst":
                amount = float(np.random.uniform(200, 1200))
                velocity_1h = int(np.random.randint(6, 25))
                geo_distance_km = float(np.random.uniform(50, 400))
                device_trust_score = float(np.random.beta(a=2, b=6))
                is_proxy_vpn = 1 if np.random.rand() < 0.65 else 0
                card_fails_24h = int(np.random.randint(3, 10))
                user_account_age_days = int(np.random.randint(0, 10))
                is_new_shipping_address = 1
            elif attack_type == "geo_jump":
                amount = float(np.random.uniform(4000, 35000))
                velocity_1h = int(np.random.randint(2, 6))
                geo_distance_km = float(np.random.uniform(1200, 9500))  # Impossible jump in < 1 hour
                device_trust_score = float(np.random.beta(a=3, b=5))
                is_proxy_vpn = 1 if np.random.rand() < 0.8 else 0
                card_fails_24h = int(np.random.randint(1, 4))
                user_account_age_days = int(np.random.randint(5, 60))
                is_new_shipping_address = 1
            else: # high_ticket_proxy or takeover
                amount = float(np.random.uniform(15000, 85000))
                velocity_1h = int(np.random.randint(1, 4))
                geo_distance_km = float(np.random.uniform(300, 3000))
                device_trust_score = float(np.random.beta(a=1, b=8))
                is_proxy_vpn = 1
                card_fails_24h = int(np.random.randint(2, 6))
                user_account_age_days = int(np.random.randint(1, 15))
                is_new_shipping_address = 1

            hour_of_day = timestamp.hour

        data.append({
            "transaction_id": tx_id,
            "user_id": user_id,
            "timestamp": timestamp.isoformat(),
            "amount": round(amount, 2),
            "category": category,
            "velocity_1h": velocity_1h,
            "geo_distance_km": round(geo_distance_km, 2),
            "device_trust_score": round(device_trust_score, 3),
            "is_proxy_vpn": is_proxy_vpn,
            "card_fails_24h": card_fails_24h,
            "user_account_age_days": user_account_age_days,
            "is_new_shipping_address": is_new_shipping_address,
            "hour_of_day": hour_of_day,
            "is_fraud": is_fraud
        })
        
    df = pd.DataFrame(data)
    return df

if __name__ == "__main__":
    df = generate_synthetic_transactions(15000)
    df.to_csv("c:/Users/prash/OneDrive/Desktop/CerberusPay/cerberus_ml/transactions_dataset.csv", index=False)
    print(f"Generated {len(df)} records. Fraud rate: {df['is_fraud'].mean()*100:.2f}%")