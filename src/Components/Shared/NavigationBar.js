import {
  Chip,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Stack,
  Button,
  Menu,
  Typography,
} from "@mui/material";
import {
  MenuOutlined,
  Person,
  Logout,
  KeyboardArrowDown,
  FormatListBulleted,
} from "@mui/icons-material";
import React, { useState } from "react";
import "./NavigationBar.css";
import { get } from "../../Utility/APIHelper";

function NavigationBar({ setToken, userName }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const memnuopen = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userName");
    setToken(null);

    get("Authentication/logout").then((result) => {
      if (!result.data) {
        console.log("Error while user logout");
      }
    });
  };
  const ChipIcon = () => (
    <>
      <Typography variant="p" sx={{marginBottom:'5px'}}>{localStorage.getItem("userName")}</Typography>
      <KeyboardArrowDown />
    </>
  );
  return (
    <nav className="navbar bg-light">
      <div className="container-fluid title">
        <IconButton
          className="toggle"
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          color="inherit"
        >
          <MenuOutlined />
        </IconButton>
        Customized Forward Trading
      </div>
      {/*<Stack direction={"row"}>
        <Chip
          sx={{ marginRight: "30px" }}
          icon={<Person />}
          label={localStorage.getItem("userName")}
        />
        <Divider orientation="vertical" />
        <Chip
          sx={{ marginRight: "20px" }}
          icon={<Logout />}
          variant="outlined"
          label="Log out"
          onClick={handleLogout}
        />
      </Stack>*/}

      <Button
        sx={{ marginRight: "30px" }}
        id="basic-menu"
        aria-controls={memnuopen ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={memnuopen ? "true" : undefined}
        onClick={(e) => {
          handleClick(e);
        }}
        disableElevation
        variant='outlined'
        color='success'
        startIcon={ <Person />}
        endIcon={ <KeyboardArrowDown />}
      >{localStorage.getItem("userName")}</Button>
      <Menu    
        id="basic-menu"
        anchorEl={anchorEl}
        open={memnuopen}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              // handleClose();
              handleLogout();
            }}
            disableRipple
          >
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            <ListItemText>Log out</ListItemText>
          </MenuItem>
        </MenuList>
      </Menu>
    </nav>
  );
}

export { NavigationBar };
