import axiosInstance from '@/api/axiosInstance';
import { useQuery } from '@tanstack/react-query';

export const useGetParticipants = () => {
    return useQuery({
        queryKey: [''], // Query key
        queryFn: async () => {
            const { data } = await axiosInstance.get('/');
            return data.data;
        },
    });
};
