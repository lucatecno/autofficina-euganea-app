#!/usr/bin/env python3
"""
Backend API Testing for Autofficina Euganea
Tests all backend endpoints according to test_result.md
"""

import requests
import json
from datetime import datetime, timedelta
import sys
import os

# Get backend URL from frontend env
BACKEND_URL = "https://autotrack-app-1.preview.emergentagent.com"
API_BASE = f"{BACKEND_URL}/api"

class BackendTester:
    def __init__(self):
        self.session_token = None
        self.user_id = None
        self.vehicle_id = None
        self.service_id = None
        self.booking_id = None
        self.results = {}
        
    def log_result(self, test_name, success, message="", data=None):
        """Log test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        self.results[test_name] = {
            "success": success,
            "message": message,
            "data": data
        }
        
    def test_health_check(self):
        """Test basic health check endpoint"""
        try:
            response = requests.get(f"{API_BASE}/", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "Autofficina Euganea API" in data["message"]:
                    self.log_result("Health Check", True, f"API online: {data['message']}")
                    return True
                else:
                    self.log_result("Health Check", False, f"Unexpected response: {data}")
            else:
                self.log_result("Health Check", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result("Health Check", False, f"Connection error: {str(e)}")
        return False
        
    def setup_test_user(self):
        """Create test user and session in MongoDB"""
        try:
            import subprocess
            
            # Create test user and session
            mongo_script = '''
use('test_database');
var userId = 'user_test123';
var sessionToken = 'test_session_123456';
db.users.deleteOne({user_id: userId});
db.user_sessions.deleteOne({session_token: sessionToken});
db.users.insertOne({
  user_id: userId,
  email: 'test@example.com',
  name: 'Test User',
  picture: null,
  created_at: new Date(),
  gdpr_accepted: true,
  marketing_accepted: false
});
db.user_sessions.insertOne({
  user_id: userId,
  session_token: sessionToken,
  expires_at: new Date(Date.now() + 7*24*60*60*1000),
  created_at: new Date()
});
print('Session token: ' + sessionToken);
            '''
            
            result = subprocess.run(
                ['mongosh', '--eval', mongo_script],
                capture_output=True,
                text=True,
                timeout=30
            )
            
            if result.returncode == 0:
                self.session_token = 'test_session_123456'
                self.user_id = 'user_test123'
                self.log_result("Setup Test User", True, "Test user and session created")
                return True
            else:
                self.log_result("Setup Test User", False, f"MongoDB error: {result.stderr}")
        except Exception as e:
            self.log_result("Setup Test User", False, f"Error: {str(e)}")
        return False
        
    def test_auth_me(self):
        """Test GET /api/auth/me endpoint"""
        if not self.session_token:
            self.log_result("Auth Me", False, "No session token available")
            return False
            
        try:
            headers = {"Authorization": f"Bearer {self.session_token}"}
            response = requests.get(f"{API_BASE}/auth/me", headers=headers, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("user_id") == self.user_id and data.get("email") == "test@example.com":
                    self.log_result("Auth Me", True, f"User authenticated: {data['name']}")
                    return True
                else:
                    self.log_result("Auth Me", False, f"Unexpected user data: {data}")
            else:
                self.log_result("Auth Me", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result("Auth Me", False, f"Error: {str(e)}")
        return False
        
    def test_init_services(self):
        """Test POST /api/init-services endpoint"""
        try:
            response = requests.post(f"{API_BASE}/init-services", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if "Initialized" in data.get("message", ""):
                    self.log_result("Init Services", True, data["message"])
                    return True
                else:
                    self.log_result("Init Services", False, f"Unexpected response: {data}")
            else:
                self.log_result("Init Services", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result("Init Services", False, f"Error: {str(e)}")
        return False
        
    def test_get_services(self):
        """Test GET /api/services endpoint"""
        try:
            response = requests.get(f"{API_BASE}/services", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) >= 6:
                    # Store first service ID for booking tests
                    if data:
                        self.service_id = data[0].get("service_id")
                    self.log_result("Get Services", True, f"Retrieved {len(data)} services")
                    return True
                else:
                    self.log_result("Get Services", False, f"Expected 6+ services, got {len(data) if isinstance(data, list) else 'non-list'}")
            else:
                self.log_result("Get Services", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result("Get Services", False, f"Error: {str(e)}")
        return False
        
    def test_get_slots(self):
        """Test GET /api/slots endpoint"""
        try:
            # Test with tomorrow's date
            tomorrow = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
            response = requests.get(f"{API_BASE}/slots?date={tomorrow}", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if "slots" in data and isinstance(data["slots"], list):
                    slots_count = len(data["slots"])
                    self.log_result("Get Time Slots", True, f"Retrieved {slots_count} time slots for {tomorrow}")
                    return True
                else:
                    self.log_result("Get Time Slots", False, f"Invalid slots response: {data}")
            else:
                self.log_result("Get Time Slots", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result("Get Time Slots", False, f"Error: {str(e)}")
        return False
        
    def test_vehicles_crud(self):
        """Test vehicles CRUD operations"""
        if not self.session_token:
            self.log_result("Vehicles CRUD", False, "No session token available")
            return False
            
        headers = {"Authorization": f"Bearer {self.session_token}"}
        
        try:
            # Test GET vehicles (should be empty initially)
            response = requests.get(f"{API_BASE}/vehicles", headers=headers, timeout=10)
            if response.status_code != 200:
                self.log_result("Vehicles CRUD", False, f"GET vehicles failed: {response.status_code}")
                return False
                
            # Test POST vehicle
            vehicle_data = {
                "marca": "Fiat",
                "modello": "Panda",
                "targa": "AB123CD",
                "anno": 2020
            }
            response = requests.post(f"{API_BASE}/vehicles", json=vehicle_data, headers=headers, timeout=10)
            
            if response.status_code == 200:
                vehicle = response.json()
                self.vehicle_id = vehicle.get("vehicle_id")
                if self.vehicle_id:
                    self.log_result("Vehicles CRUD", True, f"Vehicle created: {vehicle['marca']} {vehicle['modello']} ({vehicle['targa']})")
                    return True
                else:
                    self.log_result("Vehicles CRUD", False, f"No vehicle_id in response: {vehicle}")
            else:
                self.log_result("Vehicles CRUD", False, f"POST vehicle failed: HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result("Vehicles CRUD", False, f"Error: {str(e)}")
        return False
        
    def test_bookings_crud(self):
        """Test bookings CRUD operations"""
        if not self.session_token or not self.vehicle_id or not self.service_id:
            self.log_result("Bookings CRUD", False, "Missing prerequisites (session, vehicle, or service)")
            return False
            
        headers = {"Authorization": f"Bearer {self.session_token}"}
        
        try:
            # Test GET bookings (should be empty initially)
            response = requests.get(f"{API_BASE}/bookings", headers=headers, timeout=10)
            if response.status_code != 200:
                self.log_result("Bookings CRUD", False, f"GET bookings failed: {response.status_code}")
                return False
                
            # Test POST booking
            booking_data = {
                "vehicle_id": self.vehicle_id,
                "service_id": self.service_id,
                "scheduled_date": (datetime.now() + timedelta(days=2)).isoformat(),
                "notes": "Test booking"
            }
            response = requests.post(f"{API_BASE}/bookings", json=booking_data, headers=headers, timeout=10)
            
            if response.status_code == 200:
                booking = response.json()
                self.booking_id = booking.get("booking_id")
                if self.booking_id:
                    self.log_result("Bookings CRUD", True, f"Booking created: {booking['booking_id']} for {booking['scheduled_date']}")
                    return True
                else:
                    self.log_result("Bookings CRUD", False, f"No booking_id in response: {booking}")
            else:
                self.log_result("Bookings CRUD", False, f"POST booking failed: HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result("Bookings CRUD", False, f"Error: {str(e)}")
        return False
        
    def test_vehicle_tracking(self):
        """Test vehicle status tracking"""
        if not self.session_token or not self.booking_id:
            self.log_result("Vehicle Tracking", False, "Missing prerequisites (session or booking)")
            return False
            
        headers = {"Authorization": f"Bearer {self.session_token}"}
        
        try:
            # Test GET tracking history
            response = requests.get(f"{API_BASE}/tracking/{self.booking_id}", headers=headers, timeout=10)
            
            if response.status_code == 200:
                tracking = response.json()
                if isinstance(tracking, list) and len(tracking) > 0:
                    self.log_result("Vehicle Tracking", True, f"Retrieved {len(tracking)} tracking entries")
                    return True
                else:
                    self.log_result("Vehicle Tracking", False, f"No tracking data found: {tracking}")
            else:
                self.log_result("Vehicle Tracking", False, f"GET tracking failed: HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result("Vehicle Tracking", False, f"Error: {str(e)}")
        return False
        
    def test_admin_endpoints(self):
        """Test admin endpoints (no auth required for MVP)"""
        try:
            # Test GET admin/bookings
            response = requests.get(f"{API_BASE}/admin/bookings", timeout=10)
            
            if response.status_code == 200:
                bookings = response.json()
                if isinstance(bookings, list):
                    self.log_result("Admin Endpoints", True, f"Admin retrieved {len(bookings)} bookings")
                    
                    # Test admin tracking update if we have a booking
                    if self.booking_id:
                        tracking_data = {
                            "booking_id": self.booking_id,
                            "status": "checked_in",
                            "notes": "Vehicle arrived for service"
                        }
                        response = requests.post(f"{API_BASE}/admin/tracking", json=tracking_data, timeout=10)
                        if response.status_code == 200:
                            self.log_result("Admin Tracking Update", True, "Status updated successfully")
                        else:
                            self.log_result("Admin Tracking Update", False, f"Status update failed: {response.status_code}")
                    
                    return True
                else:
                    self.log_result("Admin Endpoints", False, f"Invalid bookings response: {bookings}")
            else:
                self.log_result("Admin Endpoints", False, f"GET admin/bookings failed: HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result("Admin Endpoints", False, f"Error: {str(e)}")
        return False
        
    def run_all_tests(self):
        """Run all backend tests"""
        print(f"🚀 Starting Backend API Tests for Autofficina Euganea")
        print(f"📍 Backend URL: {BACKEND_URL}")
        print("=" * 60)
        
        # Test sequence based on dependencies
        tests = [
            ("Health Check", self.test_health_check),
            ("Setup Test User", self.setup_test_user),
            ("Auth Session Exchange API", self.test_auth_me),
            ("Services API", self.test_init_services),
            ("Services API", self.test_get_services),
            ("Time Slots API", self.test_get_slots),
            ("Vehicles CRUD API", self.test_vehicles_crud),
            ("Bookings CRUD API", self.test_bookings_crud),
            ("Vehicle Status Tracking API", self.test_vehicle_tracking),
            ("Admin Bookings API", self.test_admin_endpoints),
        ]
        
        passed = 0
        total = len(tests)
        
        for test_name, test_func in tests:
            try:
                if test_func():
                    passed += 1
            except Exception as e:
                self.log_result(test_name, False, f"Test crashed: {str(e)}")
        
        print("=" * 60)
        print(f"📊 Test Results: {passed}/{total} tests passed")
        
        # Print summary
        print("\n📋 DETAILED RESULTS:")
        for test_name, result in self.results.items():
            status = "✅" if result["success"] else "❌"
            print(f"{status} {test_name}: {result['message']}")
        
        return passed, total, self.results

if __name__ == "__main__":
    tester = BackendTester()
    passed, total, results = tester.run_all_tests()
    
    # Exit with error code if tests failed
    if passed < total:
        sys.exit(1)
    else:
        print("\n🎉 All tests passed!")
        sys.exit(0)