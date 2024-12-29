import axiosInstance from '@/api/axiosInstance';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useUpdateConfig = () => {
    const queryClient = useQueryClient();
    let toastId; 

    return useMutation({
        mutationFn: (updateData) =>
            axiosInstance.patch(`/admin/config/update/${updateData._id}`, { value: updateData.value }),
        onMutate: async (updatedConfig) => {
            console.log(updatedConfig);
            // Cancel any outgoing refetches for `configs`
            await queryClient.cancelQueries(['configs']);

            // Snapshot of previous state
            const previousConfigs = queryClient.getQueryData(['configs']);

            // Optimistically update the data
            queryClient.setQueryData(['configs'], (old) =>
                old.map((config) =>
                    config._id === updatedConfig._id ? { ...config, value: updatedConfig.value } : config
                )
            );

            // Return snapshot for rollback
            return { previousConfigs };
        },
        onError: (error, variables, context) => {
            toast.dismiss(toastId);
            const errorMessage = error.response?.data?.message || "An error occurred";
            toast.error(errorMessage);

            // Rollback to previous state
            if (context?.previousConfigs) {
                queryClient.setQueryData(['configs'], context.previousConfigs);
            }
        },
        onSuccess: () => {
            toast.dismiss(toastId);
            toast.success("Configuration updated successfully");
        },
        onSettled: () => {
            queryClient.invalidateQueries(['configs']);
        },
    });
};
