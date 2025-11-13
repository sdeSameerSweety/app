"""
Document Verification Service
Verifies authenticity of documents like ID cards, admission letters, certificates
Uses OCR, pattern matching, and fraud detection
"""
import cv2
import numpy as np
from typing import Dict, List, Tuple
import re

# Try to import pytesseract for OCR
try:
    import pytesseract
    PYTESSERACT_AVAILABLE = True
except ImportError:
    PYTESSERACT_AVAILABLE = False
    print("Warning: pytesseract not available. Install with: pip install pytesseract")

class DocumentVerificationService:
    def __init__(self):
        self.supported_doc_types = [
            'id_card', 'admission_letter', 'certificate',
            'payslip', 'offer_letter', 'enrollment_proof', 'general'
        ]

        # Document patterns for verification
        self.patterns = self._load_verification_patterns()

    def _load_verification_patterns(self) -> Dict:
        """Load verification patterns for different document types"""
        return {
            'id_card': {
                'required_fields': ['name', 'id_number', 'date'],
                'keywords': ['identity', 'card', 'id', 'issued'],
                'number_pattern': r'\d{4,}',
            },
            'admission_letter': {
                'required_fields': ['student_name', 'course', 'date', 'college'],
                'keywords': ['admission', 'enrolled', 'student', 'course', 'semester'],
                'email_pattern': r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.ac\.in',
            },
            'certificate': {
                'required_fields': ['name', 'course', 'date', 'institution'],
                'keywords': ['certificate', 'completion', 'course', 'certified'],
                'date_pattern': r'\d{1,2}[/-]\d{1,2}[/-]\d{2,4}',
            },
            'payslip': {
                'required_fields': ['employee_name', 'amount', 'date', 'company'],
                'keywords': ['payslip', 'salary', 'earnings', 'deductions', 'net pay'],
                'amount_pattern': r'₹?\s?\d+[,\d]*\.?\d*',
            },
            'offer_letter': {
                'required_fields': ['candidate_name', 'position', 'date', 'company'],
                'keywords': ['offer', 'position', 'salary', 'joining', 'appointment'],
                'email_pattern': r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in|co\.in)',
            }
        }

    def verify_document(self, document_path: str, doc_type: str = 'general') -> Dict:
        """
        Verify document authenticity
        Checks for: proper format, required fields, tampering signs, quality
        """
        try:
            # Load document image
            image = cv2.imread(document_path)
            if image is None:
                return {
                    'success': False,
                    'error': 'Could not load document'
                }

            results = {
                'success': True,
                'is_authentic': True,
                'confidence': 0.0,
                'document_type': doc_type,
                'checks': {},
                'extracted_data': {},
                'warnings': [],
                'score': 0.0
            }

            # 1. Document Quality Check
            quality_result = self._check_document_quality(image)
            results['checks']['quality'] = quality_result
            if quality_result['score'] < 0.5:
                results['warnings'].append('Low document quality')

            # 2. Tampering Detection
            tampering_result = self._detect_tampering(image)
            results['checks']['tampering'] = tampering_result
            if tampering_result['is_tampered']:
                results['is_authentic'] = False
                results['warnings'].append('Possible document tampering detected')

            # 3. Extract Text (OCR)
            if PYTESSERACT_AVAILABLE:
                text_result = self.extract_text(document_path)
                results['extracted_data']['text'] = text_result.get('text', '')
                results['extracted_data']['word_count'] = text_result.get('word_count', 0)
            else:
                results['extracted_data']['text'] = ''
                results['warnings'].append('OCR not available - text extraction skipped')

            # 4. Document Type Verification
            if doc_type in self.patterns:
                type_result = self._verify_document_type(
                    results['extracted_data'].get('text', ''),
                    doc_type
                )
                results['checks']['type_verification'] = type_result

                if not type_result['is_valid']:
                    results['is_authentic'] = False
                    results['warnings'].extend(type_result.get('missing_fields', []))

            # 5. Structure Analysis
            structure_result = self._analyze_document_structure(image)
            results['checks']['structure'] = structure_result

            # Calculate overall confidence score
            scores = []
            if 'quality' in results['checks']:
                scores.append(results['checks']['quality']['score'])
            if 'tampering' in results['checks']:
                scores.append(1.0 - results['checks']['tampering']['score'])
            if 'type_verification' in results['checks']:
                scores.append(results['checks']['type_verification'].get('confidence', 0.5))
            if 'structure' in results['checks']:
                scores.append(results['checks']['structure']['score'])

            results['confidence'] = np.mean(scores) if scores else 0.5
            results['score'] = results['confidence']

            # Final recommendation
            results['recommendation'] = self._get_document_recommendation(results)

            return results

        except Exception as e:
            return {
                'success': False,
                'error': f'Document verification error: {str(e)}'
            }

    def _check_document_quality(self, image: np.ndarray) -> Dict:
        """Check document image quality"""
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        # Check blur/sharpness
        laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
        sharpness_score = min(laplacian_var / 300, 1.0)

        # Check brightness
        brightness = np.mean(gray)
        if 100 <= brightness <= 200:
            brightness_score = 1.0
        else:
            brightness_score = max(0, 1.0 - abs(brightness - 150) / 150)

        # Check contrast
        contrast = np.std(gray)
        contrast_score = min(contrast / 50, 1.0)

        # Check resolution
        height, width = image.shape[:2]
        min_dimension = min(height, width)
        resolution_score = min(min_dimension / 800, 1.0)

        # Overall quality
        quality_score = (
            sharpness_score * 0.35 +
            brightness_score * 0.25 +
            contrast_score * 0.2 +
            resolution_score * 0.2
        )

        return {
            'score': quality_score,
            'sharpness': sharpness_score,
            'brightness': brightness_score,
            'contrast': contrast_score,
            'resolution': resolution_score,
            'dimensions': f"{width}x{height}",
            'is_acceptable': quality_score > 0.5
        }

    def _detect_tampering(self, image: np.ndarray) -> Dict:
        """Detect signs of document tampering/manipulation"""
        gray = cv2.imread = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        tampering_indicators = []
        score = 0.0

        # 1. Check for inconsistent compression artifacts
        # Different compression levels in different regions suggest tampering
        regions = self._divide_into_regions(gray, 3, 3)
        compression_scores = []

        for region in regions:
            # Calculate compression artifact score using DCT
            dct = cv2.dct(np.float32(region))
            compression_scores.append(np.std(dct))

        compression_variance = np.var(compression_scores)
        if compression_variance > 1000:
            tampering_indicators.append('Inconsistent compression detected')
            score += 0.3

        # 2. Check for edge inconsistencies
        edges = cv2.Canny(gray, 50, 150)
        edge_regions = self._divide_into_regions(edges, 3, 3)
        edge_densities = [np.sum(region > 0) / region.size for region in edge_regions]

        edge_variance = np.var(edge_densities)
        if edge_variance > 0.01:
            tampering_indicators.append('Inconsistent edge patterns')
            score += 0.2

        # 3. Check for noise inconsistencies
        noise_variance = self._analyze_noise_patterns(gray)
        if noise_variance > 0.05:
            tampering_indicators.append('Inconsistent noise patterns')
            score += 0.3

        # 4. Check for cloning/copy-paste
        clone_score = self._detect_cloning(gray)
        if clone_score > 0.6:
            tampering_indicators.append('Potential content cloning detected')
            score += 0.4

        is_tampered = score > 0.5

        return {
            'is_tampered': is_tampered,
            'score': min(score, 1.0),
            'indicators': tampering_indicators,
            'confidence': 'high' if score > 0.7 else 'medium' if score > 0.4 else 'low'
        }

    def _divide_into_regions(self, image: np.ndarray, rows: int, cols: int) -> List[np.ndarray]:
        """Divide image into regions"""
        h, w = image.shape[:2]
        region_h = h // rows
        region_w = w // cols

        regions = []
        for i in range(rows):
            for j in range(cols):
                region = image[i*region_h:(i+1)*region_h, j*region_w:(j+1)*region_w]
                if region.size > 0:
                    regions.append(region)

        return regions

    def _analyze_noise_patterns(self, gray: np.ndarray) -> float:
        """Analyze noise patterns for inconsistencies"""
        # Apply Gaussian blur and subtract to get noise
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)
        noise = cv2.absdiff(gray, blurred)

        # Divide into regions and check noise consistency
        regions = self._divide_into_regions(noise, 3, 3)
        noise_levels = [np.std(region) for region in regions]

        return np.var(noise_levels) / (np.mean(noise_levels) + 1e-6)

    def _detect_cloning(self, gray: np.ndarray) -> float:
        """Detect copy-paste/cloning in document (basic approach)"""
        # Use feature matching to detect similar regions
        # Simple approach: check for duplicate blocks
        h, w = gray.shape
        block_size = 32
        blocks = {}
        duplicates = 0
        total_blocks = 0

        for i in range(0, h - block_size, block_size // 2):
            for j in range(0, w - block_size, block_size // 2):
                block = gray[i:i+block_size, j:j+block_size]
                if block.shape == (block_size, block_size):
                    block_hash = hash(block.tobytes())
                    if block_hash in blocks:
                        duplicates += 1
                    else:
                        blocks[block_hash] = (i, j)
                    total_blocks += 1

        clone_ratio = duplicates / (total_blocks + 1)
        return min(clone_ratio * 5, 1.0)  # Scale up for sensitivity

    def _verify_document_type(self, text: str, doc_type: str) -> Dict:
        """Verify document matches expected type"""
        if doc_type not in self.patterns:
            return {'is_valid': True, 'confidence': 0.5, 'note': 'Unknown document type'}

        pattern = self.patterns[doc_type]
        text_lower = text.lower()

        # Check for required keywords
        keyword_matches = sum(1 for keyword in pattern['keywords'] if keyword in text_lower)
        keyword_score = keyword_matches / len(pattern['keywords']) if pattern['keywords'] else 0

        # Check for specific patterns
        pattern_matches = 0
        pattern_count = 0

        for key, regex_pattern in pattern.items():
            if key.endswith('_pattern'):
                pattern_count += 1
                if re.search(regex_pattern, text):
                    pattern_matches += 1

        pattern_score = pattern_matches / pattern_count if pattern_count > 0 else 1.0

        # Overall verification
        confidence = (keyword_score * 0.6 + pattern_score * 0.4)
        is_valid = confidence > 0.4

        missing_fields = []
        for keyword in pattern['keywords']:
            if keyword not in text_lower:
                missing_fields.append(f"Missing keyword: {keyword}")

        return {
            'is_valid': is_valid,
            'confidence': confidence,
            'keyword_matches': keyword_matches,
            'pattern_matches': pattern_matches,
            'missing_fields': missing_fields if not is_valid else []
        }

    def _analyze_document_structure(self, image: np.ndarray) -> Dict:
        """Analyze document structure (layout, alignment, etc.)"""
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        # Detect text regions using contours
        _, binary = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
        contours, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        # Analyze text regions
        text_regions = len([c for c in contours if cv2.contourArea(c) > 100])

        # Check for proper alignment (text blocks should be aligned)
        centroids = []
        for contour in contours:
            if cv2.contourArea(contour) > 100:
                M = cv2.moments(contour)
                if M["m00"] != 0:
                    cx = int(M["m10"] / M["m00"])
                    cy = int(M["m01"] / M["m00"])
                    centroids.append((cx, cy))

        # Calculate alignment score
        if len(centroids) > 3:
            x_coords = [c[0] for c in centroids]
            x_std = np.std(x_coords)
            alignment_score = max(0, 1.0 - (x_std / image.shape[1]))
        else:
            alignment_score = 0.5

        # Check for proper margins
        h, w = gray.shape
        margin_size = int(min(h, w) * 0.05)
        margins_clear = (
            np.mean(gray[:margin_size, :]) > 200 and  # Top
            np.mean(gray[-margin_size:, :]) > 200 and  # Bottom
            np.mean(gray[:, :margin_size]) > 200 and  # Left
            np.mean(gray[:, -margin_size:]) > 200     # Right
        )

        structure_score = (alignment_score * 0.6 + (1.0 if margins_clear else 0.3) * 0.4)

        return {
            'score': structure_score,
            'text_regions': text_regions,
            'alignment_score': alignment_score,
            'margins_clear': margins_clear,
            'is_well_structured': structure_score > 0.5
        }

    def extract_text(self, document_path: str) -> Dict:
        """Extract text from document using OCR"""
        try:
            if not PYTESSERACT_AVAILABLE:
                return {
                    'success': False,
                    'error': 'OCR not available'
                }

            image = cv2.imread(document_path)
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

            # Preprocess image for better OCR
            # Apply thresholding
            _, binary = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

            # Apply dilation and erosion to remove noise
            kernel = np.ones((1, 1), np.uint8)
            processed = cv2.dilate(binary, kernel, iterations=1)
            processed = cv2.erode(processed, kernel, iterations=1)

            # Perform OCR
            text = pytesseract.image_to_string(processed)

            # Extract structured data if possible
            structured_data = self._extract_structured_data(text)

            return {
                'success': True,
                'text': text.strip(),
                'word_count': len(text.split()),
                'structured_data': structured_data
            }

        except Exception as e:
            return {
                'success': False,
                'error': f'OCR error: {str(e)}'
            }

    def _extract_structured_data(self, text: str) -> Dict:
        """Extract structured data from text"""
        data = {}

        # Extract email addresses
        emails = re.findall(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', text)
        if emails:
            data['emails'] = emails

        # Extract phone numbers
        phones = re.findall(r'\+?[\d\s\-\(\)]{10,}', text)
        if phones:
            data['phones'] = phones

        # Extract dates
        dates = re.findall(r'\d{1,2}[/-]\d{1,2}[/-]\d{2,4}', text)
        if dates:
            data['dates'] = dates

        # Extract amounts (₹ or numbers with commas)
        amounts = re.findall(r'₹?\s?\d+[,\d]*\.?\d*', text)
        if amounts:
            data['amounts'] = amounts

        # Extract ID numbers (sequences of 6+ digits/letters)
        ids = re.findall(r'\b[A-Z0-9]{6,}\b', text)
        if ids:
            data['id_numbers'] = ids

        return data

    def _get_document_recommendation(self, results: Dict) -> str:
        """Get recommendation based on verification results"""
        if not results['is_authentic']:
            return 'REJECT'

        if results['confidence'] < 0.4:
            return 'REJECT'
        elif results['confidence'] < 0.6:
            return 'MANUAL_REVIEW'
        elif results['confidence'] < 0.8:
            return 'REVIEW'
        else:
            return 'APPROVE'
