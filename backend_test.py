#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for Autofficina Euganea
Pre-Deploy Validation - Tests all endpoints with real credentials
"""

import requests
import json
from datetime import datetime, timedelta
from typing import Optional, Dict, Any

# Backend URL
BACKEND_URL = "https://euganea-portal.preview.emergentagent.com/api"

# Test credentials
ADMIN_EMAIL = "baxadmin@autofficina.it"
ADMIN_PASSWORD = "Bassinimerda1."
DEMO_EMAIL = "demo@autofficina.it"
DEMO_PASSWORD = "Demo1234"

# Test data storage
test_data = {
    "admin_session": None,
    "demo_session": None,
    "vehicle_id": None,
    "service_id": None,
    "booking_id": None
}

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    END = '\033[0m'

def log_test(name: str, status: str, details: str = ""):
    """Log test result with color"""
    if status == "PASS":
        print(f"{Colors.GREEN}✅ {name}: PASS{Colors.END}")
    elif status == "FAIL":
        print(f"{Colors.RED}❌ {name}: FAIL{Colors.END}")
        if details:
            print(f"   {Colors.RED}{details}{Colors.END}")
    elif status == "INFO":
        print(f"{Colors.BLUE}ℹ️  {name}{Colors.END}")
    if details and status == "PASS":
        print(f"   {Colors.YELLOW}{details}{Colors.END}")

def test_health_check():
    """Test health check endpoint"""
    print(f"\n{Colors.BLUE}{'='*60}{Colors.END}")
    print(f"{Colors.BLUE}HEALTH CHECK{Colors.END}")
    print(f"{Colors.BLUE}{'='*60}{Colors.END}")
    
    try:
        response = requests.get(f"{BACKEND_URL}/health", timeout=10)
        if response.status_code == 200:
            log_test("GET /api/health", "PASS", f"Status: {response.json()}")
            return True
        else:
            log_test("GET /api/health", "FAIL", f"Status code: {response.status_code}")
            return False
    except Exception as e:
        log_test("GET /api/health", "FAIL", f"Error: {str(e)}")
        return False

def test_contact_info():
    """Test contact info endpoint"""
    print(f"\n{Colors.BLUE}{'='*60}{Colors.END}")
    print(f"{Colors.BLUE}CONTACT INFO{Colors.END}")
    print(f"{Colors.BLUE}{'='*60}{Colors.END}")
    
    try:
        response = requests.get(f"{BACKEND_URL}/contact-info", timeout=10)
        if response.status_code == 200:
            data = response.json()
            log_test("GET /api/contact-info", "PASS", 
                    f"Name: {data.get('name')}, Phone: {data.get('phone')}")
            return True
        else:
            log_test("GET /api/contact-info", "FAIL", f"Status code: {response.status_code}")
            return False
    except Exception as e:
        log_test("GET /api/contact-info", "FAIL", f"Error: {str(e)}")
        return False

def test_init_services():
    """Initialize services in database"""
    print(f"\n{Colors.BLUE}{'='*60}{Colors.END}")
    print(f"{Colors.BLUE}INITIALIZE SERVICES{Colors.END}")
    print(f"{Colors.BLUE}{'='*60}{Colors.END}")
    
    try:
        response = requests.post(f"{BACKEND_URL}/init-services", timeout=10)
        if response.status_code == 200:
            data = response.json()
            log_test("POST /api/init-services", "PASS", f"{data.get('message')}")
            return True
        else:
            log_test("POST /api/init-services", "FAIL", f"Status code: {response.status_code}")
            return False
    except Exception as e:
        log_test("POST /api/init-services", "FAIL", f"Error: {str(e)}")
        return False

def test_get_services():
    """Test get services endpoint"""
    print(f"\n{Colors.BLUE}{'='*60}{Colors.END}")
    print(f"{Colors.BLUE}SERVICES{Colors.END}")
    print(f"{Colors.BLUE}{'='*60}{Colors.END}")
    
    try:
        response = requests.get(f"{BACKEND_URL}/services", timeout=10)
        if response.status_code == 200:
            services = response.json()
            log_test("GET /api/services", "PASS", 
                    f"Found {len(services)} services")
            if len(services) >= 6:
                # Store first service ID for booking tests
                test_data["service_id"] = services[0]["service_id"]
                log_test("Services validation", "PASS", 
                        f"Expected 6 services, got {len(services)}")
                return True
            else:
                log_test("Services validation", "FAIL", 
                        f"Expected 6 services, got {len(services)}")
                return False
        else:
            log_test("GET /api/services", "FAIL", f"Status code: {response.status_code}")
            return False
    except Exception as e:
        log_test("GET /api/services", "FAIL", f"Error: {str(e)}")
        return False

def test_register_demo_user():
    """Test user registration"""
    print(f"\n{Colors.BLUE}{'='*60}{Colors.END}")
    print(f"{Colors.BLUE}AUTH - REGISTRATION{Colors.END}")
    print(f"{Colors.BLUE}{'='*60}{Colors.END}")
    
    try:
        # Try to register demo user
        payload = {
            "email": DEMO_EMAIL,
            "password": DEMO_PASSWORD,
            "name": "Demo User",
            "phone": "+39 123 456 7890"
        }
        response = requests.post(f"{BACKEND_URL}/auth/register", json=payload, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            test_data["demo_session"] = data.get("session_token")
            log_test("POST /api/auth/register", "PASS", 
                    f"User: {data['user']['name']}, Email: {data['user']['email']}")
            return True
        elif response.status_code == 400 and "già registrata" in response.text:
            log_test("POST /api/auth/register", "PASS", 
                    "User already exists (expected)")
            return True
        else:
            log_test("POST /api/auth/register", "FAIL", 
                    f"Status code: {response.status_code}, Response: {response.text}")
            return False
    except Exception as e:
        log_test("POST /api/auth/register", "FAIL", f"Error: {str(e)}")
        return False

def test_register_admin_user():
    """Test admin user registration"""
    try:
        payload = {
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD,
            "name": "Admin User",
            "phone": "+39 320 314 5049"
        }
        response = requests.post(f"{BACKEND_URL}/auth/register", json=payload, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            test_data["admin_session"] = data.get("session_token")
            log_test("POST /api/auth/register (Admin)", "PASS", 
                    f"Admin registered: {data['user']['email']}")
            return True
        elif response.status_code == 400 and "già registrata" in response.text:
            log_test("POST /api/auth/register (Admin)", "PASS", 
                    "Admin already exists (expected)")
            return True
        else:
            log_test("POST /api/auth/register (Admin)", "FAIL", 
                    f"Status code: {response.status_code}")
            return False
    except Exception as e:
        log_test("POST /api/auth/register (Admin)", "FAIL", f"Error: {str(e)}")
        return False

def test_login_demo_user():
    """Test user login"""
    print(f"\n{Colors.BLUE}{'='*60}{Colors.END}")
    print(f"{Colors.BLUE}AUTH - LOGIN{Colors.END}")
    print(f"{Colors.BLUE}{'='*60}{Colors.END}")
    
    try:
        payload = {
            "email": DEMO_EMAIL,
            "password": DEMO_PASSWORD
        }
        response = requests.post(f"{BACKEND_URL}/auth/login", json=payload, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            test_data["demo_session"] = data.get("session_token")
            log_test("POST /api/auth/login (Demo)", "PASS", 
                    f"Logged in: {data['user']['email']}")
            return True
        else:
            log_test("POST /api/auth/login (Demo)", "FAIL", 
                    f"Status code: {response.status_code}, Response: {response.text}")
            return False
    except Exception as e:
        log_test("POST /api/auth/login (Demo)", "FAIL", f"Error: {str(e)}")
        return False

def test_login_admin_user():
    """Test admin login"""
    try:
        payload = {
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        }
        response = requests.post(f"{BACKEND_URL}/auth/login", json=payload, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            test_data["admin_session"] = data.get("session_token")
            log_test("POST /api/auth/login (Admin)", "PASS", 
                    f"Logged in: {data['user']['email']}")
            return True
        else:
            log_test("POST /api/auth/login (Admin)", "FAIL", 
                    f"Status code: {response.status_code}, Response: {response.text}")
            return False
    except Exception as e:
        log_test("POST /api/auth/login (Admin)", "FAIL", f"Error: {str(e)}")
        return False

def test_get_me():
    """Test get current user endpoint"""
    print(f"\n{Colors.BLUE}{'='*60}{Colors.END}")
    print(f"{Colors.BLUE}AUTH - GET ME{Colors.END}")
    print(f"{Colors.BLUE}{'='*60}{Colors.END}")
    
    if not test_data["demo_session"]:
        log_test("GET /api/auth/me", "FAIL", "No session token available")
        return False
    
    try:
        headers = {"Authorization": f"Bearer {test_data['demo_session']}"}
        response = requests.get(f"{BACKEND_URL}/auth/me", headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            log_test("GET /api/auth/me", "PASS", 
                    f"User: {data.get('name')}, Email: {data.get('email')}")
            return True
        else:
            log_test("GET /api/auth/me", "FAIL", 
                    f"Status code: {response.status_code}, Response: {response.text}")
            return False
    except Exception as e:
        log_test("GET /api/auth/me", "FAIL", f"Error: {str(e)}")
        return False

def test_create_vehicle():
    """Test create vehicle endpoint"""
    print(f"\n{Colors.BLUE}{'='*60}{Colors.END}")
    print(f"{Colors.BLUE}VEHICLES - CREATE{Colors.END}")
    print(f"{Colors.BLUE}{'='*60}{Colors.END}")
    
    if not test_data["demo_session"]:
        log_test("POST /api/vehicles", "FAIL", "No session token available")
        return False
    
    try:
        headers = {"Authorization": f"Bearer {test_data['demo_session']}"}
        payload = {
            "marca": "Fiat",
            "modello": "Panda",
            "targa": "AB123CD",
            "anno": 2020
        }
        response = requests.post(f"{BACKEND_URL}/vehicles", json=payload, headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            test_data["vehicle_id"] = data.get("vehicle_id")
            log_test("POST /api/vehicles", "PASS", 
                    f"Created: {data.get('marca')} {data.get('modello')} ({data.get('targa')})")
            return True
        else:
            log_test("POST /api/vehicles", "FAIL", 
                    f"Status code: {response.status_code}, Response: {response.text}")
            return False
    except Exception as e:
        log_test("POST /api/vehicles", "FAIL", f"Error: {str(e)}")
        return False

def test_get_vehicles():
    """Test get vehicles endpoint"""
    print(f"\n{Colors.BLUE}{'='*60}{Colors.END}")
    print(f"{Colors.BLUE}VEHICLES - GET{Colors.END}")
    print(f"{Colors.BLUE}{'='*60}{Colors.END}")
    
    if not test_data["demo_session"]:
        log_test("GET /api/vehicles", "FAIL", "No session token available")
        return False
    
    try:
        headers = {"Authorization": f"Bearer {test_data['demo_session']}"}
        response = requests.get(f"{BACKEND_URL}/vehicles", headers=headers, timeout=10)
        
        if response.status_code == 200:
            vehicles = response.json()
            log_test("GET /api/vehicles", "PASS", 
                    f"Found {len(vehicles)} vehicle(s)")
            return True
        else:
            log_test("GET /api/vehicles", "FAIL", 
                    f"Status code: {response.status_code}, Response: {response.text}")
            return False
    except Exception as e:
        log_test("GET /api/vehicles", "FAIL", f"Error: {str(e)}")
        return False

def test_get_slots():
    """Test get available slots endpoint"""
    print(f"\n{Colors.BLUE}{'='*60}{Colors.END}")
    print(f"{Colors.BLUE}SLOTS - GET AVAILABLE{Colors.END}")
    print(f"{Colors.BLUE}{'='*60}{Colors.END}")
    
    try:
        # Get slots for tomorrow
        tomorrow = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
        response = requests.get(f"{BACKEND_URL}/slots?date={tomorrow}", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            slots = data.get("slots", [])
            available_slots = [s for s in slots if s.get("available")]
            log_test("GET /api/slots", "PASS", 
                    f"Date: {tomorrow}, Total slots: {len(slots)}, Available: {len(available_slots)}")
            return True
        else:
            log_test("GET /api/slots", "FAIL", 
                    f"Status code: {response.status_code}, Response: {response.text}")
            return False
    except Exception as e:
        log_test("GET /api/slots", "FAIL", f"Error: {str(e)}")
        return False

def test_create_booking():
    """Test create booking endpoint"""
    print(f"\n{Colors.BLUE}{'='*60}{Colors.END}")
    print(f"{Colors.BLUE}BOOKINGS - CREATE{Colors.END}")
    print(f"{Colors.BLUE}{'='*60}{Colors.END}")
    
    if not test_data["demo_session"]:
        log_test("POST /api/bookings", "FAIL", "No session token available")
        return False
    
    if not test_data["vehicle_id"]:
        log_test("POST /api/bookings", "FAIL", "No vehicle_id available")
        return False
    
    if not test_data["service_id"]:
        log_test("POST /api/bookings", "FAIL", "No service_id available")
        return False
    
    try:
        headers = {"Authorization": f"Bearer {test_data['demo_session']}"}
        # Schedule for tomorrow at 10:00
        tomorrow = datetime.now() + timedelta(days=1)
        scheduled_date = tomorrow.replace(hour=10, minute=0, second=0, microsecond=0)
        
        payload = {
            "vehicle_id": test_data["vehicle_id"],
            "service_id": test_data["service_id"],
            "scheduled_date": scheduled_date.isoformat(),
            "notes": "Test booking from automated tests"
        }
        response = requests.post(f"{BACKEND_URL}/bookings", json=payload, headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            test_data["booking_id"] = data.get("booking_id")
            log_test("POST /api/bookings", "PASS", 
                    f"Booking ID: {data.get('booking_id')}, Status: {data.get('status')}")
            return True
        else:
            log_test("POST /api/bookings", "FAIL", 
                    f"Status code: {response.status_code}, Response: {response.text}")
            return False
    except Exception as e:
        log_test("POST /api/bookings", "FAIL", f"Error: {str(e)}")
        return False

def test_get_bookings():
    """Test get bookings endpoint"""
    print(f"\n{Colors.BLUE}{'='*60}{Colors.END}")
    print(f"{Colors.BLUE}BOOKINGS - GET{Colors.END}")
    print(f"{Colors.BLUE}{'='*60}{Colors.END}")
    
    if not test_data["demo_session"]:
        log_test("GET /api/bookings", "FAIL", "No session token available")
        return False
    
    try:
        headers = {"Authorization": f"Bearer {test_data['demo_session']}"}
        response = requests.get(f"{BACKEND_URL}/bookings", headers=headers, timeout=10)
        
        if response.status_code == 200:
            bookings = response.json()
            log_test("GET /api/bookings", "PASS", 
                    f"Found {len(bookings)} booking(s)")
            return True
        else:
            log_test("GET /api/bookings", "FAIL", 
                    f"Status code: {response.status_code}, Response: {response.text}")
            return False
    except Exception as e:
        log_test("GET /api/bookings", "FAIL", f"Error: {str(e)}")
        return False

def test_admin_get_bookings():
    """Test admin get all bookings endpoint"""
    print(f"\n{Colors.BLUE}{'='*60}{Colors.END}")
    print(f"{Colors.BLUE}ADMIN - GET ALL BOOKINGS{Colors.END}")
    print(f"{Colors.BLUE}{'='*60}{Colors.END}")
    
    try:
        # Admin endpoint doesn't require auth in current implementation
        response = requests.get(f"{BACKEND_URL}/admin/bookings", timeout=10)
        
        if response.status_code == 200:
            bookings = response.json()
            log_test("GET /api/admin/bookings", "PASS", 
                    f"Found {len(bookings)} booking(s)")
            return True
        else:
            log_test("GET /api/admin/bookings", "FAIL", 
                    f"Status code: {response.status_code}, Response: {response.text}")
            return False
    except Exception as e:
        log_test("GET /api/admin/bookings", "FAIL", f"Error: {str(e)}")
        return False

def test_admin_update_booking():
    """Test admin update booking endpoint"""
    print(f"\n{Colors.BLUE}{'='*60}{Colors.END}")
    print(f"{Colors.BLUE}ADMIN - UPDATE BOOKING{Colors.END}")
    print(f"{Colors.BLUE}{'='*60}{Colors.END}")
    
    if not test_data["booking_id"]:
        log_test("PUT /api/admin/bookings/{id}", "FAIL", "No booking_id available")
        return False
    
    try:
        payload = {
            "status": "confirmed",
            "admin_notes": "Booking confirmed by automated test"
        }
        response = requests.put(
            f"{BACKEND_URL}/admin/bookings/{test_data['booking_id']}", 
            json=payload, 
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            log_test("PUT /api/admin/bookings/{id}", "PASS", 
                    f"Updated status to: {data.get('status')}")
            return True
        else:
            log_test("PUT /api/admin/bookings/{id}", "FAIL", 
                    f"Status code: {response.status_code}, Response: {response.text}")
            return False
    except Exception as e:
        log_test("PUT /api/admin/bookings/{id}", "FAIL", f"Error: {str(e)}")
        return False

def test_logout():
    """Test logout endpoint"""
    print(f"\n{Colors.BLUE}{'='*60}{Colors.END}")
    print(f"{Colors.BLUE}AUTH - LOGOUT{Colors.END}")
    print(f"{Colors.BLUE}{'='*60}{Colors.END}")
    
    if not test_data["demo_session"]:
        log_test("POST /api/auth/logout", "FAIL", "No session token available")
        return False
    
    try:
        headers = {"Authorization": f"Bearer {test_data['demo_session']}"}
        response = requests.post(f"{BACKEND_URL}/auth/logout", headers=headers, timeout=10)
        
        if response.status_code == 200:
            log_test("POST /api/auth/logout", "PASS", "Logged out successfully")
            return True
        else:
            log_test("POST /api/auth/logout", "FAIL", 
                    f"Status code: {response.status_code}, Response: {response.text}")
            return False
    except Exception as e:
        log_test("POST /api/auth/logout", "FAIL", f"Error: {str(e)}")
        return False

def run_all_tests():
    """Run all backend tests"""
    print(f"\n{Colors.GREEN}{'='*60}{Colors.END}")
    print(f"{Colors.GREEN}AUTOFFICINA EUGANEA - BACKEND API TESTS{Colors.END}")
    print(f"{Colors.GREEN}Backend URL: {BACKEND_URL}{Colors.END}")
    print(f"{Colors.GREEN}{'='*60}{Colors.END}")
    
    results = []
    
    # Health & Info
    results.append(("Health Check", test_health_check()))
    results.append(("Contact Info", test_contact_info()))
    
    # Initialize Services
    results.append(("Init Services", test_init_services()))
    results.append(("Get Services", test_get_services()))
    
    # Auth - Registration
    results.append(("Register Demo User", test_register_demo_user()))
    results.append(("Register Admin User", test_register_admin_user()))
    
    # Auth - Login
    results.append(("Login Demo User", test_login_demo_user()))
    results.append(("Login Admin User", test_login_admin_user()))
    
    # Auth - Get Me
    results.append(("Get Current User", test_get_me()))
    
    # Vehicles
    results.append(("Create Vehicle", test_create_vehicle()))
    results.append(("Get Vehicles", test_get_vehicles()))
    
    # Slots
    results.append(("Get Available Slots", test_get_slots()))
    
    # Bookings
    results.append(("Create Booking", test_create_booking()))
    results.append(("Get User Bookings", test_get_bookings()))
    
    # Admin
    results.append(("Admin Get All Bookings", test_admin_get_bookings()))
    results.append(("Admin Update Booking", test_admin_update_booking()))
    
    # Logout
    results.append(("Logout", test_logout()))
    
    # Summary
    print(f"\n{Colors.GREEN}{'='*60}{Colors.END}")
    print(f"{Colors.GREEN}TEST SUMMARY{Colors.END}")
    print(f"{Colors.GREEN}{'='*60}{Colors.END}")
    
    passed = sum(1 for _, result in results if result)
    failed = sum(1 for _, result in results if not result)
    total = len(results)
    
    print(f"\nTotal Tests: {total}")
    print(f"{Colors.GREEN}Passed: {passed}{Colors.END}")
    print(f"{Colors.RED}Failed: {failed}{Colors.END}")
    print(f"Success Rate: {(passed/total)*100:.1f}%\n")
    
    if failed > 0:
        print(f"{Colors.RED}Failed Tests:{Colors.END}")
        for name, result in results:
            if not result:
                print(f"  {Colors.RED}❌ {name}{Colors.END}")
    
    return passed, failed, total

if __name__ == "__main__":
    passed, failed, total = run_all_tests()
    exit(0 if failed == 0 else 1)
