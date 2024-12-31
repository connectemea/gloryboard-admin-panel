import React, { useContext, useEffect, useState } from 'react'
import { useFormik } from 'formik'
import { DialogHeader, Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pencil, Plus, Copy, RefreshCw } from 'lucide-react'
import { useModel } from '@/hooks/useModel'
import { collegeValidationSchema } from '@/constants/validationSchemas'
import { collegeInitalValue } from '@/constants/initalValue'
import { useCreateCollege, useUpdateCollege } from '@/services/mutation/collegeMutations'
import { PasswordInput } from '../ui/password-input'
import { AuthContext } from '@/context/authContext'
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
// Utility function for random password generation
const generateRandomPassword = (length = 12) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

function CollegeModal({ editMode = false, initialData = {} }) {
    const queryClient = useQueryClient();
    const [updatePassword, setUpdatePassword] = useState(false);
    const { isOpen, openModal, closeModal: handleCloseModal } = useModel()
    const { isOpen: isCopyOpen, openModal: handleCopyModal, closeModal: handleCloseCopyModal } = useModel()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleCloseDialog = () => {
        formik.resetForm()
        handleCloseModal()
        setUpdatePassword(false)
    }
    const handleFormSuccess = () => {
        handleCloseDialog()
        handleCopyModal()
    }

    const { mutate: createCollege } = useCreateCollege(handleFormSuccess, setIsSubmitting);
    const { mutate: updateCollege } = useUpdateCollege(handleFormSuccess, setIsSubmitting);

    const [copyData, setCopyData] = useState({ email: '', password: '' });

    // const { auth } = useContext(AuthContext);
    const validationSchema = React.useMemo(
        () => collegeValidationSchema(editMode, updatePassword),
        [editMode, updatePassword]
    );
    // Initial form values
    const formik = useFormik({
        initialValues: editMode ? { ...collegeInitalValue, ...initialData } : collegeInitalValue,
        validationSchema: validationSchema,
        validateOnBlur: true,
        validateOnChange: true,
        onSubmit: (values) => {
            // setIsSubmitting(true);
            setCopyData({ email: values.email, password: values.password });
            if (!values.password || !values.confirmPassword) {
                delete values.password;
                delete values.confirmPassword;
            }
            // editMode ? updateCollege(values) : createCollege({ ...values, user_type: 'organization' });
            if (editMode) {
                updateCollege(values);
            } else {
                createCollege({ ...values, user_type: 'organization' });
            }
        }
    })
    useEffect(() => {
        if (editMode) {
            formik.setFormikState((state) => ({
                ...state,
                values: {
                    ...state.values,
                    ...initialData,
                },
            }));
        }
    }, [editMode, initialData]);


    const handleSubmit = (e) => {
        e.preventDefault()
        formik.handleSubmit()
    }


    // Utility function for copying to clipboard
    const copyToClipboard = () => {
        const textToCopy = `Email: ${copyData.email}\nPassword: ${copyData.password ? copyData.password : '****'}`;
        navigator.clipboard.writeText(textToCopy);
        toast.success('Copied email and password to clipboard!');
        handleCloseDialog();
    };

    const handleUpdatePassword = () => {
        setUpdatePassword(!updatePassword);
    }

    const CloseCopyModal = () => {
        queryClient.invalidateQueries(['users']);
        handleCloseCopyModal();
    }

    return (
        <>
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
                            {editMode ? 'Edit College' : 'Add New College'}
                        </DialogTitle>
                        <DialogDescription>
                            {editMode ? 'Update the details of the College.' : 'Please fill out the form to create a new College.'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-2">
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
                        {formik.touched.email && formik.errors.email && (
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
                        {editMode && (
                            <div className="pt-2">
                                <Button type="button" onClick={() => handleUpdatePassword()} >
                                    {editMode ? (updatePassword ? 'Cancel Password' : 'Update Password') : 'Update Password'}
                                </Button>
                            </div>
                        )}
                        {editMode ? (
                            updatePassword && (
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
                                                    // formik.validateField('password');
                                                    // formik.validateField('confirmPassword');
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
                            )) : (
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
                                            onClick={(e) => {
                                                const randomPassword = generateRandomPassword();
                                                formik.setFieldValue('password', randomPassword);
                                                formik.setFieldValue('confirmPassword', randomPassword);

                                                formik.validateForm();
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
                                    label="Confirm Password"
                                    placeholder="Enter password"
                                    value={formik.values.confirmPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />

                                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                    <div className="text-red-500 text-sm">{formik.errors.confirmPassword}</div>
                                )}


                            </>
                        )
                        }
                        <div className="!mt-4 flex justify-end">
                            <Button type="submit" className="mr-2" disabled={isSubmitting}>
                                {editMode ? 'Update' : 'Submit'}
                            </Button>
                            <Button type="button" variant="ghost" onClick={handleCloseDialog}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={isCopyOpen} onOpenChange={(open) => (open ? handleCopyModal() : CloseCopyModal())}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            College Added
                        </DialogTitle>
                        <DialogDescription>
                            College added successfully
                        </DialogDescription>
                    </DialogHeader>
                    <div className="border p-4 rounded-lg shadow-sm bg-gray-950 mb-4">
                        <div className="flex space-x-2 mt-4 relative py-2">
                            <code className="text-sm text-gray-400 flex flex-col gap-2">
                                <span> Email: {copyData.email} </span>
                                <span> Password: {copyData.password ? copyData.password : '****'}</span>
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
                </DialogContent>
            </Dialog>
        </>
    )
}

export default CollegeModal
