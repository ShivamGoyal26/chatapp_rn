import AsyncStorage from '@react-native-async-storage/async-storage';
import {useState, useEffect} from 'react';

type StorageHookResult<T> = {
  value: T;
  setValue: (newValue: T) => void;
  clearValue: () => void;
  clearStorage: () => void;
};

const useAsyncStorage = <T>(
  key: string,
  initialValue: T,
): StorageHookResult<T> => {
  const [value, setValue] = useState<T>(initialValue);

  // Load data from AsyncStorage when the component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedValue = await AsyncStorage.getItem(key);
        if (storedValue !== null) {
          setValue(JSON.parse(storedValue) as T);
        }
      } catch (error) {
        console.error('Error loading data from AsyncStorage:', error);
      }
    };

    loadData();
  }, [key]);

  const setStoredValue = async (newValue: T) => {
    try {
      setValue(newValue);
      await AsyncStorage.setItem(key, JSON.stringify(newValue));
    } catch (error) {
      console.error('Error storing data in AsyncStorage:', error);
    }
  };

  const clearStoredValue = async () => {
    try {
      setValue(initialValue);
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing data from AsyncStorage:', error);
    }
  };

  const clearAllStoredKeys = async () => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing all keys in AsyncStorage:', error);
    }
  };

  return {
    value,
    setValue: setStoredValue,
    clearValue: clearStoredValue,
    clearStorage: clearAllStoredKeys,
  };
};

export default useAsyncStorage;
