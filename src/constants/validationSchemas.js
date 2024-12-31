import * as Yup from "yup";

export const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    department: Yup.string().required("Department is required"),
    year: Yup.string().required("Year is required"),
});

export const loginSchema = Yup.object().shape({
    // number: Yup.string()
    //     .matches(/^\d+$/, "Phone number must only contain digits") 
    //     .matches(/^\S+$/, "Phone number cannot contain spaces") // no spaces are allowed
    //     .min(10, "Phone number must be at least 10 digits")
    //     .max(15, "Phone number must be no more than 15 digits")
    //     .required("Phone No is required"),
    email: Yup.string()
        .email("Invalid email")
        .required("Email is required"),
    password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
});


export const repValidationSchema = (editMode) =>
    Yup.object({
        name: Yup.string().required("Name is required"),
        gender: Yup.string().required("Gender is required"),
        number: Yup.string()
            .matches(/^[0-9]+$/, "Phone number must only contain digits")
            .min(10, "Phone number must be at least 10 digits")
            .max(15, "Phone number must be no more than 15 digits")
            .required("Phone No is required"),
        password: editMode
            ? Yup.string() // No validation if in editMode
            : Yup.string()
                .required("Password is required")
                .min(6, "Password must be at least 6 characters"),
        department: Yup.string().required("Department is required"),
        year_of_study: Yup.string().required("Year is required"),
    });

export const collegeValidationSchema = (editMode, updatePassword) =>
    Yup.object({
        name: Yup.string().required("Name is required"),
        phoneNumber: Yup.string()
            .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
            .required("Phone number is required"),
        email: Yup.string()
            .email("Invalid email address")  // Built-in email validation
            .required("Email is required"),
        password: editMode && !updatePassword
            ? Yup.string()
            : Yup.string()
                .required("Password is required")
                .min(6, "Password must be at least 6 characters"),
        confirmPassword: editMode && !updatePassword
            ? Yup.string()
            : Yup.string()
                .required("Confirm Password is required")
                .oneOf([Yup.ref("password"), null], "Passwords must match"),

    });

export const participantValidationSchema = (editMode) =>
    Yup.object({
        name: Yup.string().required("Name is required"),
        gender: Yup.string().required("Gender is required"),
        course: Yup.string().required("Course is required"),
        phoneNumber: Yup.string()
            .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
            .required("Phone number is required"),
        semester: Yup.string().required("Semster is required"),
        year_of_study: Yup.string().required("Year is required"),
        dob: Yup.date()
            .required("Date of Birth is required")
            .min(new Date("2000-07-01"), "Must be after July 1, 2000")
            .max(new Date(), "Must be before today"),
        capId: Yup.string().required("Cap ID is required"),
    });

export const eventTypeValidationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    // participant_count: Yup.number()
    //     .required('Participants count is required')
    //     .typeError('Participants count must be a number')
    //     .positive('Participants count must be a positive number')
    //     .integer('Participants count must be a whole number')
    //     .when('is_group', {
    //         is: true,
    //         then: (schema) =>
    //             schema
    //                 .min(2, 'Participants count must be at least 2'),
    //         otherwise: (schema) =>
    //             schema
    //                 .min(1, 'Participants count must be at least 1'),
    //     }),
    // helper_count: Yup.string().required('Helper count is required'),

    scores: Yup.object({
        first: Yup.number()
            .required('First place score is required')
            .positive('Must be a positive number')
            .integer('Must be an integer')
            .min(1, 'Score must be at least 1'),

        second: Yup.number()
            .required('Second place score is required')
            .positive('Must be a positive number')
            .integer('Must be an integer')
            .test(
                'is-less-than-first',
                'Second place score must be lower than the first place score',
                function (value) {
                    const { first } = this.parent; // Access sibling field
                    return value < first; // Validate second < first
                }
            )
        ,

        third: Yup.number()
            .required('Third place score is required')
            .positive('Must be a positive number')
            .integer('Must be an integer')
            .test(
                'is-less-than-second',
                'Thrid place score must be lower than the second place score',
                function (value) {
                    const { second } = this.parent; // Access sibling field
                    return value < second; // Validate second < Second
                }
            )
        ,
    })
});

export const eventValidationSchema = (editMode) => Yup.object({
    name: Yup.string().required("Name is required"),
    event_type: editMode ? Yup.string() : Yup.string().required("Event Type is required"),
    event_category: editMode ? Yup.string() : Yup.string().required("Event Category is required"),
    min_participants: editMode
        ? Yup.string()
        : Yup.number()
            .typeError('Min Participants must be a number')  // Ensures the value is a number
            .required("Min Participants is required")
            .positive("Min Participants must be a positive number")  // Optional: to ensure positive values
            .integer("Min Participants must be an integer"),  // Optional: to enforce integer values

    max_participants: editMode
        ? Yup.string()
        : Yup.number()
            .typeError('Max Participants must be a number')  // Ensures the value is a number
            .required("Max Participants is required")
            .positive("Max Participants must be a positive number")  // Optional: to ensure positive values
            .integer("Max Participants must be an integer")  // Optional: to enforce integer values
            .test(
                "is-less-than-or-equal",
                "Max Participants must be greater than or equal to Min Participants",
                function (value) {
                    const { min_participants } = this.parent;
                    return value >= min_participants;
                }
            ),

    result_category: editMode ? Yup.string() : Yup.string().required("Result Category is required"),
});



export const eventRegistrationSchema = Yup.object().shape({
    event: Yup.string()
        .transform((value) => (value ? String(value).trim() : ''))
        .required('Event selection is required'),


    participants: Yup.array()
        .of(
            Yup.object().shape({
                user: Yup.string()
                    .required('Participant selection is required')
                    .trim()
            })
        )
        .min(1, 'At least one participant is required')
        .max(10, 'Maximum 10 participants allowed')
        .required('Participants are required')
})

export const resultValidationSchema = Yup.object({
    event: Yup.string().required("Event is required"),
    // event_type: Yup.string().required("Event Type is required"),
    // date: Yup.string().required("Date is required"),
});
