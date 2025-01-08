import axiosInstance from '@/api/axiosInstance';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CloudFog } from 'lucide-react';
import { toast } from 'sonner';

export const useCreateUser = (onSuccess,setIsSubmitting) => {
    const queryClient = useQueryClient();
    let toastId; // Variable to store the toast ID for updating later

    

    return useMutation({
        mutationFn: (newUser) => {

            const formData = new FormData();

            
            formData.append('name', newUser.name);
            formData.append('phoneNumber', newUser.phoneNumber);
            formData.append('gender', newUser.gender);
            formData.append('course', newUser.course);
            formData.append('semester', newUser.semester);
            formData.append('capId', newUser.capId);
            formData.append('dob', newUser.dob);
            formData.append('year_of_study', newUser.year_of_study);


            if (newUser.image) {
                // Function to convert base64 to Blob
                const base64ToBlob = (base64, mimeType) => {
                    const byteString = atob(base64.split(',')[1]); // Decode base64
                    const arrayBuffer = new Uint8Array(byteString.length);
                    for (let i = 0; i < byteString.length; i++) {
                        arrayBuffer[i] = byteString.charCodeAt(i);
                    }
                    return new Blob([arrayBuffer], { type: mimeType });
                };
        
                // Extract mime type from the base64 string
                const mimeType = newUser.image.match(/data:(.*?);base64,/)[1];
                const blob = base64ToBlob(newUser.image, mimeType);
        
                // Append the Blob to FormData
                formData.append('image', blob, 'image.jpg'); // 'image.jpg' is the file name
            }

            return axiosInstance.post('/org/register', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        
        },

        


        onMutate: () => {
            toastId = toast.loading("Creating user...");
            setIsSubmitting(true);
        },
        onSuccess: () => {
            toast.dismiss(toastId);
            toast.success("User created successfully");
            queryClient.invalidateQueries(['users']);
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

export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    let toastId; 

    return useMutation({
        mutationFn: (id) => axiosInstance.delete(`/org/delete/${id}`),

    
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

export const useUpdateUser = (onSuccess,setIsSubmitting) => {
    const queryClient = useQueryClient();
    let toastId; 

    return useMutation({
        mutationFn: (data) =>  axiosInstance.put(`/org/update/${data._id}`, data),
        onMutate: () => {
            toastId = toast.loading("Updating user...");
            setIsSubmitting(true);
        },
        onSuccess: () => {
            toast.dismiss(toastId);
            toast.success("User Updated")
            queryClient.invalidateQueries(['users']);
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
