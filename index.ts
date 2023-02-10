import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
const lineByLine = require('n-readlines');
import keccak256 from 'keccak256'
import { MerkleTree } from 'merkletreejs'
const cors = require('cors');

dotenv.config();

const app: Express = express();
const port = 3001;

let addresses1: string[] = [
  "0xCF49661e783c2b7Bf581106c9f88FFA765752e3d",
  "0x31935883802D258D73d698AA2aaB31cCE308DBF0"
]

let addresses2: string[] = [
  "0xE5ce1Bc690a23780c292fEeB0c734FDbC29dC754",
  "0xd7B420916B543Aed6926523424CA16C63e948A15"
]

let rowCounter = 0;

/*
const liner = new lineByLine('public/addr-list_test.txt');

let line;


while (line = liner.next()) {
  addresses.push(line.toString())
  rowCounter++;
  console.log({
    rowCounter
  })
}
*/

const merkleTree1 = new MerkleTree(
  addresses1,
  keccak256,
  { hashLeaves: true, sortPairs: true }
)

const merkleTree2 = new MerkleTree(
  addresses2,
  keccak256,
  { hashLeaves: true, sortPairs: true }
)

app.use(cors({
  //origin: 'https:website.com'
  origin: '*'
}));

app.use(express.static('public'))

console.log("root1", merkleTree1.getRoot().toString('hex'));
console.log("root2", merkleTree2.getRoot().toString('hex'));
app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.get('/get_proof_by_address/:list/:address', (req: Request, res: Response) => {
  let address: string = req.params.address;
  let list: string = req.params.list;
  let proof: string[];

  if (list === "1") {
     proof = merkleTree1.getHexProof(keccak256(address));
  } else if (list === "2") {
     proof = merkleTree2.getHexProof(keccak256(address));
  } else {
     proof = [];
  }

  res.send(proof);
});


app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});

module.exports = app;