import React, { useEffect, useMemo } from 'react';
import DataTable from '@/components/DataTable';
import EventCollisionViewModal from '@/components/modals/view/eventCollisionViewModal';
import TableSkeleton from '@/components/skeleton/TableSkeleton';
import { useGetEventRegs } from '@/services/queries/eventRegQueries';
import { findCollidingEvents, getParticipantsByEvents, getParticipantsCountByEvent } from '@/utils/eventCollisionUtils';
import { useGetEvents } from '@/services/queries/eventsQueries';


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
        enableSorting: true,
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
    const { data: events, isLoading: isLoadingEvents, error: errorEvents } = useGetEvents();

    const collisionData = useMemo(() => {
        if (!eventRegs || !events) return [];
        const collidingEvents = findCollidingEvents(events);
        const participants = getParticipantsByEvents(eventRegs);
    
        return getParticipantsCountByEvent(collidingEvents, participants);
    }, [eventRegs, events]);    
    

    if (isLoading || isLoadingEvents) return <TableSkeleton />;
    if (error || errorEvents) return <div className="px-6">Error fetching data</div>;

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