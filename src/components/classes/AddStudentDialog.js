import React, { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import * as message from "~/utils/validateRuleMessages";
import { LoadingButton } from "@mui/lab";

import { useDispatch } from "react-redux";
import { Dialog, DialogContent, DialogTitle, Button, Typography, TextField } from '@material-ui/core';
import httpAuthorization from "../../utils/httpAuthorization";
import endpoints from "../../constants/endpoints";
import { GlobalActions } from '../../store/global';
import { ClassesAction } from "../../store/class";

const validationSchema = Yup.object({
    fullName: Yup.string()
        .min(3, message.min('Fullname', 3))
        .required(message.required("Fullname")),
    studentId: Yup.string()
        .min(6, message.min("Student ID", 6))
        .matches(/^\d+$/, 'Student ID must be a number')
        .required(message.required("Student ID")),
});

const AddStudentDialog = (props) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const handleOnClose = () => {
        setLoading(false);
        props.onClose();
    };

    const initialValues = {
        fullName: '',
        studentId: '',
    }

    return (
        <Dialog open={props.open} onClose={handleOnClose}>
            <DialogTitle>Add Student</DialogTitle>
            <DialogContent style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={async (values) => {
                        try {
                            setLoading(true);
                            const body = {
                                courseId: props.courseId,
                                fullName: values.fullName,
                                studentId: values.studentId,
                            }

                            const result = await httpAuthorization.patch(endpoints.addStudentGrade, body);

                            if (result.status != 400) {
                                const newCourseDetail = await httpAuthorization.get(
                                    endpoints.getClassInfo(props.courseCode)
                                );
                                dispatch(GlobalActions.setSnackbarSuccess("Upload grade success"));
                                dispatch(ClassesAction.setClassInfo(newCourseDetail.data));
                                handleOnClose();
                            } else {
                                handleOnClose();
                                dispatch(GlobalActions.setSnackbarError(result.message));
                            }
                        } catch (e) {
                            console.log(e);
                            dispatch(GlobalActions.setSnackbarError("Error occured"));
                            handleOnClose();
                        }
                    }}
                >
                    {formik => (
                        <form onSubmit={formik.handleSubmit}>
                            <TextField style={{ marginTop: 10 }}
                                id='fullName'
                                error={formik.touched.fullName && Boolean(formik.errors.fullName)}
                                helperText={formik.touched.fullName && formik.errors.fullName}
                                value={formik.values.fullName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                label="Fullname" variant="outlined" fullWidth={true} />
                            <TextField style={{ marginTop: 10 }}
                                id="studentId"
                                error={formik.touched.studentId && Boolean(formik.errors.studentId)}
                                helperText={formik.touched.studentId && formik.errors.studentId}
                                value={formik.values.studentId}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                label="Student ID" variant="outlined" fullWidth={true} />
                            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 16 }}>
                                <Button variant="outlined" disableElevation onClick={handleOnClose}>
                                    Cancel
                                </Button>
                                <LoadingButton loading={loading} variant="contained" disableElevation type="submit">
                                    Confirm
                                </LoadingButton>
                            </div>
                        </form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog >
    );
}

export default AddStudentDialog;