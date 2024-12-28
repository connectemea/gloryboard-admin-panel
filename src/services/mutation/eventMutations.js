import axiosInstance from '@/api/axiosInstance';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useCreateEvent = () => {
    const queryClient = useQueryClient();
    let toastId; 

    return useMutation({
        mutationFn: (newEventType) => axiosInstance.post('/admin/events', newEventType),
        onMutate: () => {
            toastId = toast.loading("Creating event ...");
        },
        onSuccess: () => {
            toast.dismiss(toastId);
            toast.success("Event created successfully");
            queryClient.invalidateQueries(['events']);
        },
        onError: (error) => {
            toast.dismiss(toastId);
            const errorMessage = error.response?.data?.message || "An error occurred";
            toast.error(errorMessage);
            console.error(errorMessage);
        },
    });
};

export const useDeleteEvent = () => {
    const queryClient = useQueryClient();
    let toastId; 

    return useMutation({
        mutationFn: (id) => axiosInstance.delete(`/admin/events/delete/${id}`),
    
        onMutate: () => {
            toastId = toast.loading("Deleting event ...");
        },
        onSuccess: () => {
            toast.dismiss(toastId);
            toast.success("Event  Deleted")
            queryClient.invalidateQueries(['events']);
        },
        onError: (error) => {
            toast.dismiss(toastId);
            const errorMessage = error.response?.data?.message || "An error occurred";
            toast.error(errorMessage);
            console.error(errorMessage);
        },
    });
};

export const useUpdateEvent = () => {
    const queryClient = useQueryClient();
    let toastId; 

    return useMutation({
        mutationFn: (data) => axiosInstance.patch(`/admin/events/update/${data._id}`, data),
        onMutate: () => {
            toastId = toast.loading("Updating event ...");
        },
        onSuccess: () => {
            toast.dismiss(toastId);
            toast.success("Event Updated")
            queryClient.invalidateQueries(['events']);
        },
        onError: (error) => {
            toast.dismiss(toastId);
            const errorMessage = error.response?.data?.message || "An error occurred";
            toast.error(errorMessage);
            console.error(errorMessage);
        },
    
    });
};