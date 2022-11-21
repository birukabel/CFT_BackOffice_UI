import React, { useState } from 'react';
import {
    FormControl, FormControlLabel, FormLabel, Stack, CardContent, Card,
    TextField, Button, Switch, Link, Select, MenuItem, InputLabel, CardHeader
} from '@mui/material';
import { MemberDetail } from './MemberDetail';


export function Buyer() {
    const [open, setOpen] = React.useState(false); 

    const [buyer, setBuyer] = useState({
        MemberId: '',
        MemberName: '',
        Status: '',
        ClientId: '',
        ClientName: '',
        TINNumber: '',
        VATNumber: '',
        Region: '',
        Zone: '',
        Woreda: '',
        HouseNo: '',
        Phone: '',
        IsSeller: ''
    });
  const handleClickOpen = () => {
    setOpen(true);
  };
    const [buyerclient, setBuyerClient] = useState("");
    const onBuyerCheckedChanged = () => {
        //enable and disable clinet controls
    }

    const onBuyerClientChanged = (_buyerclientid) => {

    }

    const onBuyerViewDetailClicked = () => {

    }

    return (
        <div>
        <Card style={{ backgroundColor: "rgb(255 248 218)", minWidth: 400 }}>
            <CardHeader title={"Buyer Information"}/>
            <CardContent>
                <FormControl>
                    <Stack direction="row">
                        <TextField id="outlined-basic" label="Member Id" size='small' variant="outlined" ></TextField>
                        
                    </Stack>

                    <FormLabel size="small" margin="dense">
                        Member Name:{ }
                    </FormLabel>
                    <FormControlLabel control={<Switch  onChange={onBuyerCheckedChanged} />} label="Is Self?" />

                    <TextField
                        size="small"
                        labelId="buyerclientid"
                        value={buyerclient}
                        label="Client ID"
                        margin="dense"
                        select 
                        onChange={(e) => onBuyerClientChanged(e.target.value)}
                    >
                        <MenuItem>Ten</MenuItem>
                    </TextField>
                    <FormLabel margin="dense">
                        Client Name:{ }
                    </FormLabel>
                    <FormLabel margin="dense">
                        Status:{ }
                    </FormLabel>
                    <FormLabel>
                        Tin:{ }
                    </FormLabel>
                    <FormLabel>
                        VAT:{ }
                    </FormLabel>
                    <TextField label="Region" variant="outlined" margin="dense" size="small" />
                    <TextField label="Zone" variant="outlined" margin="dense" size="small" />
                    <TextField label="Woreda" variant="outlined" margin="dense" size="small" />
                    <TextField label="House Number" variant="outlined" margin="dense" size="small" />
                    <TextField label="Tel No" variant="outlined" margin="dense" size="small" />
                    <Link
                        component="button"
                        variant="body2"
                        onClick={handleClickOpen}
                    >
                        View More Detail
                    </Link>
                </FormControl>
            </CardContent>
        </Card>
       
       </div>
    );
}
