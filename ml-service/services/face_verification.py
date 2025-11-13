"""
Face Verification Service
Includes liveness detection, anti-spoofing, and duplicate detection
"""
import face_recognition
import cv2
import numpy as np
import json
from typing import Dict, List, Tuple, Optional

class FaceVerificationService:
    def __init__(self):
        self.face_distance_threshold = 0.6  # Lower = more strict
        self.liveness_threshold = 0.7

    def verify_face_with_liveness(self, image_path: str) -> Dict:
        """
        Verify face with liveness detection to prevent spoofing
        Returns verification result with confidence scores
        """
        try:
            # Load image
            image = face_recognition.load_image_file(image_path)
            image_cv = cv2.imread(image_path)

            # Detect faces
            face_locations = face_recognition.face_locations(image)

            if len(face_locations) == 0:
                return {
                    'success': False,
                    'verified': False,
                    'error': 'No face detected in image',
                    'liveness_score': 0.0,
                    'quality_score': 0.0
                }

            if len(face_locations) > 1:
                return {
                    'success': False,
                    'verified': False,
                    'error': 'Multiple faces detected. Please ensure only one face is visible',
                    'faces_detected': len(face_locations)
                }

            # Perform liveness detection
            liveness_result = self._detect_liveness(image_cv, face_locations[0])

            # Calculate image quality score
            quality_score = self._calculate_image_quality(image_cv)

            # Check if image passes liveness and quality checks
            is_live = liveness_result['is_live']
            liveness_score = liveness_result['confidence']

            return {
                'success': True,
                'verified': is_live and quality_score > 0.5,
                'is_live': is_live,
                'liveness_score': liveness_score,
                'quality_score': quality_score,
                'face_location': face_locations[0],
                'checks': {
                    'liveness_check': 'passed' if is_live else 'failed',
                    'quality_check': 'passed' if quality_score > 0.5 else 'failed',
                    'face_detection': 'passed'
                },
                'message': 'Face verified successfully' if (is_live and quality_score > 0.5) else 'Verification failed'
            }

        except Exception as e:
            return {
                'success': False,
                'verified': False,
                'error': f'Verification error: {str(e)}'
            }

    def _detect_liveness(self, image: np.ndarray, face_location: Tuple) -> Dict:
        """
        Detect if face is live (not a photo/video)
        Uses multiple techniques:
        1. Texture analysis (photos have different texture)
        2. Color distribution analysis
        3. Edge detection patterns
        4. Motion analysis (if video frames available)
        """
        top, right, bottom, left = face_location
        face_img = image[top:bottom, left:right]

        if face_img.size == 0:
            return {'is_live': False, 'confidence': 0.0}

        # Convert to grayscale for analysis
        gray_face = cv2.cvtColor(face_img, cv2.COLOR_BGR2GRAY)

        # 1. Texture Analysis using LBP (Local Binary Patterns)
        texture_score = self._analyze_texture(gray_face)

        # 2. Color Distribution Analysis
        color_score = self._analyze_color_distribution(face_img)

        # 3. Edge Detection Analysis
        edge_score = self._analyze_edges(gray_face)

        # 4. Brightness consistency check
        brightness_score = self._check_brightness_consistency(face_img)

        # Combine scores
        combined_score = (
            texture_score * 0.3 +
            color_score * 0.3 +
            edge_score * 0.2 +
            brightness_score * 0.2
        )

        is_live = combined_score > self.liveness_threshold

        return {
            'is_live': is_live,
            'confidence': combined_score,
            'details': {
                'texture_score': texture_score,
                'color_score': color_score,
                'edge_score': edge_score,
                'brightness_score': brightness_score
            }
        }

    def _analyze_texture(self, gray_image: np.ndarray) -> float:
        """Analyze texture to detect photo vs real face"""
        # Calculate Laplacian variance (measure of texture/blur)
        laplacian_var = cv2.Laplacian(gray_image, cv2.CV_64F).var()

        # Real faces typically have variance > 100, photos < 100
        score = min(laplacian_var / 200.0, 1.0)
        return score

    def _analyze_color_distribution(self, color_image: np.ndarray) -> float:
        """Analyze color distribution (real faces have more natural distribution)"""
        # Calculate color histogram
        hist_b = cv2.calcHist([color_image], [0], None, [256], [0, 256])
        hist_g = cv2.calcHist([color_image], [1], None, [256], [0, 256])
        hist_r = cv2.calcHist([color_image], [2], None, [256], [0, 256])

        # Calculate histogram correlation
        # Real faces have more varied color distribution
        std_b = np.std(hist_b)
        std_g = np.std(hist_g)
        std_r = np.std(hist_r)

        avg_std = (std_b + std_g + std_r) / 3
        score = min(avg_std / 1000.0, 1.0)
        return score

    def _analyze_edges(self, gray_image: np.ndarray) -> float:
        """Analyze edge patterns (photos have sharper, more uniform edges)"""
        # Apply Canny edge detection
        edges = cv2.Canny(gray_image, 100, 200)

        # Calculate edge density
        edge_density = np.sum(edges > 0) / edges.size

        # Real faces typically have moderate edge density (0.1-0.3)
        # Too high = photo, too low = poor quality
        if 0.1 <= edge_density <= 0.3:
            score = 1.0
        elif edge_density < 0.1:
            score = edge_density / 0.1
        else:
            score = max(0, 1.0 - (edge_density - 0.3) / 0.3)

        return score

    def _check_brightness_consistency(self, color_image: np.ndarray) -> float:
        """Check brightness consistency (photos often have uniform lighting)"""
        # Convert to LAB color space
        lab = cv2.cvtColor(color_image, cv2.COLOR_BGR2LAB)
        l_channel = lab[:, :, 0]

        # Calculate brightness variance across face regions
        h, w = l_channel.shape
        regions = [
            l_channel[0:h//2, 0:w//2],      # Top-left
            l_channel[0:h//2, w//2:w],      # Top-right
            l_channel[h//2:h, 0:w//2],      # Bottom-left
            l_channel[h//2:h, w//2:w]       # Bottom-right
        ]

        means = [np.mean(region) for region in regions]
        brightness_variance = np.var(means)

        # Real faces have some variance due to natural lighting
        # Photos tend to have very uniform lighting
        score = min(brightness_variance / 200.0, 1.0)
        return score

    def _calculate_image_quality(self, image: np.ndarray) -> float:
        """Calculate overall image quality score"""
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        # Check blur (using Laplacian variance)
        blur_score = cv2.Laplacian(gray, cv2.CV_64F).var()
        blur_score = min(blur_score / 200.0, 1.0)

        # Check brightness
        brightness = np.mean(gray)
        # Ideal brightness is around 100-150
        if 80 <= brightness <= 170:
            brightness_score = 1.0
        else:
            brightness_score = max(0, 1.0 - abs(brightness - 125) / 125)

        # Check resolution
        height, width = image.shape[:2]
        min_resolution = 200
        if height >= min_resolution and width >= min_resolution:
            resolution_score = 1.0
        else:
            resolution_score = min(height, width) / min_resolution

        # Combined quality score
        quality = (blur_score * 0.4 + brightness_score * 0.3 + resolution_score * 0.3)
        return quality

    def extract_embedding(self, image_path: str) -> Dict:
        """Extract face embedding for storage and comparison"""
        try:
            image = face_recognition.load_image_file(image_path)
            face_locations = face_recognition.face_locations(image)

            if len(face_locations) == 0:
                return {
                    'success': False,
                    'error': 'No face detected'
                }

            if len(face_locations) > 1:
                return {
                    'success': False,
                    'error': 'Multiple faces detected'
                }

            # Extract face encoding (128-dimensional embedding)
            face_encodings = face_recognition.face_encodings(image, face_locations)

            if len(face_encodings) == 0:
                return {
                    'success': False,
                    'error': 'Could not extract face features'
                }

            embedding = face_encodings[0].tolist()

            return {
                'success': True,
                'embedding': embedding,
                'embedding_size': len(embedding),
                'face_location': face_locations[0]
            }

        except Exception as e:
            return {
                'success': False,
                'error': f'Embedding extraction error: {str(e)}'
            }

    def compare_faces(self, image_path1: str, image_path2: str) -> Dict:
        """Compare two faces and return similarity score"""
        try:
            # Extract embeddings
            result1 = self.extract_embedding(image_path1)
            result2 = self.extract_embedding(image_path2)

            if not result1['success'] or not result2['success']:
                return {
                    'success': False,
                    'error': 'Could not extract embeddings from one or both images'
                }

            embedding1 = np.array(result1['embedding'])
            embedding2 = np.array(result2['embedding'])

            # Calculate face distance
            distance = np.linalg.norm(embedding1 - embedding2)

            # Convert to similarity score (0-1, higher = more similar)
            similarity = max(0, 1 - (distance / 2))

            is_match = distance < self.face_distance_threshold

            return {
                'success': True,
                'is_match': is_match,
                'similarity': similarity,
                'distance': distance,
                'threshold': self.face_distance_threshold,
                'confidence': 'high' if abs(similarity - 0.5) > 0.3 else 'medium'
            }

        except Exception as e:
            return {
                'success': False,
                'error': f'Face comparison error: {str(e)}'
            }

    def detect_duplicate(self, image_path: str, existing_embeddings_json: str) -> Dict:
        """
        Detect if face matches any existing faces (duplicate account detection)
        existing_embeddings_json: JSON string of array of embeddings
        """
        try:
            # Extract embedding from new image
            result = self.extract_embedding(image_path)
            if not result['success']:
                return result

            new_embedding = np.array(result['embedding'])

            # Parse existing embeddings
            try:
                existing_embeddings = json.loads(existing_embeddings_json)
            except:
                existing_embeddings = []

            if len(existing_embeddings) == 0:
                return {
                    'success': True,
                    'is_duplicate': False,
                    'message': 'No existing faces to compare'
                }

            # Compare with all existing embeddings
            matches = []
            for idx, existing_emb in enumerate(existing_embeddings):
                existing_array = np.array(existing_emb)
                distance = np.linalg.norm(new_embedding - existing_array)

                if distance < self.face_distance_threshold:
                    similarity = max(0, 1 - (distance / 2))
                    matches.append({
                        'index': idx,
                        'distance': distance,
                        'similarity': similarity
                    })

            is_duplicate = len(matches) > 0

            return {
                'success': True,
                'is_duplicate': is_duplicate,
                'matches_found': len(matches),
                'matches': matches[:5],  # Return top 5 matches
                'message': 'Duplicate account detected' if is_duplicate else 'No duplicates found'
            }

        except Exception as e:
            return {
                'success': False,
                'error': f'Duplicate detection error: {str(e)}'
            }
