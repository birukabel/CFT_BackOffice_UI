import PropTypes from 'prop-types';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { get } from '../../Utility/APIHelper'
import dayjs from "dayjs";

export function SessionAuditTrail({ open, setOpen }) {

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
    };

    const [sessionAudit, setSessionAudit] = useState([]);
    useEffect(() => {
        PopulateSessionAuditTrail();
    }, []);

    const PopulateSessionAuditTrail = () => {
        get('Session/audit').then((result) => { setSessionAudit(result.data) });
    }
    return (
        <div>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
                fullWidth={true}
                maxWidth={'md'}
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Session Audit Trail
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    <TableContainer>
                        <Table sx={{ minWidth: 650 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Time</TableCell>
                                    <TableCell>Old Value</TableCell>
                                    <TableCell >New Value</TableCell>
                                    <TableCell >Modified By</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sessionAudit.map((row) => (
                                    <TableRow
                                        key={row.AuditId}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell > {dayjs(row.ModifiedTimeStamp).format('DD/MM/YYYY h:mm:ss A')}</TableCell>
                                        <TableCell >{row.OldValue}</TableCell>
                                        <TableCell >{row.NewValue}</TableCell>
                                        <TableCell >{row.UserName}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
            </BootstrapDialog>
        </div>
    )
}