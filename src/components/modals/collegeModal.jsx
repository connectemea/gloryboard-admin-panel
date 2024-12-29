import React, { useContext, useEffect } from 'react'
import { useFormik } from 'formik'
import { DialogHeader, Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pencil, Plus, Copy, RefreshCw } from 'lucide-react'
import { useModel } from '@/hooks/useModel'
import { collegeValidationSchema } from '@/constants/validationSchemas'
import { collegeInitalValue } from '@/constants/initalValue'
import SelectInput from '../common/SelectInput'
import { useCreateUser, useUpdateUser } from '@/services/mutation/userMutations'
import { useCreateCollege , useUpdateCollege } from '@/services/mutation/collegeMutations'
import { PasswordInput } from '../ui/password-input'
import { AuthContext } from '@/context/authContext'
import extractDepartment from '@/utils/extractDepartment'
import { toast } from 'sonner';

// Utility function for random password generation
const generateRandomPassword = (length = 12) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};




function CollegeModal({ editMode = false, initialData = {} }) {
    const [submitted, setSubmitted] = React.useState(false);
    const { mutate: createCollege } = useCreateCollege(setSubmitted);
    const { mutate: updateCollege } = useUpdateCollege();
    const { isOpen, openModal, closeModal } = useModel()

    // const { auth } = useContext(AuthContext);

    // Initial form values
    const formik = useFormik({
        initialValues: editMode ? { ...collegeInitalValue, ...initialData } : collegeInitalValue,
        validationSchema: collegeValidationSchema(editMode),
        validateOnBlur: false,
        onSubmit: (values) => {
            console.log(editMode ? 'Updated Data:' : 'New Data:', values)
            editMode ? updateCollege(values) : createCollege({ ...values, user_type: 'organization' });
            // handleCloseDialog()
        }
    })

    const handleCloseDialog = () => {
        formik.resetForm()
        setSubmitted(false)
        closeModal()
    }



    // Utility function for copying to clipboard
    const copyToClipboard = () => {
        const textToCopy = `Email: ${formik.values.email}\nPassword: ${formik.values.password}`;
        navigator.clipboard.writeText(textToCopy);
        toast.success('Copied email and password to clipboard!');
        handleCloseDialog();
    };

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
                    <DialogTitle>
                        {submitted ? 'College Added' :
                            (editMode ? 'Edit College' : 'Add New College')}
                    </DialogTitle>
                    <DialogDescription>
                        {submitted ? 'College added successfully' :
                            (editMode ? 'Update the details of the College.' : 'Please fill out the form to create a new College.')}
                    </DialogDescription>
                </DialogHeader>
                {!submitted ? (
                    <form onSubmit={formik.handleSubmit} className="space-y-2">
                        {/* Name input field */}
                        <Input
                            name="name"
                            label="College Name"
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
                            name="phoneNumber"
                            label="Phone No"
                            placeholder="Enter phone no"
                            value={formik.values.phoneNumber}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                            <div className="text-red-500 text-sm">{formik.errors.phoneNumber}</div>
                        )}

                        {/* {!editMode && */}
                        <>
                            <div className='flex w-full'>
                                <div className='w-full flex-1 flex-grow'>
                                    <PasswordInput
                                        name="password"
                                        label="Password"
                                        placeholder="Enter password"
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                </div>

                                <div className='flex items-end justify-end pb-[2px] pl-[5px]'>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="!py-2"
                                        onClick={() => {
                                            const randomPassword = generateRandomPassword();
                                            formik.setFieldValue('password', randomPassword);
                                            formik.setFieldValue('confirmPassword', randomPassword);
                                        }}
                                    >
                                        <RefreshCw className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>
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
                        {/* } */}
                        <div className="!mt-4 flex justify-end">
                            <Button type="submit" className="mr-2" disabled={formik.isSubmitting}>
                                {editMode ? 'Update' : 'Submit'}
                            </Button>
                            <Button type="button" variant="ghost" onClick={handleCloseDialog}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                ) : (
                    <div className="border p-4 rounded-lg shadow-sm bg-gray-950 mb-4">
                        <div className="flex space-x-2 mt-4 relative py-2">
                            <code className="text-sm text-gray-400 flex flex-col gap-2">
                                <span> Email: {formik.values.email} </span>
                                <span> Password: {formik.values.password}</span>


                            </code>
                            <Button
                                onClick={copyToClipboard}
                                variant="outline"
                                size="sm"
                                className="ml-4 absolute -top-5 -right-2"
                            >
                                <Copy className="mr-1 h-3 w-3" /> <span className='text-xs'>Copy</span>
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default CollegeModal
