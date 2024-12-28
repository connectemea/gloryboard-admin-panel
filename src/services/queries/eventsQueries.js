import axiosInstance from '@/api/axiosInstance';
import { useQuery } from '@tanstack/react-query';

export const useGetEvents = () => {
    return useQuery({
        queryKey: ['events'], // Query key
        queryFn: async () => {
            const { data } = await axiosInstance.get('/admin/events');
            return data.data;
        },
    });
};
