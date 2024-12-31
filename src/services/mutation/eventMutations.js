import axiosInstance from '@/api/axiosInstance';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useCreateEvent = (setIsSubmitting) => {
    const queryClient = useQueryClient();
    let toastId; 

    return useMutation({
        mutationFn: (newEventType) => axiosInstance.post('/admin/events', newEventType),
        onMutate: () => {
            toastId = toast.loading("Creating event ...");
            setIsSubmitting(true);
        },
        onSuccess: () => {
            toast.dismiss(toastId);
            toast.success("Event created successfully");
            queryClient.invalidateQueries(['events']);
            setIsSubmitting(false);
        },
        onError: (error) => {
            toast.dismiss(toastId);
            const errorMessage = error.response?.data?.message || "An error occurred";
            toast.error(errorMessage);
            console.error(errorMessage);
            setIsSubmitting(false);
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

export const useUpdateEvent = (setIsSubmitting) => {
    const queryClient = useQueryClient();
    let toastId; 

    return useMutation({
        mutationFn: (data) => axiosInstance.patch(`/admin/events/update/${data._id}`, data),
        onMutate: () => {
            toastId = toast.loading("Updating event ...");
            setIsSubmitting(true);
        },
        onSuccess: () => {
            toast.dismiss(toastId);
            toast.success("Event Updated")
            queryClient.invalidateQueries(['events']);
            setIsSubmitting(false);
        },
        onError: (error) => {
            toast.dismiss(toastId);
            const errorMessage = error.response?.data?.message || "An error occurred";
            toast.error(errorMessage);
            console.error(errorMessage);
            setIsSubmitting(false);
        },
    
    });
};