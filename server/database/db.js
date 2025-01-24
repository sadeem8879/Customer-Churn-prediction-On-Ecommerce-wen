import { PrismaClient } from "@prisma/client";

const prisma=new PrismaClient({
    log:["error","query"],
    errorFormat:"pretty",//note:pretty should be in small 
});

export default prisma;