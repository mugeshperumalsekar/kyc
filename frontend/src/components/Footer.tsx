import React from 'react';
import { Layout } from 'antd';

const { Footer } = Layout;

const AppFooter: React.FC = () => {
  return (
    <Footer style={{ textAlign: 'center' }}>
      Ant Design ©2024 Created by Ant UED
    </Footer>
  );
};

export default AppFooter;
