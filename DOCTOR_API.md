# Doctor API Documentation

## Base URL
```
https://healthapp-backend-production-38c4.up.railway.app
```

---

## 1. Doctor Signup API

### Endpoint
```
POST /api/auth/doctor/signup
```

### Request Body
```json
{
  "fullName": "Dr. Rajesh Kumar",
  "email": "rajesh@clinic.com",
  "phone": "9876543210",
  "password": "123456",
  "gender": "male",
  "age": 35,
  "specialization": "Cardiology",
  "qualifications": "MBBS, MD",
  "experience": 8,
  "licenseNumber": "MCI12345",
  "clinicAddress": "123 Medical Street",
  "clinicCity": "Mumbai",
  "clinicState": "Maharashtra",
  "clinicPincode": "400001",
  "clinicPhone": "9876543210",
  "consultationFee": 500
}
```

### Required Fields
- `fullName`
- `email`
- `phone`
- `password`
- `specialization`

### Response (Success - 201)
```json
{
  "message": "Doctor signup successful",
  "doctor": {
    "_id": "507f1f77bcf86cd799439011",
    "fullName": "Dr. Rajesh Kumar",
    "email": "rajesh@clinic.com",
    "specialization": "Cardiology",
    "clinicCity": "Mumbai"
  }
}
```

---

## 2. Doctor Login API

### Endpoint
```
POST /api/auth/login
```

### Request Body
```json
{
  "email": "rajesh@clinic.com",
  "password": "123456",
  "role": "doctor"
}
```

### Response (Success - 200)
```json
{
  "message": "Login Successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "fullName": "Dr. Rajesh Kumar",
    "email": "rajesh@clinic.com",
    "phone": "9876543210",
    "role": "doctor",
    "specialization": "Cardiology"
  }
}
```

---

## 3. Get Doctor Dashboard

### Endpoint
```
GET /doctor/dashboard
```

### Headers
```
Authorization: Bearer {token}
Content-Type: application/json
```

### Response (Success - 200)
```json
{
  "message": "Doctor dashboard data",
  "data": {
    "doctor": {
      "_id": "507f1f77bcf86cd799439011",
      "fullName": "Dr. Rajesh Kumar",
      "email": "rajesh@clinic.com",
      "phone": "9876543210",
      "specialization": "Cardiology",
      "qualifications": "MBBS, MD",
      "experience": 8,
      "licenseNumber": "MCI12345",
      "rating": 4.5,
      "consultationFee": 500
    },
    "clinic": {
      "address": "123 Medical Street",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001",
      "phone": "9876543210"
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
    "stats": {
      "totalPatients": 42,
      "totalAppointments": 156,
      "rating": 4.5,
      "consultationFee": 500
    }
  }
}
```

---

## 4. Get All Doctors (Search/List)

### Endpoint
```
GET /doctor/list?specialization=Cardiology&city=Mumbai
```

### Query Parameters
- `specialization` (optional): Filter by specialization
- `city` (optional): Filter by clinic city

### Response (Success - 200)
```json
{
  "count": 15,
  "doctors": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "fullName": "Dr. Rajesh Kumar",
      "specialization": "Cardiology",
      "experience": 8,
      "clinicCity": "Mumbai",
      "rating": 4.5,
      "consultationFee": 500,
      "availableSlots": { ... }
    }
  ]
}
```

---

## 5. Get Doctor Profile (Public)

### Endpoint
```
GET /doctor/profile/{doctorId}
```

### Parameters
- `doctorId`: Doctor's MongoDB ID

### Response (Success - 200)
```json
{
  "doctor": {
    "_id": "507f1f77bcf86cd799439011",
    "fullName": "Dr. Rajesh Kumar",
    "specialization": "Cardiology",
    "qualifications": "MBBS, MD",
    "experience": 8,
    "clinicCity": "Mumbai",
    "rating": 4.5,
    "consultationFee": 500,
    "availableSlots": { ... }
  }
}
```

---

## 6. Update Doctor Profile

### Endpoint
```
PUT /doctor/profile
```

### Headers
```
Authorization: Bearer {token}
Content-Type: application/json
```

### Request Body (All Optional)
```json
{
  "phone": "9876543210",
  "specialization": "Cardiology",
  "qualifications": "MBBS, MD, DM",
  "experience": 10,
  "clinicAddress": "456 Heart Street",
  "clinicCity": "Bangalore",
  "clinicState": "Karnataka",
  "clinicPincode": "560001",
  "clinicPhone": "9876543210",
  "consultationFee": 600
}
```

### Response (Success - 200)
```json
{
  "message": "Profile updated successfully",
  "doctor": { ... }
}
```

---

## 7. Update Doctor Schedule

### Endpoint
```
PUT /doctor/schedule
```

### Headers
```
Authorization: Bearer {token}
Content-Type: application/json
```

### Request Body
```json
{
  "availableSlots": {
    "monday": { "startTime": "09:00", "endTime": "18:00" },
    "tuesday": { "startTime": "09:00", "endTime": "18:00" },
    "wednesday": { "startTime": "09:00", "endTime": "18:00" },
    "thursday": { "startTime": "09:00", "endTime": "18:00" },
    "friday": { "startTime": "09:00", "endTime": "18:00" },
    "saturday": { "startTime": "10:00", "endTime": "14:00" },
    "sunday": null
  }
}
```

### Response (Success - 200)
```json
{
  "message": "Schedule updated successfully",
  "doctor": { ... }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Please provide: fullName, email, phone, password, specialization"
}
```

### 401 Unauthorized
```json
{
  "message": "Invalid Token",
  "error": "jwt expired"
}
```

### 403 Forbidden
```json
{
  "message": "Only doctors can access this"
}
```

### 404 Not Found
```json
{
  "message": "Doctor not found"
}
```

### 500 Server Error
```json
{
  "message": "Server error",
  "error": "Database connection failed"
}
```

---

## Testing with cURL

### Doctor Signup
```bash
curl -X POST https://healthapp-backend-production-38c4.up.railway.app/api/auth/doctor/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Dr. Test",
    "email": "doctor@test.com",
    "phone": "9999999999",
    "password": "123456",
    "specialization": "General Practice"
  }'
```

### Doctor Login
```bash
curl -X POST https://healthapp-backend-production-38c4.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "doctor@test.com",
    "password": "123456",
    "role": "doctor"
  }'
```

### Get Dashboard (Use token from login)
```bash
curl -X GET https://healthapp-backend-production-38c4.up.railway.app/doctor/dashboard \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json"
```

---

## Notes
- Password must be at least 6 characters
- Email must be unique across the system
- Token expires in 7 days
- All timestamps are in UTC
- Consultation fee should be in INR (₹)
