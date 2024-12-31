import React, { useEffect, useMemo, useState } from "react";
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
import {
  useGetEvents,
  useGetEventsOrg,
} from "@/services/queries/eventsQueries";
import {
  useCreateEventReg,
  useUpdateEventReg,
} from "@/services/mutation/eventRegMutations";
import SelectInput2 from "../common/SelectInput2";
import { toast } from "sonner";
import { set } from "date-fns";

const EventRegModal = ({ editMode = false, initialData = {} }) => {
  const { isOpen, openModal, closeModal } = useModel();
  const [event, setEvent] = useState(null);
  const { mutate: CreateEventReg } = useCreateEventReg();
  const { mutate: UpdateEventReg } = useUpdateEventReg();
  const [eventCategory, setEventCategory] = useState("general");

  const [selectedParticipant, setSelectedParticipant] = useState(null);

  const {
    data: participants,
    isLoading: participantIsLoading,
    error: participantError,
  } = useGetParticipants();
  const {
    data: events,
    isLoading: eventIsLoading,
    error: eventError,
  } = useGetEventsOrg();

  const formik = useFormik({
    initialValues: editMode
      ? { ...eventRegistrationInitialValues, ...initialData }
      : eventRegistrationInitialValues,
    validationSchema: eventRegistrationSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: (values) => {
      editMode
        ? UpdateEventReg({ ...values, id: initialData._id })
        : CreateEventReg(values);
      handleCloseDialog();
    },
  });

  const selectedItem = useMemo(() => {
    return events?.find((item) => item._id === formik.values.event) || null;
  }, [events, formik.values.event]);

  const handleCloseDialog = () => {
    // formik.resetForm();
    closeModal();
  };

  const getEventsOptions = (data) => {
    return data.map((item) => ({ label: item.name, value: item._id }));
  };

  const checkIfGroupItem = (id) => {
    const foundItem = events?.find((item) => item._id === id);

    const result = foundItem?.event_type?.is_group;
    return result;
  };
  const checkIfCategoryItem = (id) => {
    const foundItem = events?.find((item) => item._id === id);
    const result = foundItem?.event_category;
    setEventCategory(result);
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

  //     let result;
  //     if (currentHelpers === 0 && helperCount === 0) {
  //         result = false;
  //     } else {
  //         result = currentHelpers <= helperCount;
  //     }
  //     return result;
  // };

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
  };

  const handleRemoveParticipant = (index) => {
    const newParticipants = formik.values.participants.filter(
      (_, i) => i !== index
    );
    formik.setFieldValue("participants", newParticipants);
  };

  const getDetails = (userID) => {

    if (!userID) {
      return <div>No details available</div>; // Handle cases where user or user._id is undefined
    }
    const foundItem = participants?.find((item) => item._id === userID);
    return (
      <div className="flex gap-2 items-center">
        {foundItem?.name}
        <span className="text-gray-500 text-xs">
          {foundItem?.course} {foundItem?.year_of_study}yr
        </span>
      </div>
    );
  };

  const renderOption = (option) => {
    return (
      <div className="flex gap-3 items-center">
        {option.name}
        <span className="text-gray-500 text-xs">
          {" "}
          {option?.course} {option?.year_of_study}yr{" "}
        </span>
      </div>
    );
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const participantCount = formik.values.participants.length;
    if (participantCount > selectedItem.max_participants) {
      toast.error(
        `Only ${selectedItem.max_participants} participants are allowed for this event.`
      );
      return;
    } else if (
      participantCount < selectedItem.min_participants
    ) {
      toast.error(
        `Atleast ${selectedItem.min_participants} participants are required for this event.`
      );
      return;
    }
    formik.handleSubmit();
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
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {!eventIsLoading ? (
              <div className="space-y-2">
                <SelectInput
                  label="Event"
                  name="event"
                  value={formik.values.event}
                  onChange={(e) => {
                    setEvent(e.target.value);
                    formik.setFieldValue("event", e.target.value);
                    formik.setFieldValue(
                      "is_group",
                      checkIfGroupItem(e.target.value)
                    );
                    checkIfCategoryItem(e.target.value);
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
                {/* <>
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
                                </> */}
                {participantIsLoading ? (
                  <div>loading...</div>
                ) : (
                  <div className="flex items-end gap-3">
                    <SelectInput2
                      label="Participants"
                      value={selectedParticipant}
                      renderOption={renderOption}
                      onChange={(e) => setSelectedParticipant(e.target.value)}
                      valueKey="_id"
                      options={participants}
                      formik={formik.values.participants} // Pass formik to access participant values
                      category={eventCategory}
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
                    )}
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
            )}

            {formik.values.participants.length > 0 && (
              <div className="border rounded-md p-3 space-y-2">
                {formik.values.participants.map((participant, index) => (
                  <div
                    className="flex items-center justify-between"
                    key={index}
                  >
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
