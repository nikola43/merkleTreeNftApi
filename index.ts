import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
const lineByLine = require('n-readlines');
import keccak256 from 'keccak256'
import { MerkleTree } from 'merkletreejs'
const cors = require('cors');

dotenv.config();

const app: Express = express();
const port = 3001;

let addresses: string[] = [
  "0x31935883802D258D73d698AA2aaB31cCE308DBF0",
  "0xCF49661e783c2b7Bf581106c9f88FFA765752e3d"
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

const merkleTree = new MerkleTree(
  addresses,
  keccak256,
  { hashLeaves: true, sortPairs: true }
)

app.use(cors({
  //origin: 'https:website.com'
  origin: '*'
}));

app.use(express.static('public'))

console.log("root", merkleTree.getRoot().toString('hex'));
app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.get('/get_proof_by_address/:address', (req: Request, res: Response) => {
  let address: string = req.params.address;
  const proof = merkleTree.getHexProof(keccak256(address));
  res.send(proof);
});


app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});

module.exports = app;