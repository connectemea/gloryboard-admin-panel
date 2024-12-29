import axiosInstance from '@/api/axiosInstance';
import { useQuery } from '@tanstack/react-query';

export const useGetEventRegs = () => {
    return useQuery({
        queryKey: ['events-regs'], // Query key
        queryFn: async () => {
            const { data } = await axiosInstance.get('/org/event-registration');
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
