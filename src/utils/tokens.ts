import {jwtDecode} from 'jwt-decode';

export function isTokenExpired(authToken: string | null) {
  if (!authToken) {
    return true; // If the token is not provided, it's considered expired
  }
  try {
    const decodedHeader = jwtDecode(authToken, {header: true});
    console.log(decodedHeader);
  } catch (error) {
    return true;
  }
}
