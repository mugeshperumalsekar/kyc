export interface AlretDataPayload {
    id: number;
    alert: string;
    senderAccount: string;
    senderCustomerId: string;
    transCount: string;
    transCumulativeAmt: string;
    bankAccount: string;
    customerId: string;
    transModeId: string;
}
export interface Level {
    id: string;

    name: string;
}
export interface createCustomerRequest {
    id: number;
    levelId: number;
    customerId: '';
    alertId:number;
    name: string;
}

    export interface CustomerGetData{
        transModeId:number;
        transCount:number,
        transCumulativeAmt:number,
        customerId:string;
        accountId:string;
        alertDetails:string;
        dt:number;
        assignInvestigation:number;
        txnAlert:string;
        description:string;
        customerName:string;
        accountNum:string;
        bankName:string;
        branchName:string;
        pocId:number;
        isCumulativeEntry:number;
    }
    export interface TransactionData{
        senderAccount:string;
        withdrawals:string;
        dt:number;
        country:string;
        receiver:number;
        receiverBankName:string;
        receiverCountry:string;
       
    }
    export interface AlertDetails {
        transModeId: string;
        transCount: string;
        transCumulativeAmt: string;
        customerId: string;
        accountId: string;
        alertDetails: string;
        dt: string;
        assignInvestigation: string;
        txnAlert: string;
        description: string;
        customerName: string;
        accountNum: string;
        bankName: string;
        branchName: string;
    }
