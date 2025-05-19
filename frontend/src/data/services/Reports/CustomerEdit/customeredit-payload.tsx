export interface CustomerEditData {
  frmDate: string;
  toDate: string;
  name: string;
  count: string;
  recordTypeId: number;
  genderId: number;
  userName: string;
  sourceLink: string;
  cmsId: number,
  uid: number,
  created_at: string;
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
  name: string;
  genderId: number;
  recordTypeId: number;
  sourceLink: string;
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
  name: string;
  recordTypeId: number;
  genderId: number;
  sourceLink: string;
};