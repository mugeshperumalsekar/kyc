import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, Switch, Row, Col, DatePicker, Select, Checkbox, message } from 'antd';
// import AdminUserApiService from '../../../data/services/master/AdminUser/adminuser_api_serivice';
// import AdmingroupApiService from '../../../data/services/master/AdminGroup/admingroup_api_service';
// import GenderApiService from '../../../data/services/master/Gender/gender_api_service';
// import MaritalStatusApiService from '../../../data/services/master/Maritalstatus/maritalstatus_api_service';
// import { AdminUserPayload } from '../../../data/services/master/AdminUser/adminuser_payload';
import { useSelector } from 'react-redux';
import AdminUserApiService from '../../../../data/services/google-search/master/AdminUser/adminuser_api_serivice';
import AdmingroupApiService from '../../../../data/services/google-search/master/AdminGroup/admingroup_api_service';
import GenderApiService from '../../../../data/services/google-search/master/Gender/gender_api_service';
import MaritalStatusApiService from '../../../../data/services/google-search/master/Maritalstatus/maritalstatus_api_service';
import { AdminUserPayload } from '../../../../data/services/google-search/master/AdminUser/adminuser_payload';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface CreateAdminUserProps {
  isOpen: boolean;
  handleClose: () => void;
  onUserCreated: () => void;
}

interface Gender {
  id: string;
  gender: string;
  title: string;
}

interface Admingroup {
  id: string;
  moduleUrl: string;
  name: string;
}

interface Maritalstatus {
  id: string;
  name: string;
}
interface Role {
    id: string;
    roleName: string;
  }

const CreateAdminUser: React.FC<CreateAdminUserProps> = ({ isOpen, handleClose, onUserCreated }) => {
    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
  const [loading, setLoading] = useState(false);
  const [genders, setGenders] = useState<Gender[]>([]);
  const [role, setRole] = useState<Role[]>([]);
  const [maritalstatus, setMaritalstatus] = useState<Maritalstatus[]>([]);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form] = Form.useForm(); // Defining form for Ant Design

  const authService = new AdminUserApiService();
  const admingroupService = new AdmingroupApiService();
  const genderService = new GenderApiService();
  const maritalService = new MaritalStatusApiService();

  useEffect(() => {
    fetchRole();
    fetchGender();
    fetchMaritalStatus();
  }, []);

  const fetchRole = async () => {
    try {
      const role = await authService.getAdminRole();
      setRole(role);
      console.log('role',role)
    } catch (error) {
      console.error('Error fetching admin groups:', error);
    }
  };

  const fetchGender = async () => {
    try {
      const genders = await genderService.getGender();
      setGenders(genders);
    
    } catch (error) {
      console.error('Error fetching genders:', error);
    }
  };

  const fetchMaritalStatus = async () => {
    try {
      const maritalstatus = await maritalService.getMaritalStatus();
      setMaritalstatus(maritalstatus);
    } catch (error) {
      console.error('Error fetching marital statuses:', error);
    }
  };
  const showMessage = (messageText: string, type: 'success' | 'error') => {
    if (type === 'success') {
        message.success(messageText);
    } else {
        message.error(messageText);
    }
};
  const handleCreate = async (values: any) => {
    setLoading(true);
    
    try {
        
      const payload: AdminUserPayload = {id:0,
      
        fullName: values.fullName,
        userName: values.userName,
        email: values.email,
        dob: values.dob ? values.dob.format('YYYY-MM-DD') : '',
        genderId: values.genderId,
        phoneNo: values.phoneNumber,
        validFrm: values.validRange && values.validRange[0] ? values.validRange[0].format('YYYY-MM-DD') : '',
        validTo: values.validRange && values.validRange[1] ? values.validRange[1].format('YYYY-MM-DD') : '',
        maritalStatusId: values.maritalStatusId,
        adminGroup: values.adminGroup,
        superUser: values.isSuperUser,
        password: values.password,
        roleId:values.roleId,
        clientId:loginDetails.id,
        uid: loginDetails.id
      };   
      console.log("admin:", payload);

      await authService.doMasterAdminUser(payload);
      showMessage('Admin user added successfully.', 'success');

     
      onUserCreated(); // Refresh user list after creation
      handleClose();
    
    } catch (error) {
      console.error('Error creating admin user:', error);
      showMessage('Error creating admin user.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Create Admin User"
      visible={isOpen}
      onCancel={handleClose}
    //   onOk={handleCreate}
    //   okText="Save"
    // //   cancelText="Cancel"
      footer={null}
      width={1024}
      centered
    >
      <Form form={form} layout="vertical" onFinish={handleCreate}>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="Full Name"
              name="fullName"
              rules={[{ required: true, message: 'Please input the full name!' }]}
            >
              <Input placeholder="Enter full name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Please input the email!' }]}
            >
              <Input type="email" placeholder="Enter email" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="User Name"
              name="userName"
              rules={[{ required: true, message: 'Please input the user name!' }]}
            >
              <Input placeholder="Enter user name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Phone Number"
              name="phoneNumber"
              rules={[{ required: true, message: 'Please input the phone number!' }]}
            >
              <Input type="number" placeholder="Enter phone number" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="Date of Birth"
              name="dob"
              rules={[{ required: true, message: 'Please select the date of birth!' }]}
            >
              <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} placeholder="Select date of birth" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Valid From - Valid To"
              name="validRange"
              rules={[{ required: true, message: 'Please select the valid range!' }]}
            >
              <RangePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please input the password!' }]}
              hasFeedback
            >
              <Input.Password
                placeholder="Enter password"
                visibilityToggle={{
                  visible: showPassword,
                  onVisibleChange: setShowPassword,
                }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              rules={[
                { required: true, message: 'Please confirm the password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords do not match!'));
                  },
                }),
              ]}
              hasFeedback
            >
              <Input.Password
                placeholder="Confirm password"
                visibilityToggle={{
                  visible: showConfirmPassword,
                  onVisibleChange: setShowConfirmPassword,
                }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="Gender"
              name="genderId"
              rules={[{ required: true, message: 'Please select the gender!' }]}
            >
              <Select placeholder="Select gender">
                {genders.map(gender => (
                  <Option key={gender.id} value={gender.id}>{gender.gender}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Marital Status"
              name="maritalStatusId"
              rules={[{ required: true, message: 'Please select marital status!' }]}
            >
              <Select placeholder="Select marital status">
                {maritalstatus.map(status => (
                  <Option key={status.id} value={status.id}>{status.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="Role"
              name="roleId"
              rules={[{ required: true, message: 'Please select the admin group!' }]}
            >
              <Select placeholder="Select admin group">
                {role.map(role  => (
                  <Option key={role .id} value={role .id}>{role .roleName}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Is Super User?"
              name="isSuperUser"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>
        </Row>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

      
          <Button type="primary" htmlType="submit" loading={loading}>
            Create User
          </Button>
    
        </div>
      </Form>
    </Modal>
  );
};

export default CreateAdminUser;
