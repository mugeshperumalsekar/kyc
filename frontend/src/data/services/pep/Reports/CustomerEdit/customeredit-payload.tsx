export interface CustomerEditData {
  frmDate: string;
  toDate: string;
  name: string;
  count: string;
  userName: string;
  created_at: string;
  pepName: string;
  dob: string;
  panNum: string;
  sourceLink: string;
  pepId: number,
  uid: number,
  fatherName:string;
}
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
}

export interface QcPendingViewData {
  fromDate: string;
  toDate: string;
  pepName: string;
  pepPan: string;
  pepDOB: string;
  pepSourceLink: string;
}
export interface ManagerPendingViewData {
  fromDate: string;
  toDate: string;
  pepName: string;
  pepPan: string;
  pepDOB: string;
  pepSourceLink: string;
}
export interface ManagerData {
  frmDate: string;
  toDate: string;
  pepName: string;
  pepDOB: string;
  pepPan: string;
  pepSourceLink: string;
  // pepId: number,
  // uid: number,
}