import {showMessage} from 'react-native-flash-message';

const showSuccessMessage = (message: string) => {
  showMessage({
    message: message ? message : 'Something went wrong!',
    type: 'success',
  });
};

const showErrorMessage = (message: string) => {
  showMessage({
    message: message ? message : 'Something went wrong!',
    type: 'danger',
  });
};

export default {
  showErrorMessage,
  showSuccessMessage,
};
