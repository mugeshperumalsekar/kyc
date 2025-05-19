import React, { useState } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SettingsIcon from '@mui/icons-material/Settings';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu } from "@mui/material";
import { FormatSize, FormatBold } from "@mui/icons-material";
import { IconButton, Tooltip } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { Button, Grid, MenuItem } from '@mui/material';
import { removeQuestionnaire } from '../../pages/KYC_NEW/Insert/state/save-application-action';

const Navigation = () => {

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [formatAnchorEl, setFormatAnchorEl] = useState<null | HTMLElement>(null);
  const [fontSizeAnchorEl, setFontSizeAnchorEl] = useState<null | HTMLElement>(null);
  const [fontFamily, setFontFamily] = useState<string>("Arial");
  const [fontSize, setFontSize] = useState<string>("16");
  const [open, setOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const userDetails = useSelector((state: any) => state.loginReducer);
  const loginDetails = userDetails.loginDetails;
  const dispatch = useDispatch();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFormatClick = (event: React.MouseEvent<HTMLLIElement>) => {
    setFormatAnchorEl(event.currentTarget);
  };

  const handleFontSizeClick = (event: React.MouseEvent<HTMLLIElement>) => {
    setFontSizeAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(false);
    setAnchorEl(null);
    setFormatAnchorEl(null);
    setFontSizeAnchorEl(null);
  };

  const changeFontSize = (fontSize: number) => {
    setFontSize(fontSize.toString());
    const elements = document.querySelectorAll("*");
    elements.forEach((element) => {
      if (element instanceof HTMLElement) {
        element.style.fontSize = `${fontSize}px`;
      }
    });
  };

  const changeFontFamily = (fontFamily: string) => {
    setFontFamily(fontFamily);
    const elements = document.querySelectorAll("*");
    elements.forEach((element) => {
      if (element instanceof HTMLElement) {
        element.style.fontFamily = fontFamily;
      }
    });
  };

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    dispatch(removeQuestionnaire());
    navigate('/login');
  };

  const handleAccountBalanceClick = () => {
    sessionStorage.clear();
    navigate('/scpk/dashboard');
  };

  return (
    <>
      <Navbar expand="sm" style={{ display: 'contents' }}>
        <Grid item xs={2}>
          <NavLink to="/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>
            {/* <h6 style={{ fontSize: '16px' }}> <AccountBalanceIcon style={{ fontSize: '14px' }} onClick={handleAccountBalanceClick} /></h6> */}
            <h6 style={{ fontSize: '16px' }}> <AccountBalanceIcon style={{ fontSize: '14px' }} /></h6>
          </NavLink>
        </Grid>
        <Navbar.Brand href="/scpk/dashboard" className='allhref' style={{ color: "white", marginLeft: '26px' }}>PONSUN Look Up</Navbar.Brand>
        <Navbar.Collapse id="navbarScroll" className="justify-content-end">
          <div className="d-lg-none">
            <IconButton color="inherit" onClick={() => navigate('/')}>
              <ExitToAppIcon />
            </IconButton>
          </div>
          <Tooltip title="Settings">
            <Button color="inherit"
              aria-controls="settings-menu"
              aria-haspopup="true"
              onClick={handleClick}
            ><SettingsIcon style={{ fontSize: '14px' }} /></Button></Tooltip>
          <Menu
            id="settings-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleFormatClick}>
              <FormatBold />
              Format
            </MenuItem>
            <MenuItem onClick={handleFontSizeClick}>
              <FormatSize />
              Font Size
            </MenuItem>
          </Menu>
          <Menu
            id="format-menu"
            anchorEl={formatAnchorEl}
            open={Boolean(formatAnchorEl)}
            onClose={handleClose}
          >
            <div className="icon-wrapper">
              <Menu
                id="settings-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={() => changeFontFamily("Arial")}>
                  Arial
                </MenuItem>
                <MenuItem
                  onClick={() => changeFontFamily("Times New Roman")}
                >
                  Times New Roman
                </MenuItem>
                <MenuItem onClick={() => changeFontFamily("Helvetica")}>
                  Helvetica
                </MenuItem>
                <MenuItem onClick={() => changeFontFamily("Garamond")}>
                  Garamond
                </MenuItem>
                <MenuItem onClick={() => changeFontFamily("Bodoni")}>
                  Bodoni
                </MenuItem>
                <MenuItem onClick={() => changeFontFamily("Verdana")}>
                  Verdana
                </MenuItem>
                <MenuItem onClick={() => changeFontFamily("Rockwell")}>
                  Rockwell
                </MenuItem>
                <MenuItem onClick={() => changeFontFamily("Avenir")}>
                  Avenir
                </MenuItem>
                <MenuItem onClick={() => changeFontFamily("Tahoma")}>
                  Tahoma
                </MenuItem>
                <MenuItem
                  onClick={() => changeFontFamily("Brush Script MT")}
                >
                  Brush Script MT
                </MenuItem>
              </Menu>
            </div>
          </Menu>
          <Menu
            id="font-size-menu"
            anchorEl={fontSizeAnchorEl}
            keepMounted
            open={Boolean(fontSizeAnchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={() => changeFontSize(9)}>9</MenuItem>
            <MenuItem onClick={() => changeFontSize(10)}>10</MenuItem>
            <MenuItem onClick={() => changeFontSize(12)}>12</MenuItem>
            <MenuItem onClick={() => changeFontSize(14)}>14</MenuItem>
            <MenuItem onClick={() => changeFontSize(16)}>16</MenuItem>
            <MenuItem onClick={() => changeFontSize(20)}>20</MenuItem>
            <MenuItem onClick={() => changeFontSize(22)}>22</MenuItem>
            <MenuItem onClick={() => changeFontSize(24)}>24</MenuItem>
            <MenuItem onClick={() => changeFontSize(28)}>28</MenuItem>
          </Menu>
        </Navbar.Collapse>
        <Navbar >
          <Navbar.Collapse id="navbarScroll" className="justify-content-end">
            <p style={{ marginBottom: '1%' }}>Welcome, <span style={{ marginRight: '11px' }}>{loginDetails.username}</span></p>
            <Tooltip title="Logout">
              <IconButton className="d-none d-lg-block" color="inherit" onClick={handleLogout}>
                <LogoutIcon style={{ fontSize: '14px' }} />
              </IconButton>
            </Tooltip>
          </Navbar.Collapse>
        </Navbar>
      </Navbar>
    </>
  );
}

export default Navigation;