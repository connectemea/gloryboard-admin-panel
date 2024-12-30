import axiosInstance from '@/api/axiosInstance';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useUpdateConfig = () => {
    const queryClient = useQueryClient();
    let toastId; 

    return useMutation({
        mutationFn: (updateData) =>
            axiosInstance.patch(`/admin/config/update/${updateData._id}`, { value: updateData.value }),

        onMutate: () => {
            toastId = toast.loading("Updating config...");
        },

        // Optimistically update the cache before mutation is complete
        onMutate: async (updatedConfig) => {
            // Cancel any ongoing requests for the 'config' query
            await queryClient.cancelQueries(['config']);

            // Snapshot of previous data
            const previousConfig = queryClient.getQueryData(['config']);

            // Optimistically update the cache with new value
            queryClient.setQueryData(['config'], (oldData) =>
                oldData.map((config) =>
                    config._id === updatedConfig._id
                        ? { ...config, value: updatedConfig.value }
                        : config
                )
            );

            // Return snapshot for rollback in case of error
            return { previousConfig };
        },

        onSuccess: () => {
            toast.dismiss(toastId);
            toast.success("Configuration updated successfully");

            // Invalidate and refetch the 'config' query to ensure it's up-to-date
            queryClient.invalidateQueries(['config']);
            console.log("Configuration updated successfully");
        },

        onError: (error, variables, context) => {
            toast.dismiss(toastId);
            const errorMessage = error.response?.data?.message || "An error occurred";
            toast.error(errorMessage);

            // Rollback the optimistic update if there's an error
            if (context?.previousConfig) {
                queryClient.setQueryData(['config'], context.previousConfig);
            }
            console.log("Error updating config:", errorMessage);
        },
    });
};
