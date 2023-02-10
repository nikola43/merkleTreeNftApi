"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const lineByLine = require('n-readlines');
const keccak256_1 = __importDefault(require("keccak256"));
const merkletreejs_1 = require("merkletreejs");
const cors = require('cors');
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = 3001;
let addresses = [
    "0x31935883802D258D73d698AA2aaB31cCE308DBF0",
    "0xCF49661e783c2b7Bf581106c9f88FFA765752e3d"
];
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
const merkleTree = new merkletreejs_1.MerkleTree(addresses, keccak256_1.default, { hashLeaves: true, sortPairs: true });
app.use(cors({
    //origin: 'https:website.com'
    origin: '*'
}));
app.use(express_1.default.static('public'));
console.log("root", merkleTree.getRoot().toString('hex'));
app.get('/', (req, res) => {
    res.send('Express + TypeScript Server');
});
app.get('/get_proof_by_address/:address', (req, res) => {
    let address = req.params.address;
    const proof = merkleTree.getHexProof((0, keccak256_1.default)(address));
    res.send(proof);
});
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
module.exports = app;
