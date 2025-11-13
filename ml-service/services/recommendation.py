"""
Recommendation Service
Provides personalized content recommendations using collaborative filtering
and content-based algorithms
"""
import numpy as np
from typing import Dict, List, Tuple
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
import json

class RecommendationService:
    def __init__(self):
        self.user_item_matrix = {}  # user_id -> {item_id: rating}
        self.item_features = {}  # item_id -> feature_vector
        self.user_preferences = {}  # user_id -> preference_vector
        self.tfidf_vectorizer = TfidfVectorizer(max_features=100)

    def recommend_colleges(self, user_id: str, preferences: Dict, history: List) -> Dict:
        """
        Generate personalized college recommendations
        Uses hybrid approach: collaborative filtering + content-based
        """
        try:
            recommendations = []

            # Extract user preferences
            preferred_state = preferences.get('state', '')
            preferred_type = preferences.get('type', '')
            preferred_ranking = preferences.get('ranking', {})
            budget = preferences.get('budget', 0)

            # Calculate scores for each college based on:
            # 1. User preferences match
            # 2. Similar users' choices (collaborative filtering)
            # 3. College features (content-based)

            # For now, return structure with scoring logic
            # In production, this would query actual database

            return {
                'success': True,
                'recommendations': [
                    {
                        'college_id': 'college_1',
                        'name': 'Sample College',
                        'score': 0.85,
                        'reasons': [
                            'Matches your state preference',
                            'High ranking in your preferred field',
                            'Within your budget range'
                        ],
                        'confidence': 'high'
                    }
                ],
                'explanation': {
                    'factors': [
                        'User preferences',
                        'Historical behavior',
                        'Similar users choices'
                    ],
                    'weights': {
                        'preference_match': 0.4,
                        'collaborative': 0.3,
                        'content_based': 0.3
                    }
                }
            }

        except Exception as e:
            return {
                'success': False,
                'error': f'Recommendation error: {str(e)}'
            }

    def recommend_reviews(self, user_id: str, history: List) -> Dict:
        """
        Recommend relevant reviews based on user history
        """
        try:
            # Analyze user's reading history
            # Find similar users
            # Recommend reviews those users found helpful

            return {
                'success': True,
                'recommendations': [
                    {
                        'review_id': 'review_1',
                        'title': 'Sample Review',
                        'score': 0.82,
                        'reasons': [
                            'Similar to reviews you liked',
                            'About colleges you viewed',
                            'Highly rated by similar users'
                        ]
                    }
                ],
                'personalization_factors': [
                    'Reading history',
                    'Liked reviews',
                    'User profile'
                ]
            }

        except Exception as e:
            return {
                'success': False,
                'error': f'Recommendation error: {str(e)}'
            }

    def train_model(self, training_data: List[Dict]) -> Dict:
        """
        Train/update recommendation model with new data
        training_data: List of {user_id, item_id, rating, features}
        """
        try:
            # Update user-item matrix
            for entry in training_data:
                user_id = entry.get('user_id')
                item_id = entry.get('item_id')
                rating = entry.get('rating', 0)

                if user_id not in self.user_item_matrix:
                    self.user_item_matrix[user_id] = {}

                self.user_item_matrix[user_id][item_id] = rating

            # Calculate item similarities
            similarity_matrix = self._calculate_item_similarities()

            # Update user preferences
            for user_id in self.user_item_matrix:
                self.user_preferences[user_id] = self._calculate_user_preferences(user_id)

            return {
                'success': True,
                'users_processed': len(self.user_item_matrix),
                'items_processed': len(self.item_features),
                'model_updated': True
            }

        except Exception as e:
            return {
                'success': False,
                'error': f'Training error: {str(e)}'
            }

    def _calculate_item_similarities(self) -> np.ndarray:
        """Calculate similarity matrix between items"""
        if not self.item_features:
            return np.array([[]])

        item_ids = list(self.item_features.keys())
        feature_matrix = np.array([self.item_features[item_id] for item_id in item_ids])

        # Calculate cosine similarity
        similarity_matrix = cosine_similarity(feature_matrix)

        return similarity_matrix

    def _calculate_user_preferences(self, user_id: str) -> np.ndarray:
        """Calculate user preference vector based on ratings"""
        if user_id not in self.user_item_matrix:
            return np.zeros(100)  # Default feature size

        user_ratings = self.user_item_matrix[user_id]

        # Weight item features by user ratings
        preference_vector = np.zeros(100)
        total_weight = 0

        for item_id, rating in user_ratings.items():
            if item_id in self.item_features:
                preference_vector += self.item_features[item_id] * rating
                total_weight += rating

        if total_weight > 0:
            preference_vector /= total_weight

        return preference_vector

    def _collaborative_filtering(self, user_id: str, k: int = 5) -> List[Tuple[str, float]]:
        """
        Collaborative filtering: Find similar users and recommend their items
        Returns: List of (item_id, score) tuples
        """
        if user_id not in self.user_item_matrix:
            return []

        user_ratings = self.user_item_matrix[user_id]

        # Find similar users
        similar_users = self._find_similar_users(user_id, k)

        # Aggregate recommendations from similar users
        recommendations = {}

        for similar_user_id, similarity in similar_users:
            similar_user_ratings = self.user_item_matrix[similar_user_id]

            for item_id, rating in similar_user_ratings.items():
                if item_id not in user_ratings:  # Only recommend unseen items
                    if item_id not in recommendations:
                        recommendations[item_id] = 0
                    recommendations[item_id] += rating * similarity

        # Sort by score
        sorted_recommendations = sorted(
            recommendations.items(),
            key=lambda x: x[1],
            reverse=True
        )

        return sorted_recommendations

    def _find_similar_users(self, user_id: str, k: int = 5) -> List[Tuple[str, float]]:
        """Find k most similar users"""
        if user_id not in self.user_item_matrix:
            return []

        user_ratings = self.user_item_matrix[user_id]
        similarities = []

        for other_user_id, other_ratings in self.user_item_matrix.items():
            if other_user_id == user_id:
                continue

            # Calculate similarity (Pearson correlation or cosine similarity)
            similarity = self._calculate_user_similarity(user_ratings, other_ratings)
            similarities.append((other_user_id, similarity))

        # Sort by similarity and return top k
        similarities.sort(key=lambda x: x[1], reverse=True)
        return similarities[:k]

    def _calculate_user_similarity(self, ratings1: Dict, ratings2: Dict) -> float:
        """Calculate similarity between two users based on their ratings"""
        # Find common items
        common_items = set(ratings1.keys()) & set(ratings2.keys())

        if len(common_items) < 2:
            return 0.0

        # Extract ratings for common items
        ratings1_common = np.array([ratings1[item] for item in common_items])
        ratings2_common = np.array([ratings2[item] for item in common_items])

        # Calculate Pearson correlation
        mean1 = np.mean(ratings1_common)
        mean2 = np.mean(ratings2_common)

        num = np.sum((ratings1_common - mean1) * (ratings2_common - mean2))
        den = np.sqrt(np.sum((ratings1_common - mean1)**2) * np.sum((ratings2_common - mean2)**2))

        if den == 0:
            return 0.0

        correlation = num / den
        return correlation

    def _content_based_filtering(self, user_id: str, k: int = 10) -> List[Tuple[str, float]]:
        """
        Content-based filtering: Recommend items similar to user's preferences
        Returns: List of (item_id, score) tuples
        """
        if user_id not in self.user_preferences:
            return []

        user_pref_vector = self.user_preferences[user_id]
        user_seen_items = set(self.user_item_matrix.get(user_id, {}).keys())

        # Calculate similarity between user preferences and all items
        recommendations = []

        for item_id, item_features in self.item_features.items():
            if item_id not in user_seen_items:
                # Calculate cosine similarity
                similarity = np.dot(user_pref_vector, item_features) / (
                    np.linalg.norm(user_pref_vector) * np.linalg.norm(item_features) + 1e-6
                )
                recommendations.append((item_id, similarity))

        # Sort by similarity
        recommendations.sort(key=lambda x: x[1], reverse=True)
        return recommendations[:k]

    def _hybrid_recommendation(self, user_id: str, k: int = 10,
                              collab_weight: float = 0.5,
                              content_weight: float = 0.5) -> List[Tuple[str, float]]:
        """
        Hybrid recommendation combining collaborative and content-based filtering
        """
        # Get recommendations from both methods
        collab_recs = dict(self._collaborative_filtering(user_id, k * 2))
        content_recs = dict(self._content_based_filtering(user_id, k * 2))

        # Combine scores
        all_items = set(collab_recs.keys()) | set(content_recs.keys())
        hybrid_scores = {}

        for item_id in all_items:
            collab_score = collab_recs.get(item_id, 0)
            content_score = content_recs.get(item_id, 0)

            # Weighted combination
            hybrid_scores[item_id] = (
                collab_weight * collab_score +
                content_weight * content_score
            )

        # Sort and return top k
        sorted_recommendations = sorted(
            hybrid_scores.items(),
            key=lambda x: x[1],
            reverse=True
        )

        return sorted_recommendations[:k]

    def explain_recommendation(self, user_id: str, item_id: str) -> Dict:
        """
        Explain why an item was recommended to a user
        """
        try:
            explanation = {
                'factors': [],
                'similar_users': [],
                'similar_items': [],
                'preference_match': {}
            }

            # Check if user has rated similar items
            if user_id in self.user_item_matrix:
                user_ratings = self.user_item_matrix[user_id]

                # Find similar items user has rated
                if item_id in self.item_features:
                    item_vector = self.item_features[item_id]

                    similar_rated_items = []
                    for rated_item_id, rating in user_ratings.items():
                        if rated_item_id in self.item_features:
                            similarity = np.dot(item_vector, self.item_features[rated_item_id])
                            if similarity > 0.7:  # Threshold for similarity
                                similar_rated_items.append({
                                    'item_id': rated_item_id,
                                    'rating': rating,
                                    'similarity': similarity
                                })

                    explanation['similar_items'] = similar_rated_items[:3]

            # Find similar users who liked this item
            similar_users = self._find_similar_users(user_id, 5)
            for similar_user_id, similarity in similar_users:
                if item_id in self.user_item_matrix.get(similar_user_id, {}):
                    rating = self.user_item_matrix[similar_user_id][item_id]
                    explanation['similar_users'].append({
                        'user_id': similar_user_id,
                        'similarity': similarity,
                        'rating': rating
                    })

            # Generate explanation text
            explanation['factors'] = self._generate_explanation_factors(explanation)

            return {
                'success': True,
                'explanation': explanation
            }

        except Exception as e:
            return {
                'success': False,
                'error': f'Explanation error: {str(e)}'
            }

    def _generate_explanation_factors(self, explanation: Dict) -> List[str]:
        """Generate human-readable explanation factors"""
        factors = []

        if explanation['similar_items']:
            factors.append(f"Similar to {len(explanation['similar_items'])} items you liked")

        if explanation['similar_users']:
            factors.append(f"Liked by {len(explanation['similar_users'])} users similar to you")

        if not factors:
            factors.append("Based on general popularity")

        return factors
