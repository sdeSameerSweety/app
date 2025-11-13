"""
Content Moderation Service
Detects NSFW, violence, hate speech, and inappropriate content
"""
import cv2
import numpy as np
from typing import Dict, List
import re

# Try to import NudeNet for NSFW detection
try:
    from nudenet import NudeDetector
    NUDENET_AVAILABLE = True
except ImportError:
    NUDENET_AVAILABLE = False
    print("Warning: NudeNet not available. Install with: pip install nudenet")

class ContentModerationService:
    def __init__(self):
        # Initialize NSFW detector if available
        if NUDENET_AVAILABLE:
            try:
                self.nude_detector = NudeDetector()
            except Exception as e:
                print(f"Warning: Could not initialize NudeDetector: {e}")
                self.nude_detector = None
        else:
            self.nude_detector = None

        # Inappropriate keywords (expandable list)
        self.inappropriate_keywords = self._load_inappropriate_keywords()

        # Hate speech patterns
        self.hate_patterns = self._load_hate_patterns()

    def _load_inappropriate_keywords(self) -> List[str]:
        """Load list of inappropriate keywords"""
        # This is a basic list - in production, use a comprehensive database
        return [
            # Adult content
            'porn', 'xxx', 'nude', 'naked', 'sex',
            # Violence
            'kill', 'murder', 'violence', 'attack', 'bomb',
            # Drugs
            'drug', 'cocaine', 'heroin', 'meth',
            # Spam
            'click here', 'buy now', 'limited offer',
            # Add more as needed
        ]

    def _load_hate_patterns(self) -> List[str]:
        """Load hate speech patterns"""
        return [
            r'\b(hate|kill|attack)\s+(muslims?|hindus?|christians?|jews?)\b',
            r'\b(inferior|superior)\s+(race|caste|religion)\b',
            # Add more patterns
        ]

    def moderate_image(self, image_path: str) -> Dict:
        """
        Moderate image content
        Checks for: NSFW content, violence, inappropriate symbols
        """
        try:
            # Load image
            image = cv2.imread(image_path)
            if image is None:
                return {
                    'success': False,
                    'error': 'Could not load image'
                }

            results = {
                'success': True,
                'is_safe': True,
                'moderation_scores': {},
                'flags': [],
                'details': {}
            }

            # 1. NSFW Detection
            if self.nude_detector is not None:
                nsfw_result = self._detect_nsfw(image_path)
                results['moderation_scores']['nsfw'] = nsfw_result['score']
                results['details']['nsfw'] = nsfw_result

                if nsfw_result['is_nsfw']:
                    results['is_safe'] = False
                    results['flags'].append('nsfw')
            else:
                # Fallback: Basic skin detection
                nsfw_score = self._basic_skin_detection(image)
                results['moderation_scores']['nsfw'] = nsfw_score
                if nsfw_score > 0.6:
                    results['is_safe'] = False
                    results['flags'].append('potential_nsfw')

            # 2. Violence Detection (basic)
            violence_result = self._detect_violence_indicators(image)
            results['moderation_scores']['violence'] = violence_result['score']
            results['details']['violence'] = violence_result

            if violence_result['score'] > 0.7:
                results['is_safe'] = False
                results['flags'].append('potential_violence')

            # 3. Quality Check
            quality_result = self._check_image_quality(image)
            results['moderation_scores']['quality'] = quality_result['score']
            results['details']['quality'] = quality_result

            if quality_result['score'] < 0.3:
                results['flags'].append('poor_quality')

            # 4. Image metadata check
            metadata_result = self._check_metadata(image_path)
            results['details']['metadata'] = metadata_result

            # Overall assessment
            results['recommendation'] = self._get_recommendation(results)

            return results

        except Exception as e:
            return {
                'success': False,
                'error': f'Image moderation error: {str(e)}'
            }

    def _detect_nsfw(self, image_path: str) -> Dict:
        """Detect NSFW content using NudeNet"""
        try:
            detections = self.nude_detector.detect(image_path)

            # Analyze detections
            nsfw_parts = ['EXPOSED_BREAST', 'EXPOSED_GENITALIA', 'EXPOSED_BUTTOCKS']
            nsfw_score = 0

            for detection in detections:
                if detection['class'] in nsfw_parts:
                    nsfw_score = max(nsfw_score, detection['score'])

            is_nsfw = nsfw_score > 0.6

            return {
                'is_nsfw': is_nsfw,
                'score': nsfw_score,
                'detections': len(detections),
                'confidence': 'high' if nsfw_score > 0.8 else 'medium' if nsfw_score > 0.6 else 'low'
            }

        except Exception as e:
            return {
                'is_nsfw': False,
                'score': 0,
                'error': str(e)
            }

    def _basic_skin_detection(self, image: np.ndarray) -> float:
        """
        Basic skin detection as fallback
        High skin exposure might indicate NSFW content
        """
        # Convert to YCrCb color space (better for skin detection)
        ycrcb = cv2.cvtColor(image, cv2.COLOR_BGR2YCrCb)

        # Define skin color range in YCrCb
        lower = np.array([0, 133, 77], dtype=np.uint8)
        upper = np.array([255, 173, 127], dtype=np.uint8)

        # Create mask
        skin_mask = cv2.inRange(ycrcb, lower, upper)

        # Calculate skin percentage
        skin_pixels = np.sum(skin_mask > 0)
        total_pixels = image.shape[0] * image.shape[1]
        skin_ratio = skin_pixels / total_pixels

        # High skin ratio (>60%) might be concerning
        return min(skin_ratio / 0.6, 1.0)

    def _detect_violence_indicators(self, image: np.ndarray) -> Dict:
        """
        Detect violence indicators (basic approach)
        Looks for: red colors (blood), sharp edges (weapons), dark tones
        """
        # Convert to HSV for color analysis
        hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

        # Detect red colors (potential blood)
        lower_red1 = np.array([0, 50, 50])
        upper_red1 = np.array([10, 255, 255])
        lower_red2 = np.array([170, 50, 50])
        upper_red2 = np.array([180, 255, 255])

        red_mask1 = cv2.inRange(hsv, lower_red1, upper_red1)
        red_mask2 = cv2.inRange(hsv, lower_red2, upper_red2)
        red_mask = cv2.bitwise_or(red_mask1, red_mask2)

        red_ratio = np.sum(red_mask > 0) / (image.shape[0] * image.shape[1])

        # Detect sharp edges (potential weapons)
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        edges = cv2.Canny(gray, 100, 200)
        edge_density = np.sum(edges > 0) / edges.size

        # Detect dark tones
        brightness = np.mean(gray)
        darkness_score = max(0, 1 - brightness / 128)

        # Combine indicators
        violence_score = (
            red_ratio * 0.4 +
            (edge_density / 0.3) * 0.3 +
            darkness_score * 0.3
        )

        violence_score = min(violence_score, 1.0)

        return {
            'score': violence_score,
            'red_content': red_ratio,
            'edge_density': edge_density,
            'darkness': darkness_score,
            'confidence': 'medium'
        }

    def _check_image_quality(self, image: np.ndarray) -> Dict:
        """Check image quality"""
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        # Check blur
        blur_var = cv2.Laplacian(gray, cv2.CV_64F).var()
        blur_score = min(blur_var / 200, 1.0)

        # Check brightness
        brightness = np.mean(gray)
        if 80 <= brightness <= 170:
            brightness_score = 1.0
        else:
            brightness_score = max(0, 1.0 - abs(brightness - 125) / 125)

        # Check resolution
        height, width = image.shape[:2]
        min_resolution = 200
        resolution_score = min(min(height, width) / min_resolution, 1.0)

        # Overall quality
        quality_score = (blur_score * 0.4 + brightness_score * 0.3 + resolution_score * 0.3)

        return {
            'score': quality_score,
            'blur_score': blur_score,
            'brightness_score': brightness_score,
            'resolution_score': resolution_score,
            'dimensions': f"{width}x{height}"
        }

    def _check_metadata(self, image_path: str) -> Dict:
        """Check image metadata for manipulation indicators"""
        # Basic metadata check
        import os
        from datetime import datetime

        stats = os.stat(image_path)

        return {
            'file_size': stats.st_size,
            'created': datetime.fromtimestamp(stats.st_ctime).isoformat(),
            'modified': datetime.fromtimestamp(stats.st_mtime).isoformat()
        }

    def moderate_text(self, text: str) -> Dict:
        """
        Moderate text content
        Checks for: profanity, hate speech, spam, personal info
        """
        try:
            results = {
                'success': True,
                'is_safe': True,
                'flags': [],
                'moderation_scores': {},
                'details': {}
            }

            text_lower = text.lower()

            # 1. Check for inappropriate keywords
            inappropriate_count = 0
            found_keywords = []
            for keyword in self.inappropriate_keywords:
                if keyword in text_lower:
                    inappropriate_count += 1
                    found_keywords.append(keyword)

            if inappropriate_count > 0:
                results['is_safe'] = False
                results['flags'].append('inappropriate_language')
                results['details']['inappropriate_keywords'] = found_keywords

            results['moderation_scores']['inappropriate'] = min(inappropriate_count / 3, 1.0)

            # 2. Check for hate speech patterns
            hate_score = 0
            for pattern in self.hate_patterns:
                if re.search(pattern, text_lower, re.IGNORECASE):
                    hate_score += 1
                    results['is_safe'] = False
                    results['flags'].append('hate_speech')

            results['moderation_scores']['hate_speech'] = min(hate_score, 1.0)

            # 3. Check for spam patterns
            spam_indicators = [
                r'click here',
                r'buy now',
                r'limited (time )?offer',
                r'call \+?[\d\s\-]+',
                r'www\.',
                r'http[s]?://'
            ]

            spam_count = sum(1 for pattern in spam_indicators if re.search(pattern, text_lower))
            spam_score = min(spam_count / 3, 1.0)
            results['moderation_scores']['spam'] = spam_score

            if spam_score > 0.5:
                results['is_safe'] = False
                results['flags'].append('spam')

            # 4. Check for personal information
            pii_patterns = {
                'email': r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}',
                'phone': r'\+?[\d\s\-\(\)]{10,}',
                'url': r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+'
            }

            pii_found = {}
            for pii_type, pattern in pii_patterns.items():
                matches = re.findall(pattern, text)
                if matches:
                    pii_found[pii_type] = len(matches)
                    results['flags'].append(f'contains_{pii_type}')

            results['details']['pii'] = pii_found
            results['moderation_scores']['pii'] = min(len(pii_found) / 2, 1.0)

            # 5. Text quality checks
            word_count = len(text.split())
            results['details']['word_count'] = word_count

            if word_count < 5:
                results['flags'].append('too_short')
            elif word_count > 2000:
                results['flags'].append('too_long')

            # Overall recommendation
            results['recommendation'] = self._get_text_recommendation(results)

            return results

        except Exception as e:
            return {
                'success': False,
                'error': f'Text moderation error: {str(e)}'
            }

    def _get_recommendation(self, results: Dict) -> str:
        """Get recommendation based on moderation results"""
        if not results['is_safe']:
            return 'REJECT'

        scores = results['moderation_scores']

        # Check if any score is concerning
        if any(score > 0.7 for score in scores.values()):
            return 'REVIEW'

        if any(score > 0.4 for score in scores.values()):
            return 'WARNING'

        return 'APPROVE'

    def _get_text_recommendation(self, results: Dict) -> str:
        """Get recommendation for text content"""
        if not results['is_safe']:
            return 'REJECT'

        scores = results['moderation_scores']

        if scores.get('hate_speech', 0) > 0.5:
            return 'REJECT'

        if scores.get('inappropriate', 0) > 0.6:
            return 'REVIEW'

        if scores.get('spam', 0) > 0.5:
            return 'REJECT'

        if len(results['flags']) > 2:
            return 'REVIEW'

        return 'APPROVE'
