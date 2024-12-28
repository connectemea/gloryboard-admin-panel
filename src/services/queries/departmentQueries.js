import axiosInstance from '@/api/axiosInstance';
import { useQuery } from '@tanstack/react-query';

export const useGetDepartments = () => {
    return useQuery({
        queryKey: ['departments'], // Query key
        queryFn: async () => {
            const { data } = await axiosInstance.get('/users/departments');
            return data.data;
        },
    });
};