import axios from 'axios';
import Config from 'react-native-config';

// Files
import {setLoading} from '../redux/common';
import {store} from '../redux/store';
import api from '../constants/api';
import {isTokenExpired} from '../utils/tokens';
import {logoutThunk} from '../redux/auth';

type apiCallProps = {
  hasImage?: 0 | 1;
  type: string;
  url: string;
  data?: Object;
  params?: Object;
  enableLoader?: boolean;
  extraAdditionToHeader?: null | Object;
  replaceHeaders?: null | Object;
  cancelToken?: any;
};

const getInstance = ({
  hasImage,
  data,
  params,
  extraAdditionToHeader,
  cancelToken,
  replaceHeaders,
}: any) => {
  const authToken = store.getState().auth.authToken;
  const instance = axios.create({
    baseURL: Config.API_URL,
  });

  instance.interceptors.request.use(
    (request: any) => {
      request.data = data;
      request.params = params;
      if (cancelToken) {
        request.cancelToken = cancelToken;
      }
      if (replaceHeaders) {
        request.headers = {...request.headers, ...replaceHeaders};
      } else {
        if (extraAdditionToHeader) {
          request.headers = {...request.headers, ...extraAdditionToHeader};
        }
        if (hasImage !== 0) {
          request.headers['Content-Type'] = 'multipart/form-data';
        } else {
          request.headers['Content-Type'] = 'application/json';
        }
      }
      if (authToken) {
        request.headers['Authorization'] = 'Bearer ' + authToken;
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
      return response;
    },
    function (error) {
      if (error?.response?.status === 401 && isTokenExpired(authToken)) {
        store.dispatch(logoutThunk());
        throw new Error(
          error?.response?.data?.message
            ? error?.response?.data?.message
            : 'Something went wrong!',
        );

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
        if (error?.response?.status) {
          throw new Error(
            error?.response?.data?.message
              ? error?.response?.data?.message
              : 'Something went wrong!',
          );
        } else {
          throw new Error(error.message);
        }
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
  replaceHeaders = null,
  cancelToken,
}: apiCallProps) => {
  if (enableLoader) {
    store.dispatch(setLoading(true));
  }
  const instance = getInstance({
    hasImage,
    data,
    params,
    extraAdditionToHeader,
    cancelToken,
    replaceHeaders,
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
    return {
      status: false,
      message: error?.message,
    };
  } finally {
    store.dispatch(setLoading(false));
  }
};

export default apiCall;
