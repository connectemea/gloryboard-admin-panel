import React from 'react'
import { useFormik } from 'formik'
import { DialogHeader, Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import SelectInput from './common/SelectInput'
import { Plus } from 'lucide-react'
import { useModel } from '@/hooks/useModel'
import { departmentOptions, yearOptions } from '@/constants/options'
import { validationSchema } from '@/constants/validationSchemas'
import { initalValue } from '@/constants/initalValue'

function Modal({ editMode = false, initialData = {} }) {
    const { isOpen, openModal, closeModal } = useModel()

    // Initial form values
    const formik = useFormik({
        initialValues: editMode ? { ...initalValue, ...initialData } : initalValue,
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handleCloseDialog()
        }
    })

    const handleCloseDialog = () => {
        formik.resetForm()
        closeModal()
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => (open ? openModal() : closeModal())}>
            <DialogTrigger className='flex justify-center items-center bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md text-sm font-semibold'>
                <Plus className='mr-2' /> {editMode ? 'Edit' : 'Add'}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{editMode ? 'Edit Record' : 'Add New Record'}</DialogTitle>
                    <DialogDescription>
                        {editMode ? 'Update the details of the record.' : 'Please fill out the form to create a new record.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={formik.handleSubmit} className="space-y-4">
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

                    {/* Department select input */}
                    <SelectInput
                        label="Department"
                        name="department"
                        value={formik.values.department}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        options={departmentOptions}
                    />
                    {formik.touched.department && formik.errors.department && (
                        <div className="text-red-500 text-sm">{formik.errors.department}</div>
                    )}

                    {/* Year select input */}
                    <SelectInput
                        label="Year"
                        name="year"
                        value={formik.values.year}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        options={yearOptions}
                    />
                    {formik.touched.year && formik.errors.year && (
                        <div className="text-red-500 text-sm">{formik.errors.year}</div>
                    )}

                    <div className="mt-4 flex justify-end">
                        <Button type="submit" className="mr-2" disabled={formik.isSubmitting}>
                            {editMode ? 'Update' : 'Submit'}
                        </Button>
                        <Button variant="ghost" onClick={handleCloseDialog}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default Modal
