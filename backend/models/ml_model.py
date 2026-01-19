import pickle
import os
import re

class AttackClassifier:
    def __init__(self):
        self.model_path = os.path.join(os.path.dirname(__file__), 'classifier.pkl')
        self.vectorizer_path = os.path.join(os.path.dirname(__file__), 'vectorizer.pkl')
        self.model = None
        self.vectorizer = None
        self.load_model()
        
        # Pattern-based detection as fallback
        self.attack_patterns = {
            'SQL Injection': [
                r"('\s*(OR|AND)\s*'?\d*\s*=\s*'?\d*)",  # ' OR '1'='1
                r"('?\s*OR\s+1\s*=\s*1)",  # OR 1=1
                r"(UNION\s+SELECT)",  # UNION SELECT
                r"(-{2}|#|/\*)",  # SQL comments
                r"(DROP\s+TABLE|DELETE\s+FROM|INSERT\s+INTO)",
                r"(SELECT\s+.+\s+FROM)",
                r"(;\s*SELECT|;\s*DROP|;\s*DELETE)",
            ],
            'XSS': [
                r"(<script[^>]*>)",  # <script> tags
                r"(javascript\s*:)",  # javascript:
                r"(on\w+\s*=)",  # onclick=, onerror=, etc.
                r"(<img[^>]+onerror)",  # <img onerror=
                r"(alert\s*\(|confirm\s*\(|prompt\s*\()",
            ],
            'Command Injection': [
                r"(;\s*cat\s|;\s*ls\s|;\s*wget\s|;\s*curl\s)",
                r"(\|\s*cat\s|\|\s*ls\s)",  # pipe commands
                r"(`[^`]+`)",  # backtick execution
                r"(\$\([^)]+\))",  # $(command)
                r"(/etc/passwd|/etc/shadow)",
            ],
            'Directory Traversal': [
                r"(\.\./|\.\.\\)",  # ../
                r"(%2e%2e/|%2e%2e\\)",  # encoded ../
                r"(/etc/passwd|/etc/shadow|/windows/system32)",
            ],
            'Brute Force': [
                r"(admin|root|administrator|password|123456|qwerty)",
            ],
        }

    def load_model(self):
        try:
            if os.path.exists(self.model_path) and os.path.exists(self.vectorizer_path):
                with open(self.model_path, 'rb') as f:
                    self.model = pickle.load(f)
                with open(self.vectorizer_path, 'rb') as f:
                    self.vectorizer = pickle.load(f)
                print("ML Model loaded successfully.")
            else:
                print("ML Model not found. Using pattern-based detection.")
        except Exception as e:
            print(f"Error loading ML model: {e}. Using pattern-based detection.")
    
    def pattern_based_detect(self, payload):
        """Fallback pattern-based attack detection"""
        if not payload:
            return None
        
        payload_lower = payload.lower()
        
        for attack_type, patterns in self.attack_patterns.items():
            for pattern in patterns:
                if re.search(pattern, payload_lower, re.IGNORECASE):
                    return attack_type
        
        return None

    def predict(self, payload):
        if not payload:
            return "Reconnaissance"
        
        # First try pattern-based detection (more reliable)
        pattern_result = self.pattern_based_detect(payload)
        if pattern_result:
            return pattern_result
        
        # Then try ML model
        if self.model and self.vectorizer:
            try:
                features = self.vectorizer.transform([payload])
                prediction = self.model.predict(features)[0]
                if prediction and prediction != "Normal":
                    return prediction
            except Exception as e:
                print(f"Prediction Error: {e}")
        
        # Default based on content analysis
        if any(word in payload.lower() for word in ['password', 'pass', 'admin', 'root', 'user']):
            return "Brute Force"
        
        return "Suspicious Activity"
        

