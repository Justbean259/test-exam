# Ethereum Full-Stack DApp – Wallet Dashboard & Token Minting

## Overview

This project is a full-stack decentralized application (DApp) built with a modular architecture, integrating frontend, backend, smart contract, and blockchain interaction layers. Users can connect their Ethereum wallet, view account details and transaction history, fetch blockchain metadata, and mint custom tokens via smart contracts.

This solution was developed in response to a 4-tier blockchain development challenge to demonstrate capabilities across frontend, backend, smart contracts, and system integration.

---

## 🧩 Project Structure

```
/
├── frontend/       # React-based UI with Web3 integration
├── backend/        # RESTful API built with Node.js & Express
├── blockchain/ # Solidity smart contracts using OpenZeppelin
├── docker/         # Dockerfile & Compose config for orchestration
├── infra/          # Utility scripts (Windows & Linux) to sync contract files
└── README.md       # You're here!
```

---

## ✨ Features

- Connect Ethereum wallets (MetaMask, WalletConnect)
- Display ETH balance and latest 10 transactions
- REST API: Gas price, block number, address balance, amount, accountFrom, accountTo
- ERC-20 minting and token transfers
- Integrated frontend interaction with smart contract
- Containerized with Docker & Docker Compose

---

## 🔧 Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Yarn](https://classic.yarnpkg.com/lang/en/) or npm
- [Docker](https://www.docker.com/) & Docker Compose
- MetaMask extension or WalletConnect-compatible app
- Ethereum testnet (e.g., Sepolia, Goerli)

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/eth-fullstack-dapp.git
cd eth-fullstack-dapp
```

---

### 2. Environment Variables

Copy `.env.example` and update it in each directory as needed:


```bash
cp .env.example .env
```

---

### 3. Run deploy contract
Navigate to the `blockchain/` folder and install dependencies:

```bash
cd blockchain && npm install
```
To deploy the smart contract (you can check package.json for additional network options):
```bash
npm run deploy:sepolia
```

To run the contract tests:
```bash
npm run test
```
Ensure your .env file inside blockchain/ is correctly set up with your private key and RPC URL before deploying to a testnet.

---

### 4. Run Locally with Docker Compose
Navigate to the `docker/` folder and start the application using Docker Compose:

```bash
docker compose up --build
```
Alternatively, you can run the following command directly from the project root:
```bash
docker compose -f 'docker/docker-compose.yml' up -d --build
```

This will start:
- Backend (Node.js) on `localhost:8000`
- Frontend (React) on `localhost:5173`

Ensure you have Docker and Docker Compose installed on your system before running this command.

---

### 5. Run Manually Without Docker

#### Backend

```bash
cd backend
yarn install
yarn dev
```

#### Frontend

```bash
cd frontend
yarn install
yarn dev
```

---

## 📄 Smart Contract

- Built using Solidity and OpenZeppelin libraries.
- ERC-20 contract supports minting and transferring.
- Deployment via Hardhat to Ethereum testnet.
- Contract address configurable in `.env`.
- Includes unit tests written in JavaScript/TypeScript using Hardhat and Chai.

---

## 📦 Tech Stack

- **Frontend**: React, TypeScript, Wagmi
- **Backend**: Node.js, Express, Ethers.js, Mongodb
- **Smart Contract**: Solidity, OpenZeppelin, Hardhat
- **DevOps**: Docker, Docker Compose

---

## 📌 Assumptions & Decisions

- Used `ethers.js` for both backend blockchain interactions.
- MongoDB database is available for persistence of account snapshots.
- The frontend supports only MetaMask & WalletConnect at the moment.

---

## 🐛 Known Issues

- Frontend currently displays only the last 10 transactions, but the backend API already supports pagination and can be extended for full history.
- Caching for gas price and block number is in-memory
- Smart contract deployment assumes testnet access (e.g., Sepolia).
- Wallet interactions assume users have sufficient ETH to cover gas fees.

---


## 💡 Future Improvements
- Better error UI on frontend (loading state, failed tx)
- Add pagination for transaction history
- Integrate Redis caching for gas price and block number (skipped for now due to project size)
- CI/CD pipeline integration
---


## 🙌 Final Note

Thank you for taking the time to go through this project.

This repository was built as a skill showcase to help you evaluate my technical abilities and development approach before any potential collaboration.

If you have any questions, feedback, or want to discuss how we can work together, feel free to reach out.

Looking forward to the possibility of building something great with you! 🚀

— The Developer 💼✨
