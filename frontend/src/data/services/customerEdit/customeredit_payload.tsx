export interface CustomerEditData {
  recordTypeId: number;
  name: string;
  sourceLink: string;
  genderId: number;
  frmDate: string;
  toDate: string;
  created_at: string;
  userName: string;
  cmsId: number,
  uid: number,
};

export interface QcViewDataPayload {
  frmDate: string;
  toDate: string;
  name: string;
  count: string;
  pep: string;
  pepName: string;
  pepDOB: string;
  pepPan: string;
  pepSourceLink: string;
  pepId: number,
  uid: number,
};

export interface QcPendingViewData {
  fromDate: string;
  toDate: string;
  pepName: string;
  pepPan: string;
  pepDOB: string;
  pepSourceLink: string;
};

export interface ManagerPendingViewData {
  fromDate: string;
  toDate: string;
  pepName: string;
  pepPan: string;
  pepDOB: string;
  pepSourceLink: string;
};

export interface ManagerData {
  frmDate: string;
  toDate: string;
  pepName: string;
  pepDOB: string;
  pepPan: string;
  pepSourceLink: string;
};