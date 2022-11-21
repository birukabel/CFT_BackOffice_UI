import { Approval, Close, Edit } from "@mui/icons-material";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";

import {
  Button,
  Chip,
  DialogContent,
  DialogTitle,
  Drawer,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { get, post, put } from "../../Utility/APIHelper";
import { CustomizedSnackbars } from "../../Utility/notification";
import { InfoOutlined } from "@mui/icons-material";

export function ContractMargin({ cft, sellerId, buyerId, open, setOpen }) {
  const [margin, setMargin] = useState([]);
  const [side, setSide] = useState("");
  const [marginLookUp, setMarginLookUp] = useState([]);
  const [selectedMargin, setSelectedMargin] = useState(0);
  const [amount, setAmount] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [accountNumber, setAccountNumber] = useState("");
  const [bankAccount, setBankAccount] = useState([]);

  const [marginData, setMarginData] = useState({
    Id: 0,
    CFTId: cft.id,
    CFTTraderId: "",
    MarginId: 0,
    Amount: 0,
    QuantityInLot: 0,
    Side: 0,
    AccountNumber: "",
  });

  const [notification, setNotification] = useState({
    message: "",
    openNotif: false,
    severity: "",
  });
  useEffect(() => {
    PopulateMarginLookUp();
    if (cft.id !== "") {
      PopulateMargin(cft.id);
      setMarginData((prev) => ({
        ...prev,
        Id: 0,
        Side: "",
        CFTId: cft.id,
        CFTTraderId: "",
        MarginId: 0,
        Amount: 0,
        QuantityInLot: 0,
        AccountNumber: "00000000-0000-0000-0000-000000000000",
      }));
    }

    setSide("");
    setSelectedMargin([]);
    setAmount(0);
    setQuantity(0);
    setAccountNumber([]);
  }, [cft.id]);
  const PopulateMarginLookUp = async () => {
    await get(`Membership/GetMarginLookUp`).then((result) => {
      if (result.data) {
        setMarginLookUp(result.data);
      }
    });
  };
  const PopulateMargin = (_id) => {
    if (_id !== "") {
      get(`Contract/GetMarginByCftId?cftId=${_id}`).then((result) => {
        if (result.data) {
          setMargin(result.data);
        }
      });
    }
  };
  const handleRelease = async (id) => {
    if (id !== "") {
      put(`Contract/ReleaseMargin?cFTTraderId=${id}`).then((result) => {
        if (result.data && result.data === "Ok") {
          setNotification({
            message: "Margin successfuly Released",
            openNotif: true,
            severity: "success",
          });
        PopulateMargin(cft.id); 
        } else {
          setNotification({
            message: result.data,
            openNotif: true,
            severity: "error",
          });
        }
      });
    }
  };
  const handleSide = (value) => {
    setSide(value);
    if (value === "2") {
      setMarginData((prev) => ({
        ...prev,
        Side: value,
        CFTId: cft.id,
        CFTTraderId: sellerId,
        MarginId: 0,
      }));
    } else {
      setMarginData((prev) => ({
        ...prev,
        Side: value,
        CFTId: cft.id,
        CFTTraderId: buyerId,
        MarginId: 1,
      }));
      setSelectedMargin(1);
    }
    getBankAccount(value);
  };
  const handleSubmit = async () => {
    console.log(marginData);
    if (marginData.Id === 0) {
      await post("Contract/savemargin", marginData).then((result) => {
        if (result.data && result.data.Result) {
          if (result.data.Result === "Ok") {
            setMarginData((prev) => ({
              ...prev,
              Id: 0,
              Side: "",
              CFTId: cft.id,
              CFTTraderId: "",
              MarginId: 0,
              Amount: 0,
              QuantityInLot: 0,
              AccountNumber: "00000000-0000-0000-0000-000000000000",
            }));
            setSide("");
            setSelectedMargin([]);
            setAmount(0);
            setQuantity(0);
            setAccountNumber([]);
            PopulateMargin(cft.id);
            setNotification({
              message: "Margin saved successfuly",
              openNotif: true,
              severity: "success",
            });
          } else {
            setNotification({
              message: result.data.Result,
              openNotif: true,
              severity: "error",
            });
          }
        }
      });
    } else {
      await put("Contract/editMargin", marginData).then((result) => {
        if (result.data) {
          setNotification({
            message: "Margin edited successfuly",
            openNotif: true,
            severity: "success",
          });
          setMarginData((prev) => ({
            ...prev,
            Id: 0,
            Side: "",
            CFTId: cft.id,
            CFTTraderId: "",
            MarginId: 0,
            Amount: 0,
            QuantityInLot: 0,
            AccountNumber: "00000000-0000-0000-0000-000000000000",
          }));
          setSide("");
          setSelectedMargin([]);
          setAmount(0);
          setQuantity(0);
          setAccountNumber([]);
          PopulateMargin(cft.id);
        } else {
          setNotification({
            message: result.data.Result,
            openNotif: true,
            severity: "error",
          });
        }
      });
    }
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleEdit = async (id) => {
    const filtered = margin.find((x) => x.ID === id);
    if (filtered) {
      if (filtered.Side === "Seller") {
        setSide("2");
        setMarginData((prev) => ({
          ...prev,
          Id: 1,
          CFTTraderId: id,
          MarginId: filtered.MarginName === "Commodity" ? 2 : 1,
          Amount: filtered.Amount,
          QuantityInLot: filtered.QuantityInLot ? filtered.QuantityInLot : 0,
          AccountNumber: filtered.AccountID,
        }));
        getBankAccount("2");
      } else {
        setSide("1");
        setMarginData((prev) => ({
          ...prev,
          Id: 1,
          CFTTraderId: id,
          MarginId: 1,
          Amount: filtered.Amount,
          QuantityInLot: 0,
          AccountNumber: filtered.AccountID,
        }));
        getBankAccount("1");
      }

      filtered.MarginName === "Cash"
        ? setSelectedMargin(1)
        : setSelectedMargin(2);
      setAmount(filtered.Amount);
      setQuantity(filtered.QuantityInLot);
      setAccountNumber(filtered.AccountID);
      console.log(marginData);
    }
  };
  const handleAmount = (_amount) => {
    setAmount(_amount);
    setMarginData((prev) => ({
      ...prev,
      Amount: _amount,
    }));
  };
  const handleQuantity = (_quantity) => {
    setQuantity(_quantity);
    setMarginData((prev) => ({
      ...prev,
      QuantityInLot: _quantity,
    }));
  };
  const handleMarginType = (_margin) => {
    setSelectedMargin(_margin);
    setMarginData((prev) => ({
      ...prev,
      MarginId: _margin,
    }));
  };
  const handleApprove = async (id) => {
    await put(
      `Contract/updateStatus?cftId=${cft.id}&cftTraderId=${id}`,
      {}
    ).then((result) => {
      if (result.data && result.data.Result === "Ok") {
        setNotification({
          message: "Margin successfuly Approved",
          openNotif: true,
          severity: "success",
        });
        PopulateMargin(cft.id);
      } else {
        setNotification({
          message: result.data.Result,
          openNotif: true,
          severity: "error",
        });
      }
    });
  };
  const getBankAccount = async (_side) => {
    if (_side !== "") {
      await get(
        `Lookup/bankAccount?TraderId=${_side === "1" ? buyerId : sellerId}`
      ).then((result) => {
        if (result.data) {
          setBankAccount(result.data);
        }
      });
    } else {
      setNotification({
        message: "Unable to set side",
        openNotif: true,
        severity: "error",
      });
    }
  };
  const handleAccountNumber = (_accountNumber) => {
    setAccountNumber(_accountNumber);
    setMarginData((prev) => ({
      ...prev,
      AccountNumber: _accountNumber,
    }));
  };
  const handleNotificationClose = () => {
    setNotification((prev) => ({ ...prev, openNotif: false }));
  };
  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: { width: "70%" },
        }}
      >
        <DialogTitle>
          Contract Margin ({cft.cftNumber}){" "}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Stack direction="row">
            <TextField
              value={side}
              select
              margin="normal"
              label="Side"
              variant="outlined"
              size="small"
              fullWidth
              onChange={(e) => handleSide(e.target.value)}
            >
              <MenuItem value="1">Buyer</MenuItem>
              <MenuItem value="2">Seller</MenuItem>
            </TextField>

            <TextField
              value={selectedMargin}
              select
              margin="normal"
              label="Margin Type"
              variant="outlined"
              size="small"
              fullWidth
              disabled={side === "2" ? false : true}
              onChange={(e) => handleMarginType(e.target.value)}
            >
              {marginLookUp.map(
                (cmd, index) => (
                  <MenuItem key={index} value={cmd.ID}>
                    {cmd.Name}
                  </MenuItem>
                ),
                []
              )}
            </TextField>
          </Stack>
          <Stack direction="row">
            <TextField
              value={quantity}
              type="number"
              margin="normal"
              label="Quantity"
              variant="outlined"
              size="small"
              fullWidth
              disabled={side === "2" ? false : true}
              onChange={(e) => handleQuantity(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">Lot</InputAdornment>
                ),
              }}
            />
            <TextField
              value={accountNumber}
              select
              fullWidth
              margin="normal"
              label="Account Number"
              variant="outlined"
              size="small"
              onChange={(e) => handleAccountNumber(e.target.value)}
            >
              {bankAccount.map(
                (ba, index) => (
                  <MenuItem key={index} value={ba.Guid}>
                    {ba.AccountNumber}
                  </MenuItem>
                ),
                []
              )}
            </TextField>
          </Stack>
          <Stack direction="row">
            <TextField
              value={amount}
              type="number"
              margin="normal"
              label="Amount"
              variant="outlined"
              size="small"
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">Birr</InputAdornment>
                ),
              }}
              onChange={(e) => handleAmount(e.target.value)}
            />
          </Stack>
          <Stack direction="row">
            <Button
              onClick={(e) => handleSubmit()}
              color="primary"
              size="small"
              variant="contained"
            >
              Save
            </Button>
          </Stack>
        {/* margin.map((item, index) => {
            return (
              <>
                <Grid container spacing={4}>
                  <Grid  item xs={12} sm={12} md={6}  spacing={4}>
                    <ListItemText dividers>Owner :{item.Owner}</ListItemText>
                    <ListItemText dividers>
                      CFT # : {item.ContractNumber}
                    </ListItemText>
                    <ListItemText dividers>
                      Margin : {item.MarginName}
                    </ListItemText>
                    <ListItemText>Side : {item.Side}</ListItemText>
                    <ListItemText>Amount : {item.Amount}</ListItemText>
                    <ListItemText>Quantity : {item.QuantityInLot}</ListItemText>
                    <ListItemText>
                      Status :{" "}
                      <Chip
                        icon={
                          item.MarginStatus === "New" ? (
                            <InfoOutlined />
                          ) : item.MarginStatus == "Approved" ? (
                            <Approval />
                          ) : (
                            <DriveFolderUploadIcon />
                          )
                        }
                        label={item.MarginStatus}
                        color={
                          item.MarginStatus === "New"
                            ? "primary"
                            : item.MarginStatus == "Approved"
                            ? "success"
                            : "error"
                        }
                        variant="outlined"
                        size="small"
                      />
                    </ListItemText>
                  </Grid>
                </Grid>{" "}
              </>
            );
          })*/}
          <Table margin="dense">
            <TableHead>
              <TableRow>
                <TableCell>Owner</TableCell>
                <TableCell>CFT #</TableCell>
                <TableCell>Margin</TableCell>
                <TableCell>Side</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Status</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {margin.map((item, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>{item.Owner}</TableCell>
                    <TableCell>{item.ContractNumber}</TableCell>
                    <TableCell>{item.MarginName}</TableCell>
                    <TableCell>{item.Side}</TableCell>
                    <TableCell>{item.Amount}</TableCell>
                    <TableCell>{item.QuantityInLot}</TableCell>
                    <TableCell>
                      {" "}
                      <Chip
                        icon={
                          item.MarginStatus === "New" ? (
                            <InfoOutlined />
                          ) : item.MarginStatus === "Approved" ? (
                            <Approval />
                          ) : (
                            <DriveFolderUploadIcon />
                          )
                        }
                        label={item.MarginStatus}
                        color={
                          item.MarginStatus === "New"
                            ? "primary"
                            : item.MarginStatus === "Approved"
                            ? "success"
                            : "error"
                        }
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<Edit />}
                          onClick={(e) => handleEdit(item.ID)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<Approval />}
                          onClick={(e) => handleApprove(item.ID)}
                        >
                          Approve
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<DriveFolderUploadIcon />}
                          onClick={(e) => handleRelease(item.ID)}
                        >
                          Release
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </DialogContent>
      </Drawer>
      <CustomizedSnackbars
        notification={notification}
        handleNotificationClose={handleNotificationClose}
      ></CustomizedSnackbars>
    </>
  );
}
