import axiosInstance from '@/api/axiosInstance';
import { useQuery } from '@tanstack/react-query';

export const useGetResults = () => {
    return useQuery({
        queryKey: ['results'], // Query key
        queryFn: async () => {
            const { data } = await axiosInstance.get('/results');
            return data.data;
        },
    });
};
