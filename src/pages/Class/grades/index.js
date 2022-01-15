import {
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Dialog,
  TextField,
  TableHead,
  TableRow,
  Typography,
  Button,
  CircularProgress,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from "@material-ui/core";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import ClassLayout from "../../../components/layout/ClassLayout";
import { imageUrlFormatter } from "~/utils/stringUtils";
import { ExportExcel } from "../../../components/common/ExportExcel";
import { useState } from "react";
import { ClassesAction } from "../../../store/class";
import http from "../../../utils/httpAuthorization";
import { Add, FileUpload, MoreVert, Preview, Tour } from "@mui/icons-material";
import FileSaver from "file-saver";
import endpoints from "../../../constants/endpoints";
import { GlobalActions } from "../../../store/global";
import httpAuthorization from "~/utils/httpAuthorization";
import AddStudentDialog from "../../../components/classes/AddStudentDialog";

const StudentDialog = ({ open, handleClose, data, student }) => {
  const [point, setPoint] = useState("");
  const [explanation, setExplanation] = useState("");
  const { info } = useSelector((state) => state.classes);
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const dispatch = useDispatch();
  const gradeData = student?.grades?.find(
    (grade) => grade.gradeComponentId == data?._id
  );
  React.useEffect(() => {
    (async () => {
      setLoading(true);
      const response = await http.get(
        endpoints.getRequestStatus(info._id, data._id)
      );
      if (response.data) {
        setRequest(response.data);
      }
      setLoading(false);
    })();
  }, []);

  return (
    <Dialog
      open={open}
      onClose={() => {
        handleClose();
      }}
      maxWidth="xs"
      fullWidth
    >
      <Box
        style={{
          padding: "16px 16px 0px",
        }}
      >
        <Typography className="sb">{`Review ${data.name}'s grade : ${
          gradeData?.point || "-"
        } points`}</Typography>
      </Box>
      {request && (
        <>
          <Box
            style={{
              padding: "16px 16px 0",
              paddingBottom: request?.status == "pending" ? "16px" : "0",
            }}
          >
            <Typography>Your current request</Typography>
            <Box
              style={{
                border: `1px solid ${
                  request.status == "accepted"
                    ? "#66bb6a"
                    : request.status == "rejected"
                    ? "#f44336"
                    : "#ffa726"
                }`,
                color:
                  request.status == "accepted"
                    ? "#66bb6a"
                    : request.status == "rejected"
                    ? "#f44336"
                    : "#ffa726",
                borderRadius: 8,
              }}
            >
              <Box
                p={2}
                style={{
                  ...(request.status != "pending"
                    ? {
                        borderBottom: `1px solid ${
                          request.status == "accepted"
                            ? "#66bb6a"
                            : request.status == "rejected"
                            ? "#f44336"
                            : "#ffa726"
                        }`,
                      }
                    : {
                        border: `1px solid ${
                          request.status == "accepted"
                            ? "#66bb6a"
                            : request.status == "rejected"
                            ? "#f44336"
                            : "#ffa726"
                        }`,
                      }),

                  color:
                    request.status == "accepted"
                      ? "#66bb6a"
                      : request.status == "rejected"
                      ? "#f44336"
                      : "#ffa726",
                  borderRadius: 8,
                }}
                className="df jcsb"
              >
                <Box>
                  <Typography>Point: {request.expectedGrade}</Typography>
                  <Typography
                    style={{ maxWidth: 200 }}
                    className="one-line-text"
                  >
                    Explaination: {request.explanation}
                  </Typography>
                </Box>
                <Box className="df aic jcc sb">{request.status}</Box>
              </Box>
              {request.status != "pending" && (
                <Box p={2}>
                  {request.status == "accepted" && (
                    <Typography>Final Grade: {request.finalGrade}</Typography>
                  )}
                  <Typography>Comment: {request.comment}</Typography>
                </Box>
              )}
            </Box>
          </Box>
        </>
      )}
      {loading ? (
        <Box className="df aic jcc fdc" p={3}>
          <CircularProgress />
          <Typography>Loading</Typography>
        </Box>
      ) : (
        <>
          {!(request?.status == "pending") && (
            <Box className="df fdc" p={2}>
              <Typography>Review new request</Typography>
              <TextField
                label="Expected point"
                variant="outlined"
                margin="dense"
                type="number"
                value={point}
                onChange={(e) => {
                  setPoint(e.target.value);
                }}
              ></TextField>
              <TextField
                multiline
                style={{ marginTop: 16 }}
                rows={3}
                placeholder="Your reason here"
                label="Explanation"
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
              ></TextField>
              <Box
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "end",
                }}
                mt={1}
              >
                {sending && (
                  <Box mr={2} className="df aic">
                    <Typography variant="body2" color="textSecondary">
                      Sending request...
                    </Typography>
                  </Box>
                )}
                <Button
                  onClick={async () => {
                    try {
                      setSending(true);
                      await http.post(endpoints.requestReview, {
                        courseId: info._id,
                        gradeComponentId: data._id,
                        expectedGrade: point,
                        explanation: explanation,
                      });
                      dispatch(
                        GlobalActions.setSnackbarSuccess(
                          "Request sent successfully!"
                        )
                      );
                      handleClose();
                      setSending(false);
                    } catch (error) {
                      setSending(false);
                      dispatch(GlobalActions.setSnackbarError(error));
                    }
                  }}
                >
                  Send request
                </Button>
              </Box>
            </Box>
          )}
        </>
      )}
    </Dialog>
  );
};

const ReviewDialog = ({ open, handleClose, data, student }) => {
  const { info } = useSelector((state) => state.classes);
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const dispatch = useDispatch();
  const [point, setPoint] = useState("");
  const [comment, setComment] = useState("");

  React.useEffect(() => {
    (async () => {
      setLoading(true);
      const response = await http.get(
        endpoints.getRequestStatus(info._id, data._id, student.studentId)
      );
      if (response.data) {
        setRequest(response.data);
      }
      setLoading(false);
    })();
  }, []);
  return (
    <Dialog open={open} onClose={() => handleClose()} maxWidth="xs" fullWidth>
      <Box p={2} className="df fdc">
        <Box>
          <Typography className="sb">
            Review {student.fullName}'s grade on {data.name}
          </Typography>
        </Box>
        {loading ? (
          <Box className="df aic jcc fdc" p={3}>
            <CircularProgress />
            <Typography>Loading</Typography>
          </Box>
        ) : (
          <>
            <Box className="df">
              <Typography className="sb">
                Expected Point: {request?.expectedGrade}
              </Typography>
            </Box>
            <Typography className="sb df" style={{ wordBreak: "break-word" }}>
              Reason: <Typography> {request?.explanation}</Typography>
            </Typography>
            <Box className="df fdc" mt={2}>
              <Typography>Grading</Typography>
              <TextField
                label="Point"
                variant="outlined"
                margin="dense"
                type="number"
                value={point}
                onChange={(e) => {
                  setPoint(e.target.value);
                }}
              ></TextField>
              <TextField
                multiline
                style={{ marginTop: 16 }}
                rows={3}
                placeholder="Your comment here"
                label="Comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></TextField>
            </Box>
          </>
        )}
      </Box>
      <Box className="df aic" style={{ justifyContent: "end" }} p={2}>
        {sending && <Typography color="textSecondary">Reviewing...</Typography>}
        <Button
          variant="outlined"
          style={{ marginRight: 16 }}
          onClick={async () => {
            if (!comment) {
              dispatch(
                GlobalActions.setSnackbarError("Comment can't be empty")
              );
              return;
            }
            try {
              setSending(true);
              await http.post(endpoints.rejectRequest, {
                courseId: info._id,
                gradeComponentId: data._id,
                comment,
                userRequestId: request.userRequestId,
              });
              dispatch(GlobalActions.setSnackbarSuccess("Review Rejected"));
              handleClose();
              setSending(false);
            } catch (error) {
              setSending(false);
              dispatch(GlobalActions.setSnackbarError(error.message));
            }
          }}
        >
          Decline
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={async () => {
            if (!point) {
              dispatch(GlobalActions.setSnackbarError("Point can't be empty"));
              return;
            }
            try {
              setSending(true);
              await http.post(endpoints.acceptRequest, {
                courseId: info._id,
                gradeComponentId: data._id,
                grade: point,
                comment,
                userRequestId: request.userRequestId,
              });
              dispatch(GlobalActions.setSnackbarSuccess("Review accepted"));
              setSending(false);
              handleClose();
            } catch (error) {
              setSending(false);
              dispatch(GlobalActions.setSnackbarError(error.message));
            }
          }}
        >
          Accept
        </Button>
      </Box>
    </Dialog>
  );
};

const TableItem = ({ student }) => {
  const { info } = useSelector((state) => state.classes);
  const { user } = useSelector((state) => state.auth);
  const [hover, setHover] = useState(false);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(null);
  const [openStudent, setOpenStudent] = useState(null);
  const [openReview, setOpenReview] = useState(null);
  const [value, setValue] = useState(0);

  const columnToShow =
    user._id == info?.owner._id
      ? info?.gradeStructure || []
      : (info?.gradeStructure || []).filter(
          (structure) => structure.isFinalized
        );

  React.useEffect(() => {
    if (open != null) {
      setValue(
        student.grades.find((grade) => grade.gradeComponentId == open._id)
          ?.point || 0
      );
    }
  }, [open]);

  return (
    <>
      <TableRow
        style={{
          background: hover ? "#e3f2fd" : "transparent",
          transition: "background 0.5s ease",
        }}
        onMouseEnter={() => {
          if (student.studentId) setHover(true);
        }}
        onMouseLeave={() => {
          if (student.studentId) setHover(false);
        }}
      >
        <TableCell style={{}}>
          <Box
            className="df aic"
            style={{
              minHeight: 52,
            }}
          >
            <Avatar
              src={
                student.avatar ? imageUrlFormatter(student.avatar) : "not-exist"
              }
            ></Avatar>
            <Box width={12} />
            <Box className="df fdc">
              <Typography className="sb">{student.fullName}</Typography>
              {hover && (
                <Typography
                  variant="body2 one-line-text"
                  style={{ maxWidth: 145 }}
                >
                  {student.studentId}
                </Typography>
              )}
            </Box>
          </Box>
        </TableCell>
        {columnToShow.map((item) => {
          const data = student?.grades?.find(
            (grade) => grade.gradeComponentId == item?._id
          );

          return (
            <TableCell
              style={{ cursor: "pointer" }}
              onClick={() => {
                if (
                  data?.inReview &&
                  (user._id == info.owner._id ||
                    info.teachers
                      .map((teacher) => teacher._id)
                      .includes(user._id))
                ) {
                  setOpenReview(item);
                  return;
                }
                if (
                  user._id == info.owner._id ||
                  info.teachers.map((teacher) => teacher._id).includes(user._id)
                ) {
                  setOpen(item);
                  return;
                }
                if (data?.point) {
                  setOpenStudent(item);
                }
              }}
            >
              {data?.point || "-"}
              {data?.inReview && <Tour />}
            </TableCell>
          );
        })}
        <TableCell>
          {student?.grades
            ?.map((item) => item.point)
            .reduce((a, b) => Number(a) + Number(b), 0)}
        </TableCell>
      </TableRow>
      {!!open && (
        <Dialog
          maxWidth="md"
          open={!!open}
          onClose={() => {
            setOpen(null);
          }}
        >
          <Box className="df fdc" p={3}>
            <Typography className="sb">{`Edit  ${student.fullName}'s ${open.name} point`}</Typography>
            <TextField
              style={{ marginTop: 16 }}
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
              }}
              type="number"
              variant="outlined"
            />
            <Box className="df " mt={3} style={{ justifyContent: "end" }}>
              <Button
                variant="outlined"
                onClick={() => {
                  setOpen(null);
                }}
              >
                Cancel
              </Button>
              <Box width={16} />
              <Button
                color="primary"
                variant="contained"
                onClick={(e) => {
                  if (Number(value) > open.point) {
                    dispatch(
                      GlobalActions.setSnackbarError(
                        `Max point of ${open.name} is ${open.point}`
                      )
                    );
                  } else if (Number(value) < 0) {
                    dispatch(
                      GlobalActions.setSnackbarError(
                        `Point of ${open.name} must not be negative`
                      )
                    );
                  } else {
                    dispatch(
                      ClassesAction.changeStudentPoint({
                        ...student,
                        point: value,
                        gradeComponentId: open?._id,
                      })
                    );
                    dispatch(
                      GlobalActions.setSnackbarSuccess("Set point success!")
                    );
                    setOpen(null);
                  }
                }}
              >
                Confirm
              </Button>
            </Box>
          </Box>
        </Dialog>
      )}
      {!!openReview && (
        <ReviewDialog
          open={!!openReview}
          handleClose={() => {
            setOpenReview(null);
          }}
          data={openReview}
          student={student}
        />
      )}
      {!!openStudent && (
        <StudentDialog
          student={student}
          open={!!openStudent}
          handleClose={() => {
            setOpenStudent(null);
          }}
          data={openStudent}
        />
      )}
    </>
  );
};

const HeadItem = ({ item, setLoading }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { info } = useSelector((state) => state.classes);
  const { user } = useSelector((state) => state.auth);
  const inputRef = React.useRef(null);
  const dispatch = useDispatch();
  const open = Boolean(anchorEl);
  const [errors, setErrors] = React.useState([]);
  const [openErrs, setOpenErrs] = React.useState(false);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCloseErrs = () => {
    setOpenErrs(false);
  };

  const upload = async (e) => {
    try {
      setErrors([]);
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("csvFile", file);
      formData.append("courseId", info?._id);
      formData.append("gradeComponentId", item._id);
      e.target.value = null;
      const result = await http.put("/api/grade/upload-grades", formData);
      setErrors(result.data.errors);
      if (result.data.errors.length > 0) {
        setOpenErrs(true);
      }
      const newCourseDetail = await http.get(
        endpoints.getClassInfo(info?.code)
      );
      dispatch(GlobalActions.setSnackbarSuccess("Upload grade success"));
      dispatch(ClassesAction.setClassInfo(newCourseDetail.data));
    } catch (err) {
      console.log(err);
      dispatch(GlobalActions.setSnackbarError("Error occured"));
    }
  };

  return (
    <>
      <Dialog onClose={handleCloseErrs} open={openErrs}>
        <DialogTitle>Error rows</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <ul>
              {errors.map(function (error, index) {
                return <li key={index}>{error}</li>;
              })}
            </ul>
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <TableCell style={{ minWidth: 175 }}>
        <Box className="df jcsb aic">
          <Box className="df fdc">
            <Typography className="sb">{`${item.name} ${
              item.isFinalized ? "(*)" : ""
            }`}</Typography>
            <Typography>{`${item.point} points`}</Typography>
          </Box>
          {user._id == info?.owner._id && (
            <IconButton onClick={(event) => setAnchorEl(event.currentTarget)}>
              <MoreVert />
            </IconButton>
          )}
        </Box>
      </TableCell>
      <input
        style={{ display: "none" }}
        ref={inputRef}
        onChange={upload}
        type="file"
        accept=".csv"
      />
      {open && (
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={() => {
            handleClose();
          }}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem
            onClick={async () => {
              setLoading(true);

              try {
                const template = await http.get(
                  `/api/grade/grade-template?courseId=${info?._id}&gradeComponentId=${item._id}`
                );
                var blob = new Blob([template], {
                  type: "text/csv;charset=utf-8",
                });
                FileSaver.saveAs(blob, item.name + ".csv");
                handleClose();
              } catch (error) {
                dispatch(GlobalActions.setSnackbarError(error.message));
              }
              setLoading(false);
            }}
          >
            Download Template
          </MenuItem>
          <MenuItem
            onClick={(e) => {
              inputRef.current?.click();

              handleClose();
            }}
          >
            Upload
          </MenuItem>
          <MenuItem
            onClick={async () => {
              setLoading(true);

              try {
                if (!item.isFinalized) {
                  const result = await http.patch(
                    `/api/grade/finalize-column`,
                    {
                      courseId: info?._id,
                      gradeComponentId: item._id,
                    }
                  );
                  dispatch(
                    ClassesAction.finalizeUpdate({
                      enrolledStudents: result.data.enrolledStudents,
                      gradeStructure: result.data.gradeStructure,
                    })
                  );
                  dispatch(
                    GlobalActions.setSnackbarSuccess("Finalize Success")
                  );
                } else {
                  const result = await http.patch(
                    `/api/grade/unfinalize-column`,
                    {
                      courseId: info?._id,
                      gradeComponentId: item._id,
                    }
                  );
                  dispatch(
                    ClassesAction.finalizeUpdate({
                      enrolledStudents: result.data.enrolledStudents,
                      gradeStructure: result.data.gradeStructure,
                    })
                  );
                  dispatch(
                    GlobalActions.setSnackbarSuccess("Unfinalize Success")
                  );
                }
                handleClose();
              } catch (error) {
                dispatch(GlobalActions.setSnackbarError(error.message));
              }
              setLoading(false);
            }}
          >
            {`${item.isFinalized ? "Unfinalize" : "Finalize"}`}
          </MenuItem>
          <MenuItem
            onClick={async () => {
              setLoading(true);
              try {
                const result = await http.put(`/api/grade/finalize-grades`, {
                  courseId: info?._id,
                  gradeComponentId: item._id,
                  listPoints: info?.enrolledStudents
                    .filter((student) =>
                      student.grades.find(
                        (grade) => grade.gradeComponentId == item._id
                      )
                    )
                    .map((student) => {
                      return {
                        studentId: student.studentId,
                        point: student.grades.find(
                          (grade) => grade.gradeComponentId == item._id
                        ).point,
                      };
                    }),
                });
                dispatch(
                  GlobalActions.setSnackbarSuccess("Return all Success")
                );
                handleClose();
              } catch (error) {
                dispatch(GlobalActions.setSnackbarError(error.message));
              }
              setLoading(false);
            }}
          >
            Return all
          </MenuItem>
        </Menu>
      )}
    </>
  );
};

const GradePage = () => {
  const { info } = useSelector((state) => state.classes);
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const inputRef = React.useRef(null);
  const [errors, setErrors] = React.useState([]);
  const dispatch = useDispatch();
  const [openErrs, setOpenErrs] = React.useState(false);
  const [openAddStudentDialog, setOpenAddStudentDialog] = useState(false);

  const handleCloseErrs = () => {
    setOpenErrs(false);
  };

  const handeCloseAddStudentDialog = () => {
    setOpenAddStudentDialog(false);
  };

  const handleOpenAddStudentDialog = () => {
    setOpenAddStudentDialog(true);
  };

  const columnToShow =
    user._id == info?.owner._id
      ? info?.gradeStructure || []
      : (info?.gradeStructure || []).filter(
          (structure) => structure.isFinalized
        );

  const uploadStudentList = async (e) => {
    try {
      setErrors([]);
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("csvFile", file);
      formData.append("courseId", info?._id);
      e.target.value = null;
      const result = await http.put("/api/grade/upload-student-list", formData);
      setErrors(result.data.errors);
      console.log("result", result);
      if (result.data.errors.length > 0) {
        setOpenErrs(true);
      }
      const newCourseDetail = await http.get(
        endpoints.getClassInfo(info?.code)
      );
      dispatch(GlobalActions.setSnackbarSuccess("Upload grade success"));
      dispatch(ClassesAction.setClassInfo(newCourseDetail.data));
    } catch (err) {
      console.log(err);
      dispatch(GlobalActions.setSnackbarError("Error occured"));
    }
  };

  return (
    <ClassLayout maxWidth={"md"} customLoading={loading}>
      <Dialog onClose={handleCloseErrs} open={openErrs}>
        <DialogTitle>Error rows</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <ul>
              {errors.map(function (error, index) {
                return <li key={index}>{error}</li>;
              })}
            </ul>
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <AddStudentDialog
        open={openAddStudentDialog}
        onClose={handeCloseAddStudentDialog}
        courseId={info?._id}
        courseCode={info?.code}
      />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {user._id == info?.owner._id && (
          <Box
            className="df aic "
            style={{ justifyContent: "end", cursor: "pointer" }}
            mt={2}
            onClick={() => {
              inputRef.current?.click();
            }}
          >
            <label
              htmlFor="choose-file"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <input
                style={{ display: "none" }}
                type="file"
                type="file"
                accept=".csv"
                id="choose-file"
                onChange={uploadStudentList}
              />
              <Button variant="outlined" component="span">
                Upload student list
              </Button>
            </label>
          </Box>
        )}
        {user._id == info?.owner._id && (
          <Box
            className="df"
            style={{ justifyContent: "end", cursor: "pointer" }}
            mt={2}
          >
            <ExportExcel
              fileName="ClassMember"
              title="Template"
              preLoad={async () => {
                return await httpAuthorization.get(
                  "/api/grade/student-list-template"
                );
              }}
            />
          </Box>
        )}
      </div>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ minWidth: 200 }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  {user._id == info?.owner._id && (
                    <Box
                      className="df aic "
                      style={{ justifyContent: "end", cursor: "pointer" }}
                      onClick={() => {
                        inputRef.current?.click();
                      }}
                    >
                      <IconButton
                        aria-label="delete"
                        size="small"
                        onClick={handleOpenAddStudentDialog}
                      >
                        <Add fontSize="inherit" />
                      </IconButton>
                    </Box>
                  )}
                  Student name
                </div>
              </TableCell>
              {columnToShow.map((item) => {
                return (
                  <HeadItem
                    item={item}
                    key={item._id}
                    setLoading={setLoading}
                  />
                );
              })}
              <TableCell style={{ minWidth: 175 }}>
                <Box className="df fdc">
                  <Typography className="sb">Total Grade</Typography>
                  <Typography>{`${info?.gradeStructure
                    .map((item) => item.point)
                    .reduce(
                      (a, b) => Number(a) + Number(b),
                      0
                    )} points`}</Typography>
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {info?.enrolledStudents?.map((student) => {
              return <TableItem key={student?._id} student={student} />;
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {
        <Box className="df " style={{ justifyContent: "end" }}>
          <Box
            className="df"
            style={{ justifyContent: "end", cursor: "pointer" }}
            mt={2}
          >
            <ExportExcel
              fileName="GradeTable"
              data={[
                [
                  "Name",
                  "StudentId",
                  ...(info?.gradeStructure || []).map(
                    (item) => `${item.name} : ${item.point}`
                  ),
                  `Total Grade: ${info?.gradeStructure
                    .map((item) => item.point)
                    .reduce((a, b) => Number(a) + Number(b), 0)}`,
                ],
                ...(info?.enrolledStudents || []).map((student) => [
                  student.fullName,
                  student.studentId,
                  ...(info?.gradeStructure || []).map(
                    (item) =>
                      student?.grades?.find(
                        (grade) => grade.gradeComponentId == item._id
                      )?.point || "-"
                  ),
                  student?.grades
                    .map((item) => item.point)
                    .reduce((a, b) => Number(a) + Number(b), 0),
                ]),
              ]}
            />
          </Box>
        </Box>
      }
    </ClassLayout>
  );
};

export default GradePage;
