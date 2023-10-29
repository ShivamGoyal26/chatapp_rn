import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

// Files
import {store} from '../redux/store';
import api from '../constants/api';
import {setLoading} from '../redux/common';
import toast from '../utils/toast';

const getInstance = ({
  hasImage,
  data,
  params,
  extraAdditionToHeader,
  cancelToken,
}: any) => {
  const authToken = store.getState().auth.authToken;

  const isInternet = store.getState().common.isInternet;
  const instance = axios.create({
    baseURL: api.baseUrl.STAGING_URL,
  });

  // const {CancelToken} = axios;
  // const source = CancelToken.source();

  function isTokenExpired() {
    if (!authToken) {
      return true;
    }
    const decodedToken = jwtDecode(authToken); // Assuming you are using a JWT access token
    const expirationTime = decodedToken.exp * 1000; // Convert expiration time to milliseconds

    // Compare the current time with the expiration time
    const currentTime = Date.now();
    return currentTime >= expirationTime;
  }

  instance.interceptors.request.use(
    (request: any) => {
      request.data = data;
      request.params = params;
      if (cancelToken) {
        request.cancelToken = cancelToken;
      }
      if (extraAdditionToHeader) {
        request.headers = {...request.headers, ...extraAdditionToHeader};
      }
      if (hasImage !== 0) {
        request.headers['Content-Type'] = 'multipart/form-data';
      } else {
        request.headers['Content-Type'] = 'application/json';
      }
      if (authToken) {
        request.headers['Authorization'] = 'Bearer ' + authToken;
      }

      if (!isInternet) {
        source.cancel('Cancelled');
      }
      if (__DEV__) {
        console.log(request.url);
      } else {
        console.log(request.url, request.data);
      }
      return request;
    },
    error => {
      throw new Error(error.message);
    },
  );

  instance.interceptors.response.use(
    function (response) {
      if (response.data.responseCode === 222) {
        // store.dispatch(signOutManager());
        throw new Error(response.data.message);
      }
      return response;
    },
    function (error) {
      if (error?.response?.status === 401 && isTokenExpired()) {
        // store.dispatch(signOutManager());
        // throw new Error(localization.sessionExpired);
        // // Refresh the token and resend the original request
        // return refreshAccessToken().then(newToken => {
        //   // Update the access token
        //   updateAccessToken(newToken);
        //   // Modify the original request with the new access token
        //   const originalRequest = error.config;
        //   originalRequest.headers.Authorization = `Bearer ${newToken}`;
        //   // Retry the original request
        //   return axiosInstance(originalRequest);
        // });
      } else {
        throw new Error(error.message);
      }
    },
  );

  return instance;
};

const apiCall = async ({
  hasImage = 0,
  type,
  url,
  data,
  params = {},
  enableLoader = true,
  extraAdditionToHeader = null,
  source,
  cancelToken,
}: any) => {
  if (enableLoader) {
    store.dispatch(setLoading(true));
  }
  const instance = getInstance({
    hasImage,
    data,
    params,
    extraAdditionToHeader,
    source,
    cancelToken,
  });
  try {
    switch (type) {
      case api.apiTypes.post: {
        let response = await instance.post(url);
        return response?.data;
      }
      case api.apiTypes.patch: {
        let response = await instance.patch(url);
        return response?.data;
      }
      case api.apiTypes.put: {
        let response = await instance.put(url);
        return response?.data;
      }

      case api.apiTypes.delete: {
        let response = await instance.delete(url);
        return response?.data;
      }

      case api.apiTypes.get: {
        let response = await instance.get(url);
        return response?.data;
      }

      default: {
        let response = await instance.get(url);
        return response?.data;
      }
    }
  } catch (error: any) {
    console.log('Error in catch', error.message);
    if (error.message !== 'Cancelled') {
      toast.showErrorMessage(error?.message);
    }
  } finally {
    store.dispatch(setLoading(false));
  }
};

export default apiCall;
