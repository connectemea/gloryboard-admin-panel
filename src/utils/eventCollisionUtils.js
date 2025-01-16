export const findCollidingEvents = (events) => {
    const collisions = [];

    events.forEach((currentEvent, i) => {
        const collidingEvents = new Map();

        events.forEach((otherEvent, j) => {
            if (i === j) return;

            const currentStart = new Date(currentEvent.start_time);
            const currentEnd = new Date(currentEvent.end_time);
            const otherStart = new Date(otherEvent.start_time);
            const otherEnd = new Date(otherEvent.end_time);

            if (hasTimeOverlap(currentStart, currentEnd, otherStart, otherEnd)) {
                collidingEvents.set(otherEvent._id, otherEvent.name);
            }
        });

        if (collidingEvents.size > 0) {
            collisions.push({
                event_name: currentEvent.name,
                event_id: currentEvent._id,
                collied_events: Array.from(collidingEvents.entries()).map(([id, name]) => ({
                    event_id: id,
                    event_name: name,
                })),
            });
        }
    });

    return collisions;
};

const hasTimeOverlap = (start1, end1, start2, end2) => (
    (start1 <= end2 && start1 >= start2) ||
    (end1 >= start2 && end1 <= end2) ||
    (start1 <= start2 && end1 >= end2)
);

export const getParticipantsByEvents = (events) => {
    const participantMap = new Map();

    events.forEach((event) => {
        if (event.event.event_type.is_group || event.event.event_type.is_onstage) return;

        event.participants.forEach((participant) => {
            const existingData = participantMap.get(participant._id);

            if (existingData) {
                existingData.events.push({
                    event_id: event.event._id,
                    event_name: event.event.name,
                });
            } else {
                participantMap.set(participant._id, {
                    participant_id: participant._id,
                    participant_name: participant.name,
                    college: participant.college,
                    course: participant.course,
                    year_of_study: participant.year_of_study,
                    events: [{
                        event_id: event.event._id,
                        event_name: event.event.name,
                    }],
                });
            }
        });
    });

    return Array.from(participantMap.values());
};

export const getParticipantsCountByEvent = (events, participants) => {
    const processedEventIds = new Set();

    return events.reduce((eventCounts, event) => {
        if (processedEventIds.has(event.event_id)) return eventCounts;

        const participantsInEvent = participants
            .filter(participant =>
                participant.events.some(e => e.event_id === event.event_id)
            )
            .map(participant => {
                const collisions = new Set(
                    participant.events
                        .filter(e =>
                            event.collied_events.some(ce => ce.event_id === e.event_id) &&
                            e.event_id !== event.event_id
                        )
                        .map(e => e.event_name)
                );

                return collisions.size > 0 ? {
                    participant_name: participant.participant_name,
                    participant_id: participant.participant_id,
                    college: participant.college,
                    course: participant.course,
                    year_of_study: participant.year_of_study,
                    collisions: Array.from(collisions),
                } : null;
            })
            .filter(Boolean);

        if (participantsInEvent.length > 0) {
            eventCounts.push({
                event_name: event.event_name,
                participant_count: participantsInEvent.length,
                participants: participantsInEvent,
            });
        }

        processedEventIds.add(event.event_id);
        return eventCounts;
    }, []);
};