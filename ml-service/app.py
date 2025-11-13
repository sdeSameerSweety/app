"""
2minreview ML Service
Provides face verification, content moderation, document verification, and recommendations
"""
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import traceback

from services.face_verification import FaceVerificationService
from services.content_moderation import ContentModerationService
from services.document_verification import DocumentVerificationService
from services.recommendation import RecommendationService

app = Flask(__name__)
CORS(app)

# Configuration
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
ALLOWED_IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
ALLOWED_DOC_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg'}

# Initialize services
face_service = FaceVerificationService()
content_service = ContentModerationService()
document_service = DocumentVerificationService()
recommendation_service = RecommendationService()

def allowed_file(filename, allowed_extensions):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions

# ============================================================================
# FACE VERIFICATION ENDPOINTS
# ============================================================================

@app.route('/api/ml/face/verify', methods=['POST'])
def verify_face():
    """Verify face with liveness detection"""
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400

        file = request.files['image']
        if file.filename == '':
            return jsonify({'error': 'No image selected'}), 400

        if not allowed_file(file.filename, ALLOWED_IMAGE_EXTENSIONS):
            return jsonify({'error': 'Invalid file type'}), 400

        # Save file temporarily
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        # Perform face verification with liveness detection
        result = face_service.verify_face_with_liveness(filepath)

        # Clean up
        os.remove(filepath)

        return jsonify(result), 200
    except Exception as e:
        print(f"Face verification error: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@app.route('/api/ml/face/extract-embedding', methods=['POST'])
def extract_face_embedding():
    """Extract face embedding for storage"""
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400

        file = request.files['image']
        if file.filename == '':
            return jsonify({'error': 'No image selected'}), 400

        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        result = face_service.extract_embedding(filepath)

        os.remove(filepath)

        return jsonify(result), 200
    except Exception as e:
        print(f"Embedding extraction error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/ml/face/compare', methods=['POST'])
def compare_faces():
    """Compare two faces"""
    try:
        if 'image1' not in request.files or 'image2' not in request.files:
            return jsonify({'error': 'Two images required'}), 400

        file1 = request.files['image1']
        file2 = request.files['image2']

        filename1 = secure_filename(file1.filename)
        filename2 = secure_filename(file2.filename)

        filepath1 = os.path.join(app.config['UPLOAD_FOLDER'], filename1)
        filepath2 = os.path.join(app.config['UPLOAD_FOLDER'], filename2)

        file1.save(filepath1)
        file2.save(filepath2)

        result = face_service.compare_faces(filepath1, filepath2)

        os.remove(filepath1)
        os.remove(filepath2)

        return jsonify(result), 200
    except Exception as e:
        print(f"Face comparison error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/ml/face/detect-duplicate', methods=['POST'])
def detect_duplicate_account():
    """Detect duplicate accounts via face matching"""
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400

        file = request.files['image']
        existing_embeddings = request.form.get('embeddings', '[]')  # JSON array of existing embeddings

        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        result = face_service.detect_duplicate(filepath, existing_embeddings)

        os.remove(filepath)

        return jsonify(result), 200
    except Exception as e:
        print(f"Duplicate detection error: {str(e)}")
        return jsonify({'error': str(e)}), 500

# ============================================================================
# CONTENT MODERATION ENDPOINTS
# ============================================================================

@app.route('/api/ml/content/moderate-image', methods=['POST'])
def moderate_image():
    """Check image for inappropriate content (NSFW, violence, etc.)"""
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400

        file = request.files['image']
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        result = content_service.moderate_image(filepath)

        os.remove(filepath)

        return jsonify(result), 200
    except Exception as e:
        print(f"Image moderation error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/ml/content/moderate-text', methods=['POST'])
def moderate_text():
    """Check text for inappropriate content"""
    try:
        data = request.get_json()
        text = data.get('text', '')

        if not text:
            return jsonify({'error': 'No text provided'}), 400

        result = content_service.moderate_text(text)

        return jsonify(result), 200
    except Exception as e:
        print(f"Text moderation error: {str(e)}")
        return jsonify({'error': str(e)}), 500

# ============================================================================
# DOCUMENT VERIFICATION ENDPOINTS
# ============================================================================

@app.route('/api/ml/document/verify', methods=['POST'])
def verify_document():
    """Verify document authenticity and extract information"""
    try:
        if 'document' not in request.files:
            return jsonify({'error': 'No document provided'}), 400

        file = request.files['document']
        doc_type = request.form.get('type', 'general')  # id_card, admission_letter, etc.

        if not allowed_file(file.filename, ALLOWED_DOC_EXTENSIONS):
            return jsonify({'error': 'Invalid document type'}), 400

        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        result = document_service.verify_document(filepath, doc_type)

        os.remove(filepath)

        return jsonify(result), 200
    except Exception as e:
        print(f"Document verification error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/ml/document/extract-text', methods=['POST'])
def extract_document_text():
    """Extract text from document using OCR"""
    try:
        if 'document' not in request.files:
            return jsonify({'error': 'No document provided'}), 400

        file = request.files['document']
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        result = document_service.extract_text(filepath)

        os.remove(filepath)

        return jsonify(result), 200
    except Exception as e:
        print(f"Text extraction error: {str(e)}")
        return jsonify({'error': str(e)}), 500

# ============================================================================
# RECOMMENDATION ENDPOINTS
# ============================================================================

@app.route('/api/ml/recommendations/colleges', methods=['POST'])
def recommend_colleges():
    """Get personalized college recommendations"""
    try:
        data = request.get_json()
        user_id = data.get('userId')
        user_preferences = data.get('preferences', {})
        user_history = data.get('history', [])

        result = recommendation_service.recommend_colleges(
            user_id, user_preferences, user_history
        )

        return jsonify(result), 200
    except Exception as e:
        print(f"Recommendation error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/ml/recommendations/reviews', methods=['POST'])
def recommend_reviews():
    """Get personalized review recommendations"""
    try:
        data = request.get_json()
        user_id = data.get('userId')
        user_history = data.get('history', [])

        result = recommendation_service.recommend_reviews(user_id, user_history)

        return jsonify(result), 200
    except Exception as e:
        print(f"Recommendation error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/ml/recommendations/train', methods=['POST'])
def train_recommendation_model():
    """Train/update recommendation model with new data"""
    try:
        data = request.get_json()
        training_data = data.get('data', [])

        result = recommendation_service.train_model(training_data)

        return jsonify(result), 200
    except Exception as e:
        print(f"Training error: {str(e)}")
        return jsonify({'error': str(e)}), 500

# ============================================================================
# HEALTH CHECK
# ============================================================================

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'ml-service',
        'version': '1.0.0',
        'services': {
            'face_verification': 'active',
            'content_moderation': 'active',
            'document_verification': 'active',
            'recommendations': 'active'
        }
    }), 200

@app.route('/', methods=['GET'])
def index():
    """Service info"""
    return jsonify({
        'service': '2minreview ML Service',
        'version': '1.0.0',
        'endpoints': {
            'face_verification': [
                'POST /api/ml/face/verify',
                'POST /api/ml/face/extract-embedding',
                'POST /api/ml/face/compare',
                'POST /api/ml/face/detect-duplicate'
            ],
            'content_moderation': [
                'POST /api/ml/content/moderate-image',
                'POST /api/ml/content/moderate-text'
            ],
            'document_verification': [
                'POST /api/ml/document/verify',
                'POST /api/ml/document/extract-text'
            ],
            'recommendations': [
                'POST /api/ml/recommendations/colleges',
                'POST /api/ml/recommendations/reviews',
                'POST /api/ml/recommendations/train'
            ]
        }
    }), 200

if __name__ == '__main__':
    # Create upload folder if it doesn't exist
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    # Run server
    port = int(os.getenv('ML_SERVICE_PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=True)
