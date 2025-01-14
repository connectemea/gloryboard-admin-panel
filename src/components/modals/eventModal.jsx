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
import { Pencil, Plus, CalendarIcon } from 'lucide-react';
import { useModel } from '@/hooks/useModel';
import SelectInput from '../common/SelectInput';
import { useGetEventTypes } from '@/services/queries/eventTypeQueries';
import { eventInitalValue } from '@/constants/initalValue';
import { eventValidationSchema } from '@/constants/validationSchemas';
import { useCreateEvent, useUpdateEvent } from '@/services/mutation/eventMutations';
import { eventCategorys, resultCategorys } from '@/constants/options';

function EventModal({ editMode = false, initialData = {} }) {
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const { isOpen, openModal, closeModal } = useModel();
    const { data: eventTypes, isLoading: eventTypesLoading, error } = useGetEventTypes();

    console.log(initialData);

    const { mutate: CreateEvent } = useCreateEvent(setIsSubmitting)
    const { mutate: updateEvent } = useUpdateEvent(setIsSubmitting);


    // Initial form values
    const formik = useFormik({
        initialValues: editMode ? { name: initialData.name, start_time: initialData.start_time, end_time: initialData.end_time, id: initialData._id } : eventInitalValue, // Only set the name in editMode
        validationSchema: eventValidationSchema(editMode),
        validateOnBlur: false,
        onSubmit: (values) => {
            setIsSubmitting(true);
            if (values.result_category === "") {
                values.result_category = "none";
            }

            if (editMode) {
                updateEvent({
                    name: values.name,
                    start_time: values.start_time,
                    end_time: values.end_time,
                    _id: values.id
                });
            } else {
                CreateEvent(values);
            }

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

                    {!editMode && (
                        <div className='space-y-2'>

                            {/* Event Category input field */}
                            <SelectInput
                                label="Event Category"
                                name="event_category"
                                value={formik.values.event_category}
                                onChange={(e) =>
                                    formik.setFieldValue('event_category', e.target.value)
                                }
                                onBlur={formik.handleBlur}
                                options={eventCategorys}
                            />
                            {formik.touched.event_category && formik.errors.event_category && (
                                <div className="text-red-500 text-sm">
                                    {formik.errors.event_category}
                                </div>
                            )}

                            {/* Result Category input field */}
                            <SelectInput
                                label={"Result Category"}
                                name="result_category"
                                value={formik.values.result_category}
                                onChange={(e) =>
                                    formik.setFieldValue('result_category', e.target.value)
                                }
                                onBlur={formik.handleBlur}
                                options={resultCategorys}
                            />
                            {formik.touched.result_category && formik.errors.result_category && (
                                <div className="text-red-500 text-sm">
                                    {formik.errors.result_category}
                                </div>
                            )}

                            {/* Min Participants input field */}
                            <Input
                                name="min_participants"
                                label="Min Participants"
                                placeholder="Enter min participants"
                                value={formik.values.min_participants}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />

                            {formik.touched.min_participants && formik.errors.min_participants && (
                                <div className="text-red-500 text-sm">
                                    {formik.errors.min_participants}
                                </div>
                            )}

                            {/* Max Participants input field */}
                            <Input
                                name="max_participants"
                                label="Max Participants"
                                placeholder="Enter max participants"
                                value={formik.values.max_participants}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />

                            {formik.touched.max_participants && formik.errors.max_participants && (
                                <div className="text-red-500 text-sm">
                                    {formik.errors.max_participants}
                                </div>
                            )}


                            {!eventTypesLoading ? (
                                <>
                                    <SelectInput
                                        label="Event Type"
                                        name="event_type"
                                        value={formik.values.event_type}
                                        onChange={(e) =>
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
                        </div>
                    )}

                    <div className="relative">
                        <label className="block text-white/70 text-sm mb-1">Start Time</label>
                        <input
                            className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-[#0c0B0E] text-white focus:outline-none focus:ring-2 focus:ring-[#fff] shadow-md 
    [appearance:textfield] [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:invert"
                            type="datetime-local"
                            value={formik.values.start_time ? formik.values.start_time.slice(0, 16) : ""}  
                            onChange={(e) => {
                                console.log(e.target.value);
                                const date = new Date(e.target.value);  
                                const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes()));
                                formik.setFieldValue('start_time', utcDate.toISOString().slice(0, 19).replace('T', ' ')); 
                            }}
                        />
                        {formik.touched.start_time && formik.errors.start_time && (
                            <div className="text-red-500 text-sm mt-1">
                                {formik.errors.start_time}
                            </div>
                        )}
                    </div>

                    <div className="relative mt-4">
                        <label className="block text-white/70 text-sm mb-1">End Time</label>
                       <input
                            className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-[#0c0B0E] text-white focus:outline-none focus:ring-2 focus:ring-[#fff] shadow-md 
    [appearance:textfield] [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:invert"
                            type="datetime-local"
                            value={formik.values.end_time ? formik.values.end_time.slice(0, 16) : ""}  
                            onChange={(e) => {
                                console.log(e.target.value);
                                const date = new Date(e.target.value); 
                                const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes()));
                                formik.setFieldValue('end_time', utcDate.toISOString().slice(0, 19).replace('T', ' '));  
                            }}
                        />
                        {formik.touched.end_time && formik.errors.end_time && (
                            <div className="text-red-500 text-sm mt-1">
                                {formik.errors.end_time}
                            </div>
                        )}
                    </div>

                    <div className="!mt-4 flex justify-end">
                        <Button
                            type="submit"
                            className="mr-2"
                            disabled={isSubmitting}
                        >
                            {editMode ? 'Update' : 'Submit'}
                        </Button>
                        <Button type="button" variant="ghost" onClick={handleCloseDialog}>
                            Cancel
                        </Button>
                    </div>

                </form>
            </DialogContent>
        </Dialog>
    );
}

export default EventModal;
