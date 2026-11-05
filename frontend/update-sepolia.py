from pathlib import Path

p = Path("src/components/Dashboard.jsx")
s = p.read_text(encoding="utf-8")

replacements = [
    (
        'import { Contract, JsonRpcProvider } from "ethers";',
        'import { Contract, JsonRpcProvider, BrowserProvider } from "ethers";'
    ),
    (
        'const RPC_URL = "http://127.0.0.1:8545";',
        'const RPC_URL = "https://ethereum-sepolia-rpc.publicnode.com";\nconst SEPOLIA_CHAIN_ID = 11155111;'
    ),
    (
        '''  async function checkNetwork() {
    try {
      const provider = getProvider();
      await provider.getBlockNumber();
      setNetworkStatus("Connected");
      return provider;
    } catch {
      setNetworkStatus("Offline");
      return null;
    }
  }''',
        '''  async function checkNetwork() {
    try {
      const provider = getProvider();
      await provider.getBlockNumber();
      const network = await provider.getNetwork();

      if (Number(network.chainId) !== SEPOLIA_CHAIN_ID) {
        setNetworkStatus("Wrong Network");
        return null;
      }

      setNetworkStatus("Connected");
      return provider;
    } catch {
      setNetworkStatus("Offline");
      return null;
    }
  }'''
    ),
    (
        '''      const provider = getProvider();
      await provider.getBlockNumber();

      const signer = await provider.getSigner(0);
      const contract = new Contract(CONTRACT_ADDRESS, PROOFLEDGER_ABI, signer);''',
        '''      if (!window.ethereum) {
        throw new Error("Install MetaMask to register documents.");
      }

      const walletProvider = new BrowserProvider(window.ethereum);
      await walletProvider.send("eth_requestAccounts", []);
      const walletNetwork = await walletProvider.getNetwork();

      if (Number(walletNetwork.chainId) !== SEPOLIA_CHAIN_ID) {
        throw new Error("Switch MetaMask to Ethereum Sepolia before registering.");
      }

      const signer = await walletProvider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, PROOFLEDGER_ABI, signer);'''
    ),
    (
        'Document successfully registered on the local blockchain.',
        'Document successfully registered on Ethereum Sepolia.'
    ),
    (
        'Registration failed. Check that the Hardhat node is running and the contract is deployed.',
        'Registration failed. Check MetaMask, your Sepolia balance, and the contract connection.'
    ),
    (
        'Verification failed. Check that the Hardhat node and deployed contract are available.',
        'Verification failed. Check the Sepolia RPC connection and deployed contract.'
    ),
    (
        '<strong>Local Network</strong>',
        '<strong>Ethereum Sepolia</strong>'
    ),
    (
        '{networkStatus === "Connected" ? "Local Blockchain Connected" : networkStatus}',
        '{networkStatus === "Connected" ? "Sepolia Connected" : networkStatus}'
    ),
    (
        '<small>Local Hardhat JSON-RPC</small>',
        '<small>Ethereum Sepolia RPC</small>'
    ),
]

for old, new in replacements:
    count = s.count(old)
    if count != 1:
        raise SystemExit(
            f"STOP: Expected one occurrence but found {count} for:\n{old[:100]}"
        )

for old, new in replacements:
    s = s.replace(old, new, 1)

p.write_text(s, encoding="utf-8")
print("Updated Dashboard.jsx for Sepolia.")
