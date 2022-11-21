import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  Fab,
  Stack,
  CardContent,
  Divider,
  MenuItem,
  Menu,
  MenuList,
  ListItemText,
  ListItemIcon,
  Box,
} from "@mui/material/";
import {
  Add,
  FormatListBulleted,
  Edit,
  KeyboardArrowDown,
  AppRegistration,
  CurrencyExchangeOutlined,
} from "@mui/icons-material";
import "./Contract.css";
import { ContractAmendment } from "./ContractAmendment";
import { get } from "../../Utility/APIHelper";
import dayjs from "dayjs";
import { contractDTO, contractObj } from "./../../Models/contractDTO";
import { ContractMargin } from "./ContractMargin";
import { CustomizedSnackbars } from "../../Utility/notification";
import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";

export function ContractSummary() {
  const [marginopen, setMarginOpen] = useState(false);
  const [amendmentopen, setAmendmentOpen] = useState(false);
  const [cft, setCft] = useState({
    id: "",
    cftNumber: "",
  });
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [sellerId, setSellerId] = useState("");
  const [buyerId, setBuyerId] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const memnuopen = Boolean(anchorEl);
  const [selectedRow, setSelectedRow] = useState();
  const [notification, setNotification] = useState({
    message: "",
    openNotif: false,
    severity: "",
  });

  const handleClick = (event,row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row)
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    PopulateContract();
  }, []);
  const PopulateContract = () => {
    get(`Contract/all`).then((result) => {
      if (result.data) {
        setData(result.data);
      }
    });
  };
  const onClick = () => {
    navigate(`/ContractNew`, {});
  };
  const handleDetail = (_id, _cftNumber) => {
    navigate(`/ContractDetail`, {
      state: {
        cftId: _id,
        cftNumber: _cftNumber,
      },
    });
  };
  const handleEdit = (_cftNumber) => {
    if (_cftNumber) {
      get(`Contract/detail?id=${_cftNumber}`).then((result) => {
        if (
          result.data &&
          result.data.length > 0 &&
          (result.data[0].StatusName === "New" ||
            result.data[0].StatusName === "Amended" ||
            result.data[0].StatusName === "New Edit" ||
            result.data[0].StatusName === "Amended Edit")
        ) {
          navigate(`/ContractNew`, {
            state: { contractForEdit: assignContractObj(result.data[0]) },
          });
        }
        if (!result.data || result.data.length <= 0) {
          setNotification({
            message: `Unable to get data to be edited`,
            openNotif: true,
            severity: "error",
          });
        } else {
          setNotification({
            message: `Contract # ${result.data[0].ContractNumber} is ${result.data[0].StatusName} and can not be edited`,
            openNotif: true,
            severity: "error",
          });
        }
      });
    }
  };
  const assignContractObj = (detail) => {
    contractDTO.contract = contractObj;
    contractDTO.contract.ID = detail.ID;
    contractDTO.contract.ContractNumber = detail.ContractNumber;
    contractDTO.contract.OptionId = detail.OptionId;
    contractDTO.contract.CommodityId = detail.CommodityId;
    contractDTO.contract.Symbol = detail.Symbol;
    contractDTO.contract.ECXWarehouseId = detail.ECXWarehouseId;
    contractDTO.contract.TraderWarehouse = detail.TraderWarehouse;
    contractDTO.contract.CommodityClassId = detail.CommodityClassId;
    contractDTO.contract.ProductionYear = detail.ProductionYear;
    contractDTO.contract.QuantityInLot = detail.QuantityInLot;
    contractDTO.contract.QuantityNetWeight = detail.QuantityNetWeight;
    contractDTO.contract.Price = detail.Price;
    contractDTO.contract.ContractDate = detail.ContractDate;
    contractDTO.contract.MaturityDate = detail.MaturityDate;
    contractDTO.contract.Attachement = detail.Attachement;

    contractDTO.seller.ID = detail.CFTSellId;
    contractDTO.seller.MemberId = detail.SellerMemberGuid;
    contractDTO.seller.MemberName = detail.SellerMemberName;
    contractDTO.seller.ClientId = detail.SellerGuid;
    contractDTO.seller.ClientName = detail.SellerName;
    contractDTO.seller.IsSelf =
      detail.SellerMemberId === detail.SellerId ? true : false;
    contractDTO.seller.TINNumber = detail.SellerTin;
    contractDTO.seller.VATNumber = detail.SellerVat;
    contractDTO.seller.Region = detail.SellerRegion;
    contractDTO.seller.Zone = detail.SellerZone;
    contractDTO.seller.Woreda = detail.SellerWoreda;
    contractDTO.seller.HouseNo = detail.SellerHouseNo;
    contractDTO.seller.Phone = detail.SellerPhone;

    contractDTO.buyer.ID = detail.CFTBuyId;
    contractDTO.buyer.MemberId = detail.BuyerMemberGuid;
    contractDTO.buyer.MemberName = detail.BuyerMemberName;
    contractDTO.buyer.ClientId = detail.BuyerGuid;
    contractDTO.buyer.ClientName = detail.BuyerName;
    contractDTO.buyer.IsSelf =
      detail.BuyerMemberId === detail.BuyerId ? true : false;
    contractDTO.buyer.TINNumber = detail.BuyerTin;
    contractDTO.buyer.VATNumber = detail.BuyerVat;
    contractDTO.buyer.Region = detail.BuyerRegion;
    contractDTO.buyer.Zone = detail.BuyerZone;
    contractDTO.buyer.Woreda = detail.BuyerWoreda;
    contractDTO.buyer.HouseNo = detail.BuyerHouseNo;
    contractDTO.buyer.Phone = detail.BuyerPhone;

    return contractDTO;
  };
  const handleAmmendment =  (_cId, _cftNumber) => {
    setAmendmentOpen(true);
   // setDrawer(true);
    setCft((prev) => ({
      ...prev,
      id: _cId,
      cftNumber: _cftNumber,
    }));
  };
  const handleMargin = (_cId, _cftNumber, _seller, _buyer) => {
    setMarginOpen(true);
    setSellerId(_seller);
    setBuyerId(_buyer);
    setCft((prev) => ({
      ...prev,
      id: _cId,
      cftNumber: _cftNumber,
    }));
  };
  const handleNotificationClose = () => {
    setNotification((prev) => ({ ...prev, openNotif: false }));
  };
  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }
  const columns = [
    { field: "id", headerName: "CFT #", width: 90 },
    // { field: "ContractId", headerName: "CFT #", width: 90,hide:true},
    { field: "OptionName", headerName: "Option", width: 120 },
    { field: "SellerID", headerName: "Seller", width: 85 },
    { field: "BuyerID", headerName: "Buyer", width: 85 },
    { field: "Symbol", headerName: "Symbol", width: 100 },
    { field: "QuantityInLot", headerName: "Quantity", width: 65 },
    { field: "ContractDate", headerName: "Contract Date", width: 120 },
    { field: "MaturityDate", headerName: "Maturity Date", width: 120 },
    { field: "StatusName", headerName: "Status", width: 90 },
    {
      field: "Action",
      renderCell: (cellValue) => {
        return (
          <>
            <Button
              id="basic-menu"
              aria-controls={memnuopen ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={memnuopen ? "true" : undefined}
              disableElevation
              onClick={(e)=>{handleClick(e,cellValue.row)}}
              endIcon={<KeyboardArrowDown />}
            >
              Actions
            </Button>
          </>
        );
      },
    },
  ];
  const rows = data.map((row) => ({
    id: row.ContractNumber,
    cftId: row.CFTId,
    OptionName: row.OptionName,
    SellerID: row.SellerID,
    BuyerID: row.BuyerID,
    Symbol: row.Symbol,
    QuantityInLot: row.QuantityInLot,
    ContractDate: dayjs(row.ContractDate).format("LL"),
    MaturityDate: dayjs(row.MaturityDate).format("LL"),
    StatusName: row.StatusName,
    SellTrader:row.CFTSellId,
    BuyTrader:row.CFTBuyId
  }));
  const handelCellClick = (param, event) => {
    event.stopPropagation();
  };
  const CustomMenu = () => {
    return (
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
              handleClose();
              handleDetail(selectedRow.cftId, selectedRow.id)
            }}
            disableRipple
          >
            <ListItemIcon>
              <FormatListBulleted fontSize="small" />
            </ListItemIcon>
            <ListItemText>Detail</ListItemText>
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleClose();
              handleEdit(selectedRow.cftId)
            }}
            disableRipple
          >
            <ListItemIcon>
              {" "}
              <Edit fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleClose();
              handleMargin(
                selectedRow.cftId,
                selectedRow.id,
                selectedRow.SellTrader,
                selectedRow.BuyTrader
              )
            }}
            disableRipple
          >
            <ListItemIcon>
              {" "}
              <CurrencyExchangeOutlined fontSize="small" />
            </ListItemIcon>
            <ListItemText>Margin</ListItemText>
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleClose();
                handleAmmendment(selectedRow.cftId, selectedRow.id)
            }}
            disableRipple
          >
            <ListItemIcon>
              {" "}
              <AppRegistration fontSize="small" />
            </ListItemIcon>
            <ListItemText>Amendment</ListItemText>
          </MenuItem>
        </MenuList>
      </Menu>
    );
  };
  return (
    <>
      <h2>Contacts</h2>
      <Divider component="li" sx={{ mb: 2, mt: 5 }} />

      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Stack direction={"row"}>
            <Fab
              variant="extended"
              size="medium"
              color="success"
              onClick={onClick}
              className="add-button"
            >
              <Add /> New
            </Fab>
          </Stack>

          <Box sx={{ height: 700, width: "100%" }}>
            <DataGrid
              columns={columns}
              rows={rows}
              pageSize={10}
              components={{
                Toolbar: CustomToolbar,
              }}
              onCellClick={handelCellClick}
            />
          </Box>
          <ContractAmendment
              cft={cft}
              open={amendmentopen}
              setOpen={(bool) => setAmendmentOpen(bool)}
            />
            <ContractMargin
              cft={cft}
              sellerId={sellerId}
              buyerId={buyerId}
              open={marginopen}
              setOpen={(bool) => setMarginOpen(bool)}
            />
        {/* <Fab
            variant="extended"
            size="medium"
            color="success"
            onClick={onClick}
            className="add-button"
          >
            <Add /> New
          </Fab>
          <TableContainer>
            <Table
              sx={{ minWidth: 650 }}
              size="small"
              aria-label="a dense table"
            >
              <TableHead>
                <TableRow>
                  <TableCell>CFT-Number</TableCell>
                  <TableCell>Option</TableCell>
                  <TableCell>Seller</TableCell>
                  <TableCell>Buyer</TableCell>
                  <TableCell>Symbol</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Contract Date</TableCell>
                  <TableCell>Maturity Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>{row.ContractNumber}</TableCell>
                    <TableCell>{row.OptionName}</TableCell>
                    <TableCell>{row.SellerID}</TableCell>
                    <TableCell>{row.BuyerID}</TableCell>
                    <TableCell>{row.Symbol.replaceAll(",", ", ")}</TableCell>
                    <TableCell>{row.QuantityInLot}</TableCell>
                    <TableCell>
                      {dayjs(row.ContractDate).format("LL")}
                    </TableCell>
                    <TableCell>
                      {dayjs(row.MaturityDate).format("LL")}
                    </TableCell>
                    <TableCell>{row.StatusName}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        {" "}
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() =>
                            handleMargin(
                              row.CFTId,
                              row.ContractNumber,
                              row.CFTSellId,
                              row.CFTBuyId
                            )
                          }
                          startIcon={<CurrencyExchangeOutlined />}
                        >
                          Margin
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() =>
                            handleDetail(row.CFTId, row.ContractNumber)
                          }
                          startIcon={<FormatListBulleted />}
                        >
                          Detail
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleEdit(row.CFTId)}
                          startIcon={<Edit />}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() =>
                            handleAmmendment(row.CFTId, row.ContractNumber)
                          }
                          startIcon={<AppRegistration />}
                        >
                          Amendment
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <ContractAmendment
              cft={cft}
              open={amendmentopen}
              setOpen={(bool) => setAmendmentOpen(bool)}
            />
            <ContractMargin
              cft={cft}
              sellerId={sellerId}
              buyerId={buyerId}
              open={marginopen}
              setOpen={(bool) => setMarginOpen(bool)}
            />
          </TableContainer>*/}  
        </CardContent>
      </Card>

      <CustomMenu />
      <CustomizedSnackbars
        notification={notification}
        handleNotificationClose={handleNotificationClose}
      ></CustomizedSnackbars>
    
     
    </>
  );
}
