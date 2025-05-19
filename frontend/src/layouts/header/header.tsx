import { useEffect, useState } from 'react';
import { styled, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Navigation from './navigation';
import ListItem from '@mui/material/ListItem';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import DashboardIcon from '@mui/icons-material/Dashboard';
import fraud2 from '../../../src/assets/fraud2.png';
import Branch from '../../../src/assets/Branch.png';
import decision from '../../../src/assets/decision.png';
import home from '../../../src/assets/home.png';
import detailsImage from '../../../src/assets/Details.png';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { Drafts as DraftsIcon } from '@mui/icons-material';
import Testing from '../../../src/assets/Testing.png';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useDispatch } from 'react-redux';
import { removeQuestionnaire } from '../../pages/KYC_NEW/Insert/state/save-application-action';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import StorageIcon from '@mui/icons-material/Storage';
import SecurityIcon from '@mui/icons-material/Security';
import ReportIcon from '@mui/icons-material/Report';
import { Menu, MenuItem } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { RiFlowChart } from "react-icons/ri";

const drawerWidth = 180;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(6)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(7)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
};

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  height: 50,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const Sidebar = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [detailsList, setDetailsList] = useState<{ name: string; code: string; link: string }[]>([]);
  const [isDetailsDropdownOpen, setIsDetailsDropdownOpen] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [NpciTesting, setNpciTesting] = useState<{ name: string; code: string; link: string }[]>([]);
  const [npciselectedMasters, setNpciSelectedMasters] = useState([]);
  const [NpcimastersList, setNpciMastersList] = useState<{ name: string; code: string; link: string }[]>([]);
  const [isNpciMastersDropdownOpen, setIsNpciMastersDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);

  const saveToLocalStorage = (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const getFromLocalStorage = (key: string) => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : null;
  };

  const removeDuplicates = (list: any[]) => {
    const uniqueList = list.filter((item, index, self) =>
      index === self.findIndex((t) => t.name === item.name)
    );
    return uniqueList;
  };

  const handleDraftClick = () => {
    sessionStorage.clear();
    localStorage.clear();
    navigate('/Pending');
  };

  const handleScreeningReviewClick = () => {
    navigate('/PepReport');
  };

  const handleUitestingClick = () => {
    navigate('/BankReport');
  };

  const handleScreensClick = () => {
    navigate('/ScreeningDetails');
  };

  const handleCmsLevelMappingClick = () => {
    navigate('/CmsLevelStatusMapping');
    handleMenuClose();
  };

  const handleCmsWorkflowClick = () => {
    navigate('/CmsWorkFlowMapping');
    handleMenuClose();
  };

  useEffect(() => {
    const accessPermissionData = location.state?.accessPermissionData;
    if (Array.isArray(accessPermissionData)) {
      const dashboarddata = accessPermissionData.filter((item) => item.header === '2');
      const adminData = accessPermissionData.filter((item) => item.header === '5');
      const detailsData = accessPermissionData.filter((item) => item.header === '3');
      const npcimastersData = accessPermissionData.filter((item) => item.header === '1');
      const NpciTesting = accessPermissionData.filter((item) => item.header === '4');
      setNpciTesting(NpciTesting);

      const mappedDetailsList: { name: string; code: string; link: string }[] = detailsData.map((details) => ({
        name: details.name,
        code: details.code,
        link: details.link,
      }));

      const mappedNpciMastersList: { name: string; code: string; link: string }[] = npcimastersData.map((master) => ({
        name: master.name,
        code: master.code,
        link: master.link,
      }));

      const uniqueNpciMastersList = removeDuplicates(mappedNpciMastersList);
      const uniqueDetailsList = removeDuplicates(mappedDetailsList);

      setDetailsList(uniqueDetailsList);
      setNpciMastersList(uniqueNpciMastersList);

      saveToLocalStorage('detailsList', uniqueDetailsList);
      saveToLocalStorage('NpcimastersList', uniqueNpciMastersList);
      saveToLocalStorage('mpciTesting', NpciTesting);

      const showDashboardButton = dashboarddata.length > 0;
      const showAdminButton = adminData.length > 0;

      if (showDashboardButton) {
        localStorage.setItem('showDashboardButton', 'true');
      } else {
        localStorage.removeItem('showDashboardButton');
      }

      if (showAdminButton) {
        localStorage.setItem('showAdminButton', 'true');
      } else {
        localStorage.removeItem('showAdminButton');
      }

    } else {

      const storedDetailsList = getFromLocalStorage('detailsList');
      const storedNpciMastersList = getFromLocalStorage('mastersList');
      const storednpciTesting = getFromLocalStorage('uiTesting');
      setDetailsList(storedDetailsList || []);
      setNpciMastersList(storedNpciMastersList || []);
      setNpciTesting(storednpciTesting || []);

    }
    return () => {
      setIsNpciMastersDropdownOpen(false);
      setIsDetailsDropdownOpen(false);
      setNpciSelectedMasters([]);
    };
  }, [location.state, setIsDetailsDropdownOpen, setIsNpciMastersDropdownOpen, setNpciSelectedMasters]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleDashboardClick = () => {
    // sessionStorage.clear();
    navigate('/dashboard');
    if (open) {
      setOpen(false);
    }
  };

  const handleFromeClick = () => {
    navigate('/From');
  };

  const handlefirstLevelpendingReviewClick = () => {
    navigate('/FirstLevelPending');
  };

  const handleSearchClick = () => {
    navigate('/Search');
  };

  const handleUiTestingCountryClick = () => {
    navigate('/uiTestingcountry');
  };

  const handleUiTestingNameClick = () => {
    navigate('/uiTestingname');
  };

  const handleUiTestingTwoPartClick = () => {
    navigate('/uiTestingtwopartrecords');
  };

  const handleBulkData = () => {
    navigate('/BulkData');
  };

  const handleBulkUpload = () => {
    navigate('/BulkUpload');
  };

  const handleBulkTaskAssign = () => {
    navigate('/SanTaskAssign');
  };

  const handlefirstLevelpendingClick = () => {
    navigate('/CmsFirstLevelPending');
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLevelMappingClick = () => {
    navigate('/LevelStatusMapping');
    handleMenuClose();
  };

  const handleWorkflowClick = () => {
    navigate('/WorkFlowMapping');
    handleMenuClose();
  };

  const handleMenuOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handlefirstLevelpeppendingClick = () => {
    navigate('/PepFirstLevelPending');
  };

  const { kycId, complaintId, uid } = useParams();
  const [currentSection, setCurrentSection] = useState(location.pathname);

  const handleItemClick = (path: any) => {
    sessionStorage.clear();
    localStorage.clear();
    dispatch(removeQuestionnaire());
    navigate(path);
    setCurrentSection(path);
    setOpen(true);
  };

  const renderHeadings = () => {
    switch (currentSection) {
      case '/Aml':
      case '/Amldetails':
      case '/QcViewdecision':
      case `/Amlteamview/${complaintId}/${uid}`:
        return (
          <>
            <List>
              <ListItemButton sx={{ height: '40px' }} onClick={() => handleItemClick('/Amldetails')}>
                <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center' }}>
                  <Tooltip title="Aml Qry" placement="right" arrow>
                    <img src={Branch} alt="Default Preview" style={{ maxHeight: '27px', maxWidth: '300px' }} />
                  </Tooltip>
                </ListItemIcon>
                <ListItemText primary="Aml Qry" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
              <ListItemButton sx={{ height: '40px' }} onClick={() => handleItemClick('/QcViewdecision')}>
                <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center' }}>
                  <Tooltip title="Decision" placement="right" arrow>
                    <img src={decision} alt="Default Preview" style={{ maxHeight: '27px', maxWidth: '300px' }} />
                  </Tooltip>
                </ListItemIcon>
                <ListItemText primary="Decision" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </List>
            <List>
              <ListItemButton sx={{ height: '40px' }} onClick={() => handleItemClick('/Amltemasdashboard')}>
                <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center' }}>
                  <Tooltip title="Aml Home" placement="right" arrow>
                    <img src={home} alt="Default Preview" style={{ maxHeight: '27px', maxWidth: '300px' }} />
                  </Tooltip>
                </ListItemIcon>
                <ListItemText primary="Aml Home" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </List>
          </>
        );
      case '/QcViewaml':
      case '/QcViewaml':
        return (
          <>
            <List>
              <Typography variant="h6" component="h6" style={{ color: '#1976d2' }}>
                Branch
              </Typography>
              <ListItemButton sx={{ height: '40px' }} onClick={() => handleItemClick('/QcViewaml')}>
                <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center' }}>
                  <Tooltip title="Branch To Aml" placement="right" arrow>
                    <img src={Branch} alt="Default Preview" style={{ maxHeight: '27px', maxWidth: '300px' }} />
                  </Tooltip>
                </ListItemIcon>
                <ListItemText primary="Branch To Aml" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </List>
            <List>
              <ListItemButton sx={{ height: '40px' }} onClick={() => handleItemClick('/Amltemasdashboard')}>
                <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center' }}>
                  <Tooltip title="Aml Home" placement="right" arrow>
                    <img src={home} alt="Default Preview" style={{ maxHeight: '27px', maxWidth: '300px' }} />
                  </Tooltip>
                </ListItemIcon>
                <ListItemText primary="Aml Home" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </List>
          </>
        );
      case '/PepFirstLevelPending':
      case '/LevelFlow':
      case '/ReportSearch':
      case '/WorkFlowMapping':
      case '/LevelStatusMapping':
        return (
          <List>
            <ListItemButton sx={{ height: '40px' }} onClick={() => navigate('/LevelFlow')}>
              <Tooltip title="Level Flow" placement="right" arrow>
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 2 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <RiFlowChart style={{ fontSize: '16px' }} />
                </ListItemIcon>
              </Tooltip>
              <ListItemText
                primary="Level Flow"
                sx={{ opacity: open ? 1 : 0 }}
                className={`custom-list-item-text ${open ? 'custom-list-item-text-open' : 'custom-list-item-text-closed'}`}
              />
            </ListItemButton>
            <ListItemButton sx={{
              height: '40px', fontFamily: "Bookman Old Style",
              fontSize: "12px"
            }} onClick={handlefirstLevelpeppendingClick}>
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 2 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <Tooltip title="First Level Pending" placement="right" arrow>
                  <HourglassTopIcon style={{ fontSize: '16px' }} />
                </Tooltip>
              </ListItemIcon>
              <ListItemText primary="First Level Pending" sx={{ opacity: open ? 1 : 0 }} className={`custom-list-item-text ${open ? 'custom-list-item-text-open' : 'custom-list-item-text-closed'}`} />
            </ListItemButton>
            <ListItemButton sx={{ height: '40px' }} onClick={() => navigate('/ReportSearch')}>
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 2 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <Tooltip title="Report" placement="right" arrow>
                  <BarChartIcon style={{ fontSize: '16px' }} />
                </Tooltip>
              </ListItemIcon>
              <ListItemText primary="Report" sx={{ opacity: open ? 1 : 0 }} className={`custom-list-item-text ${open ? 'custom-list-item-text-open' : 'custom-list-item-text-closed'}`} />
            </ListItemButton>
            <ListItemButton
              sx={{ height: '40px' }}
              onClick={handleMenuOpen}
            >
              <Tooltip title="Master" placement="right" arrow>
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 2 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <ArrowDropDownIcon style={{ fontSize: '16px' }} />
                </ListItemIcon>
              </Tooltip>
              <ListItemText
                primary="Master"
                sx={{ opacity: open ? 1 : 0 }}
                className={`custom-list-item-text ${open ? 'custom-list-item-text-open' : 'custom-list-item-text-closed'}`}
              />
            </ListItemButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleLevelMappingClick}>
                Level Mapping
              </MenuItem>
              <MenuItem onClick={handleWorkflowClick}>
                Workflow
              </MenuItem>
            </Menu>
          </List>
        );
      case '/Fraud':
        return (
          <List>
            <ListItemButton sx={{ height: '40px' }} onClick={() => navigate('/Fraud')}>
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <Tooltip title="Fraud" placement="right" arrow>
                  <img src={fraud2} alt="Default Preview" style={{ maxHeight: '27px', maxWidth: '300px' }} />
                </Tooltip>
              </ListItemIcon>
              <ListItemText primary="Fraud" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </List>
        );
      case '/AmlScam':
      case '/QcViewaml':
        return (
          <List>
            <ListItemButton sx={{ height: '40px' }} onClick={() => navigate('/AmlScam')}>
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <Tooltip title="Branch Info To Aml Team" placement="right" arrow>
                  <SecurityIcon />
                </Tooltip>
              </ListItemIcon>
              <ListItemText primary="BranchInfo To AmlTeam" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
            <ListItemButton sx={{ height: '40px' }} onClick={() => navigate('/QcViewaml')}>
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <Tooltip title="Aml Decision" placement="right" arrow>
                  <ReportIcon />
                </Tooltip>
              </ListItemIcon>
              <ListItemText primary="Aml Decision" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </List>
        );
      case '/CmsLevelFlow':
      case '/CmsFirstLevelPending':
      case '/ReportSearchcms':
      case '/CmsWorkFlowMapping':
      case '/CmsLevelStatusMapping':
        return (
          <List>
            <ListItemButton sx={{ height: '40px' }} onClick={() => navigate('/CmsLevelFlow')}>
              <Tooltip title="Level Flow" placement="right" arrow>
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 2 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <RiFlowChart style={{ fontSize: '16px' }} />
                </ListItemIcon>
              </Tooltip>
              <ListItemText
                primary="Level Flow"
                sx={{ opacity: open ? 1 : 0 }}
                className={`custom-list-item-text ${open ? 'custom-list-item-text-open' : 'custom-list-item-text-closed'}`}
              />
            </ListItemButton>
            <ListItemButton sx={{ height: '40px' }} onClick={handlefirstLevelpendingClick}>
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 2 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <Tooltip title="First Level Pending" placement="right" arrow>
                  <HourglassTopIcon />
                </Tooltip>
              </ListItemIcon>
              <ListItemText primary="First Level Pending" sx={{ opacity: open ? 1 : 0 }}
                className={`custom-list-item-text ${open ? 'custom-list-item-text-open' : 'custom-list-item-text-closed'}`} />
            </ListItemButton>
            <ListItemButton sx={{ height: '40px' }} onClick={() => navigate('/ReportSearchcms')}>
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 2 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <Tooltip title="Report" placement="right" arrow>
                  <BarChartIcon />
                </Tooltip>
              </ListItemIcon>
              <ListItemText primary="Report" sx={{ opacity: open ? 1 : 0 }}
                className={`custom-list-item-text ${open ? 'custom-list-item-text-open' : 'custom-list-item-text-closed'}`} />
            </ListItemButton>
            <ListItemButton
              sx={{ height: '40px' }}
              onClick={handleMenuOpen}
            >
              <Tooltip title="Master" placement="right" arrow>
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 2 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <ArrowDropDownIcon style={{ fontSize: '16px' }} />
                </ListItemIcon>
              </Tooltip>
              <ListItemText
                primary="Master"
                sx={{ opacity: open ? 1 : 0 }}
                className={`custom-list-item-text ${open ? 'custom-list-item-text-open' : 'custom-list-item-text-closed'}`}
              />
            </ListItemButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleCmsLevelMappingClick}>
                Level Mapping
              </MenuItem>
              <MenuItem onClick={handleCmsWorkflowClick}>
                Workflow
              </MenuItem>
            </Menu>
          </List>
        );
      case '/FlowLevel':
      case '/SanctionSearch':
      case '/FirstLevelPending':
      case '/Search':
      case '/uiTestingcountry':
      case '/uiTestingname':
      case '/uiTestingtwopartrecords':
      case '/BulkData':
      case '/BulkUpload':
      case '/SanTaskAssign':
        return (
          <List>
            <ListItemButton sx={{ height: '40px' }} onClick={() => navigate('/FlowLevel')}>
              <Tooltip title="Level Flow" placement="right" arrow>
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 2 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <RiFlowChart style={{ fontSize: '16px' }} />
                </ListItemIcon>
              </Tooltip>
              <ListItemText
                primary="Level Flow"
                sx={{ opacity: open ? 1 : 0 }}
                className={`custom-list-item-text ${open ? 'custom-list-item-text-open' : 'custom-list-item-text-closed'}`}
              />
            </ListItemButton>
            <ListItemButton sx={{ height: '40px' }} onClick={handlefirstLevelpendingReviewClick}>
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 2 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <Tooltip title="First Level Pending" placement="right" arrow>
                  <HourglassTopIcon />
                </Tooltip>
              </ListItemIcon>
              <ListItemText primary="First Level Pending" sx={{ opacity: open ? 1 : 0 }}
                className={`custom-list-item-text ${open ? 'custom-list-item-text-open' : 'custom-list-item-text-closed'}`} />
            </ListItemButton>
            <ListItemButton sx={{ height: '40px' }} onClick={() => navigate('/SanctionSearch')}>
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 2 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <Tooltip title="Report" placement="right" arrow>
                  <BarChartIcon />
                </Tooltip>
              </ListItemIcon>
              <ListItemText primary="Report" sx={{ opacity: open ? 1 : 0 }}
                className={`custom-list-item-text ${open ? 'custom-list-item-text-open' : 'custom-list-item-text-closed'}`} />
            </ListItemButton>
            <ListItemButton sx={{ height: '40px' }} onClick={handleSearchClick}>
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 2 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <Tooltip title="UI Testing Search" placement="right" arrow>
                  <SearchOffIcon />
                </Tooltip>
              </ListItemIcon>
              <ListItemText primary="UI Testing Search" sx={{ opacity: open ? 1 : 0 }}
                className={`custom-list-item-text ${open ? 'custom-list-item-text-open' : 'custom-list-item-text-closed'}`} />
            </ListItemButton>
            <ListItemButton sx={{ height: '40px' }} onClick={handleUiTestingCountryClick}>
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 2 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <Tooltip title="UI Testing Country" placement="right" arrow>
                  <SearchOffIcon />
                </Tooltip>
              </ListItemIcon>
              <ListItemText primary="UI Testing Country" sx={{ opacity: open ? 1 : 0 }}
                className={`custom-list-item-text ${open ? 'custom-list-item-text-open' : 'custom-list-item-text-closed'}`} />
            </ListItemButton>
            <ListItemButton sx={{ height: '40px' }} onClick={handleUiTestingNameClick}>
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 2 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <Tooltip title="UI Testing Name" placement="right" arrow>
                  <SearchOffIcon />
                </Tooltip>
              </ListItemIcon>
              <ListItemText primary="UI Testing Name" sx={{ opacity: open ? 1 : 0 }}
                className={`custom-list-item-text ${open ? 'custom-list-item-text-open' : 'custom-list-item-text-closed'}`} />
            </ListItemButton>
            <ListItemButton sx={{ height: '40px' }} onClick={handleUiTestingTwoPartClick}>
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 2 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <Tooltip title="UI Testing TwoPart" placement="right" arrow>
                  <SearchOffIcon />
                </Tooltip>
              </ListItemIcon>
              <ListItemText primary="UI Testing TwoPart" sx={{ opacity: open ? 1 : 0 }}
                className={`custom-list-item-text ${open ? 'custom-list-item-text-open' : 'custom-list-item-text-closed'}`} />
            </ListItemButton>
            <ListItemButton sx={{ height: '40px' }} onClick={handleBulkData}>
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 2 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <Tooltip title="Bulk Data" placement="right" arrow>
                  <StorageIcon />
                </Tooltip>
              </ListItemIcon>
              <ListItemText primary="Bulk Data" sx={{ opacity: open ? 1 : 0 }}
                className={`custom-list-item-text ${open ? 'custom-list-item-text-open' : 'custom-list-item-text-closed'}`} />
            </ListItemButton>

            <ListItemButton sx={{ height: '40px' }} onClick={handleBulkUpload}>
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 2 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <Tooltip title="Bulk Upload" placement="right" arrow>
                  <StorageIcon />
                </Tooltip>
              </ListItemIcon>
              <ListItemText primary="Bulk Upload" sx={{ opacity: open ? 1 : 0 }}
                className={`custom-list-item-text ${open ? 'custom-list-item-text-open' : 'custom-list-item-text-closed'}`} />
            </ListItemButton>
            <ListItemButton sx={{ height: '40px' }} onClick={handleBulkTaskAssign}>
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 2 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <Tooltip title="Bulk Task Assign" placement="right" arrow>
                  <AssignmentIcon />
                </Tooltip>
              </ListItemIcon>
              <ListItemText primary="Bulk Task Assign" sx={{ opacity: open ? 1 : 0 }}
                className={`custom-list-item-text ${open ? 'custom-list-item-text-open' : 'custom-list-item-text-closed'}`} />
            </ListItemButton>
          </List>
        );
      case '/From':
      case '/Pending':
      case `/Draft/${kycId}`:
        return (
          <Drawer variant="permanent" open={open}>
            <DrawerHeader>
              <Typography variant="h4" component="h4" style={{ color: '#1976d2' }}>
                PONSUN
              </Typography>
              <IconButton onClick={() => { setOpen(!open) }}>
                {open ? <ChevronRightIcon /> : <ChevronLeftIcon />}
              </IconButton>
            </DrawerHeader>
            <Divider />
            <List>
              <List>
                <ListItemButton sx={{ height: '40px' }} onClick={() => handleItemClick('/DashboardKYC')}>
                  <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : 'auto', justifyContent: 'center' }}>
                    <Tooltip title="KYC Home" placement="right" arrow>
                      <img src={home} alt="Default Preview" style={{ maxHeight: '20px', maxWidth: '300px' }} />
                    </Tooltip>
                  </ListItemIcon>
                  <ListItemText primary="KYC Home" sx={{ opacity: open ? 1 : 0 }} className={`custom-list-item-text ${open ? 'custom-list-item-text-open' : 'custom-list-item-text-closed'}`} />
                </ListItemButton>
              </List>
              <ListItem disablePadding sx={{ display: 'block' }} onClick={handleDashboardClick}>
                <Tooltip title="Dashboard" placement="right" arrow>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 2 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard " sx={{ opacity: open ? 1 : 0 }} className={`custom-list-item-text ${open ? 'custom-list-item-text-open' : 'custom-list-item-text-closed'}`} />
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            </List>
            {detailsList.length > 0 && (
              <List>
                <ListItem disablePadding sx={{ display: 'block' }} onClick={handleFromeClick}>
                  <Tooltip title="Client form" placement="right" arrow>
                    <ListItemButton
                      sx={{ height: '40px' }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 2 : 'auto',
                          justifyContent: 'center',
                        }}
                      >
                        <img src={detailsImage} alt="Default Preview" style={{ maxHeight: '20px', maxWidth: '50px' }} />

                      </ListItemIcon>
                      <ListItemText primary=" Client form " sx={{ opacity: open ? 1 : 0 }} className={`custom-list-item-text ${open ? 'custom-list-item-text-open' : 'custom-list-item-text-closed'}`} />
                    </ListItemButton>
                  </Tooltip>
                </ListItem>
              </List>
            )}
            <List>
              <ListItem disablePadding sx={{ display: 'block' }} onClick={handleDraftClick}>
                <Tooltip title="Draft" placement="right" arrow>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 2 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      <DraftsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Draft" sx={{ opacity: open ? 1 : 0 }} className={`custom-list-item-text ${open ? 'custom-list-item-text-open' : 'custom-list-item-text-closed'}`} />
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            </List>
          </Drawer>
        );
      case '/BankReport':
      case `/BankHeader/${kycId}`:
      case '/PepReport':
      case `/Pep/${kycId}`:
      case '/ScreeningDetails':
      case '/pepSearchDetails':
      case '/cmsSearchDetails':
      case '/SancSearchDetails':
        return (
          <Drawer variant="permanent" open={open}>
            <DrawerHeader>
              <Typography variant="h4" component="h4" style={{ color: '#1976d2' }}>
                PONSUN
              </Typography>
              <IconButton onClick={() => { setOpen(!open) }}>
                {open ? <ChevronRightIcon /> : <ChevronLeftIcon />}
              </IconButton>
            </DrawerHeader>
            <Divider />
            <List>
              <List>
                <ListItemButton sx={{ height: '40px' }} onClick={() => handleItemClick('/DashboardKYC')}>
                  <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : 'auto', justifyContent: 'center' }}>
                    <Tooltip title="KYC Home" placement="right" arrow>
                      <img src={home} alt="Default Preview" style={{ maxHeight: '20px', maxWidth: '300px' }} />
                    </Tooltip>
                  </ListItemIcon>
                  <ListItemText primary="KYC Home" sx={{ opacity: open ? 1 : 0 }} className={`custom-list-item-text ${open ? 'custom-list-item-text-open' : 'custom-list-item-text-closed'}`} />
                </ListItemButton>
              </List>
              <ListItem disablePadding sx={{ display: 'block' }} onClick={handleDashboardClick}>
                <Tooltip title="Dashboard" placement="right" arrow>
                  <ListItemButton
                    sx={{
                      minHeight: 40,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 2 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard " sx={{ opacity: open ? 1 : 0 }} className={`custom-list-item-text ${open ? 'custom-list-item-text-open' : 'custom-list-item-text-closed'}`} />
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            </List>
            <List>
              <ListItem disablePadding sx={{ display: 'block' }} onClick={handleUitestingClick}>
                <Tooltip title="NPCI Review" placement="right" arrow>
                  <ListItemButton
                    sx={{
                      minHeight: 40,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 2 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      <img src={Testing} alt="Default Preview" style={{ maxHeight: '20px', maxWidth: '300px' }} />
                    </ListItemIcon>
                    <ListItemText primary=" NPCI Review " sx={{ opacity: open ? 1 : 0 }} className={`custom-list-item-text ${open ? 'custom-list-item-text-open' : 'custom-list-item-text-closed'}`} />
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            </List>
            <List>
              <ListItem disablePadding sx={{ display: 'block' }} onClick={handleScreeningReviewClick}>
                <Tooltip title="Screening Review" placement="right" arrow>
                  <ListItemButton
                    sx={{
                      minHeight: 40,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 2 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      <img src={Testing} alt="Default Preview" style={{ maxHeight: '20px', maxWidth: '300px' }} />
                    </ListItemIcon>
                    <ListItemText primary="Screening Review" sx={{ opacity: open ? 1 : 0 }} className={`custom-list-item-text ${open ? 'custom-list-item-text-open' : 'custom-list-item-text-closed'}`} />
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            </List>
            <List>
              <ListItem disablePadding sx={{ display: 'block' }} onClick={handleScreensClick}>
                <Tooltip title="Screening Details" placement="right" arrow>
                  <ListItemButton
                    sx={{
                      minHeight: 40,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 2 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      <FindInPageIcon style={{ maxHeight: '27px', maxWidth: '300px' }} />
                    </ListItemIcon>
                    <ListItemText primary="Screening Details" sx={{ opacity: open ? 1 : 0 }} className={`custom-list-item-text ${open ? 'custom-list-item-text-open' : 'custom-list-item-text-closed'}`} />
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            </List>
          </Drawer>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} style={{ height: '50px' }}>
        <Toolbar>
          <Tooltip title="Menu">
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
          </Tooltip>
          <Navigation />
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <Typography variant="h4" component="h4" style={{ color: '#1976d2' }}>
            PONSUN
          </Typography>
          <IconButton onClick={handleDrawerClose}>
            {open ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        {renderHeadings()}
        <Divider />
      </Drawer>
    </Box>
  );
}

export default Sidebar;