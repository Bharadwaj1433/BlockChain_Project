import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("ProofLedgerModule", (m) => {
  const proofLedger = m.contract("ProofLedger");

  return { proofLedger };
});
