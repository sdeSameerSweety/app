# 2minreview ML Service

Machine Learning microservice for 2minreview platform providing:
- Face verification with liveness detection
- Content moderation (NSFW, violence, hate speech)
- Document verification
- Personalized recommendations

## Features

### 1. Face Verification Service
- **Liveness Detection**: Anti-spoofing using texture, color, and edge analysis
- **Face Embedding Extraction**: 128-dimensional face encodings
- **Face Comparison**: Match faces with configurable thresholds
- **Duplicate Detection**: Prevent duplicate accounts via face matching

### 2. Content Moderation Service
- **Image Moderation**: NSFW detection, violence indicators
- **Text Moderation**: Profanity, hate speech, spam detection
- **Quality Checks**: Image quality, resolution, brightness analysis

### 3. Document Verification Service
- **Authenticity Verification**: Detect tampering and forgery
- **OCR Text Extraction**: Extract text from documents
- **Document Type Validation**: Verify ID cards, certificates, letters
- **Structured Data Extraction**: Extract emails, dates, phone numbers

### 4. Recommendation Service
- **Collaborative Filtering**: User-based recommendations
- **Content-Based Filtering**: Feature-based matching
- **Hybrid Approach**: Combined recommendation strategy
- **Explainable AI**: Understand why items are recommended

## Installation

### Prerequisites
- Python 3.10+
- Tesseract OCR
- System dependencies (CMake, OpenCV)

### Local Setup

```bash
# Install system dependencies (Ubuntu/Debian)
sudo apt-get update
sudo apt-get install -y build-essential cmake git pkg-config \
    libopencv-dev tesseract-ocr libtesseract-dev

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Run the service
python app.py
```

### Docker Setup

```bash
# Build image
docker build -t 2minreview-ml-service .

# Run container
docker run -d -p 5001:5001 --name ml-service 2minreview-ml-service
```

## API Endpoints

### Face Verification

#### Verify Face with Liveness Detection
```http
POST /api/ml/face/verify
Content-Type: multipart/form-data

image: <file>
```

Response:
```json
{
  "success": true,
  "verified": true,
  "is_live": true,
  "liveness_score": 0.85,
  "quality_score": 0.92,
  "checks": {
    "liveness_check": "passed",
    "quality_check": "passed",
    "face_detection": "passed"
  }
}
```

#### Extract Face Embedding
```http
POST /api/ml/face/extract-embedding
Content-Type: multipart/form-data

image: <file>
```

#### Compare Two Faces
```http
POST /api/ml/face/compare
Content-Type: multipart/form-data

image1: <file>
image2: <file>
```

#### Detect Duplicate Accounts
```http
POST /api/ml/face/detect-duplicate
Content-Type: multipart/form-data

image: <file>
embeddings: <json_array_of_existing_embeddings>
```

### Content Moderation

#### Moderate Image
```http
POST /api/ml/content/moderate-image
Content-Type: multipart/form-data

image: <file>
```

Response:
```json
{
  "success": true,
  "is_safe": true,
  "moderation_scores": {
    "nsfw": 0.15,
    "violence": 0.08,
    "quality": 0.92
  },
  "flags": [],
  "recommendation": "APPROVE"
}
```

#### Moderate Text
```http
POST /api/ml/content/moderate-text
Content-Type: application/json

{
  "text": "Content to moderate"
}
```

### Document Verification

#### Verify Document
```http
POST /api/ml/document/verify
Content-Type: multipart/form-data

document: <file>
type: id_card|admission_letter|certificate|payslip|offer_letter
```

Response:
```json
{
  "success": true,
  "is_authentic": true,
  "confidence": 0.87,
  "document_type": "id_card",
  "checks": {
    "quality": {"score": 0.89},
    "tampering": {"is_tampered": false},
    "type_verification": {"is_valid": true}
  },
  "recommendation": "APPROVE"
}
```

#### Extract Text from Document
```http
POST /api/ml/document/extract-text
Content-Type: multipart/form-data

document: <file>
```

### Recommendations

#### Get College Recommendations
```http
POST /api/ml/recommendations/colleges
Content-Type: application/json

{
  "userId": "user123",
  "preferences": {
    "state": "Maharashtra",
    "type": "Engineering",
    "ranking": {"min": 1, "max": 50}
  },
  "history": []
}
```

#### Get Review Recommendations
```http
POST /api/ml/recommendations/reviews
Content-Type: application/json

{
  "userId": "user123",
  "history": []
}
```

#### Train Recommendation Model
```http
POST /api/ml/recommendations/train
Content-Type: application/json

{
  "data": [
    {"user_id": "user1", "item_id": "item1", "rating": 5},
    {"user_id": "user2", "item_id": "item2", "rating": 4}
  ]
}
```

## Configuration

Environment variables in `.env`:

```env
ML_SERVICE_PORT=5001
BACKEND_API_URL=http://localhost:5000/api
MAX_FILE_SIZE_MB=16
FACE_DISTANCE_THRESHOLD=0.6
LIVENESS_THRESHOLD=0.7
NSFW_THRESHOLD=0.6
LOG_LEVEL=INFO
```

## Integration with Backend

### Example: Verify Face During Registration

**Backend (Node.js):**
```javascript
const FormData = require('form-data');
const axios = require('axios');

async function verifyUserFace(imagePath) {
  const formData = new FormData();
  formData.append('image', fs.createReadStream(imagePath));

  const response = await axios.post(
    'http://localhost:5001/api/ml/face/verify',
    formData,
    { headers: formData.getHeaders() }
  );

  return response.data;
}
```

### Example: Moderate Review Content

```javascript
async function moderateReviewText(text) {
  const response = await axios.post(
    'http://localhost:5001/api/ml/content/moderate-text',
    { text }
  );

  if (response.data.recommendation === 'REJECT') {
    throw new Error('Content violates community guidelines');
  }

  return response.data;
}
```

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    ML Service (Flask)                    │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │    Face      │  │   Content    │  │  Document    │  │
│  │ Verification │  │  Moderation  │  │ Verification │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │          Recommendation Engine                    │   │
│  └──────────────────────────────────────────────────┘   │
│                                                           │
└─────────────────────────────────────────────────────────┘
                          ↕ REST API
┌─────────────────────────────────────────────────────────┐
│              Backend API (Node.js/Express)               │
└─────────────────────────────────────────────────────────┘
```

## Performance

- **Face Verification**: ~500-800ms per image
- **Content Moderation**: ~300-500ms per image, ~50ms per text
- **Document Verification**: ~1-2s per document
- **Recommendations**: ~100-200ms per request

## Security

- File size limits enforced
- Input validation on all endpoints
- Secure file handling and cleanup
- No sensitive data logging
- CORS configured for backend only

## Testing

```bash
# Test face verification
curl -X POST -F "image=@test_face.jpg" \
  http://localhost:5001/api/ml/face/verify

# Test content moderation
curl -X POST -H "Content-Type: application/json" \
  -d '{"text":"Test content"}' \
  http://localhost:5001/api/ml/content/moderate-text

# Health check
curl http://localhost:5001/health
```

## Troubleshooting

### Issue: Tesseract not found
```bash
# Install Tesseract
sudo apt-get install tesseract-ocr

# Or set path in .env
TESSERACT_CMD=/usr/local/bin/tesseract
```

### Issue: dlib installation fails
```bash
# Install dependencies
sudo apt-get install build-essential cmake
pip install dlib --no-cache-dir
```

### Issue: CUDA support for TensorFlow
```bash
# For GPU support, install CUDA-enabled TensorFlow
pip uninstall tensorflow
pip install tensorflow-gpu==2.15.0
```

## Production Deployment

### Scaling Recommendations

1. **Horizontal Scaling**: Run multiple instances behind load balancer
2. **GPU Support**: Use GPU-enabled instances for faster processing
3. **Caching**: Cache face embeddings and model predictions
4. **Queue System**: Use Celery + Redis for async processing

### Docker Compose Example

```yaml
services:
  ml-service:
    build: ./ml-service
    ports:
      - "5001:5001"
    environment:
      - ML_SERVICE_PORT=5001
      - BACKEND_API_URL=http://backend:5000/api
    volumes:
      - ml-uploads:/app/uploads
    deploy:
      replicas: 2
      resources:
        limits:
          cpus: '2'
          memory: 4G
```

## Roadmap

- [x] Face verification with liveness detection
- [x] Content moderation (NSFW, hate speech)
- [x] Document verification with OCR
- [x] Basic recommendation system
- [ ] Advanced liveness detection (blink, head movement)
- [ ] Deep learning models for document forgery detection
- [ ] Multi-language support for text moderation
- [ ] Real-time video face verification
- [ ] Advanced recommendation algorithms (deep learning)

## License

Proprietary - 2minreview Platform

## Support

For issues or questions:
- Email: dev@2minreview.com
- Internal Docs: https://docs.2minreview.com/ml-service
