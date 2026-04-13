import axiosInstance from '@/api/axiosInstance';
import { useQuery } from '@tanstack/react-query';

export const useGetParticipants = (page=1, limit=10, gender, search ) => {
    return useQuery({
        queryKey: ['participants',page, limit, gender, search], // Query key
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/org/users`,{
                params: {
                    page,
                    limit,
                    gender,
                    search
                }
            });
            const participantsData = data.data;

            return {
                ...participantsData,
                users: (participantsData?.users || []).map((user) => ({
                    ...user,
                    zone: user?.zone ?? "-"
                }))
            };
        },
    });
};
