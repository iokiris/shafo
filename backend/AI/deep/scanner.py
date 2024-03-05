from deepface import DeepFace

def analyze_image_face(img_path):
    try:
        results = DeepFace.analyze(img_path=img_path, actions=['age', 'emotion', 'gender', 'race'])
        return results
    except:
        return None
    ...