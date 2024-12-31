import axiosInstance from '@/api/axiosInstance';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useCreateEventReg = (onSuccess, setIsSubmitting) => {
    const queryClient = useQueryClient();
    let toastId;

    return useMutation({
        mutationFn: (newEventReg) => axiosInstance.post('/org/event-registration', newEventReg),
        onMutate: () => {
            toastId = toast.loading("Creating event reg ...");
            setIsSubmitting(true);
        },
        onSuccess: () => {
            toast.dismiss(toastId);
            toast.success("Event Reg created successfully");
            queryClient.invalidateQueries(['events-regs']);
            setIsSubmitting(false);
            onSuccess();
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

export const useDeleteEventReg = () => {
    const queryClient = useQueryClient();
    let toastId;

    return useMutation({
        mutationFn: (id) => axiosInstance.delete(`/org/event-registration/delete/${id}`),

        onMutate: () => {
            toastId = toast.loading("Deleting event reg ...");
        },
        onSuccess: () => {
            toast.dismiss(toastId);
            toast.success("Event Reg  Deleted")
            queryClient.invalidateQueries(['events-regs']);
        },
        onError: (error) => {
            toast.dismiss(toastId);
            const errorMessage = error.response?.data?.message || "An error occurred";
            toast.error(errorMessage);
            console.error(errorMessage);
        },
    });
};

export const useUpdateEventReg = (onSuccess, setIsSubmitting) => {
    const queryClient = useQueryClient();
    let toastId;

    return useMutation({
        mutationFn: (data) => axiosInstance.patch(`/org/event-registration/update/${data._id}`, data),
        onMutate: () => {
            toastId = toast.loading("Updating event ref ...");
            setIsSubmitting(true);
        },
        onSuccess: () => {
            toast.dismiss(toastId);
            toast.success("Event Reg Updated")
            queryClient.invalidateQueries(['events-regs']);
            setIsSubmitting(false);
            onSuccess();
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