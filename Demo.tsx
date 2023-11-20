import React, {useState} from 'react';
import {View, Button, Text} from 'react-native';

// Replace with your API endpoint and configuration
const API_ENDPOINT = 'https://your-api-endpoint.com/upload';

// Mock function for image upload
const uploadImage = image => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const success = Math.random() < 0.7; // Simulate random success/failure
      console.log(Math.random());
      if (success) {
        resolve('Image uploaded successfully'); // Return a success message
      } else {
        reject('Image upload failed'); // Return an error message
      }
    }, 1000 * Math.random() * 10); // Simulate a 2-second upload delay
  });
};

// Main component
const ImageUploader = () => {
  const [images, setImages] = useState([1, 2, 3, 4]);
  const [status, setStatus] = useState([]);

  const handleImageUpload = async () => {
    const uploadPromises = images.map(async (image, index) => {
      //   return new Promise(async (resolve, reject) => {
      try {
        setStatus(prevStatus => [...prevStatus, {index, status: 'uploading'}]);
        const res = await uploadImage(image);
        setStatus(prevStatus => {
          prevStatus[index] = {index, status: 'completed'};
          return [...prevStatus];
        });
        // resolve(res);
      } catch (error) {
        // reject(error);
        console.log('error', error);
        setStatus(prevStatus => {
          prevStatus[index] = {index, status: 'failed'};
          return [...prevStatus];
        });
      }
    });
    // });
    console.log('uploadPromises', uploadPromises);
    const res = await Promise.allSettled(uploadPromises);
    console.log('main', res);
  };

  console.log('sjks');

  return (
    <View style={{padding: 40}}>
      <Button title="Upload Images" onPress={handleImageUpload} />

      {images.map((image, index) => {
        return (
          <Text key={index}>
            Image {index + 1}: {status[index]?.status || 'not uploaded'}
          </Text>
        );
      })}
      {/*           
          {images.map((image, index) => {
              return (
                <Text key={index}>
                Image {index + 1}: {status[index]?.status || 'not uploaded'}
              </Text>
          )
      }} */}
    </View>
  );
};

export default ImageUploader;
