/**
 * AUTHENTICATION SYSTEM - TESTING CHECKLIST
 * 
 * Complete testing checklist to verify all authentication features work
 */

# ✅ Authentication System - Testing Checklist

## 🎯 Quick Start
```bash
npm run dev:full
```
Opens app at http://localhost:5173

---

## 📋 Pre-Test Verification

- [ ] JSON Server running (should see message in terminal)
- [ ] React app running on http://localhost:5173
- [ ] No console errors (F12 → Console tab)
- [ ] db.json file exists in project root
- [ ] AppContext.jsx has signup method

---

## 🧪 Test Scenario 1: Valid Customer Login

**Expected Result**: ✅ Login successful, redirect to home page

### Steps:
1. Navigate to http://localhost:5173/login
2. Enter:
   - Email: `john@example.com`
   - Password: `john@123`
3. Click "Login"

### Verify:
- [ ] No error message
- [ ] Redirects to home page (http://localhost:5173)
- [ ] Navbar shows "Hi John Doe" or user name
- [ ] Page loads products

---

## 🧪 Test Scenario 2: Invalid Email

**Expected Result**: ❌ Error message "Invalid email or password"

### Steps:
1. Navigate to http://localhost:5173/login
2. Enter:
   - Email: `nonexistent@example.com`
   - Password: `anypassword`
3. Click "Login"

### Verify:
- [ ] Error message appears
- [ ] Doesn't redirect
- [ ] User stays on login page
- [ ] Error is dismissible

---

## 🧪 Test Scenario 3: Wrong Password

**Expected Result**: ❌ Error message "Invalid email or password"

### Steps:
1. Navigate to http://localhost:5173/login
2. Enter:
   - Email: `john@example.com`
   - Password: `wrongpassword123`
3. Click "Login"

### Verify:
- [ ] Error message appears
- [ ] Doesn't redirect
- [ ] User stays on login page

---

## 🧪 Test Scenario 4: Admin Login

**Expected Result**: ✅ Login successful, redirect to admin dashboard

### Steps:
1. Navigate to http://localhost:5173/login
2. Enter:
   - Email: `admin@shop.com`
   - Password: `admin123`
3. Click "Login"

### Verify:
- [ ] No error message
- [ ] Redirects to /admin
- [ ] Admin dashboard appears
- [ ] Can see analytics and order management

---

## 🧪 Test Scenario 5: Empty Fields

**Expected Result**: ❌ Error message "Please enter both email and password"

### Steps:
1. Navigate to http://localhost:5173/login
2. Leave both fields empty
3. Click "Login"

### Verify:
- [ ] Error message appears
- [ ] Clear validation message
- [ ] Doesn't submit form

---

## 🧪 Test Scenario 6: Signup - Valid New Account

**Expected Result**: ✅ Account created, auto-logged in, redirect to home

### Steps:
1. Navigate to http://localhost:5173/signup
2. Fill form:
   - Name: `Test User`
   - Email: `testuser_[random]@example.com` (use unique email)
   - Password: `TestPass@123`
   - Confirm: `TestPass@123`
3. Click "Sign Up"

### Verify:
- [ ] No error message
- [ ] Account created (check db.json)
- [ ] Auto-logged in
- [ ] Redirected to home page
- [ ] Navbar shows user name

---

## 🧪 Test Scenario 7: Signup - Duplicate Email

**Expected Result**: ❌ Error message "Email already registered"

### Steps:
1. Navigate to http://localhost:5173/signup
2. Fill form with existing email:
   - Name: `New Name`
   - Email: `john@example.com` (already registered)
   - Password: `NewPass@123`
   - Confirm: `NewPass@123`
3. Click "Sign Up"

### Verify:
- [ ] Error message "Email already registered" appears
- [ ] Account NOT created
- [ ] Stays on signup page
- [ ] Can dismiss error

---

## 🧪 Test Scenario 8: Signup - Weak Password

**Expected Result**: ❌ Error message about password strength

### Steps:
1. Navigate to http://localhost:5173/signup
2. Fill form:
   - Name: `Test User`
   - Email: `weakpass@example.com`
   - Password: `short` (less than 6 chars, no special char)
   - Confirm: `short`
3. Click "Sign Up"

### Verify:
- [ ] Error message appears
- [ ] Clear password requirement info shown
- [ ] Account NOT created

---

## 🧪 Test Scenario 9: Signup - Passwords Don't Match

**Expected Result**: ❌ Error message "Passwords do not match"

### Steps:
1. Navigate to http://localhost:5173/signup
2. Fill form:
   - Name: `Test User`
   - Email: `nomatch@example.com`
   - Password: `TestPass@123`
   - Confirm: `Different@123`
3. Click "Sign Up"

### Verify:
- [ ] Error message "Passwords do not match"
- [ ] Account NOT created
- [ ] Stays on signup page

---

## 🧪 Test Scenario 10: Session Persistence

**Expected Result**: ✅ User stays logged in after page refresh

### Steps:
1. Login with john@example.com / john@123
2. Verify logged in (navbar shows name)
3. Press F5 to refresh page
4. Wait for page to reload

### Verify:
- [ ] Still logged in after refresh
- [ ] User data persists
- [ ] localStorage contains "currentUser"
- [ ] No need to login again

---

## 🧪 Test Scenario 11: Logout

**Expected Result**: ✅ Session cleared, redirect to login

### Steps:
1. Login with any account
2. Find logout button (usually in navbar)
3. Click logout

### Verify:
- [ ] Redirects to login page
- [ ] localStorage cleared (currentUser removed)
- [ ] Refresh page - still on login
- [ ] Can't access protected pages

---

## 🧪 Test Scenario 12: Show/Hide Password

**Expected Result**: ✅ Password toggles between visible and hidden

### Steps:
1. Navigate to /login or /signup
2. Enter password: `TestPass@123`
3. Click "Show" button

### Verify:
- [ ] Password becomes visible as plain text
- [ ] Button changes to "Hide"
- [ ] Click "Hide" - password hidden again
- [ ] Shows dots/circles when hidden

---

## 🧪 Test Scenario 13: Already Logged In

**Expected Result**: ✅ Auto-redirect if accessing login/signup

### Steps:
1. Login with john@example.com
2. Manually navigate to http://localhost:5173/login
3. Wait for page load

### Verify:
- [ ] Auto-redirects to home page
- [ ] Doesn't show login form
- [ ] Happens automatically

---

## 🧪 Test Scenario 14: Load Test Accounts

**Expected Result**: ✅ All 3 pre-created accounts work

### Steps:
Test each account:

**Account 1:**
- Email: `john@example.com`
- Password: `john@123`

**Account 2:**
- Email: `sarah@example.com`
- Password: `sarah@456`

**Account 3:**
- Email: `mike@example.com`
- Password: `mike@789`

### Verify:
- [ ] john@example.com login works
- [ ] sarah@example.com login works
- [ ] mike@example.com login works
- [ ] Each shows correct name in navbar

---

## 🧪 Test Scenario 15: Role-Based Access

**Expected Result**: ✅ Different dashboards for admin vs customer

### Steps:
1. Login as customer (john@example.com)
2. Verify at home page
3. Try to access /admin (manually type URL)
4. Logout
5. Login as admin (admin@shop.com)
6. Verify at /admin dashboard

### Verify:
- [ ] Customer sees home/products page
- [ ] Admin sees admin dashboard
- [ ] Can't access admin as customer
- [ ] Can access admin with admin credentials

---

## 🧪 Test Scenario 16: Multiple Test Accounts

**Expected Result**: ✅ Can login/logout between different accounts

### Steps:
1. Login as john
2. Verify navbar shows "John"
3. Logout
4. Login as sarah
5. Verify navbar shows "Sarah"
6. Logout
7. Login as admin
8. Verify admin dashboard

### Verify:
- [ ] Navbar updates with each login
- [ ] Switching accounts works seamlessly
- [ ] No data confusion between accounts
- [ ] Each session is isolated

---

## 🧪 Test Scenario 17: Create and Login to New Account

**Expected Result**: ✅ Can create account and immediately use it

### Steps:
1. Go to /signup
2. Create new account
3. Auto-logged in to new account
4. Logout
5. Go to /login
6. Try to login with newly created email

### Verify:
- [ ] New account created successfully
- [ ] Auto-login worked after signup
- [ ] Can login with new credentials
- [ ] Account saved in db.json

---

## 🧪 Test Scenario 18: Error Recovery

**Expected Result**: ✅ Can recover from errors and try again

### Steps:
1. Go to login
2. Enter invalid credentials → error
3. Clear form
4. Enter valid credentials
5. Login

### Verify:
- [ ] Error dismissible
- [ ] Can clear error message
- [ ] Can try again immediately
- [ ] Previous error doesn't block new attempt

---

## 🧪 Test Scenario 19: Form Validation Feedback

**Expected Result**: ✅ Clear feedback on all form validations

### Steps:
1. Go to signup
2. Try:
   - Empty name field
   - Empty email field
   - Empty password field
   - Invalid email format
   - Password too short
   - Mismatched passwords

### Verify:
- [ ] All validations trigger error messages
- [ ] Error messages are clear
- [ ] Tell user what's wrong
- [ ] Show requirements for passwords

---

## 🧪 Test Scenario 20: Database Integrity

**Expected Result**: ✅ New accounts saved to db.json

### Steps:
1. Create new account via signup
2. Open db.json file
3. Look for new customer entry

### Verify:
- [ ] New customer appears in db.json
- [ ] Has correct email, name, role
- [ ] Has createdAt timestamp
- [ ] Can restart app and still login

---

## 📊 Test Summary

### Critical Tests (Must Pass)
- [ ] ✅ Valid customer login works
- [ ] ✅ Invalid credentials rejected
- [ ] ✅ Admin login works
- [ ] ✅ Signup creates account
- [ ] ✅ Duplicate email detected
- [ ] ✅ Session persists

### Important Tests (Should Pass)
- [ ] ✅ Password show/hide works
- [ ] ✅ Error messages clear
- [ ] ✅ Logout clears session
- [ ] ✅ Role-based access works
- [ ] ✅ Form validation works

### Nice-to-Have Tests (Good to Pass)
- [ ] ✅ Multiple account switching
- [ ] ✅ Auto-redirect when logged in
- [ ] ✅ All test accounts work
- [ ] ✅ Database updates correctly

---

## ✅ Final Checklist

- [ ] All 20 test scenarios completed
- [ ] No console errors during testing
- [ ] No database errors
- [ ] All error messages clear and helpful
- [ ] Session management working
- [ ] Admin vs customer differentiated
- [ ] Form validation all working
- [ ] Password requirements enforced
- [ ] Duplicate emails prevented
- [ ] New accounts saved to db.json

---

## 🐛 Issues Found

If you find any issues, document them here:

### Issue Template:
```
Test #: __
Title: __
Steps to Reproduce:
1. 
2. 
3. 

Expected:
Actual:
Severity: Critical / High / Medium / Low
```

---

## ✨ Notes

- Use unique test emails to avoid conflicts
- Check browser console (F12) for helpful errors
- Restart JSON Server if issues persist
- Clear browser cache if stuck
- Check db.json to verify data saved

---

**Testing Date**: ___________  
**Tester Name**: ___________  
**Test Environment**: Local (npm run dev:full)  
**Status**: ________ (Pass/Fail)  

All tests passed? 🎉 Authentication system is ready!

---

*Last Updated: December 31, 2025*
