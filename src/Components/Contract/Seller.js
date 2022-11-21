import React, { useEffect, useState } from 'react';
import {
    FormControl, FormControlLabel, FormLabel, Stack, CardContent, Card, CardHeader,
    TextField, Button, Switch, Link, Select, MenuItem, InputLabel, Autocomplete
} from '@mui/material';
import { MemberDetail } from './MemberDetail';
import { post, get } from './../../Utility/APIHelper';

export function Seller() {
    const [sellerclient, setSellerClient] = useState("");
    const [open, setOpen] = React.useState(false);
    const [memberInfo, setMemberInfo] = useState([]);
    const [clientInfo, setClientInfo] = useState([]);
    const [clientControl, setClientControl] = useState(false);
    const [businessLiceness, setBusinessLicense] = useState([]);
    const [agreement, setAgreement] = useState([]);
    const [seller, setSeller] = useState({
        MemberId: '',
        MemberName: '',
        ClientId: '',
        ClientName: '',
        TINNumber: '',
        VATNumber: '',
        Region: '',
        Zone: '',
        Woreda: '',
        HouseNo: '',
        Phone: '',
        IsSeller: '',
        IsSelf: false
    });
   
    useEffect(() => {
        PopulateMember();
    }, []);
    const PopulateMember = () => {
        get('Membership/member').then((result) => {
            setMemberInfo(result.data);
        });
    }
    const handleClickOpen = () => {
        PopulateBusinessLicense();
        PopulateMCA();
        setOpen(true);


    };
    const PopulateBusinessLicense = () => {
        get(`Membership/businessLiceness?clientmemberId=${seller.ClientId}`).then((result) => {
            setBusinessLicense(result.data);
        });

    }
    const PopulateMCA = () => {
        get(`Membership/agreement?memberId=${seller.MemberId}&clientId=${seller.ClientId}`).then((result) => {
            setAgreement(result.data);
        });

    }
    const selfTrade = (result) => {

        if (result === true) {
          var member=  memberInfo.find(x=>x.MemberId==seller.MemberId)
            
            setSeller(prev => ({
                ...prev, IsSelf: true,
                ClientId: prev.MemberId, ClientName: prev.MemberName,
                TINNumber: member.TINNo, VATNumber: member.VATNo, Status: member.Status,
                Region: member.Region,
                Zone: member.Zone,
                Woreda: member.Woreda,
                HouseNo: member.HouseNo,
                Phone: member.PhoneMob
               
            }));
           
            setClientControl(true);

        }
        else {
            setClientControl(false);
            setSeller(prev => ({
                ...prev, IsSelf: true,
                ClientId: '', ClientName: ''
            }));
        }
    }

    const onSellerClientChanged = (_sellerclientid) => {

    }

    const onSellerViewDetailClicked = () => {

    }
    const PopulateSelectedMember = (member) => {
        if (member) {
            setClientInfo([]);
            setSeller(prev => ({
                ...prev, MemberId: member.MemberId, MemberName: member.OrganizationName,
                TINNumber: member.TINNo, VATNumber: member.VATNo, Status: member.Status,
                Region: member.Region,
                Zone: member.Zone,
                Woreda: member.Woreda,
                HouseNo: member.HouseNo,
                Phone: member.PhoneMob,
                ClientId: '', ClientName: ''
            }));
            PopulateClient(member.MemberId);
        }

    }
    const PopulateClient = (memberId) => {
        if (memberId) {
            get(`Membership/client?memberId=${memberId}`).then((result) => {
                setClientInfo(result.data);
            });
        }
    }
    const PopulateSelectedClient = (client) => {
        if (client) {
            setSeller(prev => ({
                ...prev, ClientName: client.ClientName, ClientId: client.ClientId,
                TINNumber: client.TINNo, VATNumber: client.VATNo, Status: client.Status,
                Region: client.Region,
                Zone: client.Zone,
                Woreda: client.Woreda,
                HouseNo: client.HouseNo,
                Phone: client.PhoneMob


            }));
        }
    }
    return (
        <div>
          
                    <FormControl>
                        <Stack direction="row">
                            <Autocomplete
                                id="memberinfo"
                                options={memberInfo}
                                renderInput={params => (
                                    <TextField {...params} label="Member Info" variant="outlined" size='small' />
                                )}
                                getOptionLabel={option => option.IDNO}
                                style={{ width: 270 }}
                                onChange={(_event, newTeam) => {
                                    PopulateSelectedMember(newTeam);
                                }}
                            />

                        </Stack>
                        <FormLabel size="small" margin="dense">
                            Member Name:{seller.MemberName}
                        </FormLabel>
                        <FormControlLabel control={<Switch onChange={(e) => selfTrade(e.target.checked)} />} label="Is Self?" />

                        <Autocomplete
                            id="clientInfo"
                            options={clientInfo}
                            disabled={clientControl}
                            renderInput={params => (
                                <TextField {...params} label="Client Id"
                                    variant="outlined" size='small' />
                            )}
                            getOptionLabel={option => option.ClientIdNo}
                            style={{ width: 270 }}
                            onChange={(_event, newTeam) => {
                                PopulateSelectedClient(newTeam);
                            }}
                        />
                        <FormLabel>
                            Client Name:{seller.ClientName}
                        </FormLabel>
                        <FormLabel>
                            Status:{seller.Status}
                        </FormLabel>
                        <FormLabel>
                            Tin:{seller.TINNumber}
                        </FormLabel>
                        <FormLabel>
                            VAT:{seller.VATNumber}
                        </FormLabel>
                        <TextField label="Region" value={seller.Region!=null?seller.Region:''} variant="outlined" margin="dense" size="small" />
                        <TextField label="Zone" value={seller.Zone!=null?seller.Zone:''} variant="outlined" margin="dense" size="small" />
                        <TextField label="Woreda" value={seller.Woreda!=null?seller.Woreda:''} variant="outlined" margin="dense" size="small" />
                        <TextField label="House Number" value={seller.HouseNo!=null?seller.HouseNo:''} variant="outlined" margin="dense" size="small" />
                        <TextField label="Tel No" value={seller.Phone!=null?seller.Phone:''} variant="outlined" margin="dense" size="small" />

                        <Link
                            component="button"
                            variant="body2"
                            onClick={handleClickOpen}
                        >
                            View More Detail
                        </Link>
                    </FormControl>
            <MemberDetail bl={businessLiceness} ag={agreement} open={open} setOpen={(bool) => setOpen(bool)} />
        </div>
    );
}

