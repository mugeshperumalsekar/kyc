import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Modal, Checkbox, DatePicker, Select, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
// import AdmingroupApiService from '../../../data/services/master/AdminGroup/admingroup_api_service';
// import AdminUserApiService from '../../../data/services/master/AdminUser/adminuser_api_serivice';
// import { AdminUserPayload } from '../../../data/services/master/AdminUser/adminuser_payload';
// import GenderApiService from '../../../data/services/master/Gender/gender_api_service';
// import MaritalStatusApiService from '../../../data/services/master/Maritalstatus/maritalstatus_api_service';
import { useSelector } from 'react-redux';
import AdminUserApiService from '../../../../data/services/google-search/master/AdminUser/adminuser_api_serivice';
import AdmingroupApiService from '../../../../data/services/google-search/master/AdminGroup/admingroup_api_service';
import GenderApiService from '../../../../data/services/google-search/master/Gender/gender_api_service';
import MaritalStatusApiService from '../../../../data/services/google-search/master/Maritalstatus/maritalstatus_api_service';
import { AdminUserPayload } from '../../../../data/services/google-search/master/AdminUser/adminuser_payload';

const { Option } = Select;
const { RangePicker } = DatePicker;

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

interface AdminUser {
    id: string;
    fullName: string;
    userName: string;
    email: string;
    dob: string;
    genderId: string;
    phoneNo: string;
    validFrm: string;
    validTo: string;
    maritalStatusId: string;
    adminGroup: string;
    password: string;
    superUser: number;
    roleId:string;
    uid:number;
    clientId:number;
}

const EditAdminUser: React.FC<{ rowData: AdminUser | null, isOpen: boolean, handleClose: () => void }> = ({ rowData, isOpen, handleClose }) => {
    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [genders, setGenders] = useState<Gender[]>([]);
    const [role, setRole] = useState<Role[]>([]);
    const [admingroups, setAdminGroups] = useState<Admingroup[]>([]);
    const [maritalstatus, setMaritalstatus] = useState<Maritalstatus[]>([]);
    const authService = new AdminUserApiService();
    const admingroupService = new AdmingroupApiService();
    const genderService = new GenderApiService();
    const maritalService = new MaritalStatusApiService();

    useEffect(() => {
        if (isOpen && rowData) {
            form.setFieldsValue({
                fullName: rowData.fullName,
                userName: rowData.userName,
                email: rowData.email,
                dob: rowData.dob ? moment(rowData.dob) : null,
                phoneNumber: rowData.phoneNo,
                validRange: rowData.validFrm && rowData.validTo ? [moment(rowData.validFrm), moment(rowData.validTo)] : [],
                password: rowData.password,
                confirmPassword: rowData.password,
                isSuperUser: rowData.superUser,
                genderId: rowData.genderId,
                maritalStatusId: rowData.maritalStatusId,
                adminGroup: rowData.adminGroup,
                role: rowData.adminGroup,
                roleId:rowData.roleId
            });
        }
    }, [isOpen, rowData]);

    useEffect(() => {
        fetchRole();
        fetchAdmingroup();
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
    const fetchAdmingroup = async () => {
        try {
            const admingroups = await admingroupService.getAdmingroup();
            setAdminGroups(admingroups);
        } catch (error) {
            console.error("Error fetching admin groups:", error);
        }
    };

    const fetchGender = async () => {
        try {
            const genders = await genderService.getGender();
            setGenders(genders);
        } catch (error) {
            console.error("Error fetching genders:", error);
        }
    };

    const fetchMaritalStatus = async () => {
        try {
            const maritalstatus = await maritalService.getMaritalStatus();
            setMaritalstatus(maritalstatus);
        } catch (error) {
            console.error("Error fetching marital statuses:", error);
        }
    };

    const handleUpdateAdminUser = async () => {
        try {
            const values = form.getFieldsValue();
            if (values.password !== values.confirmPassword) {
                form.setFields([
                    {
                        name: 'confirmPassword',
                        errors: ['Passwords do not match!'],
                    },
                ]);
                return;
            }
            const payload: AdminUserPayload = {
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
                roleId: values.roleId,
                clientId: loginDetails.id,
                uid: loginDetails.id,
       
                id: 0
            };

            await authService.updateAdminUser(rowData!.id, payload);
            navigate('/adminuser');
            window.location.reload();
        } catch (error) {
            console.error("Error editing Admin User:", error);
        }
    };

    return (
        <Modal
            visible={isOpen}
            title="Edit User Details"
            onCancel={handleClose}
            onOk={handleUpdateAdminUser}
            okText="Save"
            cancelText="Cancel"
            width={1024}
            centered
        >
            <Form
                form={form}
                layout="vertical"
            >
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
                            <RangePicker
                                format="YYYY-MM-DD"
                                style={{ width: '100%' }}
                                placeholder={['Start Date', 'End Date']}
                                allowClear={true}
                                value={form.getFieldValue('validRange')}
                                onChange={(dates) => {
                                    form.setFieldsValue({ validRange: dates });
                                }}
                            />
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
                                        return Promise.reject(new Error('The two passwords that you entered do not match!'));
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
                                {role.map(group => (
                                    <Option key={group.id} value={group.id}>{group.roleName}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="isSuperUser"
                            valuePropName="checked"
                        >
                            <Checkbox>Super User</Checkbox>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default EditAdminUser;
