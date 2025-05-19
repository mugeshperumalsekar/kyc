import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Row, Table, Typography, Input, Modal, Space, Tag, message } from 'antd';
import { EditOutlined, BlockOutlined, UnlockOutlined } from '@ant-design/icons';
import GroupApiService from '../../../../data/services/google-search/master/Group/group-api-service';
import AppLayout from '../../../../components/Layout';

const { Text } = Typography;
const { TextArea } = Input;

interface Group {
  id: string;
  name: string;
}

const Group: React.FC = () => {
  const [name, setName] = useState('');
  const [selectedGroups, setSelectedGroups] = useState<string>('');
  const [groups, setGroups] = useState<Group[]>([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editGroupsName, setEditGroupsName] = useState('');
  const [editGroupsId, setEditGroupsId] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteGroupsId, setDeleteGroupsId] = useState('');
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

  const authService = new GroupApiService();

  useEffect(() => {
    fetchGroups();
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
    if (!name) {
      showMessage('Please fill out all fields.', 'error');
      return;
    }
    try {
      const payload = {
        name: name,
      };
      await authService.doMasterGroup(payload);
      setName('');
      fetchGroups();
      showMessage('Group added successfully.', 'success');
    } catch (error) {
      console.error("Error adding Group:", error);
    }
  };

  const handleEditDialogSave = async () => {
    try {
      const payload = {
        name: editGroupsName,
      };
      await authService.updateGroup(Number(editGroupsId), payload);
      setOpenEditDialog(false);
      setEditGroupsId('');
      setEditGroupsName('');
      fetchGroups();
      showMessage('Group updated successfully.', 'success');
    } catch (error) {
      console.error("Error editing Group:", error);
    }
  };

  const fetchGroups = async () => {
    try {
      const groups = await authService.getGroupOptions();
      setGroups(groups);
    } catch (error) {
      console.error("Error fetching Group:", error);
    }
  };

  const handleEditClick = (id: string, name: string) => {
    setEditGroupsId(id);
    setEditGroupsName(name);
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
      await authService.blockGroup(Number(id));
      setBlockedRows([...blockedRows, id]);
      localStorage.setItem('blockedRows', JSON.stringify([...blockedRows, id]));
      showMessage('Group blocked successfully.', 'success');
    } catch (error) {
      console.error("Error blocking Group:", error);
    }
  };

  const unblockRow = async (id: string) => {
    try {
      await authService.unblockGroup(Number(id));
      setBlockedRows(blockedRows.filter((rowId) => rowId !== id));
      localStorage.setItem('blockedRows', JSON.stringify(blockedRows.filter((rowId) => rowId !== id)));
      showMessage('Group unblocked successfully.', 'success',);
    } catch (error) {
      console.error("Error unblocking Group:", error);
    }
  };

  const getSerialNumber = (index: number) => {
    return page * 10 + index + 1;
  };

  return (
    <AppLayout>
      <Card style={{ padding: "30px", margin: "10px", height: '85vh' }}>
        <Text strong>Group</Text>
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
                  <Text strong>Add Group</Text>
                  <Row gutter={16}>
                    <Col span={24} sm={12}>
                      <Input
                        placeholder="Group"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyPress={validateAlphabeticInput}
                      />
                    </Col>
                    <Col span={24} sm={12} >
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
                    dataSource={groups.filter((group) => !blockedRows.includes(group.id))}
                    rowKey="id"
                    pagination={false}
                    size="small"
                    scroll={{ y: 400 }}
                  >
                    <Table.Column title="S.No" render={(_, __, index) => getSerialNumber(index)} />
                    <Table.Column title="Name" dataIndex="name" key="name" />
                    <Table.Column
                      title="Action"
                      render={(_, record) => (
                        <Space>
                          <Button
                            onClick={() => handleEditClick(record.id, record.name)}
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
                    dataSource={groups.filter((group) => blockedRows.includes(group.id))}
                    rowKey="id"
                    pagination={false}
                    size="small"
                    scroll={{ y: 400 }}
                  >
                    <Table.Column title="S.No" render={(_, __, index) => getSerialNumber(index)} />
                    <Table.Column title="Name" dataIndex="name" key="name" />
                    <Table.Column
                      title="Action"
                      render={(_, record) => (
                        <Space>
                          <Button
                            onClick={() => handleEditClick(record.id, record.name)}
                            icon={<EditOutlined />}
                            disabled={blockedRows.includes(record.id)}
                          />
                          <Button
                            onClick={() => handleUnblock(record.id)}
                            icon={<UnlockOutlined />}
                            disabled={!blockedRows.includes(record.id)}
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
      >
        <Input
          value={editGroupsName}
          onChange={(e) => setEditGroupsName(e.target.value)}
        />
      </Modal>

      <Modal
        title={`Are you sure you want to ${dialogAction}?`}
        visible={dialogOpen}
        onOk={() => handleConfirmDialog(true)}
        onCancel={() => handleConfirmDialog(false)}
      >
        <p>This action will {dialogAction === 'block' ? 'block' : 'unblock'} the selected group.</p>
      </Modal>
    </AppLayout>
  );
};

export default Group;