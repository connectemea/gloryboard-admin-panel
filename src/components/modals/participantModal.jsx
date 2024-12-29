import React, { useContext, useRef, useState } from 'react';
import { useFormik } from 'formik';
import { DialogHeader, Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pencil, Plus } from 'lucide-react';
import { useModel } from '@/hooks/useModel';
import { departmentOptions, genderOptions, yearOptions } from '@/constants/options';
import { participantValidationSchema } from '@/constants/validationSchemas';
import { participantInitalValue } from '@/constants/initalValue';
import SelectInput from '../common/SelectInput';
import { useCreateUser, useUpdateUser } from '@/services/mutation/userMutations';
import { DepartmentOptionsContext } from '@/context/departmentContext';
import { AuthContext } from '@/context/authContext';
import extractDepartment from '@/utils/extractDepartment';
import ImageCropper from '../ImageCropper';

function ParticipantModal({ editMode = false, initialData = {} }) {
    const { mutate: createUser } = useCreateUser();
    const { mutate: updateUser } = useUpdateUser();
    const { isOpen, openModal, closeModal } = useModel();

    const { auth } = useContext(AuthContext);
    const { data } = useContext(DepartmentOptionsContext);

    const [image, setImage] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);
    const [isCropDialogOpen, setIsCropDialogOpen] = useState(false);


    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImage(reader.result);
                setIsCropDialogOpen(true); // Open crop dialog after selecting an image
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCloseDialog = () => {
        formik.resetForm();
        closeModal();
        setImage(null);
        setCroppedImage(null);
    };


    const formik = useFormik({
        initialValues: editMode
            ? { ...participantInitalValue, ...initialData, year_of_study: String(initialData.year_of_study) }
            : participantInitalValue,
        validationSchema: participantValidationSchema,
        validateOnBlur: false,
        onSubmit: (values) => {
            console.log(editMode ? 'Updated Data:' : 'New Data:', values);
            editMode ? updateUser(values) : createUser({ ...values, user_type: 'member' });
            handleCloseDialog();
        },
    });

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
            <DialogContent className="max-h-[85vh] overflow-hidden flex flex-col" >
                <DialogHeader>
                    <DialogTitle>{editMode ? 'Edit Record' : 'Add New Participant'}</DialogTitle>
                    <DialogDescription>
                        {editMode ? 'Update the details of the record.' : 'Please fill out the form to create a new participant.'}
                    </DialogDescription>
                </DialogHeader>
                <div className="overflow-y-auto  px-1">
                <form onSubmit={formik.handleSubmit} className="space-y-2">
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

                    <SelectInput
                        label="Department"
                        name="department"
                        value={formik.values.department}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        options={
                            auth.user.user_type === 'admin'
                                ? extractDepartment.getDepartmentListAll(data)
                                : extractDepartment.getDepartmentListForRep(data, auth)
                        }
                    />
                    {formik.touched.department && formik.errors.department && (
                        <div className="text-red-500 text-sm">{formik.errors.department}</div>
                    )}

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

                    <Input
                        name="capid"
                        label="CAPID/Exam Reg No"
                        placeholder="Enter CAPID/Exam Reg No"
                        value={formik.values.capid}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.capid && formik.errors.capid && (
                        <div className="text-red-500 text-sm">{formik.errors.capid}</div>
                    )}

                    <Input
                        type="date"
                        name="dob"
                        label="Date of Birth"
                        placeholder="Enter Date of Birth"
                        value={formik.values.dob}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.dob && formik.errors.dob && (
                        <div className="text-red-500 text-sm">{formik.errors.dob}</div>
                    )}

                    {/* Image Picker */}
                    <div>

                        <Input label="Image" type="file" accept="image/*" onChange={handleFileChange} />
                        {croppedImage && (
                            <img src={croppedImage} alt="Cropped Preview" className="w-32 h-32 mt-2 aspect-square object-contain rounded" />
                        )}
                    </div>

                    <div className="!mt-4 flex justify-end">
                        <Button type="submit" className="mr-2" disabled={formik.isSubmitting}>
                            {editMode ? 'Update' : 'Submit'}
                        </Button>
                        <Button type="button" variant="ghost" onClick={handleCloseDialog}>
                            Cancel
                        </Button>
                    </div>
                </form>
                </div>
               
            </DialogContent>


            {/* Crop Dialog */}
            <Dialog open={isCropDialogOpen} onOpenChange={setIsCropDialogOpen}>
                <ImageCropper
                    image={image}
                    onSave={(croppedImage) => setCroppedImage(croppedImage)}
                    onClose={() => setIsCropDialogOpen(false)}
                />
            </Dialog>

        </Dialog>
    );
}

export default ParticipantModal;
