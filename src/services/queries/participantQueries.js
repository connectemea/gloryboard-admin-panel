import axiosInstance from '@/api/axiosInstance';
import { AuthContext } from '@/context/authContext';
import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';

export const useGetParticipants = () => {

    const { auth } = useContext(AuthContext);
    const key = auth.user.user_type === 'admin' ? 'admin' : 'org'

    return useQuery({
        queryKey: [''], // Query key
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/${key}/users`);
            return data.data;
        },
    });
};
