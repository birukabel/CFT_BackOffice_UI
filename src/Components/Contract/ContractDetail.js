import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  FormLabel,
  Grid,
  Button,
  Stack,
  Divider,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import "./Contract.css";
import { get, getfile } from "../../Utility/APIHelper";
import dayjs from "dayjs";
import { AttachmentOutlined } from "@mui/icons-material";
import {
  Timeline,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
} from "@mui/lab";

function ContractDetail() {
  const [open, setOpen] = React.useState(false);

  const location = useLocation();
  const navigat = useNavigate();
  const cftId = location.state.cftId;
  const cftNumber = location.state.cftNumber;
  const [data, setData] = useState({});
  useEffect(() => {
    if (cftId != null) {
      get(`Contract/detail?id=${cftId}`).then((result) => {
        if (result.data && result.data.length > 0) {
          setData(result.data[0]);
          console.log(result.data);
        }
      });
    }
  }, []);
  const handleEdit = () => {
    navigat(`/ContractNew`, {
      cftId: cftId,
    });
  };
  const handleAmmedment = () => {
    setOpen(true);
  };
  const downloadAttachement = () => {
    getfile(`Contract/downloadfile?contractId=${cftId}`).then((result) => {
      const blob = new Blob([result.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = data.Attachement;
      link.click();
    });
  };
  return (
    <>
      <h2>Contact Detail # {cftNumber}</h2>
      <Divider component="li" sx={{ mb: 2, mt: 5 }} />
      {data==={} ? (
        <Card>
          <h2 className="detail-card-title">Unable to get detail</h2>
          <CardContent></CardContent>
        </Card>
      ) : (
        <Grid container spacing={4}>
          <Grid container={"true"} item md={9} spacing={4}>
            <Grid item xs={12} sm={12} md={12} spacing={4}>
              <Card>
                <h2 className="detail-card-title">Contract Info</h2>
                <CardContent>
                  <Stack direction="row">
                    <Stack direction="column">
                      <FormLabel className="detail-label">
                        Contract Number:
                      </FormLabel>
                      <FormLabel className="detail-label">Option:</FormLabel>
                      <FormLabel className="detail-label">Commodity:</FormLabel>
                      <FormLabel className="detail-label">
                        Commodity Class:
                      </FormLabel>
                      <FormLabel className="detail-label">
                        Commodity Grade:
                      </FormLabel>
                      <FormLabel className="detail-label">
                        ECX Warehouse:
                      </FormLabel>
                      <FormLabel className="detail-label">
                        Trader Waehouse:
                      </FormLabel>
                    </Stack>
                    <Stack direction="column" sx={{ minWidth: 30 }}>
                      <FormLabel className="detail-info">{cftNumber}</FormLabel>
                      <FormLabel className="detail-info">
                        {data.OptionName}
                      </FormLabel>
                      <FormLabel className="detail-info">
                        {data.Commodity}
                      </FormLabel>
                      <FormLabel className="detail-info">
                        {data.ClassName}
                      </FormLabel>
                      <FormLabel className="detail-info">
                        {data.Symbol}
                      </FormLabel>
                      <FormLabel className="detail-info">
                        {data.ECXWarehouse}
                      </FormLabel>
                      <FormLabel className="detail-info">
                        {data.TraderWarehouse}
                      </FormLabel>
                    </Stack>
                    <Stack direction="column">
                      <FormLabel className="detail-label">PY:</FormLabel>
                      <FormLabel className="detail-label">
                        Quantity (lot):
                      </FormLabel>
                      <FormLabel className="detail-label">
                        Quantity (qtl):
                      </FormLabel>
                      <FormLabel className="detail-label">
                        Remaining Quantity (lot):
                      </FormLabel>
                      <FormLabel className="detail-label">Price:</FormLabel>
                      <FormLabel className="detail-label">
                        Contract Date:
                      </FormLabel>
                      <FormLabel className="detail-label">
                        Maturity Date:
                      </FormLabel>
                      <FormLabel className="detail-label">
                        Seller Margin:
                      </FormLabel>
                      <FormLabel className="detail-label">
                        Buyer Margin:
                      </FormLabel>
                      <FormLabel className="detail-label">Status:</FormLabel>
                    </Stack>
                    <Stack direction="column">
                      <FormLabel className="detail-info">
                        {data.ProductionYear}
                      </FormLabel>
                      <FormLabel className="detail-info">
                        {data.QuantityInLot}
                      </FormLabel>
                      <FormLabel className="detail-info">
                        {data.QuantityNetWeight}
                      </FormLabel>
                      <FormLabel className="detail-info">
                        {data.RemainingLot}
                      </FormLabel>
                      <FormLabel className="detail-info">
                        {data.Price}
                      </FormLabel>
                      <FormLabel className="detail-info">
                        {dayjs(data.ContractDate).format("LL")}
                      </FormLabel>
                      <FormLabel className="detail-info">
                        {dayjs(data.MaturityDate).format("LL")}
                      </FormLabel>
                      <FormLabel className="detail-info">
                        {data.SellerMargin}
                      </FormLabel>
                      <FormLabel className="detail-info">
                        {data.BuyerMarginAmount}
                      </FormLabel>
                      <FormLabel className="detail-info">
                        {data.StatusName}
                      </FormLabel>
                      <FormLabel className="detail-label">
                        <FormLabel>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={downloadAttachement}
                            startIcon={<AttachmentOutlined />}
                          >
                            Download
                          </Button>
                        </FormLabel>
                      </FormLabel>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={6} spacing={4}>
              <Card>
                <h2 className="detail-card-title">Seller Info</h2>
                <CardContent>
                  <Stack direction="row">
                    <Stack direction="column">
                      <FormLabel className="detail-label">Member Id:</FormLabel>
                      <FormLabel className="detail-label">
                        Member Name:
                      </FormLabel>
                      <FormLabel className="detail-label">Client Id:</FormLabel>
                      <FormLabel className="detail-label">
                        Client Name:
                      </FormLabel>
                      <FormLabel className="detail-label">TIN:</FormLabel>
                      <FormLabel className="detail-label">VAT:</FormLabel>
                      <FormLabel className="detail-label">Region:</FormLabel>
                      <FormLabel className="detail-label">Zone:</FormLabel>
                      <FormLabel className="detail-label">Woreda:</FormLabel>
                      <FormLabel className="detail-label">House No:</FormLabel>
                      <FormLabel className="detail-label">Phone No:</FormLabel>
                    </Stack>
                    <Stack direction="column">
                      <FormLabel className="detail-info">
                        {data.SellerMemberId}
                      </FormLabel>
                      <FormLabel className="detail-info">
                        {data.SellerMemberName}
                      </FormLabel>
                      <FormLabel className="detail-info">
                        {data.SellerId}
                      </FormLabel>
                      <FormLabel className="detail-info">
                        {data.SellerName}
                      </FormLabel>
                      <FormLabel className="detail-info">
                        {data.SellerTin}
                      </FormLabel>
                      <FormLabel className="detail-info">
                        {data.SellerVat}
                      </FormLabel>
                      <FormLabel className="detail-info">
                        {data.SellerRegion}
                      </FormLabel>
                      <FormLabel className="detail-info">
                        {data.SellerZone}
                      </FormLabel>
                      <FormLabel className="detail-info">
                        {data.SellerWoreda}
                      </FormLabel>
                      <FormLabel className="detail-info">
                        {data.SellerHouseNo}
                      </FormLabel>
                      <FormLabel className="detail-info">
                        {data.SellerPhone}
                      </FormLabel>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={6} spacing={4}>
              <Card>
                <h2 className="detail-card-title">Buyer Info</h2>
                <CardContent>
                  <Stack direction="row">
                    <Stack direction="column">
                      <FormLabel className="detail-label">Member Id:</FormLabel>
                      <FormLabel className="detail-label">
                        Member Name:
                      </FormLabel>
                      <FormLabel className="detail-label">Client Id:</FormLabel>
                      <FormLabel className="detail-label">
                        Client Name:
                      </FormLabel>
                      <FormLabel className="detail-label">TIN:</FormLabel>
                      <FormLabel className="detail-label">VAT:</FormLabel>
                      <FormLabel className="detail-label">Region:</FormLabel>
                      <FormLabel className="detail-label">Zone:</FormLabel>
                      <FormLabel className="detail-label">Woreda:</FormLabel>
                      <FormLabel className="detail-label">House No:</FormLabel>
                      <FormLabel className="detail-label">Phone No:</FormLabel>
                    </Stack>
                    <Stack direction="column">
                      <FormLabel className="detail-info">
                        {data.BuyerMemberId}
                      </FormLabel>
                      <FormLabel className="detail-info">
                        {data.BuyerMemberName}
                      </FormLabel>
                      <FormLabel className="detail-info">
                        {data.BuyerId}
                      </FormLabel>
                      <FormLabel className="detail-info">
                        {data.BuyerName}
                      </FormLabel>
                      <FormLabel className="detail-info">
                        {data.BuyerTin}
                      </FormLabel>
                      <FormLabel className="detail-info">
                        {data.BuyerVat}
                      </FormLabel>
                      <FormLabel className="detail-info">
                        {data.BuyerRegion}
                      </FormLabel>
                      <FormLabel className="detail-info">
                        {data.BuyerZone}
                      </FormLabel>
                      <FormLabel className="detail-info">
                        {data.BuyerWoreda}
                      </FormLabel>
                      <FormLabel className="detail-info">
                        {data.BuyerHouseNo}
                      </FormLabel>
                      <FormLabel className="detail-info">
                        {data.BuyerPhone}
                      </FormLabel>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Grid container={"true"} item md={3} spacing={4}>
            <Grid item xs={12} sm={12} md={12} spacing={12}>
              <Card>
                <h2 className="detail-card-title">Activity</h2>
                <CardContent>
                  <Timeline>
                    <TimelineItem>
                      <TimelineOppositeContent>
                        10/11/2022 09:30 am
                      </TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineDot />
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent>Created</TimelineContent>
                    </TimelineItem>
                    <TimelineItem>
                      <TimelineOppositeContent>
                        10/11/2022 09:30 am
                      </TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineDot />
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent>Created</TimelineContent>
                    </TimelineItem>
                    <TimelineItem>
                      <TimelineOppositeContent>
                        10/11/2022 09:30 am
                      </TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineDot />
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent>Created</TimelineContent>
                    </TimelineItem>
                    <TimelineItem>
                      <TimelineOppositeContent>
                        10/11/2022 10:15 am
                      </TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineDot />
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent>Approved</TimelineContent>
                    </TimelineItem>
                    <TimelineItem>
                      <TimelineOppositeContent>
                        10/15/2022 07:15 am
                      </TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineDot />
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent>Ammended</TimelineContent>
                    </TimelineItem>
                  </Timeline>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      )}
    </>
  );
}

export { ContractDetail };
{
  /*
  <>
     
      <Card>
        <CardContent>
          <Stack direction="row" spacing={2} className="action-button">
            <Fab
              variant="extended"
              size="medium"
              color="primary"
              onClick={handleEdit}
              className="add-button"
            >
              <Edit /> Edit
            </Fab>
            <Fab
              variant="extended"
              size="medium"
              color="primary"
              onClick={handleAmmedment}
              className="add-button"
            >
              <AppRegistration /> Amendment
            </Fab>
            <ContractAmendment
              cId={cftId}
              cftNumber={cftNumber}
              open={open}
              setOpen={(bool) => setOpen(bool)}
            />
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Contract Detail"></CardHeader>
        <CardContent>
          <Stack direction="row">
            <fieldset>
              <legend>General Information</legend>
              {data.map((item) => {
                return (
                  <Stack direction="row" spacing={2}>
                    <FormControl>
                      <Typography>Seller</Typography>
                      <FormLabel>Member Id: {item.SellerMemberId}</FormLabel>
                      <FormLabel>
                        Member Name: {item.SellerMemberName}
                      </FormLabel>
                      <FormLabel>Client Id: {item.SellerId}</FormLabel>
                      <FormLabel>Client Name: {item.SellerName}</FormLabel>
                      <FormLabel>TIN #: {item.SellerTin}</FormLabel>
                      <FormLabel>VAT: {item.SellerVat}</FormLabel>
                      <FormLabel>Region: {item.SellerRegion}</FormLabel>
                      <FormLabel>Zone: {item.SellerZone}</FormLabel>
                      <FormLabel>Woreda: {item.SellerWoreda}</FormLabel>
                      <FormLabel>House No: {item.SellerHouseNo}</FormLabel>
                      <FormLabel>Tel: {item.SellerPhone}</FormLabel>
                    </FormControl>
                    <FormControl>
                      <Typography>Buyer</Typography>
                      <FormLabel>Member Id: {item.BuyerMemberId}</FormLabel>
                      <FormLabel>Member Name: {item.BuyerMemberName}</FormLabel>
                      <FormLabel>Client Id: {item.BuyerId}</FormLabel>
                      <FormLabel>Client Name: {item.BuyerName}</FormLabel>
                      <FormLabel>TIN #: {item.BuyerTin}</FormLabel>
                      <FormLabel>VAT: {item.BuyerVat}</FormLabel>
                      <FormLabel>Region: {item.BuyerRegion}</FormLabel>
                      <FormLabel>Zone: {item.BuyerZone}</FormLabel>
                      <FormLabel>Woreda: {item.BuyerWoreda}</FormLabel>
                      <FormLabel>House No: {item.BuyerHouseNo}</FormLabel>
                      <FormLabel>Tel: {item.BuyerPhone}</FormLabel>
                    </FormControl>
                  </Stack>
                );
              })}
            </fieldset>
            <fieldset>
              <legend>Contract Information</legend>
              {data.map((item) => {
                return (
                  <Stack direction="row" spacing={2}>
                    <FormControl>
                      <FormLabel>
                        Contract Number: {item.ContractNumber}
                      </FormLabel>
                      <FormLabel>Option: {item.OptionName}</FormLabel>
                      <FormLabel>Commodity: {item.Commodity}</FormLabel>
                      <FormLabel>Commodity Class: {item.ClassName}</FormLabel>
                      <FormLabel>Commodity Grade: {item.Symbol} </FormLabel>
                      <FormLabel>ECX Warehouse: {item.ECXWarehouse}</FormLabel>
                      <FormLabel>
                        Trader Warehouse: {item.TraderWarehouse}:{" "}
                      </FormLabel>
                      <FormLabel>PY: {item.ProductionYear}</FormLabel>
                      <FormLabel>
                        Quantity (lot): {item.QuantityInLot}
                      </FormLabel>
                      <FormLabel>
                        Quantity (qtl): {item.QuantityNetWeight}
                      </FormLabel>
                      <FormLabel>
                        Remaining (lot): {item.RemainingLot}
                      </FormLabel>
                      <FormLabel>Price: {item.Price}</FormLabel>
                      <FormLabel>
                        Contract Date: {dayjs(item.ContractDate).format("LL")}
                      </FormLabel>
                      <FormLabel>
                        Maturity Date: {dayjs(item.MaturityDate).format("LL")}
                      </FormLabel>
                      <FormLabel>Seller Margin: {item.SellerMargin}</FormLabel>
                      <FormLabel>
                        Seller Margin Amount: {item.SellerMarginAmount}
                      </FormLabel>
                      <FormLabel>Buyer Margin: {item.BuyerMargin}</FormLabel>
                      <FormLabel>
                        Buyer Margin Amount: {item.BuyerMarginAmount}
                      </FormLabel>
                      <FormLabel>Status: {item.StatusName}</FormLabel>
                      <FormLabel>
                        <Button
                         variant="contained" size="small"
                          onClick={downloadAttachement}
                          startIcon={<CloudDownloadOutlined />}
                        >
                          Contract File
                        </Button>
                      </FormLabel>
                    </FormControl>
                  </Stack>
                );
              })}
            </fieldset>
          </Stack>
        </CardContent>
      </Card>
    </>
  */
}
