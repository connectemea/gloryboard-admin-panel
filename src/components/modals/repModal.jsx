import React, { useContext } from 'react'
import { useFormik } from 'formik'
import { DialogHeader, Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pencil, Plus } from 'lucide-react'
import { useModel } from '@/hooks/useModel'
import { repValidationSchema } from '@/constants/validationSchemas'
import { repInitalValue } from '@/constants/initalValue'
import { departmentOptions, genderOptions, yearOptions } from '@/constants/options'
import SelectInput from '../common/SelectInput'
import { useCreateUser, useUpdateUser } from '@/services/mutation/userMutations'
import { PasswordInput } from '../ui/password-input'
import { DepartmentOptionsContext } from '@/context/departmentContext'
import { AuthContext } from '@/context/authContext'
import extractDepartment from '@/utils/extractDepartment'

function RepModal({ editMode = false, initialData = {} }) {

    const { mutate: createUser } = useCreateUser();
    const { mutate: updateUser } = useUpdateUser();
    const { isOpen, openModal, closeModal } = useModel()


    // const { auth } = useContext(AuthContext);
    const { data } = useContext(DepartmentOptionsContext);



    // Initial form values
    const formik = useFormik({
        initialValues: editMode ? { ...repInitalValue, ...initialData, year_of_study: String(initialData.year_of_study) } : repInitalValue,
        validationSchema: repValidationSchema(editMode),
        validateOnBlur: false,
        onSubmit: (values) => {
            editMode ? updateUser(values) :  createUser({...values, user_type: 'rep'});
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
                    <DialogTitle>{editMode ? 'Edit Rep' : 'Add New Rep'}</DialogTitle>
                    <DialogDescription>
                        {editMode ? 'Update the details of the rep.' : 'Please fill out the form to create a new rep.'}
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
                    {/* Department select input */}
                    <SelectInput
                        label="Department"
                        name="department"
                        value={formik.values.department}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        options={extractDepartment.getDepartmentListAll(data)}
                    />
                    {formik.touched.department && formik.errors.department && (
                        <div className="text-red-500 text-sm">{formik.errors.department}</div>
                    )}

                    {/* Year select input */}
                    <SelectInput
                        label="Year"
                        name="year_of_study"
                        value={formik.values.year_of_study.toString()}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        options={yearOptions}
                    />
                    {formik.touched.year_of_study && formik.errors.year_of_study && (
                        <div className="text-red-500 text-sm">{formik.errors.year_of_study}</div>
                    )}


                    <SelectInput
                        label="Gender"
                        name="gender"
                        value={formik.values.gender}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        options={genderOptions}
                    />
                    {formik.touched.gender && formik.errors.gender && (
                        <div className="text-red-500 text-sm">{formik.errors.gender}</div>
                    )}
            

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

export default RepModal
