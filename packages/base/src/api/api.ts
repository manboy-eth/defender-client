import axios, { AxiosError, AxiosInstance } from 'axios';
import { pick } from 'lodash/fp';
import { DefenderApiResponseError } from './api-error';
import { authenticate, PoolData, UserPass } from './auth';

export function rejectWithDefenderApiError(axiosError: AxiosError): Promise<never> {
  return Promise.reject(new DefenderApiResponseError(axiosError));
}

export function createApi(key: string, token: string, apiUrl: string): AxiosInstance {
  const instance = axios.create({
    baseURL: apiUrl,
    headers: {
      'X-Api-Key': key,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  instance.interceptors.response.use(({ data }) => data, rejectWithDefenderApiError);

  return instance;
}

export async function createAuthenticatedApi(
  userPass: UserPass,
  poolData: PoolData,
  apiUrl: string,
): Promise<AxiosInstance> {
  const token = await authenticate(userPass, poolData);
  const api = createApi(userPass.Username, token, apiUrl);
  return api;
}
