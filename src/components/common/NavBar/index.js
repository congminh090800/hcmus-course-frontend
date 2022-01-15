import React, { useState } from "react";
import {
  AppBar,
  Typography,
  Slide,
  Toolbar,
  useScrollTrigger,
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Button
} from "@material-ui/core";
import { Menu, Add } from "@mui/icons-material";
import { connect } from "react-redux";
import Logo from "~/assets/images/google_logo.svg";
import "./index.scss";
import AvatarPopup from "./AvatarPopup";
import { useHistory } from "react-router-dom";
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Paper } from '@mui/material'
import { Box } from "@material-ui/system";
import NotificationItem from "../../classes/ClassNavbar/NotificationItem";

const HideOnScroll = (props) => {
  const trigger = useScrollTrigger();
  const elevateTrigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });
  const elevateChildren = React.cloneElement(props.children, {
    elevation: elevateTrigger ? 4 : 0,
    sx: {
      ...props.children.sx,
    },
  });
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {elevateChildren}
    </Slide>
  );
};

const AutoHideNavBar = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElNoti, setAnchorElNoti] = useState(null);

  const history = useHistory();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClickNoti = (event) => {
    setAnchorElNoti(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCloseNoti = () => {
    setAnchorElNoti(null);
  };

  const open = Boolean(anchorEl);

  const openNoti = Boolean(anchorElNoti);
  const id = open ? 'simple-popper' : undefined;

  return (
    <React.Fragment>
      <HideOnScroll {...props}>
        <AppBar sx={{ height: "64px" }} className="hide-app-bar">
          <Toolbar>
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
            <IconButton
              sx={{ mr: 1 }}
              size="large"
              color="inherit"
              onClick={handleClick}
            >
              <Add />
            </IconButton>
            <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              onClick={handleClose}
            >
              <List dense sx={{ borderRadius: "4px" }}>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => props.openJoinDialog()}>
                    <ListItemText primary="Join class" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => props.openCreateDialog()}>
                    <ListItemText primary="Create class" />
                  </ListItemButton>
                </ListItem>
              </List>
            </Popover>
            <Box>
              <Button onClick={handleClickNoti}>
                <Badge badgeContent={props.user.notifications.filter(e => !e.seen).length} color="primary" style={{ margin: 16 }} >
                  <NotificationsIcon color="action" />
                </Badge>
              </Button>
              <Popover id={id} open={openNoti} anchorEl={anchorElNoti}
                PaperProps={{ style: { maxHeight: '300px', overflowY: 'auto' } }}
                disableScrollLock
                onClose={handleCloseNoti}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}>
                <Paper sx={{ border: 1, borderColor: '#F6F6F6', bgcolor: 'background.paper' }}>
                  {[...(props.user.notifications || [])].reverse().map((notification) => <NotificationItem notification={notification} />)}
                </Paper>
              </Popover>
              <AvatarPopup user={props.user} />
            </Box>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar />
    </React.Fragment>
  );
};

const mapState = (state) => {
  return {
    user: state.auth.user,
  };
};

export default connect(mapState)(AutoHideNavBar);
