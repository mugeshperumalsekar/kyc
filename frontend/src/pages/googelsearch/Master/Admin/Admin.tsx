



import { useState, useEffect } from 'react';
import { Card, Form, Select, Button, Table, Checkbox, Typography, message } from 'antd';
// import GroupApiService from '../../../data/services/master/Group/group-api-service';
// import CategoryApiService from '../../../data/services/master/Category/category-api-service';
// import AuthAdminApiService from '../../../data/services/authadminuser/authu-admin-api-service';
// import AdminApiService from '../../../data/services/master/Admin/admin-api-service';
// import AppLayout from '../../../components/Layout';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import GroupApiService from '../../../../data/services/google-search/master/Group/group-api-service';
import CategoryApiService from '../../../../data/services/google-search/master/Category/category-api-service';
import AuthAdminApiService from '../../../../data/services/authadminuser/authu-admin-api-service';
import AdminApiService from '../../../../data/services/google-search/master/Admin/admin-api-service';
import AppLayout from '../../../../components/Layout';

const { Option } = Select;

interface GroupPayload {
  id: number;
  name: string;
}

interface AuthAdminPayload {
  id: number;
  userName: string;
}

interface CategoryPayload {
  id: number;
  groupId: number;
  name: string;
}

interface AdminPayload {
  id: number;
  groupId: number;
  categoryId: number;
  clientId: number;
}

const Admin = () => {
  const [groups, setGroups] = useState<GroupPayload[]>([]);
  const [clients, setClients] = useState<AuthAdminPayload[]>([]);
  const [categories, setCategories] = useState<CategoryPayload[]>([]);
  const [checkboxStatus, setCheckboxStatus] = useState<{ [key: string]: boolean }>({});
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [filteredUserAccess, setFilteredUserAccess] = useState<AdminPayload[]>([]);

  const groupService = new GroupApiService();
  const categoryService = new CategoryApiService();
  const authService = new AuthAdminApiService();
  const adminService = new AdminApiService();

  useEffect(() => {
    fetchGroups();
    fetchCategories();
    fetchClients();
  }, []);

  useEffect(() => {
    if (selectedClientId !== null) {
      fetchUserAccess();
    }
  }, [selectedClientId]);

  const showMessage = (messageText: string, type: 'success' | 'error') => {
    if (type === 'success') {
      message.success(messageText);
    } else {
      message.error(messageText);
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await groupService.getGroupOptions();
      setGroups(response || []);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      setCategories(response || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await authService.getadminuser();
      setClients(response || []);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const fetchUserAccess = async () => {
    try {
      const response = await adminService.getAdmins();
      setFilteredUserAccess(response || []);
      updateCheckboxStatus(response || []);
    } catch (error) {
      console.error("Error fetching user access:", error);
    }
  };

  const updateCheckboxStatus = (userAccess: AdminPayload[]) => {
    const status: { [key: string]: boolean } = {};
    userAccess.forEach(access => {
      if (access.clientId === selectedClientId) {
        const key = `${access.groupId}-${access.categoryId}`;
        status[key] = true;
      }
    });
    setCheckboxStatus(status);
  };

  const handleCheckboxChange = async (e: CheckboxChangeEvent, groupId: number, categoryId: number | null) => {
    const key = `${groupId}-${categoryId}`;
    const newStatus = e.target.checked;

    setCheckboxStatus(prev => ({
      ...prev,
      [key]: newStatus,
    }));

    const updatedAccess = filteredUserAccess.filter(access => !(access.groupId === groupId && access.categoryId === categoryId));

    if (newStatus) {
      updatedAccess.push({
        id: 0,
        groupId,
        categoryId: categoryId || 0,
        clientId: selectedClientId || 0,
      });
    } else {
      const accessToDelete = filteredUserAccess.find(access => access.groupId === groupId && access.categoryId === categoryId);
      if (accessToDelete) {
        try {
          await adminService.blockAdmin(accessToDelete.id);
        } catch (error) {
          console.error("Error blocking user:", error);
        }
      }
    }

    setFilteredUserAccess(updatedAccess);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedClientId) {
      showMessage("Please ensure the Client is selected.", 'error');
      return;
    }

    const payloads: AdminPayload[] = filteredUserAccess
      .filter(access => checkboxStatus[`${access.groupId}-${access.categoryId}`])
      .map(access => ({
        id: 0,
        groupId: access.groupId,
        categoryId: access.categoryId,
        clientId: selectedClientId!,
      }));

    if (payloads.length === 0) {
      showMessage("No permissions selected. Please select at least one permission.", 'error');
      return;
    }

    try {
      await Promise.all(payloads.map(payload => adminService.createAdmin(payload)));
      showMessage('Permissions saved successfully.', 'success');
    } catch (error) {
      console.error("Error saving permissions:", error);
      showMessage('Save failed. Please try again.', 'error');
    }
  };

  const handleClientChange = (value: number) => {
    setSelectedClientId(value);
  };

  const columns = [
    {
      title: 'S.No',
      dataIndex: 'serialNo',
      key: 'serialNo',
      render: (text: any, record: { rowSpan: any; }, index: number) => ({
        children: record.rowSpan > 0 ? index + 1 : null, 
        props: {
          rowSpan: record.rowSpan,
        },
      }),
    },
    {
      title: 'Group',
      dataIndex: 'group',
      key: 'group',
      render: (text: any, record: { rowSpan: any; groupId: number; }) => ({
        children: text, 
        props: {
          rowSpan: record.rowSpan,
        },
      }),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Permissions',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (text: any, record: { groupId: number; categoryId: number; }) => (
        <Checkbox
          checked={checkboxStatus[`${record.groupId}-${record.categoryId}`] || false}
          onChange={(e) => handleCheckboxChange(e, record.groupId, record.categoryId)}
        />
      ),
    },
  ];

  const dataSource = groups.length > 0 && categories.length > 0
    ? groups.flatMap((group, groupIndex) => {
      const relatedCategories = categories.filter(category => category.groupId === group.id);
      return relatedCategories.map((category, categoryIndex) => ({
        key: `${group.id}-${category.id}`,
        serialNo: groupIndex + 1,
        group: group.name,
        category: category.name,
        groupId: group.id,
        categoryId: category.id,
        rowSpan: categoryIndex === 0 ? relatedCategories.length : 0,
      }));
    })
    : [];

  return (
    <AppLayout>
      <Card style={{ borderRadius: '8px', fontFamily: 'Bookman Old Style', fontSize: '12px' }}>
        <Typography.Title level={4}>Admin Access</Typography.Title>

        <Form layout="vertical">
          <Form.Item  style={{ width: '300px', fontFamily: 'Bookman Old Style',fontSize:'12px' }}>
            <Select
              placeholder="Select Client"
              value={selectedClientId ?? undefined}
              onChange={handleClientChange}
              allowClear
            >
              {clients.map(client => (
                <Option key={client.id} value={client.id}>
                  {client.userName}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>

        <Table
    bordered
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          scroll={{ y: 450 }}
          style={{  fontFamily: 'Bookman Old Style', fontSize: '12px' }}
          size='small'
          locale={{ emptyText: 'No data available' }}
        />
        <div style={{ marginTop: '20px', display: "flex", justifyContent: "flex-end" }}>
          <Button type="primary" onClick={handleSave}>
            Save
          </Button>
        </div>
      </Card>
    </AppLayout>
  );
};

export default Admin;
