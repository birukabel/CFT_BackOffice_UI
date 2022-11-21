import { Box } from '@mui/material';
import { DataGrid, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react'
import { get } from '../../Utility/APIHelper';


function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }
export function CollateralizedReport() {
    const[data,setData]=useState([]);
    useEffect(() => {
        PopulateReport();
      }, []);
      const PopulateReport = () => {
        get(`Contract/colateralizedreport`).then((result) => {
          if (result.data) {
            setData(result.data);
          }
        });
      };
   const columns = [
        { field: "ContractNumber", headerName: "ContractNumber", width: 120 },
        { field: "Amount", headerName: "Amount", width: 85 },
        { field: "AccountNumber", headerName: "AccountNumber", width: 85 },
        { field: "ContractDate", headerName: "Contract Date", width: 120 },
        { field: "MaturityDate", headerName: "Maturity Date", width: 120 },
        { field: "MarginStatus", headerName: "MarginStatus", width: 90 },
      ];
      const rows = data.map((row) => ({
        id: row.ContractNumber,
        ContractNumber: row.ContractNumber,
        Amount: row.Amount,
        AccountNumber: row.AccountNumber,
        ContractDate: dayjs(row.ContractDate).format("LL"),
        MaturityDate: dayjs(row.MaturityDate).format("LL"),
        MarginStatus: row.MarginStatus,
      }));

  return (
    <Box sx={{ height: 700, width: "100%" }}>
    <DataGrid
      columns={columns}
      rows={rows}
      pageSize={10}
      components={{
        Toolbar: CustomToolbar,
      }}
    />
  </Box>
  )
}
