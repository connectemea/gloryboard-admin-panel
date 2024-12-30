import axiosInstance from '@/api/axiosInstance';
import { useQuery } from '@tanstack/react-query';

export const useGetConfig = () => {
    return useQuery({
        queryKey: ['config'], // Query key
        queryFn: async () => {
            const { data } = await axiosInstance.get('/org/config');
            return data.data;
        },
    });
};
