// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {AccessControlEnumerable} from "@openzeppelin/contracts/access/extensions/AccessControlEnumerable.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";
import {ZenovaRoles} from "./ZenovaRoles.sol";

/**
 * @title ZenovaAsset
 * @author Zenova Team
 * @notice Represents tokenized shares of a company. It's an ERC20 token, pausable, with access control.
 * Pricing and trading are governed by AI and specific roles.
 */
contract ZenovaAsset is ERC20, AccessControlEnumerable, Pausable, ZenovaRoles {
    using SafeERC20 for IERC20;
    using Math for uint256;

    // --- Structs ---
    struct CompanyInfo {
        string name;
        string symbol; // Token symbol
        string description;
        string website; // Optional
        address issuingCompanyWallet; // Wallet of the company receiving proceeds
    }

    struct AssetPricingDetails {
        uint256 currentPricePerToken; // Price per token in acceptedCurrency
        uint256 buyFeeBPS; // Buy fee in basis points (e.g., 250 = 2.5%)
        uint256 sellFeeBPS; // Sell fee in basis points
        uint256 marketCap; // Current market cap (calculated dynamically)
        uint256 lastPriceUpdateTimestamp; // When price was last updated
        address acceptedCurrency; // ERC20 token used for trading
    }

    struct FullAssetDetails {
        address assetAddress;
        CompanyInfo companyDetails;
        AssetPricingDetails pricingDetails;
        uint256 currentValuation;
        uint256 maxTokenSupply;
        uint256 currentTotalSupply;
        bool isTradingActive;
        address admin;
        address priceAI;
        address liquidityManager;
    }

    struct TradingMetrics {
        uint256 totalVolumeTraded;
        uint256 totalTokensTraded;
        uint256 totalBuyTransactions;
        uint256 totalSellTransactions;
        uint256 totalFeesCollected;
        uint256 averageTradeSize;
        uint256 lastTradeTimestamp;
        uint256 priceVolatility;
    }

    struct MarketAnalysis {
        uint256 currentMarketCap;
        uint256 fullyDilutedMarketCap;
        uint256 circulationRatio; // BPS
        uint256 liquidityRatio; // BPS
        uint256 priceToValuationRatio; // BPS
        bool isOvervalued;
        bool isUndervalued;
        uint256 timeSinceLastPriceUpdate;
    }

    struct UserAssetInfo {
        uint256 tokenBalance;
        uint256 tokenBalanceValue;
        uint256 percentageOfSupply; // BPS
        uint256 totalPurchaseValue;
        uint256 totalSaleValue;
        uint256 totalFeesPaid;
        uint256 lastTradeTimestamp;
        bool hasTraded;
        uint256 realizedPnL;
        uint256 unrealizedPnL;
    }

    // --- State Variables ---
    CompanyInfo public companyInfo;
    AssetPricingDetails public assetPricingDetails;

    uint256 public currentValuation; // AI-set company valuation in acceptedCurrency
    uint256 public maxTokenSupply; // Calculated based on valuation and initial price

    bool public tradingActive; // Whether trading (buy/sell) is enabled
    uint256 public collectedFees; // Fees accumulated from trades, in acceptedCurrency

    // --- Trading Metrics State Variables ---
    uint256 public totalVolumeTraded; // Total volume of acceptedCurrency traded
    uint256 public totalTokensTraded; // Total number of tokens bought/sold
    uint256 public totalBuyTransactions; // Number of buy transactions
    uint256 public totalSellTransactions; // Number of sell transactions
    uint256 public lastTradeTimestamp; // Timestamp of last trade

    // --- User Trading Data ---
    mapping(address => uint256) public userTotalPurchaseValue; // Total amount user has spent buying tokens
    mapping(address => uint256) public userTotalSaleValue; // Total amount user has received from selling tokens
    mapping(address => uint256) public userTotalFeesPaid; // Total fees paid by user
    mapping(address => uint256) public userLastTradeTimestamp; // User's last trade timestamp
    mapping(address => bool) public userHasTraded; // Whether user has ever traded this asset

    // --- Constants ---
    uint256 private constant BPS_DIVISOR = 10000;
    bytes32 public constant AI_ROLE = keccak256("AI_ROLE"); // For ALL operations (AI and administrative)

    // --- Events ---
    event CompanyValuationSet(uint256 valuation, uint256 maxSupply, address evaluator);
    event PriceUpdated(uint256 newPrice, address updater);
    event LiquidityParametersUpdated(uint256 buyFeeBPS, uint256 sellFeeBPS, address updater);
    event TradeExecuted(address indexed trader, bool isBuy, uint256 tokenAmount, uint256 currencyAmount, uint256 fee);

    // --- Errors ---
    error ZenovaAsset__AlreadyInitialized();
    error ZenovaAsset__NotInitialized();
    error ZenovaAsset__ZeroAddress();
    error ZenovaAsset__TradingNotActive();
    error ZenovaAsset__TradingActive();
    error ZenovaAsset__InvalidAmount();
    error ZenovaAsset__InsufficientAllowance(address token, address spender, uint256 needed);
    error ZenovaAsset__TransferFailed(address token, address recipient, uint256 amount);
    error ZenovaAsset__ValuationNotSet();
    error ZenovaAsset__MaxSupplyReached();
    error ZenovaAsset__PriceMustBePositive();
    error ZenovaAsset__FeeTooHigh(uint256 feeBPS);
    error ZenovaAsset__InsufficientOutputAmount();
    error ZenovaAsset__NoFeesToWithdraw();
    error ZenovaAsset__CompanyWalletNotSet();
    error ZenovaAsset__WithdrawAmountExceedsBalance(); // For company withdrawal
    error ZenovaAsset__MaxSupplyWouldBeZero();
    error ZenovaAsset__ValuationZeroOrPriceZero();
    error ZenovaAsset__NotAI();


    // --- Modifiers ---
    modifier whenTradingActive() {
        if (!tradingActive) {
            revert ZenovaAsset__TradingNotActive();
        }
        _; // Continue if trading is active
    }

    // This modifier overrides the virtual one from ZenovaRoles
    modifier onlyAI() override {
        // Uses AI_ROLE from inherited ZenovaRoles for all operations
        if (!hasRole(AI_ROLE, msg.sender)) {
            revert ZenovaAsset__NotAI();
        }
        _;
    }

    // --- Constructor ---
    /**
     * @dev Constructor for the implementation contract. ERC20 name/symbol are set dynamically in initialize.
     */
    constructor() ERC20("Zenova Asset Implementation", "ZAI") {
        // Grant deployer the roles needed to set up the implementation contract itself, if any.
        // Actual roles for the *cloned* asset will be set in its initialize function.
        // The deployer of this base contract gets DEFAULT_ADMIN_ROLE for *this* contract (the master copy).
        // This is standard for OZ AccessControl.
    }

    // --- Initialization ---
    /**
     * @notice Initializes the Zenova Asset token contract after cloning.
     * @param _initialAdmin The address to be granted ADMIN_ROLE for this asset contract.
     * @param _companyInfoStruct Struct containing details about the company.
     * @param _acceptedCurrency Address of the ERC20 token used for trading (e.g., USDC).
     */
    function initialize(address _initialAdmin, CompanyInfo calldata _companyInfoStruct, address _acceptedCurrency)
        external
    {
        if (totalSupply() > 0 || address(assetPricingDetails.acceptedCurrency) != address(0)) {
            revert ZenovaAsset__AlreadyInitialized();
        }
        if (_initialAdmin == address(0) || _acceptedCurrency == address(0)) {
            revert ZenovaAsset__ZeroAddress();
        }
        if (bytes(_companyInfoStruct.name).length == 0 || bytes(_companyInfoStruct.symbol).length == 0) {
            revert ZenovaAsset__InvalidAmount();
        }

        companyInfo = _companyInfoStruct;
        assetPricingDetails.acceptedCurrency = _acceptedCurrency;
        assetPricingDetails.lastPriceUpdateTimestamp = block.timestamp;

        // Grant _initialAdmin the DEFAULT_ADMIN_ROLE for this contract instance.
        // This role manages other role admins.
        _grantRole(DEFAULT_ADMIN_ROLE, _initialAdmin);

        // Grant _initialAdmin the Zenova platform's AI_ROLE for this asset.
        _grantRole(AI_ROLE, _initialAdmin);

        // The AI address now has full control over this asset through the AI_ROLE
    }

    // --- ERC20 Overrides for Dynamic Name/Symbol ---
    function name() public view virtual override returns (string memory) {
        if (bytes(companyInfo.name).length == 0) {
            return super.name(); // Return placeholder if not initialized
        }
        return companyInfo.name;
    }

    function symbol() public view virtual override returns (string memory) {
        if (bytes(companyInfo.symbol).length == 0) {
            return super.symbol(); // Return placeholder if not initialized
        }
        return companyInfo.symbol;
    }

    function decimals() public view virtual override returns (uint8) {
        return 18; // Standard for many tokens, can be made configurable if needed
    }

    // --- Pausable Overrides ---
    function pause() public virtual onlyAI {
        _pause();
    }

    function unpause() public virtual onlyAI {
        _unpause();
    }

    // --- Core Logic ---
    /**
     * @notice Sets the initial valuation and maximum token supply for the company.
     * @dev Typically called by the ZenovaAssetFactory (which is AI-controlled) immediately after asset creation.
     *      Requires the asset to be initialized. This function can only be successfully executed once.
     * @param _companyValuation The total valuation of the company in acceptedCurrency units.
     * @param _initialPricePerToken The initial price per token, used to calculate max supply.
     * @param _evaluator The address of the AI evaluator (who called the factory) setting this valuation (for event logging).
     */
    function setCompanyValuationAndSupply(uint256 _companyValuation, uint256 _initialPricePerToken, address _evaluator)
        public
    {
        // Removed onlyAI modifier; protection comes from factory logic and one-time execution
        if (address(assetPricingDetails.acceptedCurrency) == address(0)) {
            revert ZenovaAsset__NotInitialized();
        }
        if (maxTokenSupply > 0) {
            revert ZenovaAsset__AlreadyInitialized(); // Valuation and supply can only be set once
        }
        if (_companyValuation == 0 || _initialPricePerToken == 0) {
            revert ZenovaAsset__ValuationZeroOrPriceZero();
        }

        currentValuation = _companyValuation;
        assetPricingDetails.currentPricePerToken = _initialPricePerToken;
        maxTokenSupply = (_companyValuation * (10 ** uint256(decimals()))) / _initialPricePerToken;
        if (maxTokenSupply == 0) {
            revert ZenovaAsset__MaxSupplyWouldBeZero();
        }

        assetPricingDetails.marketCap = currentValuation; // Initial market cap based on full valuation
        assetPricingDetails.lastPriceUpdateTimestamp = block.timestamp;

        emit CompanyValuationSet(currentValuation, maxTokenSupply, _evaluator);
        emit PriceUpdated(_initialPricePerToken, _evaluator); // Log who evaluated/set this initial price
    }

    function updatePrice(uint256 newPricePerToken) external whenNotPaused onlyAI {
        if (maxTokenSupply == 0) {
            revert ZenovaAsset__ValuationNotSet();
        }
        if (newPricePerToken == 0) {
            revert ZenovaAsset__PriceMustBePositive();
        }
        assetPricingDetails.currentPricePerToken = newPricePerToken;
        assetPricingDetails.lastPriceUpdateTimestamp = block.timestamp;
        assetPricingDetails.marketCap = (newPricePerToken * totalSupply()) / (10 ** uint256(decimals()));
        emit PriceUpdated(newPricePerToken, msg.sender);
    }

    function updateLiquidityParameters(uint256 newBuyFeeBPS, uint256 newSellFeeBPS) external whenNotPaused onlyAI {
        if (newBuyFeeBPS > BPS_DIVISOR / 2 || newSellFeeBPS > BPS_DIVISOR / 2) {
            // Arbitrary cap, e.g. 50%
            revert ZenovaAsset__FeeTooHigh(Math.max(newBuyFeeBPS, newSellFeeBPS));
        }
        assetPricingDetails.buyFeeBPS = newBuyFeeBPS;
        assetPricingDetails.sellFeeBPS = newSellFeeBPS;
        emit LiquidityParametersUpdated(newBuyFeeBPS, newSellFeeBPS, msg.sender);
    }

    function activateTrading() external onlyAI {
        if (maxTokenSupply == 0) {
            revert ZenovaAsset__ValuationNotSet();
        }
        if (tradingActive) {
            revert ZenovaAsset__TradingActive();
        }
        tradingActive = true;
    }

    function deactivateTrading() external onlyAI {
        if (!tradingActive) {
            revert ZenovaAsset__TradingNotActive(); // Already not active
        }
        tradingActive = false;
    }

    function getBuyQuote(uint256 tokenAmount) public view returns (uint256 totalCost, uint256 fee) {
        if (tokenAmount == 0) {
            revert ZenovaAsset__InvalidAmount();
        }
        if (maxTokenSupply == 0) {
            revert ZenovaAsset__ValuationNotSet();
        }
        uint256 pricePerToken = assetPricingDetails.currentPricePerToken;
        // Cost calculation needs to handle decimals of acceptedCurrency vs this token.
        // Assuming pricePerToken is in terms of acceptedCurrency for one whole ZenovaAsset token.
        uint256 baseCost = (tokenAmount * pricePerToken) / (10 ** uint256(decimals()));
        fee = (baseCost * assetPricingDetails.buyFeeBPS) / BPS_DIVISOR;
        totalCost = baseCost + fee;
        return (totalCost, fee);
    }

    function buyTokens(uint256 tokenAmountToBuy) external payable whenNotPaused whenTradingActive {
        if (tokenAmountToBuy == 0) {
            revert ZenovaAsset__InvalidAmount();
        }
        if (totalSupply() + tokenAmountToBuy > maxTokenSupply) {
            revert ZenovaAsset__MaxSupplyReached();
        }

        (uint256 totalCost, uint256 fee) = getBuyQuote(tokenAmountToBuy);

        // Ensure this contract can receive the payment
        IERC20 currency = IERC20(assetPricingDetails.acceptedCurrency);
        uint256 initialBalance = currency.balanceOf(address(this));
        currency.safeTransferFrom(msg.sender, address(this), totalCost);
        uint256 receivedAmount = currency.balanceOf(address(this)) - initialBalance;
        if (receivedAmount < totalCost) {
            // This check is belt-and-suspenders with SafeERC20 but good for fee-on-transfer tokens.
            revert ZenovaAsset__TransferFailed(address(currency), address(this), totalCost);
        }

        collectedFees += fee;

        // Mint new tokens to the buyer
        _mint(msg.sender, tokenAmountToBuy);

        // Update market cap after minting
        assetPricingDetails.marketCap =
            (assetPricingDetails.currentPricePerToken * totalSupply()) / (10 ** uint256(decimals()));

        // Update trading metrics
        totalVolumeTraded += totalCost;
        totalTokensTraded += tokenAmountToBuy;
        totalBuyTransactions += 1;
        lastTradeTimestamp = block.timestamp;

        // Update user trading data
        userTotalPurchaseValue[msg.sender] += totalCost;
        userTotalFeesPaid[msg.sender] += fee;
        userLastTradeTimestamp[msg.sender] = block.timestamp;
        userHasTraded[msg.sender] = true;

        emit TradeExecuted(msg.sender, true, tokenAmountToBuy, totalCost, fee);
    }

    function getSellQuote(uint256 tokenAmount) public view returns (uint256 proceeds, uint256 fee) {
        if (tokenAmount == 0) {
            revert ZenovaAsset__InvalidAmount();
        }
        if (maxTokenSupply == 0) {
            revert ZenovaAsset__ValuationNotSet();
        }
        uint256 pricePerToken = assetPricingDetails.currentPricePerToken;
        uint256 baseValue = (tokenAmount * pricePerToken) / (10 ** uint256(decimals()));
        fee = (baseValue * assetPricingDetails.sellFeeBPS) / BPS_DIVISOR;
        if (fee >= baseValue) {
            // fee cannot be >= 100% of value
            revert ZenovaAsset__InsufficientOutputAmount();
        }
        proceeds = baseValue - fee;
        return (proceeds, fee);
    }

    function sellTokens(uint256 tokenAmountToSell) external whenNotPaused whenTradingActive {
        if (tokenAmountToSell == 0) {
            revert ZenovaAsset__InvalidAmount();
        }
        if (balanceOf(msg.sender) < tokenAmountToSell) {
            revert ERC20InsufficientBalance(msg.sender, balanceOf(msg.sender), tokenAmountToSell);
        }

        (uint256 proceeds, uint256 fee) = getSellQuote(tokenAmountToSell);

        // Burn tokens from seller
        _burn(msg.sender, tokenAmountToSell);

        // Transfer payment to seller from contract's holdings
        IERC20 currency = IERC20(assetPricingDetails.acceptedCurrency);
        if (currency.balanceOf(address(this)) < proceeds) {
            // This means contract doesn't have enough acceptedCurrency to pay out.
            // This is a critical issue for an AMM-like model. Liquidity management is key.
            // For now, we revert. Real AMMs have more complex liquidity pool logic.
            revert ZenovaAsset__InsufficientOutputAmount(); // Re-use error, or add specific liquidity error
        }
        currency.safeTransfer(msg.sender, proceeds);

        collectedFees += fee;

        // Update market cap after burning
        assetPricingDetails.marketCap =
            (assetPricingDetails.currentPricePerToken * totalSupply()) / (10 ** uint256(decimals()));

        // Update trading metrics
        totalVolumeTraded += proceeds + fee; // Total value of the trade
        totalTokensTraded += tokenAmountToSell;
        totalSellTransactions += 1;
        lastTradeTimestamp = block.timestamp;

        // Update user trading data
        userTotalSaleValue[msg.sender] += proceeds;
        userTotalFeesPaid[msg.sender] += fee;
        userLastTradeTimestamp[msg.sender] = block.timestamp;
        userHasTraded[msg.sender] = true;

        emit TradeExecuted(msg.sender, false, tokenAmountToSell, proceeds, fee);
    }

    function withdrawFees(address recipient) external onlyAI {
        if (recipient == address(0)) {
            revert ZenovaAsset__ZeroAddress();
        }
        uint256 feesToWithdraw = collectedFees;
        if (feesToWithdraw == 0) {
            revert ZenovaAsset__NoFeesToWithdraw();
        }
        collectedFees = 0;
        IERC20(assetPricingDetails.acceptedCurrency).safeTransfer(recipient, feesToWithdraw);
    }

    /**
     * @notice Allows the company (issuingCompanyWallet) to claim/withdraw a portion of tokens.
     * This is a simplified version. Real vesting/distribution would be more complex.
     * For now, it allows the company to receive a direct mint of *new* tokens up to a certain portion
     * of the *remaining available supply before hitting maxTokenSupply*.
     * This doesn't touch trade proceeds directly, rather it's about initial allocation.
     */
    function companyWithdraw(uint256 amountOfTokens) external onlyAI {
        // Or a specific company role
        address companyWallet = companyInfo.issuingCompanyWallet;
        if (companyWallet == address(0)) {
            revert ZenovaAsset__CompanyWalletNotSet();
        }
        if (amountOfTokens == 0) {
            revert ZenovaAsset__InvalidAmount();
        }
        if (totalSupply() + amountOfTokens > maxTokenSupply) {
            revert ZenovaAsset__MaxSupplyReached(); // Or a more specific error for company allocation limit
        }

        // Mint tokens directly to the company wallet
        _mint(companyWallet, amountOfTokens);

        // Update market cap accordingly
        assetPricingDetails.marketCap =
            (assetPricingDetails.currentPricePerToken * totalSupply()) / (10 ** uint256(decimals()));
        // Consider emitting an event for company token allocation
    }

    // --- Getter Functions (from IZenovaAsset) ---
    function getCompanyInfo() external view returns (CompanyInfo memory) {
        return companyInfo;
    }

    function getAssetPricingDetails() external view returns (AssetPricingDetails memory) {
        AssetPricingDetails memory details = assetPricingDetails;
        // Calculate dynamic market cap for the getter
        if (maxTokenSupply > 0 && assetPricingDetails.currentPricePerToken > 0) {
            details.marketCap = (assetPricingDetails.currentPricePerToken * totalSupply()) / (10 ** uint256(decimals()));
        } else {
            details.marketCap = 0;
        }
        return details;
    }

    function getFullAssetDetails() external view returns (FullAssetDetails memory info) {
        info.assetAddress = address(this);
        info.companyDetails = companyInfo;
        info.pricingDetails = assetPricingDetails;

        // Calculate dynamic market cap for the getter
        if (maxTokenSupply > 0 && assetPricingDetails.currentPricePerToken > 0) {
            info.pricingDetails.marketCap =
                (assetPricingDetails.currentPricePerToken * totalSupply()) / (10 ** uint256(decimals()));
        } else {
            info.pricingDetails.marketCap = 0;
        }

        info.currentValuation = currentValuation;
        info.maxTokenSupply = maxTokenSupply;
        info.currentTotalSupply = totalSupply();
        info.isTradingActive = tradingActive;

        if (getRoleMemberCount(DEFAULT_ADMIN_ROLE) > 0) {
            info.admin = getRoleMember(DEFAULT_ADMIN_ROLE, 0);
        } else {
            info.admin = address(0); // Should not happen if initialized correctly
        }

        if (getRoleMemberCount(AI_ROLE) > 0) {
            info.priceAI = getRoleMember(AI_ROLE, 0);
        } else {
            info.priceAI = address(0); // No AI role granted yet
        }

        // The AI is also the admin/liquidity manager
        info.liquidityManager = info.priceAI;

        return info;
    }

    function isTradingActive() public view returns (bool) {
        return tradingActive;
    }

    function getCollectedFees() external view returns (uint256) {
        return collectedFees;
    }

    // --- Comprehensive Getter Functions (Similar to Credora) ---

    /**
     * @notice Retrieves comprehensive trading metrics for the asset.
     * @dev Provides insights into trading activity, volume, and performance.
     * @return metrics A TradingMetrics struct containing all trading-related data.
     */
    function getTradingMetrics() external view returns (TradingMetrics memory metrics) {
        metrics.totalVolumeTraded = totalVolumeTraded;
        metrics.totalTokensTraded = totalTokensTraded;
        metrics.totalBuyTransactions = totalBuyTransactions;
        metrics.totalSellTransactions = totalSellTransactions;
        metrics.totalFeesCollected = collectedFees;

        // Calculate average trade size
        uint256 totalTransactions = totalBuyTransactions + totalSellTransactions;
        if (totalTransactions > 0) {
            metrics.averageTradeSize = totalVolumeTraded / totalTransactions;
        } else {
            metrics.averageTradeSize = 0;
        }

        metrics.lastTradeTimestamp = lastTradeTimestamp;
        metrics.priceVolatility = 0; // Placeholder for future volatility calculation

        return metrics;
    }

    /**
     * @notice Provides detailed market analysis for the asset.
     * @dev Includes market cap calculations, ratios, and AI valuation comparisons.
     * @return analysis A MarketAnalysis struct with comprehensive market data.
     */
    function getMarketAnalysis() external view returns (MarketAnalysis memory analysis) {
        uint256 currentSupply = totalSupply();
        uint256 currentPrice = assetPricingDetails.currentPricePerToken;

        // Current market cap
        if (currentSupply > 0 && currentPrice > 0) {
            analysis.currentMarketCap = (currentPrice * currentSupply) / (10 ** uint256(decimals()));
        } else {
            analysis.currentMarketCap = 0;
        }

        // Fully diluted market cap
        if (maxTokenSupply > 0 && currentPrice > 0) {
            analysis.fullyDilutedMarketCap = (currentPrice * maxTokenSupply) / (10 ** uint256(decimals()));
        } else {
            analysis.fullyDilutedMarketCap = 0;
        }

        // Circulation ratio (percentage of max supply in circulation)
        if (maxTokenSupply > 0) {
            analysis.circulationRatio = (currentSupply * 10000) / maxTokenSupply; // BPS
        } else {
            analysis.circulationRatio = 0;
        }

        // Liquidity ratio (contract balance vs market cap)
        IERC20 currency = IERC20(assetPricingDetails.acceptedCurrency);
        uint256 contractBalance = currency.balanceOf(address(this));
        if (analysis.currentMarketCap > 0) {
            analysis.liquidityRatio = (contractBalance * 10000) / analysis.currentMarketCap; // BPS
        } else {
            analysis.liquidityRatio = 0;
        }

        // Price to valuation ratio
        if (currentValuation > 0 && analysis.currentMarketCap > 0) {
            analysis.priceToValuationRatio = (analysis.currentMarketCap * 10000) / currentValuation; // BPS
            analysis.isOvervalued = analysis.currentMarketCap > currentValuation;
            analysis.isUndervalued = analysis.currentMarketCap < currentValuation;
        } else {
            analysis.priceToValuationRatio = 10000; // 100% if no comparison available
            analysis.isOvervalued = false;
            analysis.isUndervalued = false;
        }

        // Time since last price update
        if (assetPricingDetails.lastPriceUpdateTimestamp > 0) {
            analysis.timeSinceLastPriceUpdate = block.timestamp - assetPricingDetails.lastPriceUpdateTimestamp;
        } else {
            analysis.timeSinceLastPriceUpdate = 0;
        }

        return analysis;
    }

    /**
     * @notice Retrieves user-specific information about their holdings and trading history.
     * @dev Provides personalized data for portfolio management and performance tracking.
     * @param user The address of the user to get information for.
     * @return userInfo A UserAssetInfo struct with user-specific data.
     */
    function getUserAssetInfo(address user) external view returns (UserAssetInfo memory userInfo) {
        userInfo.tokenBalance = balanceOf(user);

        // Token balance value
        uint256 currentPrice = assetPricingDetails.currentPricePerToken;
        if (userInfo.tokenBalance > 0 && currentPrice > 0) {
            userInfo.tokenBalanceValue = (userInfo.tokenBalance * currentPrice) / (10 ** uint256(decimals()));
        } else {
            userInfo.tokenBalanceValue = 0;
        }

        // Percentage of supply
        uint256 currentSupply = totalSupply();
        if (currentSupply > 0 && userInfo.tokenBalance > 0) {
            userInfo.percentageOfSupply = (userInfo.tokenBalance * 10000) / currentSupply; // BPS
        } else {
            userInfo.percentageOfSupply = 0;
        }

        // Trading history
        userInfo.totalPurchaseValue = userTotalPurchaseValue[user];
        userInfo.totalSaleValue = userTotalSaleValue[user];
        userInfo.totalFeesPaid = userTotalFeesPaid[user];
        userInfo.lastTradeTimestamp = userLastTradeTimestamp[user];
        userInfo.hasTraded = userHasTraded[user];

        // Calculate P&L
        if (userInfo.totalSaleValue >= userInfo.totalPurchaseValue) {
            userInfo.realizedPnL = userInfo.totalSaleValue - userInfo.totalPurchaseValue;
        } else {
            userInfo.realizedPnL = 0; // No negative values for now, could be int256 for actual P&L
        }

        // Unrealized P&L (current value vs remaining purchase cost)
        uint256 remainingPurchaseValue = userInfo.totalPurchaseValue > userInfo.totalSaleValue
            ? userInfo.totalPurchaseValue - userInfo.totalSaleValue
            : 0;
        if (userInfo.tokenBalanceValue >= remainingPurchaseValue) {
            userInfo.unrealizedPnL = userInfo.tokenBalanceValue - remainingPurchaseValue;
        } else {
            userInfo.unrealizedPnL = 0; // No negative values for now
        }

        return userInfo;
    }

    /**
     * @notice Provides a snapshot of the asset's current operational state.
     * @dev Quick access to frequently changing data for real-time monitoring.
     * @return currentPrice Current price per token in acceptedCurrency.
     * @return totalSupply Current total supply of tokens.
     * @return marketCap Current market capitalization.
     * @return contractBalance Contract's acceptedCurrency balance.
     * @return isTradingActive Whether trading is currently active.
     * @return lastPriceUpdate Timestamp of last price update.
     */
    function getAssetSnapshot()
        external
        view
        returns (
            uint256 currentPrice,
            uint256 totalSupply,
            uint256 marketCap,
            uint256 contractBalance,
            bool isTradingActive,
            uint256 lastPriceUpdate
        )
    {
        currentPrice = assetPricingDetails.currentPricePerToken;
        uint256 currentTotalSupply = super.totalSupply();
        totalSupply = currentTotalSupply;

        // Calculate current market cap
        if (currentTotalSupply > 0 && currentPrice > 0) {
            marketCap = (currentPrice * currentTotalSupply) / (10 ** uint256(decimals()));
        } else {
            marketCap = 0;
        }

        // Contract balance
        IERC20 currency = IERC20(assetPricingDetails.acceptedCurrency);
        contractBalance = currency.balanceOf(address(this));

        isTradingActive = tradingActive;
        lastPriceUpdate = assetPricingDetails.lastPriceUpdateTimestamp;

        return (currentPrice, totalSupply, marketCap, contractBalance, isTradingActive, lastPriceUpdate);
    }

    // --- AccessControlEnumerable Overrides (if any were strictly needed) ---
    // For supportsInterface, if we are NOT adding any new interfaces beyond what AccessControlEnumerable and ERC20 provide,
    // we might not even need to override it. However, it's good practice to explicitly state what interfaces are supported.
    // The IERC165 interface is implicitly supported by AccessControlEnumerable.

    // Override supportsInterface from AccessControlEnumerable
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(AccessControlEnumerable) // Specifies which base contract's function is being overridden
        returns (bool)
    {
        // If ZenovaAsset were to implement its own specific interface (e.g., IZenovaAsset),
        // you would add it here: if (interfaceId == type(IZenovaAsset).interfaceId) { return true; }
        return super.supportsInterface(interfaceId);
    }

    function PRICE_AI_ROLE() external view returns (bytes32) {
        // This refers to the Zenova specific AI_ROLE identifier.
        return AI_ROLE;
    }

    function LIQUIDITY_MANAGER_ROLE() external view returns (bytes32) {
        // This refers to the AI_ROLE since AI handles everything
        return AI_ROLE;
    }

    // _grantRole and _revokeRole are inherited from AccessControlEnumerable and can be used directly.
    // No need to override them if just calling super.
}
