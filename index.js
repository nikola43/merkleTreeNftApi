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
let addresses1 = [
    "0xCF49661e783c2b7Bf581106c9f88FFA765752e3d",
    "0x31935883802D258D73d698AA2aaB31cCE308DBF0"
];
let addresses2 = [
    "0xE5ce1Bc690a23780c292fEeB0c734FDbC29dC754",
    "0xd7B420916B543Aed6926523424CA16C63e948A15"
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
const merkleTree1 = new merkletreejs_1.MerkleTree(addresses1, keccak256_1.default, { hashLeaves: true, sortPairs: true });
const merkleTree2 = new merkletreejs_1.MerkleTree(addresses2, keccak256_1.default, { hashLeaves: true, sortPairs: true });
app.use(cors({
    //origin: 'https:website.com'
    origin: '*'
}));
app.use(express_1.default.static('public'));
console.log("root1", merkleTree1.getRoot().toString('hex'));
console.log("root2", merkleTree2.getRoot().toString('hex'));
app.get('/', (req, res) => {
    res.send('Express + TypeScript Server');
});
app.get('/get_proof_by_address/:list/:address', (req, res) => {
    let address = req.params.address;
    let list = req.params.list;
    let proof;
    if (list === "1") {
        proof = merkleTree1.getHexProof((0, keccak256_1.default)(address));
    }
    else if (list === "2") {
        proof = merkleTree2.getHexProof((0, keccak256_1.default)(address));
    }
    else {
        proof = [];
    }
    res.send(proof);
});
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
module.exports = app;
