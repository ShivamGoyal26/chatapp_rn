export default {
  baseUrl: {
    STAGING_URL: 'http://192.168.0.103:3000/api',
  },
  apiTypes: {
    post: 'POST',
    get: 'GET',
    delete: 'DELETE',
    put: 'PUT',
    patch: 'PATCH',
  },
  endpoints: {
    LOGIN_URL: '/user/login',
    SIGNUP_URL: '/user/register',
    UPLOAD_ASSET_URL: '/assets/put',
    GET_ASSET_URL: '/assets/get',
    FIND_USER: '/user/findusers',
  },
};
