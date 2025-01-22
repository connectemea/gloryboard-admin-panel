import { useQuery } from "@tanstack/react-query";
import axiosInstance from '@/api/axiosInstance';

export const useResultByGroup = () => {
    return useQuery({
        queryKey: ['result-by-group'], // Query key
        queryFn: async () => {
            const { data } = await axiosInstance.get('/admin/result/grouped-by-college ');
            return data.data;
        },
    });
};