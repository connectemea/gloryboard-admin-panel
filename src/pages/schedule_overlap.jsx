import DataTable from '@/components/DataTable'
import EventModal from '@/components/modals/eventModal';
import DeleteModal from "@/components/common/DeleteModal";
import React from 'react'
import { useGetEvents } from '@/services/queries/eventsQueries';
import TableSkeleton from '@/components/skeleton/TableSkeleton';
import { useDeleteEvent } from '@/services/mutation/eventMutations';
import { useGetEventRegs } from '@/services/queries/eventRegQueries';

function ScheduleOverlap() {

    const { data, isLoading, error } = useGetEventRegs();
    // const { mutate: deleteEvent } = useDeleteEvent();



    if (isLoading) {
        return <TableSkeleton />;
    }

    if (error) {
        return <div className="px-6">Error fetching data</div>;
    }


    const columns = [
        { accessorKey: 'event_name', header: 'Event Name', cell: info => <strong>{info.getValue()}</strong> , enableSorting: false  },
        { accessorKey: 'count', header: 'No. of Participants', enableSorting: false },
    ];


    function findCollidingEvents(events) {
        const collisions = [];

        for (let i = 0; i < events.length; i++) {
            const currentEvent = events[i];
            const collidingEvents = new Set(); // Use a Set to ensure uniqueness

            for (let j = 0; j < events.length; j++) {
                if (i === j) continue;

                const otherEvent = events[j];

                const currentStart = new Date(currentEvent.event.start_time);
                const currentEnd = new Date(currentEvent.event.end_time);

                const otherStart = new Date(otherEvent.event.start_time);
                const otherEnd = new Date(otherEvent.event.end_time);

                // Check if there is a time overlap
                if (
                    (currentStart <= otherEnd && currentStart >= otherStart) ||
                    (currentEnd >= otherStart && currentEnd <= otherEnd) ||
                    (currentStart <= otherStart && currentEnd >= otherEnd) // Full overlap case
                ) {
                    collidingEvents.add(otherEvent.event._id); // Add to the Set
                }
            }

            // Add to collisions only if there are unique colliding events
            if (collidingEvents.size > 0) {
                collisions.push({
                    event_name: currentEvent.event.name,
                    event_id: currentEvent.event._id,
                    collied_event: Array.from(collidingEvents) // Convert Set to Array
                });
            }
        }

        // Remove duplicates from the collisions array
        const uniqueCollisions = [];
        const seenEvents = new Set();

        for (const collision of collisions) {
            if (!seenEvents.has(collision.event_id)) {
                uniqueCollisions.push(collision);
                seenEvents.add(collision.event_id);
            }
        }

        return uniqueCollisions;
    }

    function getParticipantsByEvents(events) {
        const participantMap = new Map(); // Map to track participants and their events

        events.forEach((event) => {
            // Check if the event's `is_group` is false
            if (!event.event.event_type.is_group && !event.event.event_type.is_onstage) {
                event.participants.forEach((participant) => {
                    const participantId = participant._id;

                    // If the participant already exists, append the event ID
                    if (participantMap.has(participantId)) {
                        const existingData = participantMap.get(participantId);
                        existingData.events.push(event.event._id);
                    } else {
                        // Add new participant with their event
                        participantMap.set(participantId, {
                            participant_id: participantId,
                            participant_name: participant.name,
                            events: [event.event._id],
                        });
                    }
                });
            }
        });

        // Convert the map to an array of objects
        return Array.from(participantMap.values());
    }



    console.log(getParticipantsByEvents(data));
    console.log(findCollidingEvents(data));

    function getParticipantsCountByEvent(events, participants) {
        // Create an array to store the count of participants by event
        const eventCounts = [];

        // Iterate through each event in the events list
        events.forEach(event => {
            const eventId = event.event_id;
            let participantCount = 0;

            // Iterate through each participant and check if they are associated with the event
            participants.forEach(participant => {
                if (participant.events.includes(eventId)) {
                    participantCount++;
                }
            });

            // Add the event name and count to the eventCounts array
            eventCounts.push({
                event_name: event.event_name,
                count: participantCount.toString()
            });
        });

        return eventCounts;
    }

    console.log(getParticipantsCountByEvent(findCollidingEvents(data), getParticipantsByEvents(data)));

    const tableData = getParticipantsCountByEvent(findCollidingEvents(data), getParticipantsByEvents(data));



    return (
        <div className="px-4 flex flex-col ">
            <div className="flex justify-between pb-6">
                <h2 className="text-2xl font-bold">Schedule Overlap</h2>
            </div>
            <DataTable data={tableData} columns={columns} />
        </div>
    )
}

export default ScheduleOverlap