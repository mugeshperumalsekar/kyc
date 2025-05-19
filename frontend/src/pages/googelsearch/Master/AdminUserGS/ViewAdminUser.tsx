import React from 'react';
import { format } from 'date-fns';
import { Modal, Typography, Badge, Button, Row, Col, Descriptions } from 'antd';
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  TeamOutlined,
  CalendarOutlined,
  StarOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';

const { Title } = Typography;

interface ViewAdminUser {
  id: string;
  fullName: string;
  userName: string;
  loginId: string;
  dob: string;
  genderId: string;
  phoneNo: string;
  validFrm: string;
  validTo: string;
  maritalStatusId: string;
  adminGroup: string;
  password: string;
  superUser: number;
  email: string;
  status: string;
}

interface ViewAdminUserProps {
  employee: ViewAdminUser;
  handleClose: () => void;
}

const ViewAdminUser: React.FC<ViewAdminUserProps> = ({ employee, handleClose }) => {
  const formattedDob = employee.dob ? format(new Date(employee.dob), 'dd-MMM-yyyy') : 'Not Available';

  const getStatusBadge = (status: string) => {
    let color;
    switch (status) {
      case 'ACTIVE':
        color = 'green';
        break;
      case 'DELETE':
        color = 'red';
        break;
      default:
        color = 'blue';
    }
    return <Badge color={color} text={status} />;
  };

  return (
    <Modal
      title="User Details"
      visible
      onCancel={handleClose}
      footer={null}
      width={600}
      style={{ top: 20 }}
      centered
    >
      <Descriptions
        bordered
        size="middle"
        column={1}
        labelStyle={{ fontWeight: 600, backgroundColor: '#f5f5f5', width: '30%' }}
        contentStyle={{ paddingLeft: 16, paddingRight: 16 }}
      >
        <Descriptions.Item label={<><UserOutlined /> User Name</>}>
          {employee.userName || 'Not Available'}
        </Descriptions.Item>
        <Descriptions.Item label={<><UserOutlined /> Full Name</>}>
          {employee.fullName || 'Not Available'}
        </Descriptions.Item>
        <Descriptions.Item label={<><CalendarOutlined /> Date of Birth</>}>
          {formattedDob}
        </Descriptions.Item>
        <Descriptions.Item label={<><PhoneOutlined /> Phone Number</>}>
          {employee.phoneNo || 'Not Available'}
        </Descriptions.Item>
        <Descriptions.Item label={<><MailOutlined /> Email Id</>}>
          {employee.email || 'Not Available'}
        </Descriptions.Item>
        <Descriptions.Item label={<><TeamOutlined /> Admin Group</>}>
          {employee.adminGroup || 'Not Available'}
        </Descriptions.Item>
        <Descriptions.Item label={<><CheckCircleOutlined /> Status</>}>
          {employee.status ? getStatusBadge(employee.status) : 'Not Available'}
        </Descriptions.Item>
        <Descriptions.Item label={<><StarOutlined /> Super User</>}>
          {employee.superUser ? 'Yes' : 'No'}
        </Descriptions.Item>
      </Descriptions>
      <Row justify="end" style={{ marginTop: 20 }}>
        <Col>
          <Button onClick={handleClose} type="primary">
            Close
          </Button>
        </Col>
      </Row>
    </Modal>
  );
}

export default ViewAdminUser;
