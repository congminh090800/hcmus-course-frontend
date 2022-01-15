// eslint-disable-next-line import/no-anonymous-default-export
export default {
  signIn: "/api/signin",
  signUp: "/api/signup",
  createAdmin: "/api/createAdmin",
  createCourse: "/api/courses",
  getCourses: "/api/courses",
  getMyCourses: "/api/courses/me",
  getMyInfo: "/api/user/me",
  getUserInfo: (id) => `/api/user/${id}`,
  participateCourse: (codeRoom) => `/api/courses/participate/${codeRoom}`,
  uploadCover: "/api/upload/upload-cover",
  getClassInfo: (code) => `/api/courses/me/${code}`,
  refreshToken: "/api/refreshToken",
  googleSignIn: "/api/google-signin",
  uploadAvatar: "/api/upload/upload-avatar",
  sendStudent: "api/courses/invite/email/send",
  sendTeacher: "/api/courses/invite/email/send-teachers",
  studentAccept: (code) => `/api/courses/invite/${code}`,
  teacherAccept: (code) => `/api/courses/invite/teacher/${code}`,
  updateInformation: "/api/user",
  sendMappingRequest: "/api/courses/mapping/request",
  findStudentMapping: (courseId) => `/api/courses/mapping/find/${courseId}`,
  createStructure: "/api/courses/grade",
  setStudentId: "/api/user/student-id",
  getRequestStatus: (courseId, gradeComponentId, studentId = "") =>
    `/api/grade/request-status?courseId=${courseId}&gradeComponentId=${gradeComponentId}${
      studentId ? "&studentId=" + studentId : ""
    }`,
  requestReview: "/api/grade/request-review",
  acceptRequest: "/api/grade/accept-request",
  rejectRequest: "/api/grade/reject-request",
};
