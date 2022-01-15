import React from "react";
import { CircularProgress, Typography } from "@material-ui/core";
import { useParams } from "react-router-dom";
import { Redirect } from "react-router-dom";
import endpoints from "~/constants/endpoints";
import http from "../../utils/http";

const VerifyEmailPage = () => {
    const { userId } = useParams();

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState("");
    React.useEffect(() => {
        (async () => {
            try {
                console.log("Verify email page", userId);
                const body = {
                    userId: userId
                }
                const result = await http.patch(
                    endpoints.verifyEmail, body
                );
                setLoading(false);
            } catch (error) {
                setError(error.message);
            }
        })();
    }, []);
    return (
        <div style={{ width: "100vw", height: "100vh" }} className="df aic fdc jcc">
            <CircularProgress />
            <Typography style={{ marginTop: 16 }}>
                {loading ? "Processing..." : "Verified email, redirecting...."}
            </Typography>
            <Typography style={{ marginTop: 16, color: "#red" }}>{error}</Typography>
            {!loading && <Redirect to={'/login'} />}
        </div>
    );
};

export default VerifyEmailPage;