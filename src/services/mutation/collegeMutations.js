import axiosInstance from '@/api/axiosInstance';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useCreateCollege = (setSubmitted) => {
    const queryClient = useQueryClient();
    let toastId; // Variable to store the toast ID for updating later

    return useMutation({
        mutationFn: (newUser) => axiosInstance.post('/admin/orgs/register', newUser),
        onMutate: () => {
            toastId = toast.loading("Creating user...");
        },
        onSuccess: () => {
            toast.dismiss(toastId);
            toast.success("User created successfully");
            queryClient.invalidateQueries(['users']);
            setSubmitted(true);
        },
        onError: (error) => {
            toast.dismiss(toastId);
            const errorMessage = error.response?.data?.message || "An error occurred";
            toast.error(errorMessage);
            console.error(errorMessage);
            setSubmitted(false);
        },
    });
};

export const useDeleteCollege = () => {
    const queryClient = useQueryClient();
    let toastId; 

    return useMutation({
        mutationFn: (id) => axiosInstance.delete(`/admin/orgs/delete/${id}`),
    
        onMutate: () => {
            toastId = toast.loading("Deleting user...");
        },
        onSuccess: () => {
            toast.dismiss(toastId);
            toast.success("User Deleted")
            queryClient.invalidateQueries(['users']);
        },
        onError: (error) => {
            toast.dismiss(toastId);
            const errorMessage = error.response?.data?.message || "An error occurred";
            toast.error(errorMessage);
            console.error(errorMessage);
        },
    });
};

export const useUpdateCollege = (setSubmitted) => {
    const queryClient = useQueryClient();
    let toastId; 

    return useMutation({
        mutationFn: (data) => axiosInstance.patch(`/admin/orgs/update/${data._id}`, data),
        onMutate: () => {
            toastId = toast.loading("Updating user...");
        },
        onSuccess: () => {
            toast.dismiss(toastId);
            toast.success("User Updated")
            queryClient.invalidateQueries(['users']);
            setSubmitted(true);
        },
        onError: (error) => {
            toast.dismiss(toastId);
            const errorMessage = error.response?.data?.message || "An error occurred";
            toast.error(errorMessage);
            console.error(errorMessage);
            setSubmitted(false);
        },
    
    });
};
