import React from 'react'
import { useFormik } from 'formik'
import { DialogHeader, Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Pencil, Plus } from 'lucide-react'
import { useModel } from '@/hooks/useModel'
import { eventTypeValidationSchema } from '@/constants/validationSchemas'
import { eventTypeinitalValue } from '@/constants/initalValue'
import { Label } from '../ui/label'
import { useCreateEventType, useUpdateEventType } from '@/services/mutation/eventTypeMutations'

function EventTypeModal({ editMode = false, initialData = {} }) {

    const { isOpen, openModal, closeModal } = useModel()

    const { mutate: CreateEventType } = useCreateEventType()
    const { mutate: updateEventType } = useUpdateEventType();  

    const formik = useFormik({
        initialValues: editMode ? { ...eventTypeinitalValue, ...initialData } : eventTypeinitalValue,
        validationSchema: eventTypeValidationSchema,
        validateOnBlur: false,
        onSubmit: (values) => {
            console.log('Submitted Values:', values);
            editMode ? updateEventType({...values, id: initialData._id}) : CreateEventType(values);
            handleCloseDialog();
        },
    })

    const handleCloseDialog = () => {
        formik.resetForm()
        closeModal()
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => (open ? openModal() : handleCloseDialog())}>
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
                    <DialogTitle>{editMode ? 'Edit Record' : 'Add New Event Type'}</DialogTitle>
                    <DialogDescription>
                        {editMode ? 'Update the details of the record.' : 'Please fill out the form to create a new event type.'}
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
                        <div className="text-red-500 text-sm">{formik.errors.name}</div>
                    )}

                    <div className='flex gap-5 border p-3 rounded-md !mt-4'>

                        {/* Checkbox for Is Group Event */}
                        <div className="flex items-center space-x-2 ">
                            <Checkbox
                                id="is_group"
                                name="is_group"
                                checked={formik.values.is_group}
                                onCheckedChange={(checked) => {
                                    formik.setFieldValue('is_group', checked)
                                    // Reset participants count when unchecked
                                    if (!checked) {
                                        formik.setFieldValue('participant_count', 1)
                                    }
                                }}
                            />
                            <Label htmlFor="is_group" className="text-white/50 ">Group Event</Label>
                        </div>
                        {formik.touched.is_group && formik.errors.is_group && (
                            <div className="text-red-500 text-sm">{formik.errors.is_group}</div>
                        )}

                        {/* Checkbox for Is OnStage Event */}
                        <div className="flex items-center space-x-2 ">
                            <Checkbox
                                id="is_onstage"
                                name="is_onstage"
                                checked={formik.values.is_onstage}
                                onCheckedChange={(checked) => {
                                    formik.setFieldValue('is_onstage', checked)
                                }}
                            />
                            <Label htmlFor="is_onstage" className="text-white/50 ">On Stage Event</Label>
                        </div>
                        {formik.touched.is_onstage && formik.errors.is_onstage && (
                            <div className="text-red-500 text-sm">{formik.errors.is_onstage}</div>
                        )}



                    </div>

                    {/* Participants Count input, shown only if Is Group Event is checked */}
                    {/* {formik.values.is_group && ( */}
                        {/* <Input
                            name="participant_count"
                            label="Participants Count"
                            type="number"
                            placeholder="Enter number of participants"
                            value={formik.values.participant_count}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        /> */}
                    {/* )} */}
                    {/* {formik.touched.participant_count && formik.errors.participant_count && (
                        <div className="text-red-500 text-sm">{formik.errors.participant_count}</div>
                    )} */}



                    {/* <Input
                        name="helper_count"
                        label="Helpers Count"
                        type="number"
                        placeholder="Enter number of helpers"
                        value={formik.values.helper_count}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    /> */}

                    {/* {formik.touched.helper_count && formik.errors.helper_count && (
                        <div className="text-red-500 text-sm">{formik.errors.helper_count}</div>
                    )} */}

                    <div className='text-gray-500 text-lg font-semibold '>Set Scores</div>

                    {/* Score fields */}
                    <Input
                        name="scores.first"
                        label="First"
                        placeholder="First"
                        value={formik.values.scores.first}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        type="number"
                    />
                    {formik.touched.scores?.first && formik.errors.scores?.first && (
                        <div className="text-red-500 text-sm">{formik.errors.scores.first}</div>
                    )}

                    <Input
                        name="scores.second"
                        label="Second"
                        placeholder="Second"
                        value={formik.values.scores.second}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        type="number"
                    />
                    {formik.touched.scores?.second && formik.errors.scores?.second && (
                        <div className="text-red-500 text-sm">{formik.errors.scores.second}</div>
                    )}

                    <Input
                        name="scores.third"
                        label="Third"
                        placeholder="Third"
                        value={formik.values.scores.third}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        type="number"
                    />
                    {formik.touched.scores?.third && formik.errors.scores?.third && (
                        <div className="text-red-500 text-sm">{formik.errors.scores.third}</div>
                    )}

                    <div className="!mt-4 flex justify-end">
                        <Button type="submit" className="mr-2" disabled={formik.isSubmitting}>
                            {editMode ? 'Update' : 'Submit'}
                        </Button>
                        <Button variant="ghost" type="button" onClick={handleCloseDialog}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default EventTypeModal