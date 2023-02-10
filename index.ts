import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
const lineByLine = require('n-readlines');
import keccak256 from 'keccak256'
import { MerkleTree } from 'merkletreejs'
const cors = require('cors');

dotenv.config();

const app: Express = express();
const port = 3001;

let addresses: string[] = []
let rowCounter = 0;

const liner = new lineByLine('addr-list_test.txt');

let line;

while (line = liner.next()) {
  addresses.push(line.toString())
  rowCounter++;
  console.log({
    rowCounter
  })
}

const merkleTree = new MerkleTree(
  addresses,
  keccak256,
  { hashLeaves: true, sortPairs: true }
)

app.use(cors({
  //origin: 'https:website.com'
  origin: '*'
}));

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
