import os
# Suppress TensorFlow logging to save memory
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3' 

import tensorflow as tf

# Optimization: Limit TensorFlow memory allocation
physical_devices = tf.config.list_physical_devices('CPU')
try:
    tf.config.set_visible_devices(physical_devices[0], 'CPU')
except:
    pass

def find_model_path(model_name):
    """Checks for models in the local models folder"""
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    # After setting Root Directory to /backend, this is the path:
    path = os.path.join(base_dir, 'models', model_name)
    
    print(f"🔍 Checking path: {path}")
    if os.path.exists(path):
        print(f"🎯 FOUND MODEL: {path}")
        return path
    return None

def load_medical_models():
    clf_path = find_model_path('best_aneurysm_model.keras')
    seg_path = find_model_path('unet_segmenter.keras')

    if not clf_path or not seg_path:
        print(f"❌ CRITICAL ERROR: Models not found on disk.")
        return None, None

    try:
        print("🔄 Loading AI Models into memory (1GB Limit)...")
        # compile=False is mandatory for low-memory environments
        clf_model = tf.keras.models.load_model(clf_path, compile=False)
        seg_model = tf.keras.models.load_model(seg_path, compile=False)
        
        print("✅ Success: Classification and Segmentation models loaded.")
        return clf_model, seg_model
    except Exception as e:
        print(f"❌ Error loading models: {e}")
        return None, None