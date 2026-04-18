import tensorflow as tf
import os

def load_medical_models():
    # Get the path to the 'models' folder inside 'backend'
    base_dir = os.path.dirname(os.path.abspath(__file__))
    clf_path = os.path.join(base_dir, 'models', 'best_aneurysm_model.keras')
    seg_path = os.path.join(base_dir, 'models', 'unet_segmenter.keras')

    try:
        print("🔄 Loading AI Models... please wait.")
        clf_model = tf.keras.models.load_model(clf_path)
        seg_model = tf.keras.models.load_model(seg_path)
        print("✅ Success: Classification and Segmentation models loaded.")
        return clf_model, seg_model
    except Exception as e:
        print(f"❌ Error loading models: {e}")
        return None, None