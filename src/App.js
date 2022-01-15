import Login from "~/pages/Login";
import Dashboard from "~/pages/Dashboard";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import AuthRoute from "~/components/common/AuthRoute";
import UploadButtons from "./components/classes/UploadButton";
import ClassPage from "./pages/Class";
import ClassMemberPage from "./pages/Class/member";
import SignUp from "~/pages/SignUp";
import Profile from "./pages/Profile";
import { useDispatch, useSelector } from "react-redux";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { GlobalActions } from "./store/global";
import ParticipatingCoursePage from "./pages/courses/participate";
import TeacherParticipatingCoursePage from "./pages/courses/teacher";
import ClassWorkPage from "./pages/Class/classwork";
import GradePage from "./pages/Class/grades";
import VerifyEmailPage from "./pages/verify-email";

function App() {
  const { snackbarSuccess, snackbarError } = useSelector(
    (state) => state.global
  );

  const dispatch = useDispatch();
  return (
    <Router>
      <div className="App">
        <Switch>
          <AuthRoute exact path={["/", "/classes"]}>
            <Dashboard />
          </AuthRoute>
          <AuthRoute path="/classes/:code" exact>
            <ClassPage />
          </AuthRoute>
          <AuthRoute path="/classes/:code/classwork" exact>
            <ClassWorkPage />
          </AuthRoute>
          <AuthRoute path="/classes/:code/grades" exact>
            <GradePage />
          </AuthRoute>

          <AuthRoute path="/classes/:code/member">
            <ClassMemberPage />
          </AuthRoute>
          <AuthRoute path="/profile">
            <Profile />
          </AuthRoute>
          <AuthRoute path="/courses/participate/:code" exact>
            <ParticipatingCoursePage />
          </AuthRoute>
          <AuthRoute path="/courses/teacher/:code" exact>
            <TeacherParticipatingCoursePage />
          </AuthRoute>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/signup">
            <SignUp />
          </Route>
          <Route path="/verify-email/:userId">
            <VerifyEmailPage />
          </Route>
        </Switch>
        {!!snackbarSuccess && (
          <Snackbar
            open={!!snackbarSuccess}
            autoHideDuration={6000}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            onClose={(event, reason) => {
              if (reason === "clickaway") {
                return;
              }
              dispatch(GlobalActions.setSnackbarSuccess(null));
              // setOpen(false);
            }}
          >
            <Alert
              onClose={() => {
                dispatch(GlobalActions.setSnackbarSuccess(null));
              }}
              severity="success"
              sx={{ width: "100%" }}
            >
              {snackbarSuccess}
            </Alert>
          </Snackbar>
        )}
        {!!snackbarError && (
          <Snackbar
            open={!!snackbarError}
            autoHideDuration={6000}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            onClose={(event, reason) => {
              if (reason === "clickaway") {
                return;
              }
              dispatch(GlobalActions.setSnackbarError(null));
              // setOpen(false);
            }}
          >
            <Alert
              onClose={() => {
                dispatch(GlobalActions.setSnackbarError(null));
              }}
              severity="error"
              sx={{ width: "100%" }}
            >
              {snackbarError}
            </Alert>
          </Snackbar>
        )}
      </div>
    </Router>
  );
}

export default App;
