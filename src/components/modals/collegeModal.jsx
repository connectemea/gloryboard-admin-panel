import React, { useContext } from 'react'
import { useFormik } from 'formik'
import { DialogHeader, Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pencil, Plus } from 'lucide-react'
import { useModel } from '@/hooks/useModel'
import { collegeValidationSchema } from '@/constants/validationSchemas'
import { collegeInitalValue } from '@/constants/initalValue'
import SelectInput from '../common/SelectInput'
import { useCreateUser, useUpdateUser } from '@/services/mutation/userMutations'
import { PasswordInput } from '../ui/password-input'
import { DepartmentOptionsContext } from '@/context/departmentContext'
import { AuthContext } from '@/context/authContext'
import extractDepartment from '@/utils/extractDepartment'

function CollegeModal({ editMode = false, initialData = {} }) {

    const { mutate: createUser } = useCreateUser();
    const { mutate: updateUser } = useUpdateUser();
    const { isOpen, openModal, closeModal } = useModel()


    // const { auth } = useContext(AuthContext);
    const { data } = useContext(DepartmentOptionsContext);



    // Initial form values
    const formik = useFormik({
        initialValues: editMode ? { ...collegeInitalValue, ...initialData } : collegeInitalValue,
        validationSchema: collegeValidationSchema(editMode),
        validateOnBlur: false,
        onSubmit: (values) => {
            console.log(editMode ? 'Updated Data:' : 'New Data:', values)
            editMode ? updateUser(values) : createUser({ ...values, user_type: 'rep' });
            handleCloseDialog()
        }
    })

    const handleCloseDialog = () => {
        formik.resetForm()
        closeModal()
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => (open ? openModal() : closeModal())}>
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
                    <DialogTitle>{editMode ? 'Edit College' : 'Add New College'}</DialogTitle>
                    <DialogDescription>
                        {editMode ? 'Update the details of the College.' : 'Please fill out the form to create a new College.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={formik.handleSubmit} className="space-y-2">
                    {/* Name input field */}
                    <Input
                        name="name"
                        label="college Name"
                        placeholder="Enter college name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.name && formik.errors.name && (
                        <div className="text-red-500 text-sm">{formik.errors.name}</div>
                    )}
                    {/* Name input field */}
                    <Input
                        name="email"
                        label="Email"
                        placeholder="Enter email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.email && formik.errors.name && (
                        <div className="text-red-500 text-sm">{formik.errors.email}</div>
                    )}
                    {/* phone number field */}
                    <Input
                        name="number"
                        label="Phone No"
                        placeholder="Enter phone no"
                        value={formik.values.number}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.number && formik.errors.number && (
                        <div className="text-red-500 text-sm">{formik.errors.number}</div>
                    )}

                    {!editMode &&
                        <>
                            <PasswordInput
                                name="password"
                                label="Password"
                                placeholder="Enter password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.password && formik.errors.password && (
                                <div className="text-red-500 text-sm">{formik.errors.password}</div>
                            )}
                            <PasswordInput
                                name="confirmPassword"
                                label="Password"
                                placeholder="Enter password"
                                value={formik.values.confirmPassword}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                <div className="text-red-500 text-sm">{formik.errors.confirmPassword}</div>
                            )}
                        </>
                    }
                    <div className="!mt-4 flex justify-end">
                        <Button type="submit" className="mr-2" disabled={formik.isSubmitting}>
                            {editMode ? 'Update' : 'Submit'}
                        </Button>
                        <Button type="button" variant="ghost" onClick={handleCloseDialog}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default CollegeModal
