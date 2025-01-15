import axiosInstance from '@/api/axiosInstance';
import { AuthContext } from '@/context/authContext';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { useContext } from 'react';

export const useGetParticipants = (page=1, limit=10, gender, search ) => {
    return useQuery({
        queryKey: ['participants',page, limit, gender, search], // Query key
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/org/users`,{
                params: {
                    page,
                    limit,
                    gender,
                    search
                }
            });
            return data.data;
        },
    });
};
