import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Row, Table, Typography, Input, Modal, Space, message, Select } from 'antd';
import { EditOutlined, BlockOutlined, UnlockOutlined } from '@ant-design/icons';
import CategoryApiService from '../../../../data/services/google-search/master/Category/category-api-service';
import GroupApiService from '../../../../data/services/google-search/master/Group/group-api-service';
import AppLayout from '../../../../components/Layout';

const { Text } = Typography;
const { Option } = Select;

interface Category {
    id: string;
    groupId: string;
    name: string;
}

interface Group {
    id: string;
    name: string;
}

const Group: React.FC = () => {

    const [name, setName] = useState('');
    const [selectedGroup, setSelectedGroup] = useState('');
    const [groups, setGroups] = useState<Group[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [editcategoriesName, setEditcategoriesName] = useState('');
    const [editcategoriesId, setEditcategoriesId] = useState('');
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deletecategoriesId, setDeletecategoriesId] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [page, setPage] = useState(0);
    const [activeTab, setActiveTab] = useState('insert');
    const [errorMessage, setErrorMessage] = useState('');
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [dialogAction, setDialogAction] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
    const [blockedRows, setBlockedRows] = useState<string[]>([]);

    const authService = new CategoryApiService();
    const groupService = new GroupApiService();

    useEffect(() => {
        fetchGroups();
        fetchCategories();
        const storedBlockedRows = localStorage.getItem('blockedRows');
        if (storedBlockedRows) {
            setBlockedRows(JSON.parse(storedBlockedRows) as string[]);
        }
    }, []);

    const showMessage = (messageText: string, type: 'success' | 'error') => {
        if (type === 'success') {
            message.success(messageText);
        } else {
            message.error(messageText);
        }
    };

    const validateAlphabeticInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const charCode = e.charCode || e.keyCode;
        if (
            e.key === 'Backspace' ||
            e.key === 'Delete' ||
            e.key === 'Enter' ||
            e.key === ' ' ||
            charCode === 0
        ) {
            return true;
        }
        if (!/^[a-zA-Z]$/.test(String.fromCharCode(charCode))) {
            e.preventDefault();
            showMessage('Only alphabetic characters are allowed.', 'error');
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!selectedGroup || !name) {
            showMessage('Please fill out all fields.', 'error');
            return;
        }
        try {
            const payload = {
                name: name,
                groupId: selectedGroup,
                includeOrExclude: 'INCLUDE',
            };
            const response = await authService.createCategory(payload);
            setName('');
            setSelectedGroup('');
            fetchCategories();
            showMessage('Category added successfully.', 'success');
        } catch (error) {
            console.error("Error adding Category:", error);
        }
    };

    const handleEditDialogSave = async () => {
        try {
            const payload = {
                name: editcategoriesName,
                groupId: selectedGroup,
                includeOrExclude: 'INCLUDE',
            };
            await authService.updateCategory(Number(editcategoriesId), payload);
            setOpenEditDialog(false);
            setEditcategoriesId('');
            setEditcategoriesName('');
            setSelectedGroup('');
            fetchCategories();
            showMessage('Category updated successfully.', 'success');
        } catch (error) {
            console.error("Error editing Category:", error);
        }
    };

    const fetchGroups = async () => {
        try {
            const groups = await groupService.getGroupOptions();
            setGroups(groups);
        } catch (error) {
            console.error("Error fetching groups:", error);
        }
    };

    const fetchCategories = async () => {
        try {
            const fetchedCategories = await groupService.getCategoryOptions();
            setCategories(fetchedCategories);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const handleEditClick = (id: string, name: string, groupId: string) => {
        setEditcategoriesId(id);
        setEditcategoriesName(name);
        setSelectedGroup(groupId);
        setOpenEditDialog(true);
    };

    const handleBlock = (id: string) => {
        setSelectedRowId(id);
        setDialogAction('block');
        setDialogOpen(true);
    };

    const handleUnblock = (id: string) => {
        setSelectedRowId(id);
        setDialogAction('unblock');
        setDialogOpen(true);
    };

    const handleConfirmDialog = async (confirmed: boolean) => {
        if (confirmed && selectedRowId !== null) {
            if (dialogAction === 'block') {
                await blockRow(selectedRowId);
            } else if (dialogAction === 'unblock') {
                await unblockRow(selectedRowId);
            }
        }
        setSelectedRowId(null);
        setDialogOpen(false);
        setDialogAction(null);
    };

    const blockRow = async (id: string) => {
        try {
            await authService.blockCategory(Number(id));
            const updatedBlockedRows = [...blockedRows, id];
            setBlockedRows(updatedBlockedRows);
            localStorage.setItem('blockedRows', JSON.stringify(updatedBlockedRows));
            showMessage('Category blocked successfully.', 'success');
        } catch (error) {
            console.error("Error blocking Category:", error);
        }
    };

    const unblockRow = async (id: string) => {
        try {
            await authService.unblockCategory(Number(id));
            const updatedBlockedRows = blockedRows.filter((rowId) => rowId !== id);
            setBlockedRows(updatedBlockedRows);
            localStorage.setItem('blockedRows', JSON.stringify(updatedBlockedRows));
            showMessage('Category unblocked successfully.', 'success');
        } catch (error) {
            console.error("Error unblocking Category:", error);
        }
    };

    const getSerialNumber = (index: number) => {
        return page * 10 + index + 1;
    };

    function getGroupNameById(groupId: string) {
        const group = groups.find((g) => g.id === groupId);
        return group ? group.name : '';
    };

    return (
        <AppLayout>
            <Card style={{ margin: "10px", height: '85vh' }}>
                <Text strong>Category</Text>
                <div className="d-flex justify-content-center">
                    <Card style={{ boxShadow: '1px 1px 1px grey', width: '100%' }}>
                        <div style={{ padding: '16px' }}>
                            <Space>
                                <Button
                                    type={activeTab === 'insert' ? 'primary' : 'default'}
                                    onClick={() => setActiveTab('insert')}
                                >
                                    Insert
                                </Button>
                                <Button
                                    type={activeTab === 'edit' ? 'primary' : 'default'}
                                    onClick={() => setActiveTab('edit')}
                                >
                                    Edit
                                </Button>
                                <Button
                                    type={activeTab === 'unblock' ? 'primary' : 'default'}
                                    onClick={() => setActiveTab('unblock')}
                                >
                                    Unblock
                                </Button>
                            </Space>
                            <br /><br />
                            {activeTab === 'insert' && (
                                <div>
                                    <Text strong>Add Category</Text>
                                    <Row gutter={10}>
                                        <Col span={24} sm={8}>
                                            <Select
                                                value={selectedGroup}
                                                onChange={(value) => setSelectedGroup(value)}
                                                placeholder="Select a group"
                                                style={{ width: '100%' }}
                                            >
                                                {groups.map((group) => (
                                                    <Option key={group.id} value={group.id}>
                                                        {group.name}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Col>
                                        <Col span={24} sm={8}>
                                            <Input
                                                placeholder="Category"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                onKeyPress={validateAlphabeticInput}
                                            />
                                        </Col>
                                        <Col span={24} sm={8}>
                                            <Button type="primary" onClick={handleSubmit}>
                                                Save
                                            </Button>
                                        </Col>
                                    </Row>
                                </div>
                            )}
                            {activeTab === 'edit' && (
                                <div>
                                    <Table
                                        dataSource={categories.filter((category) => !blockedRows.includes(category.id))}
                                        rowKey="id"
                                        pagination={false}
                                        size="small"
                                        scroll={{ y: 400 }}
                                    >
                                        <Table.Column title="S.No" render={(_, __, index) => getSerialNumber(index)} />
                                        <Table.Column
                                            title="Group"
                                            key="groupId"
                                            render={(_, record) => getGroupNameById(record.groupId)}
                                        />
                                        <Table.Column title="Name" dataIndex="name" key="name" />
                                        <Table.Column
                                            title="Action"
                                            render={(_, record) => (
                                                <Space>
                                                    <Button
                                                        onClick={() => handleEditClick(record.id, record.name, record.groupId)}
                                                        icon={<EditOutlined />}
                                                        disabled={blockedRows.includes(record.id)}
                                                    />
                                                    <Button
                                                        onClick={() => handleBlock(record.id)}
                                                        icon={<BlockOutlined />}
                                                        disabled={blockedRows.includes(record.id)}
                                                    />
                                                </Space>
                                            )}
                                        />
                                    </Table>
                                </div>
                            )}
                            {activeTab === 'unblock' && (
                                <div>
                                    <Table
                                        dataSource={categories.filter((category) => blockedRows.includes(category.id))}
                                        rowKey="id"
                                        pagination={false}
                                        size="small"
                                        scroll={{ y: 400 }}
                                    >
                                        <Table.Column title="S.No" render={(_, __, index) => getSerialNumber(index)} />
                                        <Table.Column
                                            title="Group"
                                            key="groupId"
                                            render={(_, record) => getGroupNameById(record.groupId)}
                                        />
                                        <Table.Column title="Name" dataIndex="name" key="name" />
                                        <Table.Column
                                            title="Action"
                                            render={(_, record) => (
                                                <Space>
                                                    <Button
                                                        onClick={() => handleUnblock(record.id)}
                                                        icon={<UnlockOutlined />}
                                                    />
                                                </Space>
                                            )}
                                        />
                                    </Table>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </Card>

            <Modal
                title="Edit Group"
                visible={openEditDialog}
                onOk={handleEditDialogSave}
                onCancel={() => setOpenEditDialog(false)}
                centered
            >
                <Row gutter={10}>
                    <Col span={24} sm={12}>
                        <Select
                            value={selectedGroup}
                            onChange={(value) => setSelectedGroup(value)}
                            placeholder="Select a group"
                            style={{ width: '100%' }}
                        >
                            {groups.map((group) => (
                                <Option key={group.id} value={group.id}>
                                    {group.name}
                                </Option>
                            ))}
                        </Select>
                    </Col>
                    <Col span={24} sm={12}>
                        <Input
                            value={editcategoriesName}
                            onChange={(e) => setEditcategoriesName(e.target.value)}
                        />
                    </Col>
                </Row>
            </Modal>

            <Modal
                title="Confirm"
                visible={dialogOpen}
                onOk={() => handleConfirmDialog(true)}
                onCancel={() => handleConfirmDialog(false)}
                centered
            >
                <p>Are you sure you want to {dialogAction} this item?</p>
            </Modal>

        </AppLayout>
    );
};

export default Group;