import React, { useEffect, useState } from "react";
import {
  FormControl,
  FormControlLabel,
  Checkbox,
  Fab,
  FormLabel,
  Stack,
  TextField,
  MenuItem,
  Autocomplete,
  InputAdornment,
} from "@mui/material";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Box } from "@mui/system";
import { get } from "../../Utility/APIHelper";
import dayjs from "dayjs";
import { CloudUploadOutlined } from "@mui/icons-material";

export function ContractInformation(props) {
  const [cftoptions, setCftOptions] = useState([]);

  const [commodities, setCommodities] = useState([]);
  //const [selectedcommodity, setSelectedCommodity] = useState({});

  const [commodityclasses, setCommodityClasses] = useState([]);
  //const [selectedcommodityclass, setSelectedCommodityClass] = useState({});

  const [commoditygrades, setCommodityGrades] = useState([]);
  const [selectedcommoditygrade, setSelectedCommodityGrade] = useState([]);

  const [ecxwarehouses, setEcxWarehouses] = useState([]);
 // const [selectedecxwarehouse, setSelectedEcxWarehouse] = useState({});
  const { contract, handelChange } = props;

  useEffect(() => {
    PopulateOption();
    PopulateCommodity();
    PopulateWarehouse();
  }, []);
  const PopulateOption = () => {
    get(`membership/option`).then((result) => {
      if (result.data) {
        setCftOptions(result.data);
      }
    });
  };
  const PopulateCommodity = () => {
    get(`lookUp/commodity`).then((result) => {
      if (result.data) {
        setCommodities(result.data);
        if (contract.CommodityId !== "") {
          getCommodityClass(
            result.data.find((x) => x.CommodityId === contract.CommodityId)
          );
        }
      }
    });
  };
  const PopulateWarehouse = () => {
    get(`lookUp/warehouse`).then((result) => {
      if (result.data) {
        setEcxWarehouses(result.data);
      }
    });
  };
  const getCommodityClass = (commodity) => {
    if (commodity) {
     // setSelectedCommodity(commodity);
      get(`lookUp/commodityClass?commodityId=${commodity.CommodityId}`).then(
        (result) => {
          if (result.data) {
            setCommodityClasses(result.data);
            if (contract.CommodityClassId !== "") {
              getCommodityGrade(
                result.data.find((x) => x.Guid === contract.CommodityClassId)
              );
            }
            handelChange({ name: "CommodityId", value: commodity.CommodityId });
          }
        }
      );
    }
  };
  const getCommodityGrade = (commodityClass) => {
    if (commodityClass) {
      //setSelectedCommodityClass(commodityClass);
      get(`lookUp/commodityGrade?classId=${commodityClass.Guid}`).then(
        (result) => {
          if (result.data) {
            setCommodityGrades(result.data);
            handelChange({
              name: "CommodityClassId",
              value: commodityClass.Guid,
            });
            if (contract.Symbol !== "") {
              setSelectedCommodityGrade(contract.Symbol.split(","));
            }
          }
        }
      );
    }
  };
  const onCommodityGradeChange = (e) => {
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
      concat += s + ",";
    });
    concat = concat.slice(0, -1);
    handelChange({ name: "Symbol", value: concat });
  };
  return (
    <Stack direction="row" spacing={10}>
      <FormControl style={{ width: "30%" }}>
        <TextField
          label="Options"
          select
          name="OptionId"
          size="small"
          margin="normal"
          value={contract.OptionId}
          onChange={(e) => {
            handelChange(e.target);
          }}
        >
          {cftoptions.map(
            (Id, index) => (
              <MenuItem key={index} value={Id.ID}>
                {Id.Name}
              </MenuItem>
            ),
            []
          )}
        </TextField>
        <Autocomplete
          id="CommodityId"
          options={commodities}
          renderInput={(params) => (
            <TextField
              {...params}
              margin="normal"
              label="Commodity"
              variant="outlined"
              size="small"
            />
          )}
          getOptionLabel={(option) => option.Name}
          value={
            commodities.find((x) => x.CommodityId === contract.CommodityId) ||
            null
          }
          onChange={(_event, newTeam) => {
            getCommodityClass(newTeam);
          }}
        />
        <Autocomplete
          id="commodityClass"
          options={commodityclasses}
          renderInput={(params) => (
            <TextField
              {...params}
              margin="normal"
              label="Commodity Class"
              variant="outlined"
              size="small"
            />
          )}
          getOptionLabel={(option) => option.Description}
          value={
            commodityclasses.find(
              (x) => x.Guid === contract.CommodityClassId
            ) || null
          }
          onChange={(_event, newTeam) => {
            getCommodityGrade(newTeam);
          }}
        />

        <FormLabel component="legend">Commodity Grades</FormLabel>
        <Box sx={{ display: "flex" }} margin="normal">
          <Box width="400px">
            {commoditygrades.map((item, index) => {
              return (
                <FormControlLabel
                  control={
                    <Checkbox
                      id={index}
                      onChange={(e) => {
                        onCommodityGradeChange(e);
                      }}
                      name={item.Symbol}
                      checked={selectedcommoditygrade.includes(item.Symbol)}
                    />
                  }
                  label={item.Symbol}
                />
              );
            })}
          </Box>
        </Box>
      </FormControl>
      <FormControl style={{ width: "30%" }}>
        <Autocomplete
          id="warehouse"
          name="ECXWarehouseId"
          options={ecxwarehouses}
          renderInput={(params) => (
            <TextField
              {...params}
              margin="normal"
              label="ECX Warehouse"
              variant="outlined"
              size="small"
            />
          )}
          getOptionLabel={(option) => option.Description}
          value={
            ecxwarehouses.find((x) => x.Guid === contract.ECXWarehouseId) ||
            null
          }
          onChange={(_event, newTeam) => {
            //setSelectedEcxWarehouse(newTeam);
            handelChange({ name: "ECXWarehouseId", value: newTeam.Guid });
          }}
        />
        <TextField
          label="Trader Warehouse"
          margin="normal"
          name="TraderWarehouse"
          variant="outlined"
          size="small"
          value={contract.TraderWarehouse}
          onChange={(_event) => {
            handelChange(_event.target);
          }}
        ></TextField>
        <TextField
          size="small"
          margin="normal"
          value={contract.ProductionYear}
          label="Production Year"
          type="text"
          name="ProductionYear"
          onChange={(e) => {
            handelChange(e.target);
          }}
        ></TextField>
        <TextField
          label="Quantity"
          variant="outlined"
          size="small"
          type="number"
          margin="normal"
          name="QuantityInLot"
          value={contract.QuantityInLot}
          onChange={(e) => handelChange(e.target)}
          InputProps={{
            endAdornment: <InputAdornment position="end">Lot</InputAdornment>,
          }}
        ></TextField>
        <TextField
          label="Quantity"
          variant="outlined"
          type="number"
          size="small"
          margin="normal"
          name="QuantityNetWeight"
          value={contract.QuantityNetWeight}
          onChange={(e) => handelChange(e.target)}
          InputProps={{
            endAdornment: <InputAdornment position="end">Quintal</InputAdornment>,
          }}
        ></TextField>
        <TextField
          label="Price"
          variant="outlined"
          size="small"
          margin="normal"
          name="Price"
          value={contract.Price}
          onChange={(e) => handelChange(e.target)}
          InputProps={{
            endAdornment: <InputAdornment position="end">Birr</InputAdornment>,
          }}
        ></TextField>
      </FormControl>
      <Stack spacing={1}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            margin="normal"
            label="Contract Date"
            name="ContractDate"
            value={contract.ContractDate}
            onChange={(e) => {
              handelChange({
                name: "ContractDate",
                value: dayjs(e.$d).format("YYYY-MM-DD"),
              });
            }}
            renderInput={(params) => (
              <TextField size="small" margin="normal" {...params} />
            )}
          />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            margin="normal"
            label="Maturity Date"
            name="MaturityDate"
            value={contract.MaturityDate}
            onChange={(e) => {
              handelChange({
                name: "MaturityDate",
                value: dayjs(e.$d).format("YYYY-MM-DD"),
              });
            }}
            renderInput={(params) => (
              <TextField size="small" margin="normal" {...params} />
            )}
          />
        </LocalizationProvider>

        {/* <TextField
          type="file"
          variant="outlined"
          size="small"
          margin="normal"
          onChange={(e) => {
            handelChange({ name: "Attachement", value: e.target.files[0] });
          }}
        ></TextField>*/}
        <label htmlFor="upload-contract" style={{ marginTop: "10px" }}>
          <input
            style={{ display: "none" }}
            id="upload-contract"
            name="upload-contract"
            type="file"
            onChange={(e) => {
              handelChange({ name: "Attachement", value: e.target.files[0] });
            }}
          />

          <Fab
            color="success"
            size="small"
            component="span"
            aria-label="add"
            variant="extended"
          >
            <CloudUploadOutlined /> {"        upload file"}
          </Fab>
        </label>
        <p>{contract.Attachement && contract.Attachement.name}</p>
      </Stack>
      {/* <FormControl style={{ width: "30%", marginTop: "30px" }}>
        <FormLabel margin="normal">Margin</FormLabel>
        <Stack direction="row" spacing={2} margin="normal">
          <Stack>
            <FormLabel id="seller">Seller</FormLabel>
            {margins.map((item, index) => {
              return (
                <FormControlLabel
                  control={
                    <Radio
                      id={index}
                      onChange={(e) => {
                        handelChange({name:"SellerMargin",value:item.ID});
                      }}
                      name={item.Name}
                    />
                  }
                  label={item.Name}
                />
              );
            })}
          </Stack>
          <Stack>
            <FormLabel id="buyer">Buyer</FormLabel>
            {margins.map((item, index) => {
              return (
                <FormControlLabel
                  control={
                    <Radio
                      id={index}
                      onChange={(e) => {
                        handelChange({name:"BuyerMargin",value:item.ID});
                      }}
                      name={item.Name}
                    />
                  }
                  label={item.Name}
                />
              );
            })}
          </Stack>
        </Stack>
          </FormControl>*/}
    </Stack>
  );
}
