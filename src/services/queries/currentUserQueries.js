import axiosInstance from '@/api/axiosInstance';
import { useQuery } from '@tanstack/react-query';

export const useGetCurrentUser = () => {
    return useQuery({
        queryKey: ['current-user'], // Query key
        queryFn: async () => {
            const { data } = await axiosInstance.get('/users/me');
            return data.data;
        },
    });
};