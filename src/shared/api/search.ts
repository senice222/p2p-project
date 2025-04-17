import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../inteceptors/axios";

export const useSearchLztUser = () => {
  return useMutation({
    mutationFn: async ({ username }: { username: string }) => {
      return (await axiosInstance.get(`/market/payment_app/find_lzt_user/${username}`)).data
    },
  });
};
