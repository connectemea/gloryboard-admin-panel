import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import {
    DialogHeader,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader, Loader2, Pencil, Plus, Trash } from "lucide-react";
import { useModel } from "@/hooks/useModel";
import SelectInput from "../common/SelectInput";
import { DayPicker } from "../common/DayPicker";
import { resultInitalValue } from "@/constants/initalValue";
import { resultValidationSchema } from "@/constants/validationSchemas";
import { useGetEvents } from "@/services/queries/eventsQueries";
import axiosInstance from "@/api/axiosInstance";
import { toast } from "sonner";
import SelectInput2 from "../common/SelectInput2";
import { useCreateResult, useUpdateResult } from "@/services/mutation/resultMutations ";
import { Separator } from "../ui/separator";

function ResultModal({ eventsData, editMode = false, initialData = {} }) {
    const { isOpen, openModal, closeModal } = useModel();
    const [PublishedEvent, setPublishedEvent] = useState([]);
    const [selectedEventReg, setSelectedEventReg] = useState(null);
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [eventRegsOptions, setEventRegsOptions] = useState([]);
    const [filteredEventRegs, setFilteredEventRegs] = useState([]);
    const [EvetRegsLoading, setEventRegsLoading] = useState(false);

    const { data: events, isLoading: eventsLoading } = useGetEvents();
    const { mutate: createResult } = useCreateResult();
    const { mutate: updateResult } = useUpdateResult();

    useEffect(() => {
        if (editMode && initialData.event) {
            getEventRegsByEvent(initialData.event._id);

            // Map winning registrations
            const mappedWinningRegs = initialData.winningRegistrations.map(reg => ({
                eventRegistration: reg.eventRegistration._id,
                position: reg.position
            }));

            formik.setValues({
                event: initialData.event._id,
                winningRegistrations: mappedWinningRegs
            });
        }
    }, [initialData, editMode]);

    useEffect(() => {
        if (eventsData?.length > 0) {
            const mappedEvents = eventsData.map(event => ({
                label: event?.event?.name,
                value: event?.event?._id,
            }));
            setPublishedEvent(mappedEvents);
        }
    }, [eventsData]);

    const formik = useFormik({
        initialValues: editMode ? {
            event: initialData.event?._id || "",
            winningRegistrations: []
        } : resultInitalValue,
        validationSchema: resultValidationSchema,
        validateOnBlur: false,
        onSubmit: (values) => {
            if (editMode) {
                updateResult({ id: initialData._id, data: values });
            } else {
                createResult(values);
            }
            handleCloseDialog();
        },
    });

    const handleCloseDialog = () => {
        if (!editMode) {
            setSelectedEventReg(null);
            setSelectedPosition(null);
            setEventRegsOptions([]);
            setFilteredEventRegs([]);
            formik.resetForm();
        }
        closeModal();
    };

    const getEventOptions = (data) => {
        return data.map(item => ({
            label: item.name,
            value: item._id,
            disabled: false
        }));
    };

    const getNameEventReg = (id) => {
        const foundItem = eventRegsOptions?.find(item => item._id === id);
        return foundItem?.event.event_type.is_group === false
            ? foundItem?.participants[0].user.name
            : foundItem?.group_name;
    };

    const getEventRegsByEvent = async (eventId) => {
        try {
            setEventRegsLoading(true);
            const response = await axiosInstance.get(`/admin/event-registration/event/${eventId}`);
            const allEventRegs = response.data.data;

            if (editMode) {
                const existingIds = formik.values.winningRegistrations.map(reg => reg.eventRegistration);
                const filteredRegs = allEventRegs.filter(reg => !existingIds.includes(reg._id));
                setFilteredEventRegs(filteredRegs);
            } else {
                setFilteredEventRegs(allEventRegs);
            }

            setEventRegsOptions(allEventRegs);
            if (!allEventRegs.length) {
                toast.info("No event registrations found");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error fetching registrations");
        } finally {
            setEventRegsLoading(false);
        }
    };

    const customRenderEventReg = (option) => {
        const isGroupEvent = option?.event?.event_type?.is_group === false;
        const participant = option?.participants?.[0]?.user;
        return (
            <div className="flex items-center space-x-2">
                <span className="font-bold">
                    {isGroupEvent ? (
                        <span>
                            {participant?.name || 'No Name'}
                            <span className="text-gray-500 text-xs font-normal ml-2">
                                {participant?.course || 'No Department'}
                            </span>
                            <span className="text-gray-500 text-xs font-normal ml-2">
                                {participant?.year_of_study || 'No Year'}
                            </span>
                        </span>
                    ) : (
                        option?.group_name || 'No Group Name'
                    )}
                </span>
            </div>
        );
    };

    const positionOptions = [
        { label: "1st", value: "1" },
        { label: "2nd", value: "2" },
        { label: "3rd", value: "3" },
    ];

    const getPositionName = (value) => {
        return positionOptions.find(item => item.value === String(value))?.label;
    };

    const handleAddWinningRegistration = () => {
        if (!selectedEventReg || !selectedPosition) {
            toast.error("Please select both registration and position");
            return;
        }

        const currentArray = formik.values.winningRegistrations || [];
        const isDuplicate = currentArray.some(
            item => item.eventRegistration === selectedEventReg._id
        );

        if (!isDuplicate) {
            formik.setFieldValue("winningRegistrations", [
                ...currentArray,
                { eventRegistration: selectedEventReg._id, position: selectedPosition }
            ]);

            setFilteredEventRegs(prev =>
                prev.filter(option => option._id !== selectedEventReg._id)
            );
        } else {
            toast.error("Registration already selected");
        }

        setSelectedEventReg(null);
        setSelectedPosition(null);
    };

    const handleDeleteWinningRegistration = (participant, index) => {
        const updatedParticipants = formik.values.winningRegistrations.filter(
            (_, i) => i !== index
        );
        formik.setFieldValue("winningRegistrations", updatedParticipants);
    
        const removedOption = eventRegsOptions.find(
            option => option._id === participant.eventRegistration
        );
    
        if (
            removedOption && 
            !filteredEventRegs.some(option => option._id === removedOption._id)
        ) {
            setFilteredEventRegs(prev => [...prev, removedOption]);
        }
    };

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => (open ? openModal() : handleCloseDialog())}
        >
            <DialogTrigger asChild>
                {!editMode ? (
                    <Button>
                        <Plus className="mr-1" /> Add
                    </Button>
                ) : (
                    <Button variant="outline" className="w-8 h-8" size="icon">
                        <Pencil />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {editMode ? "Edit Result" : "Add New Result"}
                    </DialogTitle>
                    <DialogDescription>
                        {editMode
                            ? "Update the result details"
                            : "Fill out the form to create a new result"}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={formik.handleSubmit} className="space-y-2">
                    {!eventsLoading ? (
                        <SelectInput
                            label="Event"
                            name="event"
                            value={formik.values.event}
                            onChange={(e) => {
                                getEventRegsByEvent(e.target.value);
                                formik.setFieldValue("event", e.target.value);
                            }}
                            onBlur={formik.handleBlur}
                            options={getEventOptions(events)}
                            disabled={editMode}
                        />
                    ) : (
                        <Loader2 className="animate-spin" />
                    )}

                    {!EvetRegsLoading && filteredEventRegs.length > 0 && (
                        <div className="flex space-x-2 items-end">
                            <SelectInput2
                                label="Event Registration"
                                name="event_reg"
                                value={selectedEventReg}
                                onChange={(e) => setSelectedEventReg(e.target.value)}
                                valueKey="_id"
                                renderOption={customRenderEventReg}
                                options={filteredEventRegs}
                            />

                            <SelectInput
                                label="Position"
                                name="pos"
                                value={selectedPosition}
                                onChange={(e) => setSelectedPosition(e.target.value)}
                                options={positionOptions}
                            />

                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={handleAddWinningRegistration}
                            >
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                    )}

                    {EvetRegsLoading && (
                        <Loader2 className="animate-spin" />
                    )}

                    <Separator className="my-6" />

                    {formik.values.winningRegistrations?.map((participant, index) => (
                        <div
                            key={index}
                            className="flex items-center w-full justify-between border p-2 rounded-md"
                        >
                            <div className="space-x-2">
                                <span>{getNameEventReg(participant.eventRegistration)}</span>
                                <span>{getPositionName(participant.position)}</span>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                className="w-8 h-8 text-red-500"
                                size="icon"
                                onClick={() => handleDeleteWinningRegistration(participant, index)}
                            >
                                <Trash />
                            </Button>
                        </div>
                    ))}

                    <div className="!mt-4 flex justify-end">
                        <Button
                            type="submit"
                            className="mr-2"
                            disabled={!formik.values.winningRegistrations?.length}
                        >
                            {editMode ? "Update" : "Submit"}
                        </Button>
                        <Button variant="ghost" type="button" onClick={handleCloseDialog}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default ResultModal;