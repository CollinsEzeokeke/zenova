// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title USDTMock
 * @author Zenova Team
 * @notice Mock USDT token for testing and development purposes.
 * @dev This contract mimics USDT behavior with 6 decimals and minting capabilities.
 */
contract USDTMock is ERC20, Ownable {
    uint8 private constant USDT_DECIMALS = 6;
    uint256 public constant MAX_MINT_PER_TRANSACTION = 1000000 * 10 ** USDT_DECIMALS; // 1M USDT per mint

    // Events
    event TokensMinted(address indexed recipient, uint256 amount, address indexed minter);
    event BulkTokensMinted(address[] recipients, uint256[] amounts, address indexed minter);

    // Custom Errors
    error USDTMock__ZeroAddress();
    error USDTMock__ZeroAmount();
    error USDTMock__ExceedsMaxMint(uint256 requested, uint256 maximum);
    error USDTMock__ArrayLengthMismatch();
    error USDTMock__InvalidArrayLength();

    /**
     * @notice Constructor to initialize the USDT Mock token.
     * @param _name The name of the token (e.g., "Tether USD Mock").
     * @param _symbol The symbol of the token (e.g., "USDT").
     */
    constructor(string memory _name, string memory _symbol) ERC20(_name, _symbol) Ownable(msg.sender) {}

    /**
     * @notice Returns the number of decimals for USDT (6).
     * @return The number of decimals.
     */
    function decimals() public pure override returns (uint8) {
        return USDT_DECIMALS;
    }

    /**
     * @notice Mints test tokens to a specified address.
     * @dev Anyone can call this function for testing purposes.
     * @param _recipient The address to receive the minted tokens.
     * @param _amount The amount of tokens to mint (in wei, considering 6 decimals).
     */
    function mintTestTokens(address _recipient, uint256 _amount) external {
        if (_recipient == address(0)) {
            revert USDTMock__ZeroAddress();
        }
        if (_amount == 0) {
            revert USDTMock__ZeroAmount();
        }
        if (_amount > MAX_MINT_PER_TRANSACTION) {
            revert USDTMock__ExceedsMaxMint(_amount, MAX_MINT_PER_TRANSACTION);
        }

        _mint(_recipient, _amount);
        emit TokensMinted(_recipient, _amount, msg.sender);
    }

    /**
     * @notice Mints tokens to multiple addresses in a single transaction.
     * @dev Useful for setting up multiple test accounts quickly.
     * @param _recipients Array of addresses to receive tokens.
     * @param _amounts Array of amounts corresponding to each recipient.
     */
    function bulkMintTestTokens(address[] calldata _recipients, uint256[] calldata _amounts) external {
        if (_recipients.length != _amounts.length) {
            revert USDTMock__ArrayLengthMismatch();
        }
        if (_recipients.length == 0 || _recipients.length > 50) {
            revert USDTMock__InvalidArrayLength();
        }

        for (uint256 i = 0; i < _recipients.length; i++) {
            if (_recipients[i] == address(0)) {
                revert USDTMock__ZeroAddress();
            }
            if (_amounts[i] == 0) {
                revert USDTMock__ZeroAmount();
            }
            if (_amounts[i] > MAX_MINT_PER_TRANSACTION) {
                revert USDTMock__ExceedsMaxMint(_amounts[i], MAX_MINT_PER_TRANSACTION);
            }

            _mint(_recipients[i], _amounts[i]);
        }

        emit BulkTokensMinted(_recipients, _amounts, msg.sender);
    }

    /**
     * @notice Owner-only function to mint large amounts for initial setup.
     * @dev Only the contract owner can call this function.
     * @param _recipient The address to receive the minted tokens.
     * @param _amount The amount of tokens to mint.
     */
    function ownerMint(address _recipient, uint256 _amount) external onlyOwner {
        if (_recipient == address(0)) {
            revert USDTMock__ZeroAddress();
        }
        if (_amount == 0) {
            revert USDTMock__ZeroAmount();
        }

        _mint(_recipient, _amount);
        emit TokensMinted(_recipient, _amount, msg.sender);
    }

    /**
     * @notice Burns tokens from the caller's balance.
     * @param _amount The amount of tokens to burn.
     */
    function burn(uint256 _amount) external {
        if (_amount == 0) {
            revert USDTMock__ZeroAmount();
        }
        _burn(msg.sender, _amount);
    }

    /**
     * @notice Returns the maximum amount that can be minted per transaction.
     * @return The maximum mint amount.
     */
    function getMaxMintPerTransaction() external pure returns (uint256) {
        return MAX_MINT_PER_TRANSACTION;
    }

    /**
     * @notice Converts a human-readable USDT amount to wei (considering 6 decimals).
     * @param _humanAmount The amount in human-readable format (e.g., 100 for 100 USDT).
     * @return The amount in wei.
     */
    function toWei(uint256 _humanAmount) external pure returns (uint256) {
        return _humanAmount * 10 ** USDT_DECIMALS;
    }

    /**
     * @notice Converts wei amount to human-readable USDT amount.
     * @param _weiAmount The amount in wei.
     * @return The amount in human-readable format.
     */
    function fromWei(uint256 _weiAmount) external pure returns (uint256) {
        return _weiAmount / 10 ** USDT_DECIMALS;
    }
}
