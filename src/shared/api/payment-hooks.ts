import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../inteceptors/axios";
import { api } from "../codegen/api-adapter";

export const useGetPaymentMethodTypes = () => {
  return useMutation({
    mutationFn: async (amount: number) => {
      return await axiosInstance.get(
        `/market/payment_app/payment_method_types?amount=${amount}`
      ).then(res => res.data);
    },
  });
};

export const useGetPaymentMethods = () => {
  return useMutation({
    mutationFn: async ({paymentMethodType, amount}: {paymentMethodType: string, amount: number}) => {
      return await axiosInstance.get(`/market/payment_app/payment_methods?payment_method_type=${paymentMethodType}&amount=${amount}`).then(res => res.data);
    },
  });
};

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: async ({amount, payment_method_id, lolz_user_id}: {amount: number, payment_method_id: number, lolz_user_id: number}) => {
      return await axiosInstance.get(
        `/market/payment_app/create_payment?amount=${amount}&payment_method_id=${payment_method_id}&lolz_user_id=${lolz_user_id}`
      ).then(res => res.data);
    },
  });
};

export const useSetNewStatus = () => {
  return useMutation({
    mutationFn: async ({payment_id, status}: {payment_id: number, status: boolean}) => {
      return await api.payment.setPaymentStatusMarketPaymentAppSetPaymentStatusPost({
        setStatusInDTO: {
          payment_id,
          status,
        },
      }).then(res => res.data);
    },
  });
};

export const useCheckIsActivePayment = () => {
  return useMutation({
    mutationFn: async () => {
      return await api.payment.checkActivePaymentMarketPaymentAppCheckActivePaymentGet().then(res => res.data);
    },
  });
};

export const useSendDocument = () => {
  return useMutation({
    mutationFn: async ({paymentId, file}: {paymentId: number, file: File}) => {
      const formData = new FormData();
      formData.append('file', file);

      return await axiosInstance.post(
        `/market/payment_app/upload_file?payment_id=${paymentId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
    },
  });
};

export const useSendReview = () => {
  return useMutation({
    mutationFn: async ({paymentId, rating, review}: {paymentId: number, rating: boolean, review?: string}) => {
      const ratingInDto: {
        payment_id: number;
        rating: boolean;
        review?: string;
      } = {
        payment_id: paymentId,
        rating
      };

      if (!rating && review) {
        ratingInDto.review = review;
      }

      return await api.payment.setRatingMarketPaymentAppSetRatingPost({
        ratingInDto
      }).then(res => res.data);
    },
  });
};
