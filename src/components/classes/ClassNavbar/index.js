import {
  AppBar,
  Button,
  IconButton,
  Toolbar,
  Typography,
  Popover
} from "@material-ui/core";
import { Box } from "@material-ui/system";
import { Menu } from "@mui/icons-material";
import React from "react";
import { useHistory, useLocation } from "react-router";
import Logo from "~/assets/images/google_logo.svg";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import AvatarPopup from "../../common/NavBar/AvatarPopup";
import "./index.scss";
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Paper } from '@mui/material'
import NotificationItem from "./NotificationItem";

const ClassNavbar = () => {
  const { user } = useSelector((state) => state.auth);
  const { info } = useSelector((state) => state.classes);
  const history = useHistory();
  const location = useLocation();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;

  return (
    <Box>
      <AppBar sx={{ height: "64px" }} className="hide-app-bar">
        <Toolbar className="df jcsb pr">
          <Box className="df aic ">
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
            >
              <Menu />
            </IconButton>
            <Typography
              onClick={() => history.push("/")}
              className="app-bar-title"
              component="div"
              sx={{ flexGrow: 1, cursor: "pointer" }}
            >
              <Logo className="app-bar-logo" alt="Google" />
              <span>&nbsp;Classroom</span>
            </Typography>
          </Box>
          <Box
            className="pa df"
            style={{
              left: "50%",
              transform: "translateX(-60%)",
            }}
          >
            <Box>
              <Button
                className={`nav-button ${location.pathname.split("/").pop() == info?.code
                  ? "active"
                  : ""
                  }`}
                component={Link}
                to={`/classes/${info?.code}`}
              >
                Stream
              </Button>
            </Box>
            <Box>
              <Button
                className={`nav-button ${location.pathname.split("/").pop() == "classwork"
                  ? "active"
                  : ""
                  }`}
                component={Link}
                to={`/classes/${info?.code}/classwork`}
              >
                Classwork
              </Button>
            </Box>
            <Box>
              <Button
                className={`nav-button ${location.pathname.split("/").pop() == "member" ? "active" : ""
                  }`}
                component={Link}
                to={`/classes/${info?.code}/member`}
              >
                People
              </Button>
            </Box>
            <Box>
              <Button
                className={`nav-button ${location.pathname.split("/").pop() == "grades" ? "active" : ""
                  }`}
                component={Link}
                to={`/classes/${info?.code}/grades`}
              >
                Grades
              </Button>
            </Box>
          </Box>
          <Box>
            <Button onClick={handleClick}>
              <Badge badgeContent={user.notifications.filter(e => !e.seen).length} color="primary" style={{ margin: 16 }} >
                <NotificationsIcon color="action" />
              </Badge>
            </Button>
            <Popover id={id} open={open} anchorEl={anchorEl}
              PaperProps={{ style: { maxHeight: '300px', overflowY: 'auto' } }}
              disableScrollLock
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}>
              <Paper sx={{ border: 1, borderColor: '#F6F6F6', bgcolor: 'background.paper' }}>
                {[...(user.notifications || [])].reverse().map((notification) => <NotificationItem notification={notification} />)}
              </Paper>
            </Popover>
            <AvatarPopup user={user} />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default ClassNavbar;
