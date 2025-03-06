import tensorflow as tf
import numpy as np
import pandas as pd

class TFLiteModel:
    def __init__(self, model_path, label_map_path='./model_weights/disease_label_encoding.csv'):
        self.interpreter = tf.lite.Interpreter(model_path=model_path)
        self.interpreter.allocate_tensors()
        self.input_details = self.interpreter.get_input_details()
        self.output_details = self.interpreter.get_output_details()
        
        # Load label mapping
        self.label_map = pd.read_csv(label_map_path).set_index('Encoding')['Label'].to_dict()

    def preprocess_image(self, image):
        image = tf.image.resize(image, [256, 256])
        image = image / 255.0
        image = tf.expand_dims(image, axis=0)
        return image

    def predict(self, image):
        input_data = self.preprocess_image(image)
        self.interpreter.set_tensor(self.input_details[0]['index'], input_data)
        self.interpreter.invoke()
        predictions = self.interpreter.get_tensor(self.output_details[0]['index'])
        return predictions

    def get_label(self, prediction):
        return self.label_map.get(int(prediction), "Unknown")

# Initialize model
model = TFLiteModel("./model_weights/plant_disease_model.tflite")