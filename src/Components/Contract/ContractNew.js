import React, { useEffect, useState } from "react";
import {
  CardContent,
  Card,
  StepLabel,
  Step,
  Stepper,
  StepContent,
  Button,
} from "@mui/material";
import { GeneralInformation } from "./GeneralInformation";
import { ContractInformation } from "./ContractInformation";
import { contractDTO, trader, contractObj } from "./../../Models/contractDTO";
import { useLocation } from "react-router-dom";
import { post, put } from "./../../Utility/APIHelper";
import Confirmation from "../../Utility/ConfirmationHelper";
import { CustomizedSnackbars } from "../../Utility/notification";

export function ContractNew() {
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();
  const location = useLocation();
  const [contractTrader, setContractTrader] = useState([
    trader,
    { ...trader, IsSeller: false },
  ]);
  const [contract, setContract] = useState(contractObj);
  const [showconfirmation, setShowconfirmation] = useState(false);
  const [notification, setNotification] = useState({
    message: "",
    openNotif: false,
    severity: "",
  });
  useEffect(() => {
    if (location.state) {
      setContract(location.state.contractForEdit.contract);
      setContractTrader([
        location.state.contractForEdit.seller,
        location.state.contractForEdit.buyer,
      ]);
    }
  }, [location.state && location.state.contractForEdit]);

  const handleNext = (action) => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    if (activeStep === 0) {
      var message = validateGeneralInformation();
      if (message !== "") {
        setNotification({
          message: message,
          openNotif: true,
          severity: "error",
        });
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
      }
    } else if (activeStep === steps.length - 1) {
      if (action === "ok") {
        setShowconfirmation(true);
        contractDTO.contract = contract;
        contractDTO.seller = contractTrader.find((x) => x.IsSeller);
        contractDTO.buyer = contractTrader.find((x) => x.IsSeller === false);

        if (location.state) {
          console.log(contractDTO)
          put(
            "Contract/update",
            contractDTO
          )
            .then((data) => {
              if (data.data === "OK") {
                setNotification({
                  message: "Contract edited successfuly",
                  openNotif: true,
                  severity: "success",
                });
              } else {
                setNotification({
                  message: data.data,
                  openNotif: true,
                  severity: "error",
                });
                setActiveStep((prevActiveStep) => prevActiveStep - 1);
              }
            })
            .catch((error) => {
              setNotification({
                message: error.message,
                openNotif: true,
                severity: "error",
              });
              setActiveStep((prevActiveStep) => prevActiveStep - 1);
            });
        } else {
          post(
            "Contract",
            contractDTO
          )
            .then((data) => {
              if (data.data === "OK") {
                setNotification({
                  message: "Contract submitted successfuly",
                  openNotif: true,
                  severity: "success",
                });
              } else {
                setNotification({
                  message: data.data,
                  openNotif: true,
                  severity: "error",
                });
                setActiveStep((prevActiveStep) => prevActiveStep - 1);
              }
            })
            .catch((error) => {
              setNotification({
                message: error.message,
                openNotif: true,
                severity: "error",
              });
              setActiveStep((prevActiveStep) => prevActiveStep - 1);
            });
        }
      } else {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
      }
      setShowconfirmation(false);
    }
  };
  const validateGeneralInformation = () => {
    if (contractTrader[0].MemberId === "") {
      return "Seller Member should be selected";
    }
    if (contractTrader[0].Region === "") {
      return "Seller's Region can not be empty";
    }
    if (contractTrader[0].Zone === "") {
      return "Seller's Zone can not be empty";
    }
    if (contractTrader[0].Woreda === "") {
      return "Seller's Woreda can not be empty";
    }
    if (contractTrader[0].HouseNo === "") {
      return "Seller's House Number can not be empty";
    }
    if (contractTrader[0].Phone === "") {
      return "Seller's Phone Number can not be empty";
    }
    if (contractTrader[0].Phone.length < 10 || contractTrader[0].Phone.length > 13) {
      return "Seller's Phone Number is Invalid";
    }
    if (contractTrader[1].MemberId === "") {
      return "Buyer Member should be selected";
    }
    if (contractTrader[1].Region === "") {
      return "Buyer's Region can not be empty";
    }
    if (contractTrader[1].Zone === "") {
      return "Buyer's Zone can not be empty";
    }
    if (contractTrader[1].Woreda === "") {
      return "Buyer's Woreda can not be empty";
    }
    if (contractTrader[1].HouseNo === "") {
      return "Buyer's House Number can not be empty";
    }
    if (contractTrader[1].Phone === "") {
      return "Buyer's Phone Number can not be empty";
    }
    if (contractTrader[0].Phone.length < 10 || contractTrader[0].Phone.length > 13) {
      return "Buyer's Phone Number is Invalid";
    }
    return ""
  };
  const validateContractInformation = () => {
    if (contract.OptionId === "") {
      return "Option should be selected";
    }
    if (contract.CommodityId === "") {
      return "Commodity should be selected";
    }
    if (contract.CommodityClassId === "") {
      return "Commodity Class should be selected";
    }
    if (contract.Symbol === "") {
      return "Commodity Grade should be selected";
    }
    if (contract.ECXWarehouseId === "") {
      return "ECX Warehouse should be selected";
    }
    if (contract.ProductionYear === "") {
      return "Production Year can not be empty";
    }
    if (contract.QuantityInLot === "") {
      return "Quantity in Lot can not be empty";
    }
    if (contract.QuantityNetWeight === "") {
      return "Quantityin quintal can not be empty";
    }
    if (contract.ContractDate === "") {
      return "Contract date can not be empty";
    }
    if (contract.MaturityDate === "") {
      return "Maturity date can not be empty";
    }
    return ""
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleContractChange = (target) => {
    const { name, value } = target;
    setContract((prevcontract) => ({
      ...prevcontract,
      [name]: value,
    }));
  };
  const handleTraderChange = (target, isSeller) => {
    const { name, value } = target;
    setContractTrader((prevTrader) =>
      prevTrader.map((obj) => {
        if (obj.IsSeller === isSeller) {
          return {
            ...obj,
            [name]: value,
          };
        }
        return obj;
      })
    );
  };
  function getSteps() {
    return [<b>'Trader Information'</b>, <b>'Contract Information'</b>];
  }
  const handleMemberChange = (member, isSeller, isSelf) => {
    if (member) {
      setContractTrader((prevTrader) =>
        prevTrader.map((obj) => {
          if (obj.IsSeller === isSeller) {
            return {
              ...obj,
              MemberId: member.MemberId,
              MemberName: member.OrganizationName,
              MemberIdNo: member.IDNO,
              ClientId: member.MemberId,
              ClientName: member.OrganizationName,
              ClientIdNo: member.IDNO,
              IsSelf: isSelf,
              TINNumber: member.TINNo,
              VATNumber: member.VATNo,
              Status: member.Status,
              Region: member.Region,
              Zone: member.Zone,
              Woreda: member.Woreda,
              HouseNo: member.HouseNo,
              Phone: member.PhoneMob,
            };
          }
          return obj;
        })
      );
    }
  };
  const handleClientChange = (client, isSeller) => {
    if (client) {
      setContractTrader((prevTrader) =>
        prevTrader.map((obj) => {
          if (obj.IsSeller === isSeller) {
            return {
              ...obj,
              ClientName: client.ClientName,
              ClientId: client.ClientId,
              ClientIdNo: client.ClientIdNo,
              TINNumber: client.TINNo,
              VATNumber: client.VATNo,
              Status: client.Status,
              Region: client.Region,
              Zone: client.Zone,
              Woreda: client.Woreda,
              HouseNo: client.HouseNo,
              Phone: client.PhoneMob,
            };
          }
          return obj;
        })
      );
    }
  };
 /* const handelFileAttachement = (event) => {
    setContract((prev) => ({
      ...prev,
      Attachement: event.target.files[0],
    }));
  };*/
  const handleNotificationClose = () => {
    setNotification((prev) => ({ ...prev, openNotif: false }));
  };
  return (
    <>
      <Card>
        <CardContent>
          <Stepper activeStep={activeStep} orientation="vertical">
            <Step>
              <StepLabel>Trader Information</StepLabel>
              <StepContent>
                <GeneralInformation
                  contractTrader={contractTrader}
                  handleMemberChange={handleMemberChange}
                  handleClientChange={handleClientChange}
                  handleChange={handleTraderChange}
                />
                <Button disabled={activeStep === 0} onClick={handleBack}>
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleNext}
                >
                  Next
                </Button>
              </StepContent>
            </Step>
            <Step>
              <StepLabel>Contract Information</StepLabel>
              <StepContent>
                <ContractInformation
                  contract={contract}
                  handelChange={handleContractChange}
                />
                <Button disabled={activeStep === 0} onClick={handleBack}>
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => { var message= validateContractInformation()
                    if(message!=="")
                    {
                      setNotification({
                        message: message,
                        openNotif: true,
                        severity: "error",
                      });
                    }
                    else{
                    setShowconfirmation(true);
                    }
                  }}
                >
                  Finish
                </Button>
              </StepContent>
            </Step>
          </Stepper>
        </CardContent>
      </Card>
      {showconfirmation && (
        <Confirmation
          title="Submit Contract"
          open={showconfirmation}
          body="Are you sure you want to submit the contract?"
          callback={handleNext.bind(this)}
        />
      )}
      <CustomizedSnackbars
        notification={notification}
        handleNotificationClose={handleNotificationClose}
      ></CustomizedSnackbars>
    </>
  );
}
