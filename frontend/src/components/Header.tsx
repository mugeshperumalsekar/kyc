// import React from 'react';
// import { Layout, Button } from 'antd';
// import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
// import Navigation from './navigation';

// const { Header } = Layout;

// interface AppHeaderProps {
//   collapsed: boolean;
//   toggleSidebar: () => void;
// }

// const AppHeader: React.FC<AppHeaderProps> = ({ collapsed, toggleSidebar }) => {
//   return (
//     <Header
//       style={{
//         display: 'flex',
//         alignItems: 'center',
//         padding: 0,
//         background: '#0d6efd',
//         position: 'fixed',
//         width: '100%',
//         zIndex: 1,
//       }}
//     >
//       <Button
//         type="text"
//         icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
//         onClick={toggleSidebar}
//         style={{
//           fontSize: '16px',
//           width: 64,
//           height: 64,
//           color: 'white'
//         }}
//       />
//          <Navigation />
//     </Header>
//   );
// };

// export default AppHeader;

import React from 'react';
import { Layout, Button } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import Navigation from './navigation';
import { useSelector } from 'react-redux';

const { Header } = Layout;

interface AppHeaderProps {
  collapsed: boolean;
  toggleSidebar: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ collapsed, toggleSidebar }) => {
  // Move the useSelector hook inside the component
  const userDetails = useSelector((state: any) => state.loginReducer);
  const loginDetails = userDetails.loginDetails;
  const roleId = loginDetails?.roleId;

  return (
    <Header
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: 0,
        background: '#0d6efd',
        position: 'fixed',
        width: '100%',
        zIndex: 1,
      }}
    >
      {(roleId === 1 || roleId === 2) && (
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={toggleSidebar}
          style={{
            fontSize: '16px',
            width: 64,
            height: 64,
            color: 'white'
          }}
        />
      )}
      <Navigation />
    </Header>
  );
};

export default AppHeader;

