import React from 'react';
import { useFormik } from 'formik';
import {
    DialogHeader,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pencil, Plus } from 'lucide-react';
import { useModel } from '@/hooks/useModel';
import SelectInput from '../common/SelectInput';
import { useGetEventTypes } from '@/services/queries/eventTypeQueries';
import { DayPicker } from '../common/DayPicker';
import { eventInitalValue } from '@/constants/initalValue';
import { eventValidationSchema } from '@/constants/validationSchemas';
import { Label } from '@radix-ui/react-label';
import { useCreateEvent, useUpdateEvent } from '@/services/mutation/eventMutations';

function EventModal({ editMode = false, initialData = {} }) {

    const { isOpen, openModal, closeModal } = useModel();
    const { data: eventTypes, isLoading: eventTypesLoading, error } = useGetEventTypes();


    const { mutate: CreateEvent } = useCreateEvent()
    const { mutate: updateEvent } = useUpdateEvent();


    // Initial form values
    const formik = useFormik({
        initialValues: editMode ? { ...eventInitalValue, ...initialData } : eventInitalValue,
        validationSchema: eventValidationSchema,
        validateOnBlur: false,
        onSubmit: (values) => {
            editMode ? updateEvent({...values, id: initialData._id}) : CreateEvent(values);
            handleCloseDialog();
        },
    });

    const handleCloseDialog = () => {
        formik.resetForm();
        closeModal();
    };

    const getEventTypeOptions = (data) => {
        return data.map((item) => ({ label: item.name, value: item._id }));
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
                        {editMode ? 'Edit Record' : 'Add New Event'}
                    </DialogTitle>
                    <DialogDescription>
                        {editMode
                            ? 'Update the details of the record.'
                            : 'Please fill out the form to create a new event.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={formik.handleSubmit} className="space-y-2">
                    {/* Name input field */}
                    <Input
                        name="name"
                        label="Name"
                        placeholder="Enter name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.name && formik.errors.name && (
                        <div className="text-red-500 text-sm">
                            {formik.errors.name}
                        </div>
                    )}

                    {!eventTypesLoading ? (
                        <>
                            <SelectInput
                                label="Event Type"
                                name="event_type"
                                value={formik.values.event_type}
                                onChange={(e) =>
                                    // console.log(value)
                                    formik.setFieldValue('event_type', e.target.value)
                                }
                                onBlur={formik.handleBlur}
                                options={getEventTypeOptions(eventTypes)}
                            />
                            {formik.touched.event_type &&
                                formik.errors.event_type && (
                                    <div className="text-red-500 text-sm">
                                        {formik.errors.event_type}
                                    </div>
                                )}
                        </>
                    ) : (
                        <p>Loading...</p>
                    )}


                    {/* <Label className="text-white/50 ">Date</Label>
                    <DayPicker className="w-full" name="date" selected={formik.values.date}
                        onSelect={(date) => {
                            formik.setFieldValue('date', date);
                        }
                        } />
                    {formik.touched.date && formik.errors.date && (
                        <div className="text-red-500 text-sm">
                            {formik.errors.date}
                        </div>
                    )} */}

                    <div className="!mt-4 flex justify-end">
                        <Button
                            type="submit"
                            className="mr-2"
                            disabled={formik.isSubmitting}
                        >
                            {editMode ? 'Update' : 'Submit'}
                        </Button>
                        <Button variant="ghost" onClick={handleCloseDialog}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default EventModal;
