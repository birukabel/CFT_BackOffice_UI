import React, { useState, useEffect } from "react";
import { SessionAuditTrail } from "./SessionAuditTrail";
import {
  AddOutlined,
  FormatListBulletedOutlined,
  EditOutlined,
  AppRegistrationOutlined,
} from "@mui/icons-material";
import {
  Stack,
  Fab,
  Card,
  CardContent,
  Table,
  TableBody,
  Button,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { post, get, put } from "../../Utility/APIHelper";
import dayjs from "dayjs";
import Confirmation from "../../Utility/ConfirmationHelper";
import { CustomizedSnackbars } from "../../Utility/notification";

export function Session() {
  const [session, setSession] = useState([]);
  const [open, setOpen] = useState(false);
  const [showconfirmation, setShowconfirmation] = useState(false);
  const [notification, setNotification] = useState({
    message: "",
    openNotif: false,
    severity: "",
  });
  const handleNotificationClose = () => {
    setNotification((prev) => ({ ...prev, openNotif: false }));
  };
  useEffect(() => {
    populateSession();
   
  }, []);
  const handleSessionAudit = () => {
    setOpen(true);
  };

  const handleOpen = (sessionid) => {
    put("Session", {
      Id: sessionid,
      Status: 2,
      UpdatedBy: "38ae0ebd-11af-434f-a9f5-9bf03b3c937e",
    }).then(() => {
      populateSession();
      setNotification({
        message: "Session opend successfuly",
        openNotif: true,
        severity: "success",
      });
    });
  };

  const handleClose = (sessionid) => {
    put("Session", {
      Id: sessionid,
      Status: 3,
      UpdatedBy: "38ae0ebd-11af-434f-a9f5-9bf03b3c937e",
    }).then(() => {
      populateSession();
      setNotification({
        message: "Session closed successfuly",
        openNotif: true,
        severity: "success",
      });
    });
  };

  const createSession = (action) => {
    if (action === "ok") {
      post("Session?createdBy=38ae0ebd-11af-434f-a9f5-9bf03b3c937e", {}).then(
        () => {
          setNotification({
            message: "Session created successfuly",
            openNotif: true,
            severity: "success",
          });
          populateSession();
        }
      );
    }
    setShowconfirmation(false);
  };
  const populateSession = () => {
    get("Session").then((result) => {
      setSession(result.data);
    });
  };

  return (
    <Card sx={{ minWidth: 275 }}>
      <CustomizedSnackbars
        notification={notification}
        handleNotificationClose={handleNotificationClose}
      ></CustomizedSnackbars>
      <CardContent>
        <h2>Session Managment</h2>

        <Fab
          variant="extended"
          disabled={session.length > 0}
          size="medium"
          color="success"
          onClick={() => {
            setShowconfirmation(true);
          }}
          className="add-button"
        >
          <AddOutlined /> Create Session
        </Fab>
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Trade Date</TableCell>
                <TableCell>Session Name</TableCell>
                <TableCell>Start Time</TableCell>
                <TableCell>End Time</TableCell>
                <TableCell>Session Status</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {session.map((row) => (
                <TableRow
                  key={row.ID}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {dayjs(row.TradeDate).format("DD/MM/YYYY")}
                  </TableCell>
                  <TableCell>{row.SessionName}</TableCell>
                  <TableCell>
                    {row.StartTmie != null
                      ? dayjs(row.StartTmie).format("h:mm:ss A")
                      : "--"}
                  </TableCell>
                  <TableCell>
                    {row.EndTime != null
                      ? dayjs(row.EndTime).format("h:mm:ss A")
                      : "--"}
                  </TableCell>
                  <TableCell>{row.StatusName}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      {" "}
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleSessionAudit()}
                        startIcon={<FormatListBulletedOutlined />}
                      >
                        View Audit
                      </Button>
                      {row.Status === 2 && (
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleClose(row.ID)}
                          startIcon={<AppRegistrationOutlined />}
                        >
                          Close
                        </Button>
                      )}
                      {row.Status === 1 && (
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleOpen(row.ID)}
                          startIcon={<EditOutlined />}
                        >
                          Open
                        </Button>
                      )}
                      <SessionAuditTrail
                        open={open}
                        setOpen={(bool) => setOpen(bool)}
                      />
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {/* <Alert severity="success">This is a success alert — check it out!</Alert>*/}
        {showconfirmation && (
          <Confirmation
            title="Create Session"
            open={showconfirmation}
            body="Are you sure you want to create today's forward trade session?"
            callback={createSession.bind(this)}
          />
        )}
      </CardContent>
    </Card>
  );
}
