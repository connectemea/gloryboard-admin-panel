import axiosInstance from '@/api/axiosInstance';
import { useQuery } from '@tanstack/react-query';

export const useGetUsers = () => {
    return useQuery({
        queryKey: ['users'], // Query key
        queryFn: async () => {
            const { data } = await axiosInstance.get('/users/reps');
            return data.data;
        },
    });
};
