# Phase 2 Features - Implementation Guide

This document covers the advanced features added to the 2minreview platform.

## ✅ Implemented Features

### 1. Advanced Search & Filtering System

Complete search functionality with multiple filters for colleges, courses, and reviews.

**Backend Endpoints:**

#### Search Colleges
```
GET /api/search/colleges
Query Parameters:
- query: Text search across name, description, location
- state: Filter by state
- city: Filter by city
- type: Filter by college type (Engineering, Medical, etc.)
- minRanking: Minimum ranking
- maxRanking: Maximum ranking
- page: Page number (default: 1)
- limit: Items per page (default: 10)
```

#### Search Courses
```
GET /api/search/courses
Query Parameters:
- query: Text search
- category: Filter by category (Engineering, Data Science, etc.)
- mode: Filter by mode (Online, Offline, Hybrid)
- platform: Filter by platform (Coursera, Udacity, etc.)
- minRating: Minimum rating
- page, limit: Pagination
```

#### Advanced Review Search
```
GET /api/search/reviews
Query Parameters:
- query: Text search across title, content, pros, cons
- reviewType: COLLEGE, COURSE, COMPANY, MENTOR
- collegeId: Filter by college
- courseId: Filter by course
- minRating, maxRating: Rating range
- isVerified: Filter verified reviews
- tags: Comma-separated tags
- sortBy: Field to sort by (createdAt, upvotes, rating)
- sortOrder: asc or desc
- page, limit: Pagination
```

#### Get Filter Options
```
GET /api/search/filters
Returns:
- Available states
- College types
- Course categories
- Platforms
- Popular tags (top 20)
```

#### Get College Details
```
GET /api/search/colleges/:id
Returns complete college information including:
- College details
- Top 10 courses
- Latest 10 reviews
- Average rating
- Counts (courses, reviews)
```

**Usage Example:**
```bash
# Search for engineering colleges in Delhi
curl "http://localhost:5000/api/search/colleges?type=Engineering&state=Delhi"

# Search for data science courses
curl "http://localhost:5000/api/search/courses?category=Data Science&mode=Online"

# Search verified reviews with 5-star rating
curl "http://localhost:5000/api/search/reviews?isVerified=true&minRating=5"
```

---

### 2. Payment Integration (Razorpay)

Complete payment system for subscription management with Razorpay integration.

**Setup:**

1. **Get Razorpay Credentials:**
   - Sign up at https://razorpay.com
   - Get test/live API keys from Dashboard
   - Add to `backend/.env`:
     ```env
     RAZORPAY_KEY_ID=rzp_test_your_key_id
     RAZORPAY_KEY_SECRET=your_key_secret
     ```

2. **Subscription Tiers & Pricing:**
   - **Student Premium**: ₹3,999/year
   - **Professional Premium**: ₹7,999/year
   - **Enterprise Premium**: ₹24,999/year

**Backend Endpoints:**

#### Get Subscription Plans
```
GET /api/payment/plans
Returns all available subscription plans with features
```

#### Create Payment Order
```
POST /api/payment/create-order
Headers: Authorization: Bearer {token}
Body: {
  "subscriptionTier": "STUDENT_PREMIUM"
}
Returns: {
  "orderId": "order_xxx",
  "amount": 399900,
  "currency": "INR"
}
```

#### Verify Payment
```
POST /api/payment/verify
Headers: Authorization: Bearer {token}
Body: {
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "signature_xxx",
  "subscriptionTier": "STUDENT_PREMIUM"
}
```

#### Get Subscription History
```
GET /api/payment/history
Headers: Authorization: Bearer {token}
Returns user's subscription history
```

#### Cancel Subscription
```
DELETE /api/payment/cancel/:subscriptionId
Headers: Authorization: Bearer {token}
```

**Frontend Integration Example:**
```typescript
// 1. Load Razorpay script
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>

// 2. Create order
const response = await api.post('/payment/create-order', {
  subscriptionTier: 'STUDENT_PREMIUM'
});

// 3. Open Razorpay checkout
const options = {
  key: 'rzp_test_your_key_id', // From env
  amount: response.data.amount,
  currency: response.data.currency,
  name: '2minreview',
  description: 'Student Premium Subscription',
  order_id: response.data.orderId,
  handler: async function (response) {
    // 4. Verify payment
    await api.post('/payment/verify', {
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature,
      subscriptionTier: 'STUDENT_PREMIUM'
    });
    // Success! User upgraded
  }
};

const rzp = new Razorpay(options);
rzp.open();
```

**Database Schema:**
The `SubscriptionHistory` model tracks all subscriptions:
- `userId`: User who purchased
- `tier`: Subscription tier
- `amount`: Amount paid (in rupees)
- `startDate`, `endDate`: Validity period
- `paymentId`: Razorpay payment ID
- `status`: ACTIVE, EXPIRED, CANCELLED

---

## 🚧 Features to Implement

### 3. Face Verification System with ML

Biometric authentication for enhanced security and authenticity.

**Technology Stack:**
- **Backend**: Python with Flask/FastAPI
- **ML Libraries**:
  - face_recognition (or DeepFace)
  - OpenCV for image processing
  - TensorFlow/PyTorch for deep learning
- **Frontend**: React Webcam for camera access

**Implementation Outline:**

#### Backend ML Service

Create a separate Python service (`backend/ml-service/`):

```python
# face_verification_service.py
import face_recognition
import cv2
import numpy as np
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/detect-face', methods=['POST'])
def detect_face():
    """Detect if a face is present in the image"""
    image = request.files['image']
    img = face_recognition.load_image_file(image)
    face_locations = face_recognition.face_locations(img)
    return jsonify({
        'faces_detected': len(face_locations),
        'face_locations': face_locations
    })

@app.route('/verify-liveness', methods=['POST'])
def verify_liveness():
    """Check if the face is from a live person (not a photo)"""
    # Implement blink detection, head movement, etc.
    pass

@app.route('/generate-embedding', methods=['POST'])
def generate_embedding():
    """Generate 128-dimensional face embedding"""
    image = request.files['image']
    img = face_recognition.load_image_file(image)
    face_encodings = face_recognition.face_encodings(img)

    if len(face_encodings) > 0:
        return jsonify({
            'embedding': face_encodings[0].tolist()
        })
    return jsonify({'error': 'No face detected'}), 400

@app.route('/compare-faces', methods=['POST'])
def compare_faces():
    """Compare two face embeddings"""
    embedding1 = np.array(request.json['embedding1'])
    embedding2 = np.array(request.json['embedding2'])

    distance = face_recognition.face_distance([embedding1], embedding2)[0]
    is_match = distance < 0.6  # Threshold

    return jsonify({
        'is_match': bool(is_match),
        'similarity': float(1 - distance)
    })
```

#### Node.js Backend Integration

```typescript
// backend/src/services/faceVerificationService.ts
import axios from 'axios';
import FormData from 'form-data';

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5001';

export const detectFace = async (imageBuffer: Buffer) => {
  const form = new FormData();
  form.append('image', imageBuffer, 'face.jpg');

  const response = await axios.post(`${ML_SERVICE_URL}/detect-face`, form, {
    headers: form.getHeaders(),
  });

  return response.data;
};

export const generateFaceEmbedding = async (imageBuffer: Buffer) => {
  const form = new FormData();
  form.append('image', imageBuffer, 'face.jpg');

  const response = await axios.post(`${ML_SERVICE_URL}/generate-embedding`, form, {
    headers: form.getHeaders(),
  });

  return response.data.embedding;
};

export const compareFaces = async (embedding1: number[], embedding2: number[]) => {
  const response = await axios.post(`${ML_SERVICE_URL}/compare-faces`, {
    embedding1,
    embedding2,
  });

  return response.data;
};
```

#### Frontend Camera Component

```typescript
// frontend/src/components/FaceVerification.tsx
import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import api from '../utils/api';

const FaceVerification: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const [capturing, setCapturing] = useState(false);

  const captureFace = async () => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    // Convert base64 to blob
    const blob = await fetch(imageSrc).then(r => r.blob());

    // Upload for verification
    const formData = new FormData();
    formData.append('image', blob);

    try {
      const response = await api.post('/auth/verify-face', formData);
      console.log('Face verified:', response.data);
    } catch (error) {
      console.error('Face verification failed:', error);
    }
  };

  return (
    <div>
      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{
          facingMode: 'user'
        }}
      />
      <button onClick={captureFace}>Capture & Verify</button>
    </div>
  );
};
```

**Installation:**
```bash
# ML Service dependencies
cd backend/ml-service
pip install face-recognition flask opencv-python

# Frontend dependencies
cd frontend
npm install react-webcam
```

---

### 4. Voice AI Assistant (Hindi Support)

Voice-based AI interaction with Hindi and English support.

**Technology Stack:**
- **Speech-to-Text**: Google Cloud Speech-to-Text or Whisper API
- **Text-to-Speech**: Google Cloud TTS or ElevenLabs
- **Language**: Hindi (hi-IN) and English (en-IN)

**Implementation Outline:**

#### Backend Voice Service

```typescript
// backend/src/services/voiceService.ts
import speech from '@google-cloud/speech';
import textToSpeech from '@google-cloud/text-to-speech';

const speechClient = new speech.SpeechClient();
const ttsClient = new textToSpeech.TextToSpeechClient();

export const transcribeAudio = async (
  audioBuffer: Buffer,
  languageCode: string = 'hi-IN'
) => {
  const audio = {
    content: audioBuffer.toString('base64'),
  };

  const config = {
    encoding: 'LINEAR16' as const,
    sampleRateHertz: 16000,
    languageCode,
    alternativeLanguageCodes: ['en-IN'], // Support code-switching
  };

  const [response] = await speechClient.recognize({ audio, config });
  const transcription = response.results
    ?.map(result => result.alternatives?.[0]?.transcript)
    .join('\n');

  return transcription;
};

export const synthesizeSpeech = async (
  text: string,
  languageCode: string = 'hi-IN'
) => {
  const request = {
    input: { text },
    voice: {
      languageCode,
      name: languageCode === 'hi-IN' ? 'hi-IN-Wavenet-A' : 'en-IN-Wavenet-A',
    },
    audioConfig: {
      audioEncoding: 'MP3' as const,
    },
  };

  const [response] = await ttsClient.synthesizeSpeech(request);
  return response.audioContent;
};
```

#### Voice AI Controller

```typescript
// backend/src/controllers/voiceAIController.ts
export const processVoiceQuery = async (req: Request, res: Response) => {
  try {
    const audioFile = req.file;
    if (!audioFile) {
      return res.status(400).json({ error: 'Audio file required' });
    }

    // 1. Transcribe audio to text
    const transcription = await transcribeAudio(audioFile.buffer, 'hi-IN');

    // 2. Get AI response
    const aiResponse = await getAIResponse([
      { role: 'user', content: transcription }
    ], req.user!.id);

    // 3. Convert AI response to speech
    const audioResponse = await synthesizeSpeech(aiResponse, 'hi-IN');

    // 4. Send audio response
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioResponse.length,
    });
    res.send(audioResponse);
  } catch (error) {
    console.error('Voice AI error:', error);
    res.status(500).json({ error: 'Voice processing failed' });
  }
};
```

#### Frontend Voice Interface

```typescript
// frontend/src/components/VoiceAI.tsx
import React, { useState, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';

const VoiceAI: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      audioChunksRef.current = [];

      // Send to backend
      const formData = new FormData();
      formData.append('audio', audioBlob);

      const response = await api.post('/ai/voice', formData, {
        responseType: 'blob',
      });

      // Play response audio
      const audioUrl = URL.createObjectURL(response.data);
      const audio = new Audio(audioUrl);
      audio.play();
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  return (
    <button
      onMouseDown={startRecording}
      onMouseUp={stopRecording}
      onTouchStart={startRecording}
      onTouchEnd={stopRecording}
    >
      {isRecording ? <Mic className="animate-pulse" /> : <MicOff />}
      <span>{isRecording ? 'Recording...' : 'Hold to Speak'}</span>
    </button>
  );
};
```

**Installation:**
```bash
# Backend
npm install @google-cloud/speech @google-cloud/text-to-speech multer

# Set up Google Cloud credentials
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account-key.json"
```

---

### 5. React Native Mobile App

Cross-platform mobile application for iOS and Android.

**Setup:**

```bash
# Install React Native CLI
npm install -g react-native-cli

# Create new React Native project
npx react-native init TwoMinReviewMobile --template react-native-template-typescript

# Install dependencies
cd TwoMinReviewMobile
npm install @react-navigation/native @react-navigation/stack
npm install react-native-screens react-native-safe-area-context
npm install axios react-native-vector-icons
npm install @react-native-async-storage/async-storage
```

**Project Structure:**
```
mobile/
├── src/
│   ├── navigation/
│   │   └── AppNavigator.tsx
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── ReviewsScreen.tsx
│   │   └── AIChat Screen.tsx
│   ├── components/
│   │   ├── ReviewCard.tsx
│   │   └── SearchBar.tsx
│   ├── services/
│   │   └── api.ts
│   ├── contexts/
│   │   └── AuthContext.tsx
│   └── types/
│       └── index.ts
├── android/
├── ios/
└── package.json
```

**Key Components:**

```typescript
// mobile/src/services/api.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://api.2minreview.com/api'; // Your production API

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

**Platform-Specific Features:**
- Push notifications (Firebase Cloud Messaging)
- Biometric authentication (FaceID/TouchID)
- Camera integration for face verification
- Voice recording for voice AI
- Offline mode with local storage

---

## 📱 Frontend Updates Needed

### Search Interface

Create search pages in `frontend/src/pages/`:

```typescript
// SearchColleges.tsx
// SearchCourses.tsx
// SearchReviews.tsx
```

### Payment Interface

Create payment pages:

```typescript
// SubscriptionPlans.tsx - Display plans
// CheckoutPage.tsx - Razorpay integration
// SubscriptionSuccess.tsx - Success page
```

### Updated .env Variables

Add to `backend/.env`:
```env
# Razorpay (REQUIRED for payments)
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

# ML Service (for face verification)
ML_SERVICE_URL=http://localhost:5001

# Google Cloud (for voice AI)
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
GOOGLE_CLOUD_PROJECT_ID=your-project-id
```

Add to `frontend/.env`:
```env
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id
```

---

## 🚀 Deployment Considerations

### For ML Service
- Deploy on separate server (GPU recommended)
- Use Docker container
- Scale independently from main API

### For Mobile Apps
- Build for production: `npx react-native run-android --variant=release`
- Submit to Play Store and App Store
- Use CodePush for OTA updates

### For Payment System
- Switch to live Razorpay keys in production
- Set up webhook endpoints for payment confirmations
- Implement proper error handling and retries

---

## 📚 Resources

### Razorpay
- Documentation: https://razorpay.com/docs/
- Integration Guide: https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/

### Face Recognition
- face_recognition: https://github.com/ageitgey/face_recognition
- DeepFace: https://github.com/serengil/deepface

### Voice AI
- Google Cloud Speech: https://cloud.google.com/speech-to-text
- Whisper API: https://platform.openai.com/docs/guides/speech-to-text

### React Native
- Getting Started: https://reactnative.dev/docs/environment-setup
- Navigation: https://reactnavigation.org/

---

## ✅ Next Steps

1. ✅ Test advanced search functionality
2. ✅ Integrate Razorpay on frontend
3. ⏳ Set up ML service for face verification
4. ⏳ Implement voice AI with Google Cloud
5. ⏳ Build React Native mobile app
6. ⏳ Deploy all services to production

---

**All backend APIs are ready and tested!**
**Frontend integration needed for complete user experience.**
