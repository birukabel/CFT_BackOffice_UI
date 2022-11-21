import {
  FormControl,
  FormLabel,
  Stack,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Box,
  MenuItem,
  FormGroup,
  DialogTitle,
  DialogContent,
  IconButton,
  Drawer,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { get, put } from "../../Utility/APIHelper";
import { CustomizedSnackbars } from "../../Utility/notification";

export function ContractAmendment({ cft, open, setOpen }) {
  const [ammendment, setAmmendment] = useState({
    Id: "",
    CommodityId: "",
    CommodityClassId: "",
    CommodityGrades: "",
    QuantityInLot: 0,
    QuantityNetWeight: 0,
    Price: "",
  });
  const [commodities, setCommodities] = useState([]);
  const [commodityclasses, setCommodityClasses] = useState([]);
  const [commoditygrades, setCommodityGrades] = useState([]);
  const [selectedcommoditygrade, setSelectedCommodityGrade] = useState({});
  const [notification, setNotification] = useState({
    message: "",
    openNotif: false,
    severity: "",
  });
  const handleClose = () => {
    setOpen(false);
  };
  /*if (cft) {
    useEffect(() => {
      PopulateContract();
    }, [cft.id]);
  }*/
  useEffect(() => {
    PopulateCommodity();
    if (cft) {
      PopulateContract();
    }
  }, [cft.id]);
  const PopulateContract = () => {
    if (cft.id !== "") {
      setCommodityGrades([]);
      get(`Contract/ammendment?id=${cft.id}`).then((result) => {
        if (result.data) {
          setAmmendment((prev) => ({
            ...prev,
            Id: cft.id,
            QuantityInLot: result.data[0].QuantityInLot,
            QuantityNetWeight: result.data[0].QuantityNetWeight,
            CommodityId: result.data[0].CommodityId,
            CommodityClassId: result.data[0].CommodityClassId,
            Price: result.data[0].Price,
            CommodityGrades: result.data[0].Symbol,
          }));
          getCommodityClass(result.data[0].CommodityId);
          getCommodityGrade(
            result.data[0].CommodityClassId,
            result.data[0].Symbol
          );
        }
      }, []);
    }
  };
  const PopulateCommodity = () => {
    get(`LookUp/commodity`).then((result) => {
      if (result.data) {
        setCommodities(result.data);
      }
    });
  };
  const getCommodityClass = async (_commodityId) => {
    if (_commodityId) {
      handelChange({ name: "CommodityId", value: _commodityId });
      await get(`LookUp/commodityClass?commodityId=${_commodityId}`).then(
        (result) => {
          if (result.data) {
            setCommodityClasses(result.data);
          }
        }
      );
    }
  };
  const getCommodityGrade = (_commodityClassId, _symbols) => {
    if (_commodityClassId) {
      handelChange({ name: "CommodityClassId", value: _commodityClassId });
      // setSelectedCommodityClass(_commodityClassId);
      get(`LookUp/commodityGrade?classId=${_commodityClassId}`).then(
        (result) => {
          if (result.data) {
            setCommodityGrades(result.data);
            var symbols = _symbols;
            const SymbolArray = symbols.split(",");
            setSelectedCommodityGrade(SymbolArray);
          }
        }
      );
    }
  };
  const onCommodityGradeChange = (e) => {
    if (e) {
      const symbol = e.target.name;
      var symbols = selectedcommoditygrade;
      if (e.target.checked) {
        setSelectedCommodityGrade((prevSymbol) => [...prevSymbol, symbol]);
        symbols.push(symbol);
      } else {
        var temp = selectedcommoditygrade;
        var index = temp.indexOf(symbol);
        if (index !== -1) {
          temp.splice(index, 1);
          setSelectedCommodityGrade(temp);
          symbols = temp;
        }
      }
      var concat = "";
      symbols.map((s) => {
        concat += s !== "" ? s + "," : s;
      });
      concat = concat.slice(0, -1);
      handelChange({ name: "CommodityGrades", value: concat });
    }
  };
  const handelChange = (target) => {
    if (target) {
      const { name, value } = target;
      setAmmendment((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  const Ammend = (event) => {
    event.preventDefault();
    put("Contract/ammend", ammendment).then((result) => {
      if (result.data) {
      setNotification({
        message: "Contract amemded successfuly",
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
     // handleClose();
    });
  };
  const handleNotificationClose = () => {
    setNotification((prev) => ({ ...prev, openNotif: false }));
  };
  return (
    <div>
      {cft && (
        <Drawer anchor="right" open={open} onClose={handleClose}>
          <DialogTitle>
            {" "}
            Contract Ammendment ({cft.cftNumber}){" "}
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
          <form onSubmit={Ammend}>
            <FormControl>
              <Stack direction="row" spacing={2}>
                <FormGroup fullWidth>
                  <TextField
                    label="Quantity (lot)"
                    variant="outlined"
                    value={ammendment.QuantityInLot}
                    name="QuantityInLot"
                    margin="dense"
                    size="small"
                    onChange={(e) => handelChange(e.target)}
                  />
                </FormGroup>
                <FormGroup fullWidth>
                  <TextField
                    label="Quantity (qtl)"
                    value={ammendment.QuantityNetWeight}
                    variant="outlined"
                    name="QuantityNetWeight"
                    margin="dense"
                    size="small"
                    onChange={(e) => handelChange(e.target)}
                  />
                </FormGroup>
              </Stack>
              <Stack direction="row" spacing={2}>
                <FormGroup>
                  <Box width="200px">
                    <TextField
                      label="Commodity"
                      select
                      fullWidth
                      margin="normal"
                      size="small"
                      value={ammendment.CommodityId}
                      onChange={(e) => getCommodityClass(e.target.value)}
                    >
                      {commodities.map(
                        (cmd, index) => (
                          <MenuItem key={index} value={cmd.CommodityId}>
                            {cmd.Name}
                          </MenuItem>
                        ),
                        []
                      )}
                    </TextField>
                  </Box>
                </FormGroup>
                <FormGroup>
                  <Box width="200px">
                    <TextField
                      label="Commodity Class"
                      select
                      fullWidth
                      size="small"
                      margin="normal"
                      value={ammendment.CommodityClassId}
                      onChange={(e) => getCommodityGrade(e.target.value,'')}
                    >
                      {commodityclasses.map(
                        (cmd, index) => (
                          <MenuItem key={index} value={cmd.Guid}>
                            {cmd.Description}
                          </MenuItem>
                        ),
                        []
                      )}
                    </TextField>
                  </Box>
                </FormGroup>
              </Stack>
              <Stack>
                <FormLabel component="legend">
                  Commodity Grades:{ammendment.CommodityGrades}
                </FormLabel>
                <Box sx={{ display: "flex" }} margin="normal">
                  <Box width="400px">
                    {commoditygrades.map((item, index) => {
                      return (
                        <FormControlLabel
                          control={
                            <Checkbox
                              key={index}
                              checked={selectedcommoditygrade.includes(
                                item.Symbol
                              )}
                              onChange={(e) => {
                                onCommodityGradeChange(e);
                              }}
                              name={item.Symbol}
                            />
                          }
                          label={item.Symbol}
                        />
                      );
                    })}
                  </Box>
                </Box>
              </Stack>
              <Stack direction="row">
                <TextField
                  label="Price"
                  variant="outlined"
                  value={ammendment.Price}
                  name="Price"
                  margin="dense"
                  size="small"
                  onChange={(e) => handelChange(e.target)}
                />
              </Stack>
              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <Button
                  color="primary"
                  size="small"
                  type="submit"
                 
                  variant="contained"
                >
                  Ammend
                </Button>
                <Button
                  color="error"
                  size="small"
                  onClick={(e) => handleClose()}
                  variant="contained"
                >
                  Cancel
                </Button>
              </Stack>
            </FormControl>
          </form>
          </DialogContent>
        </Drawer>
      )}
       <CustomizedSnackbars
        notification={notification}
        handleNotificationClose={handleNotificationClose}
      ></CustomizedSnackbars>
    </div>
  );
}
