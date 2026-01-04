import tensorflow as tf
from transformers import AutoTokenizer
import os

class HateSpeechDetector:
    def __init__(self):
        self.model = None
        self.tokenizer = None
        self.loaded = False
        
    def load_model(self, model_path, tokenizer_path):
        if not self.loaded:
            if not os.path.exists(model_path):
                raise FileNotFoundError(f"Model not found at: {model_path}")
            if not os.path.exists(tokenizer_path):
                raise FileNotFoundError(f"Tokenizer not found at: {tokenizer_path}")
                
            print(f"Loading model from: {model_path}") 
            self.model = tf.saved_model.load(model_path)
            print(f"Loading tokenizer from: {tokenizer_path}")
            self.tokenizer = AutoTokenizer.from_pretrained(tokenizer_path)
            self.loaded = True
            
    def predict(self, text, threshold=0.5):
        if not self.loaded:
            raise ValueError("Model not loaded. Call load_model() first.")
            
        try:
            inputs = self.tokenizer(
                text,
                return_tensors="tf",
                max_length=128,
                truncation=True,
                padding="max_length"
            )
            
            infer = self.model.signatures['serving_default']
            output = infer(
                input_ids=inputs['input_ids'],
                attention_mask=inputs['attention_mask']
            )
            
            probability = float(output['prediction'].numpy()[0][0])
            return {
                "is_hate": probability >= threshold,
                "probability": probability,
                "threshold": threshold
            }
            
        except Exception as e:
            raise RuntimeError(f"Prediction failed: {str(e)}")

def get_absolute_path(relative_path):
    return os.path.abspath(os.path.join(os.path.dirname(__file__), relative_path))

detector = HateSpeechDetector()
detector.load_model(
    model_path=get_absolute_path("../models/WorkSphere_labse_Model"),
    tokenizer_path=get_absolute_path("../models/WorkSphere_labse_Model_tokenizer")
)