import axiosInstance from '@/api/axiosInstance';
import { useQuery } from '@tanstack/react-query';

export const useGetParticipants = () => {
    return useQuery({
        queryKey: ['participants'], // Query key
        queryFn: async () => {
            const { data } = await axiosInstance.get('/users/members');
            return data.data;
        },
    });
};
