import axiosInstance from '@/api/axiosInstance';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useCreateUser = (setSubmitted) => {
    const queryClient = useQueryClient();
    let toastId; // Variable to store the toast ID for updating later

    return useMutation({
        mutationFn: (newUser) => axiosInstance.post('/users/register', newUser),
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

export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    let toastId; 

    return useMutation({
        mutationFn: (id) => axiosInstance.get(`/users/delete?id=${id}`),
    
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

export const useUpdateUser = (setSubmitted) => {
    const queryClient = useQueryClient();
    let toastId; 

    return useMutation({
        mutationFn: (data) => axiosInstance.put(`/users/update?id=${data._id}`, data),
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
