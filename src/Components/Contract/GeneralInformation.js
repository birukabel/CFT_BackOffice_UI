import React, { useEffect, useState } from "react";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Stack,
  CardContent,
  Card,
  CardHeader,
  TextField,
  Switch,
  Link,
  Autocomplete,
} from "@mui/material";
import { MemberDetail } from "./MemberDetail";
import { get } from "./../../Utility/APIHelper";

export function GeneralInformation(props) {
  const [open, setOpen] = React.useState(false);

  const [memberInfo, setMemberInfo] = useState([]);
  const [clientInfo, setClientInfo] = useState({
    seller: [],
    buyer: [],
  });

  const [selectedTrader, setSelectedTrader] = React.useState({});
  const {
    contractTrader,
    handleClientChange,
    handleMemberChange,
    handleChange,
  } = props;

  useEffect(() => {
    PopulateMember();
  }, []);
  const PopulateMember = () => {
    get("Membership/member").then((result) => {
      setMemberInfo(result.data);
      contractTrader.map((trader) => {
        if (trader.MemberId !== "") {
          PopulateClient(
            result.data.find((x) => x.MemberId === trader.MemberId)
              .MemberId,
            trader.IsSeller
          );
        }
      });
      /*  if (contractTrader[0].MemberId !== "") {
        PopulateClient(
          result.data.find((x) => x.MemberId === contractTrader[0].MemberId)
            .MemberId,
          true
        );
      }
      if (contractTrader[1].MemberId !== "") {
        PopulateClient(
          result.data.find((x) => x.MemberId === contractTrader[1].MemberId)
            .MemberId,
          false
        );
      }*/
    });
  };
  const selfTrade = (result, isSeller) => {
    var member = memberInfo.find(
      (x) =>
        x.MemberId ===
        contractTrader.find((y) => y.IsSeller === isSeller).MemberId
    );
    handleMemberChange(member, isSeller, result);
    !result && PopulateClient(member.MemberId, isSeller);
  };
  const PopulateSelectedMember = (member, isSeller) => {
    if (member) {
      handleMemberChange(member, isSeller, false);
      PopulateClient(member.MemberId, isSeller);
    }
  };
  const PopulateClient = (memberId, isSeller) => {
    if (memberId) {
      get(`Membership/client?memberId=${memberId}`).then((result) => {
        setClientInfo((prevclient) => {
          if (isSeller) {
            return { ...prevclient, seller: result.data };
          } else {
            return { ...prevclient, buyer: result.data };
          }
        });
      });
    }
  };
  const PopulateSelectedClient = (client, isSeller) => {
    if (client) {
      handleClientChange(client, isSeller);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      {contractTrader.map((trader) => (
        <>
          <div style={{ flex: "32%" }}>
            <Card
              style={{
                backgroundColor: trader.IsSeller
                  ? "rgb(232 247 232)"
                  : "rgb(255 248 218)",
                minWidth: 400,
              }}
            >
              <CardHeader
                title={
                  trader.IsSeller ? "Seller Information" : "Buyer Information"
                }
              />
              <CardContent>
                <div>
                  <FormControl>
                    <Stack direction="row">
                      <Autocomplete
                        id="memberinfo"
                        options={memberInfo}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Member Info"
                            variant="outlined"
                            size="small"
                          />
                        )}
                        getOptionLabel={(option) => option.IDNO}
                        style={{ width: 270 }}
                        value={
                          memberInfo.find(
                            (x) => x.MemberId === trader.MemberId
                          ) || null
                        }
                        onChange={(_event, newTeam) => {
                          PopulateSelectedMember(newTeam, trader.IsSeller);
                        }}
                      />
                    </Stack>
                    <FormLabel size="small" margin="dense">
                      Member Name:{trader.MemberName}
                    </FormLabel>
                    <FormControlLabel
                      control={
                        <Switch
                          onChange={(e) =>
                            selfTrade(e.target.checked, trader.IsSeller)
                          }
                          checked={trader.IsSelf ? true : false}
                        />
                      }
                      label="Is Self?"
                    />

                    <Autocomplete
                      id="clientInfo"
                      options={
                        trader.IsSeller ? clientInfo.seller : clientInfo.buyer
                      }
                      disabled={trader.IsSelf ? true : false}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Client Id"
                          variant="outlined"
                          size="small"
                        />
                      )}
                      getOptionLabel={(option) => option.ClientIdNo}
                      style={{ width: 270 }}
                      Value={
                        !trader.IsSelf && trader.IsSeller
                          ? clientInfo.seller.find(
                              (x) => x.ClientId === trader.ClientId
                            ) || null
                          : clientInfo.buyer.find(
                              (x) => x.ClientId === trader.ClientId
                            ) || null
                      }
                      onChange={(_event, newTeam) => {
                        PopulateSelectedClient(newTeam, trader.IsSeller);
                      }}
                    />
                    <FormLabel>Client Name:{trader.ClientName}</FormLabel>
                    <FormLabel>Status:{trader.Status}</FormLabel>
                    <FormLabel>Tin:{trader.TINNumber}</FormLabel>
                    <FormLabel>VAT:{trader.VATNumber}</FormLabel>
                    <TextField
                      label="Region"
                      name="Region"
                      value={trader.Region != null ? trader.Region : ""}
                      variant="outlined"
                      margin="dense"
                      size="small"
                      onChange={(e) => handleChange(e.target, trader.IsSeller)}
                    />
                    <TextField
                      label="Zone"
                      name="Zone"
                      value={trader.Zone !== null ? trader.Zone : ""}
                      variant="outlined"
                      margin="dense"
                      size="small"
                      onChange={(e) => handleChange(e.target, trader.IsSeller)}
                    />
                    <TextField
                      label="Woreda"
                      name="Woreda"
                      value={trader.Woreda !== null ? trader.Woreda : ""}
                      variant="outlined"
                      margin="dense"
                      size="small"
                      onChange={(e) => handleChange(e.target, trader.IsSeller)}
                    />
                    <TextField
                      label="House Number"
                      name="HouseNo"
                      value={trader.HouseNo != null ? trader.HouseNo : ""}
                      variant="outlined"
                      margin="dense"
                      size="small"
                      onChange={(e) => handleChange(e.target, trader.IsSeller)}
                    />
                    <TextField
                      label="Tel No"
                      type="tel"
                      name="Phone"
                      value={trader.Phone !== null ? trader.Phone : ""}
                      variant="outlined"
                      margin="dense"
                      size="small"
                      onChange={(e) => handleChange(e.target, trader.IsSeller)}
                    />

                    <Link
                      component="button"
                      variant="body2"
                      onClick={() => {
                        setOpen(true);
                        setSelectedTrader(trader);
                      }}
                    >
                      View More Detail
                    </Link>
                  </FormControl>
                  <MemberDetail
                    trader={selectedTrader}
                    open={open}
                    setOpen={(bool) => setOpen(bool)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          <div style={{ flex: "5%" }}> </div>
        </>
      ))}
    </div>
  );
}
