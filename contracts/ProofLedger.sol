// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ProofLedger {
    struct DocumentRecord {
        address registeredBy;
        uint256 registeredAt;
        bool exists;
    }

    mapping(bytes32 => DocumentRecord) private records;

    event DocumentRegistered(
        bytes32 indexed documentHash,
        address indexed registeredBy,
        uint256 registeredAt
    );

    error DocumentAlreadyRegistered(bytes32 documentHash);
    error InvalidDocumentHash();

    function registerDocument(bytes32 documentHash) external {
        if (documentHash == bytes32(0)) {
            revert InvalidDocumentHash();
        }

        if (records[documentHash].exists) {
            revert DocumentAlreadyRegistered(documentHash);
        }

        records[documentHash] = DocumentRecord({
            registeredBy: msg.sender,
            registeredAt: block.timestamp,
            exists: true
        });

        emit DocumentRegistered(
            documentHash,
            msg.sender,
            block.timestamp
        );
    }

    function verifyDocument(bytes32 documentHash)
        external
        view
        returns (bool)
    {
        return records[documentHash].exists;
    }

    function getDocument(bytes32 documentHash)
        external
        view
        returns (
            address registeredBy,
            uint256 registeredAt,
            bool exists
        )
    {
        DocumentRecord memory record = records[documentHash];

        return (
            record.registeredBy,
            record.registeredAt,
            record.exists
        );
    }
}
