


import React, { useState, useEffect } from 'react';
import { Table, Modal, Typography, Button, Card, Space } from 'antd';
import { EyeOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
// import AuthAdminApiService from '../../../data/services/authadminuser/authu-admin-api-service';
// import AppLayout from '../../../components/Layout';
import ViewAdminUser from './ViewAdminUser';
import EditAdminUser from './EditAdminUser';
import CreateAdminUser from './CreateAdminUser'; // Add CreateAdminUser component
import AppLayout from '../../../../components/Layout';
import AuthAdminApiService from '../../../../data/services/google-search/authadminuser/authu-admin-api-service';

const { Title } = Typography;

interface AdminUser {
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
    roleId:string;
    uid:number;
    clientId:number;
}

const AdminUserGS: React.FC = () => {
    const navigate = useNavigate();
    const authService = new AuthAdminApiService();
    const [adminuser, setAdminuser] = useState<AdminUser[]>([]);
    const [isViewEmpDialogOpen, setViewEmpDialogOpen] = useState(false);
    const [isEditEmpDialogOpen, setEditEmpDialogOpen] = useState(false);
    const [isCreateEmpDialogOpen, setCreateEmpDialogOpen] = useState(false); // Add state for create dialog
    const [selectedRowData, setSelectedRowData] = useState<AdminUser | null>(null);

    useEffect(() => {
        fetchAdminuser();
    }, []);

    const fetchAdminuser = async () => {
        try {
            const adminuser = await authService.getadminuser();
            setAdminuser(adminuser);
        } catch (error) {
            console.log('error:', error);
        }
    };

    const handleViewClick = async (id: string) => {
        try {
            const userData = await authService.getUserView(id);
            if (userData) {
                setSelectedRowData(userData);
                setViewEmpDialogOpen(true);
            } else {
                console.warn('User data is undefined');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const handleEditClick = (id: string) => {
        const selectedRow = adminuser.find(row => row.id === id);
        if (selectedRow) {
            setSelectedRowData({ ...selectedRow });
            setEditEmpDialogOpen(true);
        }
    };

    const handleCreateClick = () => {
        setCreateEmpDialogOpen(true); // Open the create dialog when "+" is clicked
    };

    const handleCloseViewEmpDialog = () => {
        setViewEmpDialogOpen(false);
        setSelectedRowData(null);
    };

    const handleCloseEditEmpDialog = () => {
        setEditEmpDialogOpen(false);
        setSelectedRowData(null);
    };

    const handleCloseCreateEmpDialog = () => {
        setCreateEmpDialogOpen(false);
    };

    const columns = [
        {
            title: 'S.No',
            dataIndex: 'sno',
            render: (_: any, __: AdminUser, index: number) => index + 1,
            width: 50,
        },
        {
            title: 'Name',
            dataIndex: 'userName',
            key: 'userName',
            width: 120,
        },
        {
            title: 'E-mail',
            dataIndex: 'email',
            key: 'email',
            width: 150,
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 120,
            render: (text: string, record: AdminUser) => (
                <Space size="middle">
                    <Button
                        icon={<EyeOutlined />}
                        onClick={() => handleViewClick(record.id)}
                    >
                        View
                    </Button>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleEditClick(record.id)}
                    >
                        Edit
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <AppLayout>
            <Card style={{ margin: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Title level={2}>Details</Title>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleCreateClick}
                        style={{ marginLeft: 'auto' }} // Align button to the right
                    >
                        Add User
                    </Button>
                </div>
                <Table
                    dataSource={adminuser}
                    columns={columns}
                    size='small'
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                    rowClassName="custom-row"
                    style={{ margin: '0 -16px' }}
                />
            </Card>

            {isViewEmpDialogOpen && selectedRowData && (
                <ViewAdminUser employee={selectedRowData} handleClose={handleCloseViewEmpDialog} />
            )}
            {isEditEmpDialogOpen && selectedRowData && (
                <EditAdminUser
                    rowData={selectedRowData}
                    isOpen={isEditEmpDialogOpen}
                    handleClose={handleCloseEditEmpDialog}
                />
            )}
            {isCreateEmpDialogOpen && (
                <CreateAdminUser
                    isOpen={isCreateEmpDialogOpen}
                    handleClose={handleCloseCreateEmpDialog}
                    onUserCreated={fetchAdminuser} // Refresh data after creating a user
                />
            )}
        </AppLayout>
    );
};

export default AdminUserGS;

