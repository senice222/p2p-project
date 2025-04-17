import globalAxios from "axios";

import type { AxiosError, InternalAxiosRequestConfig } from "axios";

type TRequestOverride = (
  requestConfig: InternalAxiosRequestConfig
) => InternalAxiosRequestConfig;

export class BaseApi {
  constructor(requestOverride: TRequestOverride) {
    this.setDefaults(requestOverride);
  }

  private setDefaults = (requestOverride: TRequestOverride) => {
    globalAxios.interceptors.response.use(
      (config) => config,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          return Promise.reject(error);
        }

        console.error("@@@ REQUEST ERROR", error.request, error.response);

        throw error;
      }
    );
    globalAxios.interceptors.request.use(requestOverride, (error) => {
      Promise.reject(error);
    });
  };
}
