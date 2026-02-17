#!/usr/bin/env python3
"""Quick test script to verify login/signup endpoints work"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_signup():
    """Test user signup"""
    print("Testing signup...")
    url = f"{BASE_URL}/api/users/signup"
    payload = {
        "username": "testuser@example.com",
        "password": "testpass123",
        "role": "controller"
    }
    try:
        response = requests.post(url, json=payload)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            print(f"Success: {response.json()}")
            return True
        else:
            print(f"Error: {response.text}")
            return False
    except Exception as e:
        print(f"Exception: {e}")
        return False

def test_login():
    """Test user login"""
    print("\nTesting login...")
    url = f"{BASE_URL}/api/users/login"
    data = {
        "username": "testuser@example.com",
        "password": "testpass123"
    }
    try:
        response = requests.post(url, data=data)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"Success: Token received (length: {len(result.get('access_token', ''))})")
            return result.get('access_token')
        else:
            print(f"Error: {response.text}")
            return None
    except Exception as e:
        print(f"Exception: {e}")
        return None

def test_me(token):
    """Test /me endpoint"""
    print("\nTesting /me endpoint...")
    url = f"{BASE_URL}/api/users/me"
    headers = {"Authorization": f"Bearer {token}"}
    try:
        response = requests.get(url, headers=headers)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            print(f"Success: {response.json()}")
            return True
        else:
            print(f"Error: {response.text}")
            return False
    except Exception as e:
        print(f"Exception: {e}")
        return False

if __name__ == "__main__":
    print("=" * 50)
    print("Testing Authentication Endpoints")
    print("=" * 50)
    
    # Test signup
    signup_ok = test_signup()
    
    # Test login
    token = test_login()
    
    # Test /me if login succeeded
    if token:
        test_me(token)
    
    print("\n" + "=" * 50)
    print("Test complete!")
    print("=" * 50)
