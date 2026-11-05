
# 🔐 ProofLedger
### Blockchain-Powered Document Integrity and Verification System

ProofLedger is a document integrity and verification system designed to detect unauthorized modifications in digital documents.

It uses the **SHA-256 hashing algorithm** to generate a unique digital fingerprint for each document. By comparing fingerprints, the system can identify whether a document has been modified.

---

## 📌 Problem Statement

Digital documents can be modified, manipulated, or tampered with without easily identifying the changes.

ProofLedger addresses this problem by generating unique cryptographic fingerprints and verifying document integrity.

## 🎯 Project Objectives

- Generate unique digital fingerprints for documents.
- Verify document integrity using SHA-256.
- Detect unauthorized document modifications.
- Provide a simple document verification interface.
- Develop a foundation for blockchain-based verification.
- Explore smart contracts for transparent record management.

## ✨ Key Features

- **SHA-256 Hash Generation:** Generates a unique fingerprint for every document.
- **Document Verification:** Compares fingerprints to identify changes.
- **Tamper Detection:** Detects modifications in previously registered documents.
- **Simple User Interface:** Easy-to-use document verification dashboard.
- **Local Record Storage:** Stores document fingerprints in browser Local Storage.
- **Smart Contract:** Includes a Solidity-based ProofLedger contract.
- **Automated Testing:** Includes Hardhat tests for smart contract functionality.

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| React | Frontend development |
| JavaScript | Application functionality |
| CSS | User interface styling |
| Solidity | Smart contract development |
| Hardhat | Smart contract compilation and testing |
| Ethers.js | Ethereum interaction library |
| SHA-256 | Document fingerprint generation |
| Node.js | JavaScript runtime |
| npm | Package management |
| Git & GitHub | Version control |

## 📂 Project Structure

```text
ProofLedger/
│
├── contracts/
│   └── ProofLedger.sol
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   └── Dashboard.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── ignition/
│   ├── deployments/
│   └── modules/
│       └── ProofLedger.ts
│
├── test/
│   └── ProofLedger.test.ts
│
├── hardhat.config.ts
├── package.json
├── package-lock.json
├── tsconfig.json
├── README.md
└── .gitignore
```

## ⚙️ Installation and Setup

### Prerequisites

- Node.js
- npm
- Git
- Visual Studio Code

### 1. Clone the Repository

```bash
git clone https://github.com/Bharadwaj1433/BlockChain_Project.git
```

### 2. Navigate to the Project

```bash
cd BlockChain_Project
```

### 3. Install Backend Dependencies

```bash
npm install
```

### 4. Install Frontend Dependencies

```bash
cd frontend
npm install
```

## 🚀 Running the Application

Navigate to the frontend directory:

```bash
cd frontend
```

Start the development server:

```bash
npm run dev
```

Open the local URL displayed in your terminal, usually:

```text
http://localhost:5173
```

## ⛓️ Smart Contract Development

ProofLedger includes a Solidity smart contract developed using Hardhat.

### Compile Smart Contracts

Run from the project root:

```bash
npx hardhat compile
```

### Run Smart Contract Tests

```bash
npx hardhat test
```

### Start Local Blockchain

```bash
npx hardhat node
```

### Deploy Smart Contract

```bash
npx hardhat ignition deploy ./ignition/modules/ProofLedger.ts --network localhost
```

Start the local Hardhat node in another terminal before deploying.

## 🔍 How It Works

1. The user selects and uploads a document.
2. The system generates its SHA-256 fingerprint.
3. The fingerprint is stored as a document record.
4. The user selects the document again for verification.
5. The system generates a new fingerprint.
6. The new fingerprint is compared with the stored fingerprint.
7. Matching fingerprints indicate that the document content has not changed.

## 🔮 Future Enhancements

- Integrate the frontend with Ethereum smart contracts.
- Store document fingerprints directly on a blockchain.
- Implement decentralized document storage.
- Add secure user authentication.
- Introduce role-based access control.
- Support document sharing through unique verification IDs.
- Deploy smart contracts to a public blockchain network.

## ⚠️ Current Implementation

The current frontend uses SHA-256 hashing and browser Local Storage for document fingerprint records.

The Solidity smart contract and Hardhat development environment are included separately in this repository.

Full integration of the frontend with blockchain-based storage is a future enhancement.

**Note:** Browser Local Storage is not immutable blockchain storage. Clearing browser data may remove locally stored verification records.

## 👨‍💻 Project Information

- **Project Name:** ProofLedger
- **Project Type:** B.Tech Final-Year Academic Project
- **Domain:** Blockchain Technology, Cybersecurity and Web Development
- **Institution:** SR University

### GitHub Repository

https://github.com/Bharadwaj1433/BlockChain_Project

## 📚 References

1. NIST. (2015). Secure Hash Standard (FIPS PUB 180-4).  
   https://doi.org/10.6028/NIST.FIPS.180-4

2. Ethereum Documentation – Introduction to Smart Contracts.  
   https://ethereum.org/developers/docs/smart-contracts/

---

## 📄 License

This project is developed for academic and educational purposes.
