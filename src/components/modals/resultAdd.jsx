import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
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
import Combobox from "../common/RealComboxInput";

function ResultAdd({ eventsData, editMode = false, initialData = {} }) {
    const { isOpen, openModal, closeModal } = useModel();
    const [PublishedEvent, setPublishedEvent] = useState([]);
    const [selectedEventReg, setSelectedEventReg] = useState(null);
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [eventRegsOptions, setEventRegsOptions] = useState([]);
    const [filteredEventRegs, setFilteredEventRegs] = useState([]);
    const [EvetRegsLoading, setEventRegsLoading] = useState(false);
    const [open, setOpen] = useState(false)
    const [event, setEvent] = useState(null);

    const { data: events, isLoading: eventsLoading } = useGetEvents();
    const { mutate: createResult } = useCreateResult();
    const { mutate: updateResult } = useUpdateResult();

    useEffect(() => {
        if (editMode && initialData.event) {
            getEventRegsByEvent(initialData.event._id);

            // Map winning registrations
            // console.log(initialData.winningRegistrations);
            const mappedWinningRegs = initialData.winningRegistrations.map(reg => ({
                eventRegistration: reg.eventRegistration._id,
                position: reg.position
            }));
            // console.log(initialData);
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
                disabled: false
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
        // console.log(id);
        const foundItem = eventRegsOptions?.find(item => item.value === id);
        // console.log(eventRegsOptions);
        // console.log(foundItem);
        return foundItem?.is_group === false
            ? foundItem?.label
            : foundItem?.group_name;
    };

    const getEventRegsByEvent = async (eventId) => {
        try {
            setEventRegsLoading(true);
            const response = await axiosInstance.get(`/org/event-registration/event/${eventId}`);
            const allEventRegs = response.data.data;
            // console.log(allEventRegs);

            // Formatting the data as { value, label }
            const formattedEventRegs = allEventRegs.map(reg => ({
                value: reg._id,
                label: reg.event.event_type.is_group
                    ? reg.participants[0]?.user?.collegeId?.name
                    : reg.participants[0]?.user?.name,
                is_group: reg.event.event_type.is_group,
                college: reg.participants[0]?.user?.collegeId?.name, 
                year_of_study: reg.participants[0]?.user?.year_of_study, 
                disabled: false
            }));
            
            // console.log(formattedEventRegs);
            if (editMode) {
                const existingIds = formik.values.winningRegistrations.map(reg => reg.eventRegistration);
                // console.log(existingIds);
                const filteredRegs = formattedEventRegs.filter(reg => !existingIds.includes(reg.value));
                setFilteredEventRegs(filteredRegs);
            } else {
                setFilteredEventRegs(formattedEventRegs);
            }
            // console.log(formattedEventRegs);
            setEventRegsOptions(formattedEventRegs);

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
        const isGroupEvent = option.is_group;
        return (
            <div className="flex items-center space-x-2">
                <span className="font-bold">
                    {!isGroupEvent ? (
                        <span>
                            {option?.label || 'No Name'}
                            <span className="text-gray-500 text-xs font-normal ml-2">
                                {option?.college || 'No Department'}
                            </span>
                            <span className="text-gray-500 text-xs font-normal ml-2">
                                {option?.year_of_study + 'year' || 'No Year'}
                            </span>
                        </span>
                    ) : (
                        option?.label || 'No Group Name'
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
        // console.log(currentArray);
    
        // Check if selected registration is already added
        const isDuplicate = currentArray.some(
            item => item.eventRegistration === selectedEventReg
        );
    
        if (!isDuplicate) {
            formik.setFieldValue("winningRegistrations", [
                ...currentArray,
                { eventRegistration: selectedEventReg, position: selectedPosition }
            ]);
    
            setFilteredEventRegs(prev =>
                prev.map(option =>
                    option.value === selectedEventReg
                        ? { ...option, disabled: true } 
                        : option
                )
            );
        } else {
            // console.log("Duplicate");
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
    
        // Find the removed option in eventRegsOptions
        const removedOption = eventRegsOptions.find(
            option => option.value === participant.eventRegistration
        );
    
        if (removedOption) {
            setFilteredEventRegs(prev =>
                prev.map(option =>
                    option.value === removedOption.value
                        ? { ...option, disabled: false } 
                        : option
                )
            );
        }
    };
    

    const removeAllParticipants = () => {
        formik.setFieldValue("winningRegistrations", []);
        setFilteredEventRegs(eventRegsOptions);
    }

    return (
        <div className="border rounded-md py-10 px-6">
            <section className="max-w-[800px] m-auto h-[calc(100vh-250px)] rounded-md overflow-auto">

                <h1 className="font-bold text-lg">

                    {editMode ? "Edit Result" : "Add New Result"}
                </h1>
                <h2 className="text-muted-foreground">
                    {editMode
                        ? "Update the result details"
                        : "Fill out the form to create a new result"}
                </h2>
                <form onSubmit={formik.handleSubmit} className="space-y-2 mt-6 p-2">
                    {!eventsLoading ? (

                        <div className="max-w-full">
                            <Combobox
                                label="Event"
                                name="event"
                                value={formik.values.event}
                                options={getEventOptions(events)}
                                onChange={(selectedValue) => {
                                    getEventRegsByEvent(selectedValue);
                                    formik.setFieldValue("event", selectedValue);
                                    removeAllParticipants();
                                }}
                                onBlur={formik.handleBlur}
                                disabled={editMode}
                            />
                        </div>

                    ) : (
                        <Loader2 className="animate-spin" />
                    )}

                    {!EvetRegsLoading && filteredEventRegs.length > 0 && (
                        <div className="flex space-x-2 items-end">
                            <Combobox
                                label="Event Registration"
                                name="event_reg"
                                value={selectedEventReg}
                                onChange={(value) => {
                                    setSelectedEventReg(value);
                                }}
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
                            {/* {console.log(participant.label)} */}
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
            </section>
        </div>
    );
}

export default ResultAdd;