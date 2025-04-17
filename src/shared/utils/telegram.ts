import { retrieveLaunchParams} from "@telegram-apps/sdk";

export function getTelegramInitData() {
  const { initDataRaw } = retrieveLaunchParams();
  return {
    initDataRaw: initDataRaw,
  };
}
