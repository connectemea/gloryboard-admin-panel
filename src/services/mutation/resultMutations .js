import axiosInstance from '@/api/axiosInstance';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useCreateResult = () => {
    const queryClient = useQueryClient();
    let toastId; 

    return useMutation({
        mutationFn: (newResult) => axiosInstance.post('/admin/result', newResult),
        onMutate: () => {
            toastId = toast.loading("Creating result ...");
        },
        onSuccess: () => {
            toast.dismiss(toastId);
            toast.success("Result created successfully");
            queryClient.invalidateQueries(['results']);
        },
        onError: (error) => {
            toast.dismiss(toastId);
            const errorMessage = error.response?.data?.message || "An error occurred";
            toast.error(errorMessage);
            console.error(errorMessage);
        },
    });
};

export const useDeleteResult = () => {
    const queryClient = useQueryClient();
    let toastId; 

    return useMutation({
        mutationFn: (id) => axiosInstance.delete(`/admin/result/delete/${id}`),
    
        onMutate: () => {
            toastId = toast.loading("Deleting result ...");
        },
        onSuccess: () => {
            toast.dismiss(toastId);
            toast.success("Result  Deleted")
            queryClient.invalidateQueries(['results']);
        },
        onError: (error) => {
            toast.dismiss(toastId);
            const errorMessage = error.response?.data?.message || "An error occurred";
            toast.error(errorMessage);
            console.error(errorMessage);
        },
    });
};

export const useUpdateResult = () => {
    const queryClient = useQueryClient();
    let toastId; 

    return useMutation({
        mutationFn: (data) => axiosInstance.put(`/admin/result/update/${data.id}`, data.data),
        onMutate: () => {
            toastId = toast.loading("Updating result ...");
        },
        onSuccess: () => {
            toast.dismiss(toastId);
            toast.success("Result Updated")
            queryClient.invalidateQueries(['results']);
        },
        onError: (error) => {
            toast.dismiss(toastId);
            const errorMessage = error.response?.data?.message || "An error occurred";
            toast.error(errorMessage);
            console.error(errorMessage);
        },
    
    });
};