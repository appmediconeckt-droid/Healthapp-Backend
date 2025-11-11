# 🏥 Patient-Doctor Matching API Documentation

## Overview
Complete system for patient signup with doctor selection, doctor dashboard showing assigned patients, and contact management.

---

## 📋 Table of Contents
1. [Patient Routes](#patient-routes)
2. [Doctor Routes](#doctor-routes)
3. [Database Schema Changes](#database-schema-changes)
4. [Frontend Implementation](#frontend-implementation)
5. [Setup Instructions](#setup-instructions)

---

## 🔐 Patient Routes

### 1. Get All Doctors List (For Dropdown)
**Endpoint:** `GET /patient/doctors/list`  
**Authentication:** Public (No token required)

**Query Parameters:**
- `specialization` (optional) - Filter by specialization
- `city` (optional) - Filter by clinic city

**Request:**
```bash
GET http://localhost:5000/patient/doctors/list?specialization=Cardiology&city=Mumbai
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "doctors": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "fullName": "Dr. Rajesh Kumar",
      "specialization": "Cardiology",
      "experience": 15,
      "clinicCity": "Mumbai",
      "rating": 4.8,
      "consultationFee": 500,
      "clinicPhone": "9876543210"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "fullName": "Dr. Priya Singh",
      "specialization": "Cardiology",
      "experience": 10,
      "clinicCity": "Mumbai",
      "rating": 4.6,
      "consultationFee": 450,
      "clinicPhone": "9876543211"
    }
  ]
}
```

---

### 2. Patient Signup with Doctor Selection
**Endpoint:** `POST /patient/signup`  
**Authentication:** Public (No token required)

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "SecurePass123",
  "gender": "male",
  "age": 35,
  "bloodGroup": "O+",
  "birthDate": "1989-01-15",
  "address": "123 Main Street, Mumbai",
  "medicalConditions": ["Diabetes", "Hypertension"],
  "allergies": "Penicillin",
  "medications": "Metformin 500mg daily",
  "emergencyName": "Jane Doe",
  "emergencyPhone": "9876543211",
  "preferredDoctorId": "507f1f77bcf86cd799439011"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Patient signup successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439013",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "patient",
    "preferredDoctor": {
      "doctorId": "507f1f77bcf86cd799439011",
      "doctorName": "Dr. Rajesh Kumar",
      "doctorSpecialization": "Cardiology"
    }
  }
}
```

**Response (Error - Email exists):**
```json
{
  "success": false,
  "message": "Email already exists"
}
```

**Response (Error - Invalid doctor):**
```json
{
  "success": false,
  "message": "Selected doctor not found"
}
```

---

### 3. Get Patient Profile
**Endpoint:** `GET /patient/me`  
**Authentication:** Required (Bearer Token)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "patient": {
    "_id": "507f1f77bcf86cd799439013",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "role": "patient",
    "gender": "male",
    "age": 35,
    "bloodGroup": "O+",
    "address": "123 Main Street, Mumbai",
    "medicalConditions": ["Diabetes", "Hypertension"],
    "allergies": "Penicillin",
    "medications": "Metformin 500mg daily",
    "emergencyName": "Jane Doe",
    "emergencyPhone": "9876543211",
    "preferredDoctor": {
      "doctorId": "507f1f77bcf86cd799439011",
      "doctorName": "Dr. Rajesh Kumar",
      "doctorSpecialization": "Cardiology"
    }
  }
}
```

---

### 4. Update Patient Profile
**Endpoint:** `PUT /patient/profile`  
**Authentication:** Required (Bearer Token)

**Request Body:**
```json
{
  "phone": "9876543212",
  "age": 36,
  "bloodGroup": "A+",
  "address": "456 New Street, Mumbai",
  "medicalConditions": ["Diabetes"],
  "allergies": "Penicillin, Sulfa",
  "medications": "Metformin 500mg, Lisinopril 10mg"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Patient profile updated successfully",
  "patient": {
    "_id": "507f1f77bcf86cd799439013",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "9876543212",
    "age": 36,
    "bloodGroup": "A+",
    "address": "456 New Street, Mumbai",
    "medicalConditions": ["Diabetes"],
    "allergies": "Penicillin, Sulfa",
    "medications": "Metformin 500mg, Lisinopril 10mg"
  }
}
```

---

## 🏨 Doctor Routes

### 1. Get Doctor Dashboard
**Endpoint:** `GET /doctor/dashboard`  
**Authentication:** Required (Bearer Token, Doctor only)

**Headers:**
```
Authorization: Bearer <doctor_token>
```

**Response:**
```json
{
  "message": "Doctor dashboard data",
  "data": {
    "doctor": {
      "_id": "507f1f77bcf86cd799439011",
      "fullName": "Dr. Rajesh Kumar",
      "email": "rajesh@example.com",
      "phone": "9876543210",
      "specialization": "Cardiology",
      "qualifications": "MBBS, MD",
      "experience": 15,
      "licenseNumber": "MED123456",
      "rating": 4.8,
      "consultationFee": 500
    },
    "clinic": {
      "address": "123 Medical Building, Fort",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001",
      "phone": "022-1234567"
    },
    "schedule": {
      "monday": { "startTime": "09:00", "endTime": "18:00" },
      "tuesday": { "startTime": "09:00", "endTime": "18:00" },
      "wednesday": { "startTime": "09:00", "endTime": "18:00" },
      "thursday": { "startTime": "09:00", "endTime": "18:00" },
      "friday": { "startTime": "09:00", "endTime": "18:00" },
      "saturday": { "startTime": "10:00", "endTime": "14:00" },
      "sunday": { "startTime": null, "endTime": null }
    },
    "patients": [
      {
        "patientId": "507f1f77bcf86cd799439013",
        "patientName": "John Doe",
        "email": "john@example.com",
        "phone": "9876543210",
        "createdAt": "2024-01-15T10:30:00Z"
      },
      {
        "patientId": "507f1f77bcf86cd799439014",
        "patientName": "Jane Smith",
        "email": "jane@example.com",
        "phone": "9876543211",
        "createdAt": "2024-01-20T14:45:00Z"
      }
    ],
    "stats": {
      "totalPatients": 2,
      "totalAppointments": 0,
      "rating": 4.8,
      "consultationFee": 500
    }
  }
}
```

---

### 2. Get Doctor Profile (Public)
**Endpoint:** `GET /doctor/profile/:doctorId`  
**Authentication:** Public (No token required)

**Response:**
```json
{
  "doctor": {
    "_id": "507f1f77bcf86cd799439011",
    "fullName": "Dr. Rajesh Kumar",
    "specialization": "Cardiology",
    "qualifications": "MBBS, MD",
    "experience": 15,
    "rating": 4.8,
    "clinicCity": "Mumbai",
    "availableSlots": {
      "monday": { "startTime": "09:00", "endTime": "18:00" },
      "tuesday": { "startTime": "09:00", "endTime": "18:00" }
    },
    "consultationFee": 500
  }
}
```

---

### 3. Get All Doctors List (Public)
**Endpoint:** `GET /doctor/list`  
**Authentication:** Public (No token required)

**Query Parameters:**
- `specialization` (optional) - Filter by specialization
- `city` (optional) - Filter by city

**Response:**
```json
{
  "count": 5,
  "doctors": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "fullName": "Dr. Rajesh Kumar",
      "specialization": "Cardiology",
      "experience": 15,
      "clinicCity": "Mumbai",
      "rating": 4.8,
      "consultationFee": 500,
      "availableSlots": {
        "monday": { "startTime": "09:00", "endTime": "18:00" }
      }
    }
  ]
}
```

---

### 4. Update Doctor Schedule
**Endpoint:** `PUT /doctor/schedule`  
**Authentication:** Required (Bearer Token, Doctor only)

**Request Body:**
```json
{
  "availableSlots": {
    "monday": { "startTime": "08:00", "endTime": "17:00" },
    "tuesday": { "startTime": "08:00", "endTime": "17:00" },
    "wednesday": { "startTime": "08:00", "endTime": "17:00" },
    "thursday": { "startTime": "08:00", "endTime": "17:00" },
    "friday": { "startTime": "08:00", "endTime": "17:00" },
    "saturday": { "startTime": "09:00", "endTime": "13:00" },
    "sunday": { "startTime": null, "endTime": null }
  }
}
```

**Response:**
```json
{
  "message": "Schedule updated successfully",
  "doctor": {
    "_id": "507f1f77bcf86cd799439011",
    "fullName": "Dr. Rajesh Kumar",
    "availableSlots": {
      "monday": { "startTime": "08:00", "endTime": "17:00" }
    }
  }
}
```

---

### 5. Update Doctor Profile
**Endpoint:** `PUT /doctor/profile`  
**Authentication:** Required (Bearer Token, Doctor only)

**Request Body:**
```json
{
  "phone": "9876543215",
  "specialization": "Cardiology & Interventional",
  "qualifications": "MBBS, MD, DNB",
  "experience": 16,
  "clinicAddress": "456 New Medical Building",
  "clinicCity": "Mumbai",
  "clinicState": "Maharashtra",
  "clinicPincode": "400002",
  "clinicPhone": "022-9876543",
  "consultationFee": 600
}
```

**Response:**
```json
{
  "message": "Profile updated successfully",
  "doctor": {
    "_id": "507f1f77bcf86cd799439011",
    "fullName": "Dr. Rajesh Kumar",
    "phone": "9876543215",
    "specialization": "Cardiology & Interventional",
    "experience": 16,
    "consultationFee": 600
  }
}
```

---

## 📊 Database Schema Changes

### User Schema Updates

**New Fields Added to Patient Profile:**
```javascript
preferredDoctor: {
  doctorId: mongoose.Schema.Types.ObjectId,
  doctorName: String,
  doctorSpecialization: String,
}
```

**New Fields Added to Doctor Profile:**
```javascript
patients: [{
  patientId: mongoose.Schema.Types.ObjectId,
  patientName: String,
  email: String,
  phone: String,
  createdAt: { type: Date, default: Date.now },
}]
```

---

## 💻 Frontend Implementation

### PatientSignup Screen

Features:
- Doctor dropdown with search/filter capability
- Display selected doctor details (name, specialization, rating, fee, city)
- Complete patient registration form
- Form validation
- Real-time doctor list fetching

### DoctorDashboard Screen

Features:
- Display all assigned patients
- Patient contact information
- Call/SMS functionality
- Patient registration date
- Empty state when no patients
- Refresh functionality

---

## 🚀 Setup Instructions

### Backend Setup

1. **Update User Model:**
   ```bash
   # No installation needed - schema is already updated
   ```

2. **Create Patient Controller:**
   - File: `controllers/patientController.js`
   - Contains: `getAllDoctors`, `patientSignup`, `getPatientProfile`, `updatePatientProfile`

3. **Update Patient Routes:**
   - File: `routes/patientRoutes.js`
   - Routes: GET `/patient/doctors/list`, POST `/patient/signup`, GET `/patient/me`, PUT `/patient/profile`

4. **Update Doctor Routes:**
   - Dashboard now includes patient list in response

5. **Start Backend:**
   ```bash
   npm run dev
   # or
   npm start
   ```

### Frontend Setup

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Update Backend URL:**
   - In `PatientSignup.js` - Change `API_BASE_URL`
   - In `DoctorDashboard.js` - Change API endpoint

3. **Register Screens in Navigation:**
   ```javascript
   <Stack.Screen name="PatientSignup" component={PatientSignup} />
   <Stack.Screen name="DoctorDashboard" component={DoctorDashboard} />
   ```

4. **Run App:**
   ```bash
   npm run android
   # or
   npm run ios
   ```

---

## 🔍 Testing the Feature

### Test Patient Signup with Doctor Selection:
```bash
curl -X POST http://localhost:5000/patient/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test Patient",
    "email": "test@example.com",
    "phone": "9876543210",
    "password": "Test@123",
    "age": 30,
    "bloodGroup": "O+",
    "preferredDoctorId": "507f1f77bcf86cd799439011"
  }'
```

### Test Get Doctors List:
```bash
curl http://localhost:5000/patient/doctors/list
```

### Test Doctor Dashboard with Patients:
```bash
curl -H "Authorization: Bearer <doctor_token>" \
  http://localhost:5000/doctor/dashboard
```

---

## ✅ Key Features

✅ Patient can select a doctor during signup  
✅ Doctor list dropdown with filtering  
✅ Doctor details displayed before selection  
✅ Patient data automatically added to doctor's patient list  
✅ Doctor dashboard shows all assigned patients  
✅ Contact patient functionality (call/SMS)  
✅ Patient registration date tracking  
✅ Full form validation  
✅ Error handling  
✅ Loading states  

---

## 📱 API Base URL
Update these values based on your environment:

**Development:**
```
http://192.168.1.100:5000
```

**Production:**
```
https://yourdomain.com
```

---

## 🐛 Troubleshooting

**Issue:** Doctors not loading in dropdown
- **Solution:** Check API_BASE_URL and ensure backend is running

**Issue:** Patient signup failing
- **Solution:** Check all required fields are filled, verify token generation

**Issue:** Doctor dashboard not showing patients
- **Solution:** Ensure doctor is logged in with correct token, check patients array in database

---

## 📝 Notes

- All sensitive data (passwords) are hashed using bcryptjs
- JWT tokens expire in 7 days
- Patient-Doctor relationship is established at signup time
- Doctor can manually update their schedule and profile anytime
- Patient data is viewable only to assigned doctor

---

**Last Updated:** January 2024  
**Version:** 1.0.0
