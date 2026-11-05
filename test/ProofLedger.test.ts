import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { network } from "hardhat";

describe("ProofLedger", async function () {
  const { ethers } = await network.connect();

  async function deployProofLedger() {
    const ledger = await ethers.deployContract("ProofLedger");
    await ledger.waitForDeployment();
    return ledger;
  }

  it("registers a document fingerprint", async function () {
    const ledger = await deployProofLedger();
    const hash = ethers.keccak256(ethers.toUtf8Bytes("document-one"));

    await ledger.registerDocument(hash);

    assert.equal(await ledger.verifyDocument(hash), true);
  });

  it("returns the registering address and timestamp", async function () {
    const ledger = await deployProofLedger();
    const [signer] = await ethers.getSigners();
    const hash = ethers.keccak256(ethers.toUtf8Bytes("document-two"));

    await ledger.registerDocument(hash);

    const record = await ledger.getDocument(hash);

    assert.equal(record[0], signer.address);
    assert.ok(record[1] > 0n);
    assert.equal(record[2], true);
  });

  it("rejects duplicate fingerprints", async function () {
    const ledger = await deployProofLedger();
    const hash = ethers.keccak256(ethers.toUtf8Bytes("duplicate-document"));

    await ledger.registerDocument(hash);

    await assert.rejects(
      ledger.registerDocument(hash),
      /DocumentAlreadyRegistered/
    );
  });

  it("rejects a zero-valued fingerprint", async function () {
    const ledger = await deployProofLedger();
    const zeroHash = ethers.ZeroHash;

    await assert.rejects(
      ledger.registerDocument(zeroHash),
      /InvalidDocumentHash/
    );
  });

  it("returns false for an unknown fingerprint", async function () {
    const ledger = await deployProofLedger();
    const hash = ethers.keccak256(ethers.toUtf8Bytes("unknown-document"));

    assert.equal(await ledger.verifyDocument(hash), false);
  });
});
