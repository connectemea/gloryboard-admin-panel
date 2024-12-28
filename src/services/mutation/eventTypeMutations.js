import axiosInstance from '@/api/axiosInstance';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useCreateEventType = () => {
    const queryClient = useQueryClient();
    let toastId; 

    return useMutation({
        mutationFn: (newEventType) => axiosInstance.post('/admin/event-type', newEventType),
        onMutate: () => {
            toastId = toast.loading("Creating event type...");
        },
        onSuccess: () => {
            toast.dismiss(toastId);
            toast.success("Event Type created successfully");
            queryClient.invalidateQueries(['event-type']);
        },
        onError: (error) => {
            toast.dismiss(toastId);
            const errorMessage = error.response?.data?.message || "An error occurred";
            toast.error(errorMessage);
            console.error(errorMessage);
        },
    });
};

export const useDeleteEventType = () => {
    const queryClient = useQueryClient();
    let toastId; 

    return useMutation({
        mutationFn: (id) => axiosInstance.delete(`/admin/event-type/delete/${id}`),
    
        onMutate: () => {
            toastId = toast.loading("Deleting event type...");
        },
        onSuccess: () => {
            toast.dismiss(toastId);
            toast.success("Event Type Deleted")
            queryClient.invalidateQueries(['event-type']);
        },
        onError: (error) => {
            toast.dismiss(toastId);
            const errorMessage = error.response?.data?.message || "An error occurred";
            toast.error(errorMessage);
            console.error(errorMessage);
        },
    });
};

export const useUpdateEventType = () => {
    const queryClient = useQueryClient();
    let toastId; 

    return useMutation({
        mutationFn: (data) => axiosInstance.patch(`/admin/event-type/update/${data._id}`, data),
        onMutate: () => {
            toastId = toast.loading("Updating event type...");
        },
        onSuccess: () => {
            toast.dismiss(toastId);
            toast.success("Event Type Updated")
            queryClient.invalidateQueries(['event-type']);
        },
        onError: (error) => {
            toast.dismiss(toastId);
            const errorMessage = error.response?.data?.message || "An error occurred";
            toast.error(errorMessage);
            console.error(errorMessage);
        },
    
    });
};