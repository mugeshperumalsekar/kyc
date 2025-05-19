export interface LevelMappingPayload {
  id: number,
  levelId: number,
  statusId: number,
  passingLevelId: number,
  isAlive:number,
  uid: number
}


export interface GetLevelMappingPayload {
  id: number,
  levelId: number,
  statusId: number,
  passingLevelId: number,
  uid:number,
  isAlive:number,
  status:string
}


export interface LevelOnePayload {
  id:number,
  levelId: number,
  status: string,
  passingLevelId: number,
  isAlive:number,
}
