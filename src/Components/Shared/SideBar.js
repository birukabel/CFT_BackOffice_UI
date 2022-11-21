import React from "react";
import './SideBar.css';
import { Stack } from '@mui/material';
import { TextSnippetOutlined, AssessmentOutlined, AccessTimeOutlined, ExpandMoreOutlined } from '@mui/icons-material'

function SideBar() {
    return (
        <div className="sideBar">
            <Stack direction="row" spacing={2} className="logo">
                <img src={window.location.origin + '/images/ECXLogo.png'} alt="ECX Logo"></img>
            </Stack>

            <ul className="menu">
                <li>
                    <span><TextSnippetOutlined /></span>
                    <a href="./ContractSummary">Contracts</a>
                </li>
                <li>
                    <span><AccessTimeOutlined /></span>
                    <a href="./Session">Session</a></li>
                <li>
                    <span><AssessmentOutlined /></span>
                    <a href="./CollateralizedReport"> Report</a>
                 
                    <span><ExpandMoreOutlined /></span>
                    <ol className="subMenu">
                        
                        <li><a href="./FloorReport">Floor Report</a></li>
                        <li><a href="./AcceptedReport">Accepted Report</a></li>
                        <li><a href="./SignSheet">Sign Sheet</a></li></ol>
                </li>
            </ul>
        </div>
    );
}

export { SideBar };