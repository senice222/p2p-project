import axios from 'axios';
import { BASE_PATH } from '../codegen/api/base';

const axiosInstance = axios.create({
  baseURL: BASE_PATH,
});

axiosInstance.interceptors.request.use(
  (config) => {
    // window?.Telegram?.WebApp?.initData;
    const token = 'query_id=AAFrv58yAgAAAGu_nzJLsb9X&user=%7B%22id%22%3A5144297323%2C%22first_name%22%3A%22Vivaldi%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22VivaldiCode%22%2C%22language_code%22%3A%22ru%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2F3xwzdTJNpGT5xO9zPiWaqh_QXcs6Ri3EkTfm05cPPMPg09fKDwdrwh65VrtqARPa.svg%22%7D&auth_date=1744058699&signature=4VeRt08j1GI4uVgyvDVhYLu0xUgfrBvaJxGchAucFSJoefKISemnJSKwcUeYa-Fh2wQnUmSVT2H_kBMuzE94Aw&hash=86db3245082a15b9f82963caf07df65202aa866564d77fa6edd46027196695c4';

    config.headers['InitData'] = token;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
