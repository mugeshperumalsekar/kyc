import React, { useEffect, useState } from 'react';
import { Layout, Menu } from 'antd';
import { UserOutlined, VideoCameraOutlined, UploadOutlined, SearchOutlined, DatabaseOutlined } from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Sidebar.css';
import { useSelector } from 'react-redux';
import { DashboardOutlined } from '@mui/icons-material';
import { LoginActionTypes } from '../pages/State/loginAction';
import AuthConfigModuleModuleDetApiService from '../data/services/configmodulemoduledet/authu-configmodulemoduledet-api-service';

const { Sider } = Layout;
const { SubMenu } = Menu;

interface AppSidebarProps {
  collapsed: boolean;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const loginReducer: any = useSelector((state: LoginActionTypes) => state);
  const [roleId] = useState(loginReducer?.roleId);
  const [mastersList, setMastersList] = useState<{ name: string; code: string; link: string }[]>([]);
  const [adminData, setAdminData] = useState<{ name: string; code: string; link: string }[]>([]);
  const [SearchData, setSearchData] = useState<{ name: string; code: string; link: string }[]>([]);
  const [dashboardData, setDashboardData] = useState<{ name: string; code: string; link: string }[]>([]);
  const [selectedKey, setSelectedKey] = useState<string>(location.pathname);
  const authConfigModuleModuleDetService = new AuthConfigModuleModuleDetApiService();
  const [menuData, setMenuData] = useState<any[]>([]);

  
  const handleMastersSelect = (link: string) => {
    navigate(link);
  };

  const saveToLocalStorage = (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const getFromLocalStorage = (key: string) => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : null;
  };


  const userDetails = useSelector((state: any) => state.loginReducer);
  const userFirstName = userDetails.userData?.firstName;
  const loginDetails = userDetails.loginDetails;


  const handleMenuClick = (link:any) => {
    if (loginDetails.id) {
      navigate(link, { state: { userId: loginDetails.id } });
    }
  };
 
  const constructMapData = (data: any) => {
    const result: any = {};
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const { modName, modDetId, modDetName, modId, link } = item;

      if (!result[modName]) {
        result[modName] = {
          feature: modName,
          link:link,
          subfeatures: [],
        };
      }
      result[modName].subfeatures.push({
        modid: modId,
        moddetid: modDetId,
        modname: modName,
        moddetname: modDetName,
        link: link
      });
    }

    return Object.values(result);
  };

  useEffect(() => {
    const accessPermissionData = location.state?.accessPermissionData;
    console.log("accessPermissionData=============>>>", accessPermissionData);
    if(accessPermissionData){
    let data = constructMapData(accessPermissionData);
    console.log("data nav =============>>>", data);
    saveToLocalStorage('menuData', data);
    setMenuData([...data]);
    }else{
      let data = getFromLocalStorage('menuData');
      setMenuData([...Array.isArray(data) ? data : []]);
    }
   
    return () => {
      setMastersList([]);
    };
  }, [location.state]);

  useEffect(() => {
    setSelectedKey(location.pathname);
  }, [location.pathname]);

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={200}
      className="site-layout-background"
      style={{
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
      }}
      onMouseEnter={() => {
        document.querySelector('.ant-layout-sider')?.classList.add('ant-layout-sider-expanded');
      }}
      onMouseLeave={() => {
        document.querySelector('.ant-layout-sider')?.classList.remove('ant-layout-sider-expanded');
      }}
    >
      <div className="demo-logo-vertical" style={{ height: '32px', margin: '16px', color: 'white', textAlign: 'center' }}>
        LOGO
      </div>
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        style={{ height: '100%', borderRight: 0 }}
      >

    {menuData && menuData.map((item) => {
      const isSearch = item.feature.toLowerCase().includes("search");
      const isAdmin = item.feature.toLowerCase().includes("admin");
        if (item.subfeatures.length === 1) {
          const subfeature = item.subfeatures[0];
          return (
            <Menu.Item
              key={subfeature.link}
              onClick={() => handleMenuClick(item.link)}
              // icon={<DashboardOutlined className='sidebar-link' />
                icon={
                  isSearch ? <SearchOutlined className='sidebar-link' /> : 
                  isAdmin ? <UserOutlined className='sidebar-link' /> : 
                  <DashboardOutlined className='sidebar-link' />
                }
                
            
            >
              <Link to={subfeature.link} className='sibebar-link'>
                {item.feature}
              </Link>
            </Menu.Item>
          );
        }

        if (item.subfeatures.length > 1) {
          return (
            <Menu.SubMenu
              key={item.feature}
              title={item.feature}
              icon={<DatabaseOutlined />}
            >
              {item.subfeatures.map((master:any) => (
                <Menu.Item
                  key={master.link}
                  onClick={() => handleMastersSelect(master.link)}
                >
                  {master.moddetname}
                </Menu.Item>
              ))}
            </Menu.SubMenu>
          );
        }
        return null;
      })}
         

       
      </Menu>
    </Sider>
  );
};

export default AppSidebar;