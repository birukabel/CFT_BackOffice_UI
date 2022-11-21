
import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent
} from "@mui/material";
import React, { useState, useEffect } from "react";
import {Close} from "@mui/icons-material/Close";
import dayjs from "dayjs";
import { get } from "./../../Utility/APIHelper";

export function MemberDetail({ trader, open, setOpen }) {
  const [businessLiceness, setBusinessLicense] = useState([]);
  const [agreement, setAgreement] = useState([]);

  useEffect(() => {
    if (trader.MemberId !== "") {
      PopulateBusinessLicense();
      PopulateMCA();
    }
  }, [trader]);
  const PopulateBusinessLicense = () => {
    if (trader.ClientId) {
      get(`Membership/businessLiceness?clientmemberId=${trader.ClientId}`).then(
        (result) => {
          setBusinessLicense(result.data);
        }
      );
    }
  };
  const PopulateMCA = () => {
    if (trader.ClientId && trader.MemberId) {
      get(
        `Membership/agreement?memberId=${trader.MemberId}&clientId=${trader.ClientId}`
      ).then((result) => {
        setAgreement(result.data);
      });
    }
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog fullWidth="md" open={open} onClose={handleClose}>
        <DialogTitle>
          Member Detail
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
            startIcon={<Close />}
          >
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Stack direction="row">
            <Typography>Business License</Typography>
          </Stack>
          <Stack direction="row">
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Business License</TableCell>
                    <TableCell>Expiration Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>COC Expiration Date</TableCell>
                    <TableCell>COC Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {businessLiceness.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>{row.Name}</TableCell>
                      <TableCell>
                        {" "}
                        {row.ExpirationDate != null
                          ? dayjs(row.ExpirationDate).format("DD/MM/YYYY")
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {row.Active ? "Active" : "InActive"}
                      </TableCell>
                      <TableCell>
                        {row.COCExpirationDate != null
                          ? dayjs(row.COCExpirationDate).format("DD/MM/YYYY")
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {row.COCActive ? "Active" : "InActive"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
          <Stack direction="row" style={{ marginTop: "25px" }}>
            <Typography>Member Client Aggrement</Typography>
          </Stack>
          <Stack direction="row">
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Commodity</TableCell>
                    <TableCell>Active</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {agreement.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>{row.Commodity}</TableCell>
                      <TableCell>
                        {row.Active ? "Active" : "InActive"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        </DialogContent>
      </Dialog>
    </div>
  );
}
/*import PropTypes from 'prop-types';
import { Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React from 'react';

import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from "dayjs";

export function MemberDetail({ bl, ag, open, setOpen }) {

    const [fullWidth, setFullWidth] = React.useState(true);
    const [maxWidth, setMaxWidth] = React.useState('md');


    const BootstrapDialog = styled(Dialog)(({ theme }) => ({
        '& .MuiDialogContent-root': {
            padding: theme.spacing(2),
        },
        '& .MuiDialogActions-root': {
            padding: theme.spacing(1),
        },
    }));
    const BootstrapDialogTitle = (props) => {
        const { children, onClose, ...other } = props;

        return (
            <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
                {children}
                {onClose ? (
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                ) : null}
            </DialogTitle>
        );
    };

    BootstrapDialogTitle.propTypes = {
        children: PropTypes.node,
        onClose: PropTypes.func.isRequired,
    };

    const handleClose = () => {
        setOpen(false);
        console.log(bl);
        console.log(ag);
    };

    return (
        <div>

            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
                fullWidth={fullWidth}
                maxWidth={maxWidth}
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Member Detail
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    <Stack direction="row">
                        <Typography>Business License</Typography>
                    </Stack>
                    <Stack direction="row">
                        <TableContainer>
                            <Table sx={{ minWidth: 650 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell >Business License</TableCell>
                                        <TableCell >Expiration Date</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>COC Expiration Date</TableCell>
                                        <TableCell >COC Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {bl.map((row, index) => (
                                        <TableRow
                                            key={index}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell >{row.Name}</TableCell>
                                            <TableCell > {row.ExpirationDate != null ? dayjs(row.ExpirationDate).format('DD/MM/YYYY') : '-'}</TableCell>
                                            <TableCell >{row.Active ? 'Active' : 'InActive'}</TableCell>
                                            <TableCell >{row.COCExpirationDate != null ? dayjs(row.COCExpirationDate).format('DD/MM/YYYY') : '-'}</TableCell>
                                            <TableCell >{row.COCActive ? 'Active' : 'InActive'}</TableCell>
                                        </TableRow>
                                    ))}

                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Stack>
                    <Stack direction="row" style={{ marginTop: "25px" }}>
                        <Typography>Member Client Aggrement</Typography>
                    </Stack>
                    <Stack direction="row">
                        <TableContainer>
                            <Table sx={{ minWidth: 650 }} >
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Commodity</TableCell>
                                        <TableCell >Active</TableCell>

                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                {ag.map((row, index) => (
                                        <TableRow
                                            key={index}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell >{row.Commodity}</TableCell>
                                            <TableCell >{row.Active ? 'Active' : 'InActive'}</TableCell>
                                            
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Stack>
                </DialogContent>
            </BootstrapDialog>
        </div>
    )
}
*/
