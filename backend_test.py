import requests
import sys
from datetime import datetime

class PrachurjaAPITester:
    def __init__(self, base_url="https://authentic-assam.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.session = requests.Session()  # For cookie persistence
        self.admin_credentials = {
            "email": "admin@prachurja.in",
            "password": "Prachurja@2026"
        }
        self.expected_products = [
            "assam-tea", "organic-honey", "bamboo-craft-collection", 
            "traditional-assamese-dress", "joha-rice"
        ]
        self.expected_categories = ["tea", "honey", "bamboo", "handloom", "rice"]

    def run_test(self, name, method, endpoint, expected_status, data=None, validate_func=None, use_session=False):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}" if endpoint else self.base_url
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            client = self.session if use_session else requests
            if method == 'GET':
                response = client.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = client.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = client.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = client.delete(url, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                if validate_func:
                    try:
                        response_data = response.json()
                        validation_result = validate_func(response_data)
                        if validation_result:
                            self.tests_passed += 1
                            print(f"✅ Passed - Status: {response.status_code}, Validation: OK")
                        else:
                            print(f"❌ Failed - Status: {response.status_code}, Validation: FAILED")
                            success = False
                    except Exception as e:
                        print(f"❌ Failed - Validation error: {str(e)}")
                        success = False
                else:
                    self.tests_passed += 1
                    print(f"✅ Passed - Status: {response.status_code}")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                if response.status_code >= 400:
                    try:
                        error_data = response.json()
                        print(f"   Error details: {error_data}")
                    except:
                        print(f"   Error text: {response.text}")

            return success, response.json() if success and response.content else {}

        except requests.exceptions.Timeout:
            print(f"❌ Failed - Request timeout")
            return False, {}
        except requests.exceptions.ConnectionError:
            print(f"❌ Failed - Connection error")
            return False, {}
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def validate_products_list(self, data):
        """Validate products list response"""
        if not isinstance(data, list):
            print("   Expected list of products")
            return False
        
        if len(data) != 5:
            print(f"   Expected 5 products, got {len(data)}")
            return False
            
        required_fields = ['id', 'name', 'slug', 'price', 'category', 'image_url']
        for product in data:
            for field in required_fields:
                if field not in product:
                    print(f"   Missing field '{field}' in product")
                    return False
        
        slugs = [p['slug'] for p in data]
        for expected_slug in self.expected_products:
            if expected_slug not in slugs:
                print(f"   Missing expected product: {expected_slug}")
                return False
                
        print(f"   Found all 5 expected products: {slugs}")
        return True

    def validate_single_product(self, data, expected_slug):
        """Validate single product response"""
        required_fields = ['id', 'name', 'slug', 'price', 'category', 'image_url', 'description', 'benefits', 'origin', 'usage']
        
        for field in required_fields:
            if field not in data:
                print(f"   Missing field '{field}' in product")
                return False
        
        if data['slug'] != expected_slug:
            print(f"   Expected slug '{expected_slug}', got '{data['slug']}'")
            return False
            
        if not isinstance(data['benefits'], list) or len(data['benefits']) == 0:
            print("   Benefits should be a non-empty list")
            return False
            
        print(f"   Product '{data['name']}' validated successfully")
        return True

    def validate_contact_response(self, data):
        """Validate contact form response"""
        if 'message' not in data or 'id' not in data:
            print("   Missing 'message' or 'id' in response")
            return False
        
        if "thank you" not in data['message'].lower():
            print("   Expected thank you message")
            return False
            
        print(f"   Contact response: {data['message']}")
        return True

    def test_api_root(self):
        """Test API root endpoint"""
        return self.run_test(
            "API Root",
            "GET",
            "",
            200,
            validate_func=lambda data: "message" in data and "prachurja" in data["message"].lower()
        )

    def test_get_all_products(self):
        """Test getting all products"""
        return self.run_test(
            "Get All Products",
            "GET",
            "products",
            200,
            validate_func=self.validate_products_list
        )

    def test_get_product_by_slug(self, slug):
        """Test getting a specific product by slug"""
        return self.run_test(
            f"Get Product: {slug}",
            "GET",
            f"products/{slug}",
            200,
            validate_func=lambda data: self.validate_single_product(data, slug)
        )

    def test_get_nonexistent_product(self):
        """Test getting a non-existent product"""
        return self.run_test(
            "Get Non-existent Product",
            "GET",
            "products/non-existent-product",
            404
        )

    def test_contact_form(self):
        """Test contact form submission"""
        test_data = {
            "name": f"Test User {datetime.now().strftime('%H%M%S')}",
            "email": "test@example.com",
            "subject": "Test Subject",
            "message": "This is a test message from automated testing."
        }
        
        return self.run_test(
            "Contact Form Submission",
            "POST",
            "contact",
            200,
            data=test_data,
            validate_func=self.validate_contact_response
        )

    def test_contact_form_invalid_data(self):
        """Test contact form with invalid data"""
        invalid_data = {
            "name": "",  # Empty name
            "email": "invalid-email",  # Invalid email
            "subject": "",
            "message": ""
        }
        
        # This should return 422 for validation error
        return self.run_test(
            "Contact Form Invalid Data",
            "POST",
            "contact",
            422,
            data=invalid_data
        )

    def validate_order_response(self, data):
        """Validate order creation response"""
        required_fields = ['message', 'id', 'status']
        for field in required_fields:
            if field not in data:
                print(f"   Missing field '{field}' in order response")
                return False
        
        if data['status'] != 'pending':
            print(f"   Expected status 'pending', got '{data['status']}'")
            return False
            
        print(f"   Order created with ID: {data['id']}, Status: {data['status']}")
        return True

    def test_create_order(self):
        """Test order creation"""
        order_data = {
            "customer_name": f"Test Customer {datetime.now().strftime('%H%M%S')}",
            "customer_phone": "+91 9876543210",
            "customer_email": "test@example.com",
            "shipping_address": "123 Test Street, Test Area",
            "shipping_city": "Guwahati",
            "shipping_pincode": "781001",
            "notes": "Test order for cart functionality",
            "items": [
                {
                    "product_slug": "assam-tea",
                    "product_name": "Assam Tea",
                    "price": 499,
                    "quantity": 2,
                    "image_url": "https://images.pexels.com/photos/9025660/pexels-photo-9025660.jpeg"
                },
                {
                    "product_slug": "organic-honey",
                    "product_name": "Organic Honey",
                    "price": 599,
                    "quantity": 1,
                    "image_url": "https://images.pexels.com/photos/8500508/pexels-photo-8500508.jpeg"
                }
            ],
            "total_amount": 1597  # 499*2 + 599*1
        }
        
        return self.run_test(
            "Create Order",
            "POST",
            "orders",
            200,
            data=order_data,
            validate_func=self.validate_order_response
        )

    def test_create_order_invalid_data(self):
        """Test order creation with invalid data"""
        invalid_order = {
            "customer_name": "",  # Empty name
            "items": [],  # Empty items
            "total_amount": 0
        }
        
        return self.run_test(
            "Create Order Invalid Data",
            "POST",
            "orders",
            422,
            data=invalid_order
        )

    def test_get_order(self, order_id):
        """Test getting order by ID"""
        return self.run_test(
            f"Get Order: {order_id}",
            "GET",
            f"orders/{order_id}",
            200,
            validate_func=lambda data: 'id' in data and data['id'] == order_id
        )

    # ===== ADMIN AUTHENTICATION TESTS =====
    
    def test_admin_login(self):
        """Test admin login"""
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "auth/login",
            200,
            data=self.admin_credentials,
            validate_func=self.validate_admin_login_response,
            use_session=True
        )
        return success, response

    def validate_admin_login_response(self, data):
        """Validate admin login response"""
        required_fields = ['id', 'email', 'name', 'role']
        for field in required_fields:
            if field not in data:
                print(f"   Missing field '{field}' in login response")
                return False
        
        if data['role'] != 'admin':
            print(f"   Expected role 'admin', got '{data['role']}'")
            return False
            
        if data['email'] != self.admin_credentials['email']:
            print(f"   Email mismatch in response")
            return False
            
        print(f"   Admin logged in: {data['email']} (Role: {data['role']})")
        return True

    def test_admin_me(self):
        """Test admin /auth/me endpoint"""
        return self.run_test(
            "Admin Auth Me",
            "GET",
            "auth/me",
            200,
            validate_func=lambda data: data.get('role') == 'admin' and data.get('email') == self.admin_credentials['email'],
            use_session=True
        )

    def test_admin_logout(self):
        """Test admin logout"""
        return self.run_test(
            "Admin Logout",
            "POST",
            "auth/logout",
            200,
            validate_func=lambda data: 'message' in data and 'logged out' in data['message'].lower(),
            use_session=True
        )

    # ===== ADMIN DASHBOARD TESTS =====
    
    def test_admin_dashboard(self):
        """Test admin dashboard stats"""
        return self.run_test(
            "Admin Dashboard Stats",
            "GET",
            "admin/dashboard",
            200,
            validate_func=self.validate_dashboard_response,
            use_session=True
        )

    def validate_dashboard_response(self, data):
        """Validate dashboard stats response"""
        required_fields = ['total_products', 'total_orders', 'total_contacts', 'total_revenue', 'recent_orders']
        for field in required_fields:
            if field not in data:
                print(f"   Missing field '{field}' in dashboard response")
                return False
        
        # Check data types
        if not isinstance(data['total_products'], int) or data['total_products'] < 0:
            print("   total_products should be a non-negative integer")
            return False
            
        if not isinstance(data['total_orders'], int) or data['total_orders'] < 0:
            print("   total_orders should be a non-negative integer")
            return False
            
        if not isinstance(data['total_revenue'], int) or data['total_revenue'] < 0:
            print("   total_revenue should be a non-negative integer")
            return False
            
        if not isinstance(data['recent_orders'], list):
            print("   recent_orders should be a list")
            return False
            
        print(f"   Dashboard stats: {data['total_products']} products, {data['total_orders']} orders, Rs.{data['total_revenue']} revenue")
        return True

    # ===== ADMIN ORDERS TESTS =====
    
    def test_admin_orders_list(self):
        """Test admin orders list"""
        return self.run_test(
            "Admin Orders List",
            "GET",
            "admin/orders",
            200,
            validate_func=self.validate_orders_list_response,
            use_session=True
        )

    def validate_orders_list_response(self, data):
        """Validate orders list response"""
        required_fields = ['orders', 'total', 'page', 'pages']
        for field in required_fields:
            if field not in data:
                print(f"   Missing field '{field}' in orders list response")
                return False
        
        if not isinstance(data['orders'], list):
            print("   orders should be a list")
            return False
            
        print(f"   Orders list: {len(data['orders'])} orders on page {data['page']} of {data['pages']}")
        return True

    def test_admin_orders_filter(self):
        """Test admin orders with status filter"""
        return self.run_test(
            "Admin Orders Filter (Pending)",
            "GET",
            "admin/orders?status=pending",
            200,
            validate_func=lambda data: 'orders' in data and isinstance(data['orders'], list),
            use_session=True
        )

    # ===== ADMIN PRODUCTS TESTS =====
    
    def test_admin_products_list(self):
        """Test admin products list"""
        return self.run_test(
            "Admin Products List",
            "GET",
            "admin/products",
            200,
            validate_func=lambda data: isinstance(data, list) and len(data) >= 5,
            use_session=True
        )

    def test_admin_create_product(self):
        """Test admin product creation"""
        test_product = {
            "name": f"Test Product {datetime.now().strftime('%H%M%S')}",
            "slug": f"test-product-{datetime.now().strftime('%H%M%S')}",
            "tagline": "Test tagline",
            "description": "Test description",
            "benefits": ["Test benefit 1", "Test benefit 2"],
            "origin": "Test origin",
            "price": 999,
            "price_label": "Test Pack",
            "category": "tea",
            "image_url": "https://example.com/test.jpg",
            "usage": "Test usage"
        }
        
        success, response = self.run_test(
            "Admin Create Product",
            "POST",
            "admin/products",
            200,
            data=test_product,
            validate_func=lambda data: 'message' in data and 'id' in data,
            use_session=True
        )
        
        return success, response

    def test_admin_update_product(self, product_id):
        """Test admin product update"""
        update_data = {
            "name": f"Updated Product {datetime.now().strftime('%H%M%S')}",
            "price": 1299
        }
        
        return self.run_test(
            f"Admin Update Product: {product_id}",
            "PUT",
            f"admin/products/{product_id}",
            200,
            data=update_data,
            validate_func=lambda data: 'message' in data and 'updated' in data['message'].lower(),
            use_session=True
        )

    def test_admin_delete_product(self, product_id):
        """Test admin product deletion"""
        return self.run_test(
            f"Admin Delete Product: {product_id}",
            "DELETE",
            f"admin/products/{product_id}",
            200,
            validate_func=lambda data: 'message' in data and 'deleted' in data['message'].lower(),
            use_session=True
        )

    # ===== ADMIN CONTACTS TESTS =====
    
    def test_admin_contacts_list(self):
        """Test admin contacts list"""
        return self.run_test(
            "Admin Contacts List",
            "GET",
            "admin/contacts",
            200,
            validate_func=self.validate_contacts_list_response,
            use_session=True
        )

    def validate_contacts_list_response(self, data):
        """Validate contacts list response"""
        required_fields = ['contacts', 'total', 'page', 'pages']
        for field in required_fields:
            if field not in data:
                print(f"   Missing field '{field}' in contacts list response")
                return False
        
        if not isinstance(data['contacts'], list):
            print("   contacts should be a list")
            return False
            
        print(f"   Contacts list: {len(data['contacts'])} contacts on page {data['page']} of {data['pages']}")
        return True

    # ===== ADMIN AUTHORIZATION TESTS =====
    
    def test_admin_unauthorized_access(self):
        """Test admin endpoints without authentication"""
        # First logout to clear session
        self.session.post(f"{self.base_url}/auth/logout")
        
        endpoints = [
            "admin/dashboard",
            "admin/orders", 
            "admin/products",
            "admin/contacts"
        ]
        
        all_passed = True
        for endpoint in endpoints:
            success, _ = self.run_test(
                f"Unauthorized Access: {endpoint}",
                "GET",
                endpoint,
                401,
                use_session=True
            )
            if not success:
                all_passed = False
                
        return all_passed

def main():
    print("🚀 Starting Prachurja API Testing...")
    print("=" * 50)
    
    tester = PrachurjaAPITester()
    
    # Test API root
    tester.test_api_root()
    
    # Test products endpoints
    tester.test_get_all_products()
    
    # Test individual products
    for slug in tester.expected_products:
        tester.test_get_product_by_slug(slug)
    
    # Test non-existent product
    tester.test_get_nonexistent_product()
    
    # Test contact form
    tester.test_contact_form()
    tester.test_contact_form_invalid_data()
    
    # Test orders functionality
    print("\n🛒 Testing Cart/Orders Functionality...")
    order_success, order_response = tester.test_create_order()
    
    if order_success and order_response and 'id' in order_response:
        order_id = order_response['id']
        tester.test_get_order(order_id)
    
    tester.test_create_order_invalid_data()
    
    # ===== ADMIN FUNCTIONALITY TESTS =====
    print("\n👑 Testing Admin Functionality...")
    
    # Test unauthorized access first
    print("\n🔒 Testing Unauthorized Access...")
    tester.test_admin_unauthorized_access()
    
    # Test admin authentication
    print("\n🔐 Testing Admin Authentication...")
    admin_login_success, admin_response = tester.test_admin_login()
    
    if admin_login_success:
        # Test authenticated admin endpoints
        print("\n📊 Testing Admin Dashboard...")
        tester.test_admin_dashboard()
        
        print("\n📋 Testing Admin Orders Management...")
        tester.test_admin_orders_list()
        tester.test_admin_orders_filter()
        
        print("\n📦 Testing Admin Products Management...")
        tester.test_admin_products_list()
        
        # Test product CRUD operations
        product_success, product_response = tester.test_admin_create_product()
        if product_success and product_response and 'id' in product_response:
            product_id = product_response['id']
            tester.test_admin_update_product(product_id)
            tester.test_admin_delete_product(product_id)
        
        print("\n📧 Testing Admin Contacts Management...")
        tester.test_admin_contacts_list()
        
        print("\n🔓 Testing Admin Auth Me...")
        tester.test_admin_me()
        
        print("\n👋 Testing Admin Logout...")
        tester.test_admin_logout()
    else:
        print("❌ Admin login failed - skipping admin tests")
    
    # Print results
    print("\n" + "=" * 50)
    print(f"📊 FINAL RESULTS:")
    print(f"   Tests Run: {tester.tests_run}")
    print(f"   Tests Passed: {tester.tests_passed}")
    print(f"   Tests Failed: {tester.tests_run - tester.tests_passed}")
    print(f"   Success Rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print("❌ Some tests failed!")
        return 1

if __name__ == "__main__":
    sys.exit(main())