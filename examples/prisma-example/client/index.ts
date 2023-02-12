import { Client } from "../../../src/index";
import { API, api } from "../server/api";

const client = Client<API>("http://localhost:8080");

const { prisma, hello } = client;

const main = async () => {
  console.log( await hello())
  console.log(await prisma.user.findMany());
  // console.log(await prisma.user.count());
  
};

main();
