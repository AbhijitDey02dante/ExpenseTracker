export interface expenseObj{
    id:number;
    category:string;
    description:string;
    amount:number;
    createdAt:Date;
    updatedAt:Date;
    userId:number;
}

export interface paramsObj{
    Bucket:any;
    Key:string;
    Body:string;
    ACL:string;
}

export interface userObj{
    id:number;
    name:string;
    email:string;
    mobile:number;
    password:string;
    spent:number;
    premium:number;
    createdAt:Date;
    updatedAt:Date;
}

export interface orderObj{
    id:number;
    createdAt:Date;
    updatedAt:Date;
    userId:number;
}