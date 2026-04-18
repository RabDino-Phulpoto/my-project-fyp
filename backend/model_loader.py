import os
# Suppress TensorFlow logging to save memory
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3' 

import tensorflow as tf

# Optimization: Limit TensorFlow to use minimal memory on CPU
physical_devices = tf.config.list_physical_devices('CPU')
try:
    tf.config.set_visible_devices(physical_devices[0], 'CPU')
except:
    pass

def find_model_path(model_name):
    """Helper to find model files in different environments"""
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Path 1: models/name.keras (Directly inside backend)
    path1 = os.path.join(base_dir, 'models', model_name)
    # Path 2: backend/models/name.keras (Monorepo root)
    path2 = os.path.join(base_dir, 'backend', 'models', model_name)
    
    if os.path.exists(path1):
        return path1
    elif os.path.exists(path2):
        return path2
    return path1 # Fallback to path1 for error reporting

def load_medical_models():
    clf_path = find_model_path('best_aneurysm_model.keras')
    seg_path = find_model_path('unet_segmenter.keras')

    try:
        print(f"🔄 Searching for models...")
        print(f"DEBUG: Using Clf Path: {clf_path}")
        
        if not os.path.exists(clf_path):
            print(f"❌ CRITICAL ERROR: {clf_path} does not exist on disk!")
            return None, None

        print("🔄 Loading AI Models into memory (1GB Limit)...")
        
        # compile=False is mandatory to keep memory usage under 1GB
        clf_model = tf.keras.models.load_model(clf_path, compile=False)
        seg_model = tf.keras.models.load_model(seg_path, compile=False)
        
        print("✅ Success: Classification and Segmentation models loaded.")
        return clf_model, seg_model
    except Exception as e:
        print(f"❌ Error loading models: {e}")
        return None, None