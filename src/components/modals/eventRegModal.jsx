import React, { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Pencil, Plus, Trash, X } from "lucide-react";
import { useModel } from "@/hooks/useModel";
import { Label } from "@/components/ui/label";
import SelectInput from "../common/SelectInput";
import { eventRegistrationInitialValues } from "@/constants/initalValue";
import { eventRegistrationSchema } from "@/constants/validationSchemas";
import { useGetParticipants } from "@/services/queries/participantQueries";
import SearchSelectInput from "../common/SearchSelectInput ";
import { useGetEvents, useGetEventsOrg } from "@/services/queries/eventsQueries";
import { useCreateEventReg, useUpdateEventReg } from "@/services/mutation/eventRegMutations";
import SelectInput2 from "../common/SelectInput2";
import { toast } from "sonner";

const EventRegModal = ({ editMode = false, initialData = {} }) => {
    const { isOpen, openModal, closeModal } = useModel();
    const [event, setEvent] = React.useState(null)
    const { mutate: CreateEventReg } = useCreateEventReg()
    const { mutate: UpdateEventReg } = useUpdateEventReg()


    const [selectedParticipant, setSelectedParticipant] = useState(null)
    const [selectedHelper, setSelectedHelper] = useState(null)

    const { data: participants, isLoading: participantIsLoading, error: participantError } = useGetParticipants();
    const { data: events, isLoading: eventIsLoading, error: eventError } = useGetEventsOrg();


    const formik = useFormik({
        initialValues: editMode
            ? { ...eventRegistrationInitialValues, ...initialData }
            : eventRegistrationInitialValues,
        validationSchema: eventRegistrationSchema,
        validateOnBlur: false,
        onSubmit: (values) => {
            console.log("Submitted Values:", values);
            editMode ? UpdateEventReg({ ...values, id: initialData._id }) : CreateEventReg(values);
            handleCloseDialog();
        },
    });

    const handleCloseDialog = () => {
        formik.resetForm();
        closeModal();
    };

    const getEventsOptions = (data) => {
        return data.map((item) => ({ label: item.name, value: item._id }));
    };

    const checkIfGroupItem = (id) => {
        const foundItem = events?.find((item) => item._id === id);
        const result = foundItem?.event_type?.is_group
        return result;
    };

    // const checkParticipantsLimit = (id) => {
    //     const foundItem = events?.find((item) => item._id === id);

    //     const participantCount = foundItem?.event_type?.participant_count;
    //     const currentParticipants = formik.values.participants.length;

    //     return currentParticipants >= participantCount;
    // };

    // const checkHelpersLimit = (id) => {
    //     const foundItem = events?.find((item) => item._id === id);

    //     const helperCount = foundItem?.event_type?.helper_count;
    //     const currentHelpers = formik.values.helpers.length;
    //     // console.log(currentHelpers, helperCount)

    //     let result;
    //     if (currentHelpers === 0 && helperCount === 0) {
    //         result = false;
    //     } else {
    //         result = currentHelpers <= helperCount;
    //     }
    //     // console.log(result)
    //     return result;
    // };

    const removeAllHelpers = () => {
        formik.setFieldValue("helpers", []);
    };

    const removeAllParticipants = () => {
        formik.setFieldValue("participants", []);
    };

    const handleAddParticipant = () => {
        if (!selectedParticipant) {
            toast.error("Please select a participant.");
            return;
        }
        const isAlreadyAdded = formik.values.participants.some(
            (participant) => participant.user === selectedParticipant._id
        );

        if (isAlreadyAdded) {
            toast.error("This participant is already added.");
            return;
        }
        formik.setFieldValue("participants", [
            ...formik.values.participants,
            { user: selectedParticipant._id },
        ]);
        setSelectedParticipant(null);
    }

    // const handleAddHelper = () => {

    //     const isAlreadyAdded = formik.values.helpers.some(
    //         (helper) => helper.user === selectedHelper._id
    //     )

    //     if (isAlreadyAdded) {
    //         toast.error("This helper is already added.");
    //         return;
    //     }

    //     formik.setFieldValue("helpers", [
    //         ...formik.values.helpers,
    //         { user: selectedHelper._id },
    //     ]);
    //     setSelectedHelper(null);
    // }

    const handleRemoveParticipant = (index) => {
        const newParticipants = formik.values.participants.filter(
            (_, i) => i !== index
        );
        formik.setFieldValue("participants", newParticipants);
    };

    const handleRemoveHelper = (index) => {
        const newHelpers = formik.values.helpers.filter((_, i) => i !== index);
        formik.setFieldValue("helpers", newHelpers);
    };

    const getDetails = (user) => {
        const foundItem = participants?.find((item) => item._id === user);
        return <div>{foundItem?.name}<span className="text-gray-500 text-xs"> {foundItem?.department} {foundItem.year_of_study}yr </span></div>;
    };

    const renderOption = (option) => {
        return <div>{option.name}<span className="text-gray-500 text-xs"> {option.department} {option.year_of_study}yr </span></div>;
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
            <DialogContent className="max-h-[85vh] overflow-hidden flex flex-col">
                <DialogHeader className="flex-shrink-0">
                    <DialogTitle>
                        {editMode ? "Edit Record" : "Add New Event Registration"}
                    </DialogTitle>
                    <DialogDescription>
                        {editMode
                            ? "Update the details of the record."
                            : "Please fill out the form to create a new event registration."}
                    </DialogDescription>
                </DialogHeader>
                <div className="overflow-y-auto  px-1">
                    <form onSubmit={formik.handleSubmit} className="space-y-4">

                        {!eventIsLoading ? (
                            <div className="space-y-2">
                                <SelectInput
                                    label="Event"
                                    name="event"
                                    value={formik.values.event}
                                    onChange={(e) => {
                                        setEvent(e.target.value)
                                        formik.setFieldValue("event", e.target.value);
                                        formik.setFieldValue("is_group", checkIfGroupItem(e.target.value));
                                        removeAllHelpers();
                                        removeAllParticipants();
                                    }}
                                    onBlur={formik.handleBlur}
                                    options={getEventsOptions(events)}
                                />
                                {formik.touched.event && formik.errors.event && (
                                    <div className="text-red-500 text-sm">
                                        {formik.errors.event}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div>loading...</div>
                        )}
                        {formik.values.event && (
                            <>
                                <>
                                    {checkIfGroupItem(formik.values.event) && (
                                        <div className="space-y-2">
                                            <Input
                                                id="group_name"
                                                name="group_name"
                                                label="Group Name"
                                                placeholder="Enter group name"
                                                value={formik.values.group_name}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            />
                                            {formik.touched.group_name && formik.errors.group_name && (
                                                <div className="text-red-500 text-sm">
                                                    {formik.errors.group_name}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </>
                                <>
                                    {participantIsLoading ? (
                                        <div>loading...</div>
                                    ) : (
                                        <div className="flex items-end gap-3">
                                            {/* {console.log(participants)} */}
                                            <SelectInput2
                                                label="Participants"
                                                value={selectedParticipant}
                                                renderOption={renderOption}
                                                onChange={(e) => setSelectedParticipant(e.target.value)}
                                                valueKey="_id"
                                                options={participants}
                                                formik={formik.values.participants}  // Pass formik to access participant values
                                            />
                                            {formik.values.participants.length > 0 && (
                                                <Button
                                                    type="button"
                                                    size="icon"
                                                    className="cursor-pointer"
                                                    variant="outline"
                                                    onClick={() => removeAllParticipants()}
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            )
                                            }
                                            <Button
                                                type="button"
                                                size="icon"
                                                className="cursor-pointer"
                                                variant="outline"
                                                onClick={() => handleAddParticipant()}

                                            >
                                                <Plus className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    )}
                                </>
                            </>
                        )}



                        {formik.values.participants.length > 0 && (
                            <div className="border rounded-md p-3 space-y-2">
                                {formik.values.participants.map((participant, index) => (
                                    <div className="flex items-center justify-between">
                                        <span>{getDetails(participant.user)} </span>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-8 h-8 text-red-500"
                                            size="icon"
                                            onClick={() => {
                                                // Call the delete function and pass the participant data
                                                handleRemoveParticipant(index);
                                            }}
                                        >
                                            <Trash />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {formik.touched.participants && formik.errors.participants && (
                            <div className="text-red-500 text-sm">
                                {formik.errors.participants}
                            </div>
                        )}



                        {formik.values.helpers.length > 0 && (
                            <div className="border rounded-md p-3 space-y-2">
                                {formik.values.helpers.map((participant, index) => (
                                    <div className="flex items-center justify-between">
                                        <span>{getDetails(participant.user)} </span>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-8 h-8 text-red-500"
                                            size="icon"
                                            onClick={() => {
                                                // Call the delete function and pass the participant data
                                                handleRemoveHelper(index);
                                            }}
                                        >
                                            <Trash />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex justify-end space-x-2 pt-4">
                            <Button type="submit" disabled={formik.isSubmitting}>
                                {editMode ? "Update" : "Submit"}
                            </Button>
                            <Button variant="ghost" onClick={handleCloseDialog}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default EventRegModal;
