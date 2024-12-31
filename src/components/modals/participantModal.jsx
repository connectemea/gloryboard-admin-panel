import React, { useContext, useRef, useState } from "react";
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
import { Pencil, Plus } from "lucide-react";
import { useModel } from "@/hooks/useModel";
import {
  departmentOptions,
  genderOptions,
  semesterOptions,
  yearOptions,
} from "@/constants/options";
import { participantValidationSchema } from "@/constants/validationSchemas";
import { participantInitalValue } from "@/constants/initalValue";
import SelectInput from "../common/SelectInput";
import {
  useCreateUser,
  useUpdateUser,
} from "@/services/mutation/userMutations";
// import { DepartmentOptionsContext } from '@/context/departmentContext';
import { AuthContext } from "@/context/authContext";
import ImageCropper from "../ImageCropper";
import { toast } from "sonner";

function ParticipantModal({ editMode = false, initialData = {} }) {
  const { isOpen, openModal, closeModal } = useModel();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleCloseDialog = () => {
    formik.resetForm();
    closeModal();
    setImage(null);
    setCroppedImage(null);
    setShowImgError(false);
  };
  const { mutate: createUser } = useCreateUser(handleCloseDialog,setIsSubmitting);
  const { mutate: updateUser } = useUpdateUser(handleCloseDialog,setIsSubmitting);

  const { auth } = useContext(AuthContext);
  // const { data } = useContext(DepartmentOptionsContext);

  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [isCropDialogOpen, setIsCropDialogOpen] = useState(false);
  const [showImgError, setShowImgError] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileSizeInMB = file.size / (1024 * 1024); // Convert bytes to MB
      if (fileSizeInMB > 1) {
        toast.warning(
          "The selected file is larger than 1MB. Please choose a smaller file."
        );
        event.target.value = "";
        return; // Stop further processing
      }

      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
        setIsCropDialogOpen(true); // Open crop dialog after selecting an image
      };
      reader.readAsDataURL(file);
    }
  };



  const formik = useFormik({
    initialValues: editMode
      ? {
        ...participantInitalValue,
        ...initialData,
        year_of_study: String(initialData.year_of_study),
        semester: String(initialData.semester),
        phoneNumber: String(initialData.phoneNumber),
        capId: String(initialData.capId),
        dob: initialData.dob
          ? new Date(initialData.dob).toISOString().split("T")[0]
          : "",
      }
      : participantInitalValue,
    validationSchema: participantValidationSchema,
    validateOnBlur: false,
    onSubmit: (values) => {
      setIsSubmitting(true);
      console.log(editMode ? "Updated Data:" : "New Data:", values);

      // editMode ? updateUser(values) : createUser({ ...values, user_type: 'member' });
      editMode
        ? updateUser(values)
        : createUser({ ...values, user_type: "member", image: croppedImage });

    },
  });


  const handleFormValidation = () => {
    formik.validateForm();
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!editMode && !croppedImage) {
      setShowImgError(true);
      handleFormValidation();
      return;
    } else {
      setShowImgError(false);
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
        <DialogHeader>
          <DialogTitle>
            {editMode ? "Edit Record" : "Add New Participant"}
          </DialogTitle>
          <DialogDescription>
            {editMode
              ? "Update the details of the record."
              : "Please fill out the form to create a new participant."}
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto  px-1">
          <form onSubmit={handleSubmit} className="space-y-2">
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

            <Input
              name="course"
              label="Course Name"
              placeholder="Enter Course Name"
              value={formik.values.course}
              onChange={formik.handleChange}
              onBlur={(e) => {
                const value = e.target.value;
                formik.setFieldValue(
                  "course",
                  value.charAt(0).toUpperCase() + value.slice(1) // Capitalize the first letter
                );
                formik.handleBlur(e);
              }}
            />
            {formik.touched.course && formik.errors.course && (
              <div className="text-red-500 text-sm">{formik.errors.course}</div>
            )}
            <span className="italic text-gray-500 text-xs ">
              example: BSC Computer Science
            </span>

            {/* <SelectInput
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
                    )} */}

            <div className="flex gap-2">
              <div className="w-1/2">
                <SelectInput
                  label="Year"
                  name="year_of_study"
                  value={formik.values.year_of_study.toString()}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  options={yearOptions}
                />
                {formik.touched.year_of_study &&
                  formik.errors.year_of_study && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.year_of_study}
                    </div>
                  )}
              </div>

              <div className="w-1/2">
                <SelectInput
                  label="Semster"
                  name="semester"
                  value={formik.values.semester}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  options={semesterOptions}
                />
                {formik.touched.semester && formik.errors.semester && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.semester}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <div className="w-1/2">
                <SelectInput
                  label="Gender"
                  name="gender"
                  value={formik.values.gender}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  options={genderOptions}
                />
                {formik.touched.gender && formik.errors.gender && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.gender}
                  </div>
                )}
              </div>
              <div className="w-1/2">
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
                  <div className="text-red-500 text-sm">
                    {formik.errors.dob}
                  </div>
                )}
              </div>
            </div>

            <Input
              name="phoneNumber"
              label="Phone No"
              placeholder="Enter phone no"
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.phoneNumber && formik.errors.phoneNumber && (
              <div className="text-red-500 text-sm">
                {formik.errors.phoneNumber}
              </div>
            )}

            <Input
              name="capId"
              label="CAPID/Exam Reg No"
              placeholder="Enter CAPID/Exam Reg No"
              value={formik.values.capId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.capId && formik.errors.capId && (
              <div className="text-red-500 text-sm">{formik.errors.capId}</div>
            )}

            {/* Image Picker */}

            {!editMode && (
              <div className="flex flex-col gap-2">
                <Input
                  className="hidden"
                  label="Image"
                  id="fileInput"
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={handleFileChange}
                />
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => {
                    document.getElementById("fileInput").click();
                  }}
                >
                  Upload Image
                </Button>
                <span className="italic text-gray-500 text-xs ">
                  The image must be under 1MB and a clear, face-view portrait.
                </span>
                {croppedImage && (
                  <img
                    src={croppedImage}
                    alt="Cropped Preview"
                    className="w-32 h-32 mt-2 object-contain rounded"
                  />
                )}
                {showImgError && (
                  <div className="text-red-500 text-sm">Image is required</div>
                )}
              </div>
            )}

            <div className="!mt-4 flex justify-end">
              <Button
                type="submit"
                className="mr-2"
                disabled={isSubmitting}
              >
                {editMode ? "Update" : "Submit"}
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
          onSave={(croppedImage) => {
            setCroppedImage(croppedImage);
            setShowImgError(false);
          }}
          onClose={() => setIsCropDialogOpen(false)}
        />
      </Dialog>
    </Dialog>
  );
}

export default ParticipantModal;
