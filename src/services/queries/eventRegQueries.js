import axiosInstance from '@/api/axiosInstance';
import { AuthContext } from '@/context/authContext';
import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';

export const useGetEventRegs = () => {

    const { auth } = useContext(AuthContext);
    const key = auth.user.user_type === 'admin' ? 'admin' : 'org'

    return useQuery({
        queryKey: ['events-regs'],
        
        // Query key
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/${key}/event-registration`);
            return data.data;
        },
    });
};

export const useGetEventRegsByEvent = (id) => {
    return useQuery({
        queryKey: ['events-regs-by-event'], // Query key
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/org/event-registration/event/${id}`);
            return data.data;
        },
    });
};
