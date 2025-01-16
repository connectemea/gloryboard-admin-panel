import React, { useEffect, useMemo } from 'react';
import DataTable from '@/components/DataTable';
import EventCollisionViewModal from '@/components/modals/view/eventCollisionViewModal';
import TableSkeleton from '@/components/skeleton/TableSkeleton';
import { useGetEventRegs } from '@/services/queries/eventRegQueries';
import { findCollidingEvents, getParticipantsByEvents, getParticipantsCountByEvent } from '@/utils/eventCollisionUtils';


const columns = [
    {
        accessorKey: 'event_name',
        header: 'Event Name',
        cell: info => <strong>{info.getValue()}</strong>,
        enableSorting: false,
    },
    {
        accessorKey: 'participant_count',
        header: 'No. of Participants',
        enableSorting: false,
    },
    {
        accessorKey: 'info',
        header: 'Info',
        enableSorting: false,
        cell: ({ row }) => <EventCollisionViewModal data={row.original.participants} />,
    },
];

const ScheduleOverlap = () => {
    const { data: eventRegs, isLoading, error } = useGetEventRegs();

    const collisionData = useMemo(() => {
        if (!eventRegs) return [];

        const collidingEvents = findCollidingEvents(eventRegs);
        const participants = getParticipantsByEvents(eventRegs);
        return getParticipantsCountByEvent(collidingEvents, participants);
    }, [eventRegs]);

    if (isLoading) return <TableSkeleton />;
    if (error) return <div className="px-6">Error fetching data</div>;

    return (
        <div className="px-4 flex flex-col">
            <div className="flex justify-between pb-6">
                <h2 className="text-2xl font-bold">Schedule Overlaps</h2>
            </div>
            <DataTable data={collisionData} columns={columns} />
        </div>
    );
};

export default ScheduleOverlap;