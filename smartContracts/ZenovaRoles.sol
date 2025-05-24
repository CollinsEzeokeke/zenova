// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title ZenovaRoles
 * @author Zenova Team (Inspired by Credora)
 * @notice Defines the ultra-simplified role system with only AI_ROLE.
 * Only one role: AI_ROLE for all platform operations.
 * This contract provides role constants and a virtual modifier that assumes
 * an AccessControl context in the inheriting contract.
 */
contract ZenovaRoles {

    // Custom Error for Role Check

    /**
     * @notice Modifier to restrict functions to AI_ROLE.
     * @dev This modifier is virtual and is intended to be overridden by contracts
     *      that inherit from ZenovaRoles and also use AccessControl.
     *      The overriding modifier should implement the actual role check.
     */
    modifier onlyAI() virtual {
        // This base implementation does nothing and relies on the override.
        // Consider adding `revert("ZenovaRoles: onlyAI modifier not overridden");`
        // if direct use of this base modifier without an override is unintended.
        _;
    }

    // Constructor and grantAIRole removed as this contract no longer inherits AccessControl.
    // Role setup and granting are now the responsibility of the contract that
    // inherits both ZenovaRoles and an AccessControl implementation (e.g., AccessControlEnumerable).
}
