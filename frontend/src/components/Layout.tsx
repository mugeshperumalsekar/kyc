// import React, { useState } from 'react';
// import { Layout } from 'antd';
// import AppHeader from './Header';
// import AppSidebar from './Sidebar';

// const { Content } = Layout;

// const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [collapsed, setCollapsed] = useState(true); // Start with sidebar collapsed
//   const navigate = useNavigate();
//   const location = useLocation();
//   const userDetails = useSelector((state: any) => state.loginReducer);
//   const loginDetails = userDetails.loginDetails;
//   const toggleSidebar = () => {
//     setCollapsed(!collapsed);
//   };

//   return (
//     <Layout style={{ minHeight: '100vh' }}>
//       <AppSidebar collapsed={collapsed} />
//       <Layout className="site-layout">
//         <AppHeader collapsed={collapsed} toggleSidebar={toggleSidebar} />
//         <Content
//           style={{
//             // margin: '24px 16px',
//             padding: 11,
//             marginTop: 64, // To account for fixed header height
//             marginLeft: collapsed ? 80 : 200, // To account for fixed sidebar width
//             transition: 'margin 0.2s',
//             background:'whitesmoke',
//           }}
//         >
//           {children}
//         </Content>
//       </Layout>
//     </Layout>
//   );
// };

// export default AppLayout;

import React, { useState } from 'react';
import { Layout } from 'antd';
import AppHeader from './Header';
import AppSidebar from './Sidebar';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const { Content } = Layout;

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(true); // Start with sidebar collapsed
  const navigate = useNavigate();
  const location = useLocation();
  const userDetails = useSelector((state: any) => state.loginReducer);
  const loginDetails = userDetails.loginDetails;

  const roleId = loginDetails?.roleId;
  
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // Check if the user is an admin or super admin
  const isAdmin = roleId === 1 || roleId === 2;
  const isClient = roleId === 3;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {isAdmin && <AppSidebar collapsed={collapsed} />}
      <Layout className="site-layout">
      <AppHeader collapsed={collapsed} toggleSidebar={toggleSidebar} />
        <Content
          style={{
            padding: 11,
            marginTop: 64, // To account for fixed header height
            marginLeft: isAdmin ? (collapsed ? 80 : 200) : 0, // Adjust margins based on sidebar visibility
            transition: 'margin 0.2s',
            background: 'whitesmoke',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
