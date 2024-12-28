import axiosInstance from '@/api/axiosInstance';
import { useQuery } from '@tanstack/react-query';

export const useGetEventTypes = () => {
    return useQuery({
        queryKey: ['event-type'], // Query key
        queryFn: async () => {
            const { data } = await axiosInstance.get('/admin/event-type');
            return data.data;
        },
    });
};
