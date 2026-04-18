import os
# Suppress TensorFlow logging to save memory and keep logs clean
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3' 

import tensorflow as tf

# Optimization: Limit TensorFlow to use minimal memory on CPU
physical_devices = tf.config.list_physical_devices('CPU')
try:
    # This helps prevent memory spikes during model loading
    tf.config.set_visible_devices(physical_devices[0], 'CPU')
except:
    pass

def load_medical_models():
    # Get the path to the 'models' folder inside 'backend'
    base_dir = os.path.dirname(os.path.abspath(__file__))
    clf_path = os.path.join(base_dir, 'models', 'best_aneurysm_model.keras')
    seg_path = os.path.join(base_dir, 'models', 'unet_segmenter.keras')

    try:
        print("🔄 Loading AI Models into memory (1GB Limit)... please wait.")
        
        # compile=False saves memory because we only need the models for prediction (inference)
        clf_model = tf.keras.models.load_model(clf_path, compile=False)
        seg_model = tf.keras.models.load_model(seg_path, compile=False)
        
        print("✅ Success: Classification and Segmentation models loaded.")
        return clf_model, seg_model
    except Exception as e:
        print(f"❌ Error loading models: {e}")
        return None, None