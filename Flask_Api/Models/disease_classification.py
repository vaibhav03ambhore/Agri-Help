import tensorflow as tf
import numpy as np

class TFLiteModel:
    def __init__(self, model_path):
        self.interpreter = tf.lite.Interpreter(model_path=model_path)
        self.interpreter.allocate_tensors()
        self.input_details = self.interpreter.get_input_details()
        self.output_details = self.interpreter.get_output_details()

    def preprocess_image(self, image):
        image = tf.image.resize(image, [256, 256])
        image = image / 255.0
        image = tf.expand_dims(image, axis=0)
        return image

    def predict(self, image):
        input_data = self.preprocess_image(image)
        self.interpreter.set_tensor(self.input_details[0]['index'], input_data)
        self.interpreter.invoke()
        return self.interpreter.get_tensor(self.output_details[0]['index'])

# Initialize model
model = TFLiteModel("./model_weights/model_quantized.tflite")