

import { useEffect, useState } from "react";
import { Button, Card, Col, Row, Form as AntdForm, Checkbox, Select, Table, message } from "antd";
// import AppLayout from "../../components/Layout";
// import AuthAdminApiService from "../../data/services/authadminuser/authu-admin-api-service";
// import AuthConfigModuleModuleDetApiService from "../../data/services/configmodulemoduledet/authu-configmodulemoduledet-api-service";
// import { RolePermissionRequest } from "../../data/services/role-permission/role-permission-payload";
// import RolePermissionApiService from "../../data/services/role-permission/role-permission-api-service";
import { useSelector } from "react-redux";
import AuthConfigModuleModuleDetApiService from "../../../data/services/configmodulemoduledet/authu-configmodulemoduledet-api-service";
import RolePermissionApiService from "../../../data/services/google-search/role-permission/role-permission-api-service";
import { RolePermissionRequest } from "../../../data/services/google-search/role-permission/role-permission-payload";
import AppLayout from "../../../components/Layout";
import AuthAdminApiService from "../../../data/services/google-search/authadminuser/authu-admin-api-service";

const { Option } = Select;

const RolePermission = () => {
  const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
  const [selectedRole, setSelectedRole] = useState("");
  const [roleData, setRoleData] = useState<any>([]);
  const [featureData, setFeatureData] = useState<any>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const authAdminApiService = new AuthAdminApiService();
  const authConfigModuleModuleDetService = new AuthConfigModuleModuleDetApiService();
  const rolePermissionApiService = new RolePermissionApiService();
  const [adminUserValidationError, setAdminUserValidationError] = useState<string | null>(null);
  const [isUpdate, setIsUpdate] = useState(false);

  const handleFeatureVisibilityChange = (idx: any, checked: boolean) => {
    const updatedFeatureData = [...featureData];
    updatedFeatureData[idx].checked = checked;
    if (updatedFeatureData[idx].subfeatures.length !== 0) {
      for (let i = 0; i < updatedFeatureData[idx].subfeatures.length; i++) {
        updatedFeatureData[idx].subfeatures[i].checked = checked;
      }
    }
    setFeatureData([...updatedFeatureData]);
  };

  const handleSubMenuVisibilityChange = (parentIdx: any, subIdx: any, checked: boolean) => {
    const updatedFeatureData = [...featureData];
    updatedFeatureData[parentIdx].subfeatures[subIdx].checked = checked;
    setFeatureData([...updatedFeatureData]);
  };

  const saveRolePermission = async () => {
    try {
      if (!selectedRole) {
        messageApi.error("Please Select User and Give Permission.");
        return;
      }
      let data = getCheckedSubfeaturesWithRole(featureData);
      let payload: RolePermissionRequest[] = [];
      for (let i = 0; i < data.length; i++) {
        payload.push({
          uid: loginDetails.id,
          modId: data[i].modid,
          modDetId: data[i].moddetid,
          entUid: 0,
          valid: true,
          euid: 0,
          roleId: selectedRole,
        });
      }

      if (isUpdate) {
        await rolePermissionApiService.updateRolePermissions(selectedRole, payload);
      } else {
        await rolePermissionApiService.saveRolePermissions(payload);
      }

      setAdminUserValidationError(null);
      messageApi.success("Save successful!");
    } catch (error) {
      console.error("Error saving AdminUserRights:", error);
      messageApi.error("Save failed. Please try again.");
    }
  };

  const getCheckedSubfeaturesWithRole = (data: any[]) => {
    let subFeatures: any[] = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].subfeatures.length !== 0) {
        for (let j = 0; j < data[i].subfeatures.length; j++) {
          if (data[i].subfeatures[j].checked) {
            subFeatures.push(data[i].subfeatures[j]);
          }
        }
      }
    }
    return subFeatures;
  };

  const fetchAllRoles = async () => {
    try {
      let res = await authAdminApiService.getAllroles();
      setRoleData(res);
    } catch (error) {
      console.error("Error fetching admin users:", error);
    }
  };

  const fetchRolePermissionByRoleId = async (roleId: any) => {
    try {
      const response = await rolePermissionApiService.fetchAllRolePermissionsByRoleId(roleId);
      if (response) {
        setIsUpdate(true);
        updateUI(response);
      }
    } catch (error) {
      console.error("Error fetching config modules:", error);
    }
  };

  const fetchAllPermissions = async () => {
    try {
      const response = await authConfigModuleModuleDetService.getConfigModuleModuleDet();
      let data = constructMapData(response);
      setFeatureData([...data]);
    } catch (error) {
      console.error("Error fetching config modules:", error);
    }
  };

  const updateUI = (rolePermission: any[]) => {
    const updatedFeatureData = featureData.map((feature: any) => {
      feature.checked = false;
      feature.subfeatures.forEach((subfeature: any) => {
        subfeature.checked = rolePermission.some(
          (permission: any) => permission.modDetId === subfeature.moddetid
        );
        if (subfeature.checked) feature.checked = true;
      });
      return feature;
    });
    setFeatureData(updatedFeatureData);
  };

  const constructMapData = (data: any) => {
    const result: any = {};
    data.forEach((item: any) => {
      const { modname, moddetid, moddetname, modid } = item;
      if (!result[modname]) {
        result[modname] = { feature: modname, subfeatures: [] };
      }
      result[modname].subfeatures.push({
        modid,
        moddetid,
        modname,
        moddetname,
      });
    });
    return Object.values(result);
  };

  const fetchTemplateData = async () => {
    fetchAllRoles();
    fetchAllPermissions();
  };

  const handleRoleChange = (value: any) => {
    setSelectedRole(value);
    setAdminUserValidationError(null);
    fetchRolePermissionByRoleId(value);
  };

  useEffect(() => {
    fetchTemplateData();
  }, []);

  const columns = [
    {
      title: "S.No.",
      key: "serialNo",
      render: (text: any, record: any, index: number) => (
        <>{index + 1}</>
      ),
    },
    {
      title: "Feature",
      dataIndex: "feature",
      key: "feature",
      render: (text: any, record: any, index: any) => (
        <Checkbox
          checked={record.checked}
          onChange={(e) => handleFeatureVisibilityChange(index, e.target.checked)}
        >
          {text}
        </Checkbox>
      ),
    },
    {
      title: "Subfeatures",
      dataIndex: "subfeatures",
      key: "subfeatures",
      render: (subfeatures: any[], record: any, parentIdx: any) => (
        <>
          {subfeatures.map((subItem: any, subIdx: any) => (
            <div key={subIdx}>
              <Checkbox
                checked={subItem.checked}
                onChange={(e) =>
                  handleSubMenuVisibilityChange(parentIdx, subIdx, e.target.checked)
                }
              >
                {subItem.moddetname}
              </Checkbox>
            </div>
          ))}
        </>
      ),
    },
  ];

  return (
    <AppLayout>
      {contextHolder}
      <Card style={{ margin: 5, height: '85vh' }}>
        <Row justify="center">
          <Col span={24}>
            <AntdForm layout="vertical">
              <AntdForm.Item label="Role">
                <Select
                  value={selectedRole}
                  onChange={handleRoleChange}
                  placeholder="Select Role"
                  style={{ width: "20%" }}
                >
                  {roleData.map((role: any) => (
                    <Option key={role.id} value={role.id}>
                      {role.roleName}
                    </Option>
                  ))}
                </Select>
              </AntdForm.Item>

              <Table
                dataSource={featureData}
                columns={columns}
                pagination={false}
                rowKey="feature"
                bordered
                scroll={{ y: 500 }} // Adjust height as needed
                style={{ marginTop: 16,  }}
              />

              {adminUserValidationError && (
                <p style={{ color: "red", textAlign: "center" }}>{adminUserValidationError}</p>
              )}
<br></br>
              <Row justify="end">
                <Button type="primary" onClick={saveRolePermission}>
                  Save
                </Button>
              </Row>
            </AntdForm>
          </Col>
        </Row>
      </Card>
    </AppLayout>
  );
};

export default RolePermission;
