import axiosInstance from '@/api/axiosInstance';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useCreateEventReg = () => {
    const queryClient = useQueryClient();
    let toastId; 

    return useMutation({
        mutationFn: (newEventReg) => axiosInstance.post('/admin/event-registration', newEventReg),
        onMutate: () => {
            toastId = toast.loading("Creating event reg ...");
        },
        onSuccess: () => {
            toast.dismiss(toastId);
            toast.success("Event Reg created successfully");
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

export const useDeleteEventReg = () => {
    const queryClient = useQueryClient();
    let toastId; 

    return useMutation({
        mutationFn: (id) => axiosInstance.delete(`/admin/event-registration/delete/${id}`),
    
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

export const useUpdateEventReg = () => {
    const queryClient = useQueryClient();
    let toastId; 

    return useMutation({
        mutationFn: (data) => axiosInstance.patch(`/admin/event-registration/update/${data._id}`, data),
        onMutate: () => {
            toastId = toast.loading("Updating event ref ...");
        },
        onSuccess: () => {
            toast.dismiss(toastId);
            toast.success("Event Reg Updated")
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