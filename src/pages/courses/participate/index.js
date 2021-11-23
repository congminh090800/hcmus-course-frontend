import { CircularProgress, Typography } from "@material-ui/core";
import React from "react";
import endpoints from "~/constants/endpoints";
import LoadingButton from "@mui/lab/LoadingButton";
import httpAuthorization from "~/utils/httpAuthorization";
import { useParams } from "react-router-dom";
import { Redirect } from "react-router-dom";

const ParticipatingCoursePage = () => {
  const { code } = useParams();

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  React.useEffect(() => {
    (async () => {
      try {
        const result = await httpAuthorization.patch(
          endpoints.studentAccept(code)
        );
        console.log("🚀 ~ file: index.js ~ line 20 ~ result", result);
        setLoading(false);
      } catch (error) {}
    })();
  }, []);
  return (
    <div style={{ width: "100vw", height: "100vh" }} className="df aic fdc jcc">
      <CircularProgress />
      <Typography style={{ marginTop: 16 }}>
        {loading ? "Processing..." : "Redirecting...."}
      </Typography>
      <Typography style={{ marginTop: 16, color: "#red" }}>{error}</Typography>
      {!loading && <Redirect to={`/classes/${code}`} />}
    </div>
  );
};

export default ParticipatingCoursePage;
