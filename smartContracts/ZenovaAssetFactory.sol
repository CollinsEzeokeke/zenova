// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IZenovaAsset, ZenovaAsset} from "./interfaces/IZenovaAsset.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title ZenovaAssetFactory
 * @author Zenova Team
 * @notice Factory for creating and managing ZenovaAsset instances (tokenized company shares).
 * It leverages AI for valuations and specific roles for operational control.
 */
contract ZenovaAssetFactory is AccessControl {
    address public immutable zenovaAssetImplementation; // Master implementation of ZenovaAsset
    IERC20 public immutable acceptedCurrency; // Currency for valuations and trading (e.g., USDC)

    address[] public allZenovaAssets; // Array of all created ZenovaAsset contracts
    mapping(address => address[]) public companyToAssets; // Company (e.g., representative wallet) to its assets
    mapping(address => CompanyInitialValuation) public assetInitialValuations; // Asset address to its initial AI valuation details

    // --- Structs ---
    /**
     * @notice Stores the initial AI-assessed valuation for a company before its asset is fully configured.
     * @param companyWallet The wallet representing the company being valued.
     * @param valuation The total valuation in acceptedCurrency units.
     * @param initialPricePerToken The suggested initial price per token.
     * @param evaluatorAI The AI address that performed the evaluation.
     * @param assessmentTimestamp Timestamp of the valuation.
     * @param exists True if a valuation has been submitted.
     */
    struct CompanyInitialValuation {
        address companyWallet;
        uint256 valuation;
        uint256 initialPricePerToken;
        address evaluatorAI;
        uint64 assessmentTimestamp;
        bool exists;
    }

    // --- Events ---
    bytes32 public constant AI_ROLE = keccak256("AI_ROLE"); // For ALL operations (AI and administrative)

    event CompanyValuationSubmitted(
        address indexed companyWallet, uint256 valuation, uint256 initialPricePerToken, address indexed evaluatorAI
    );

    event ZenovaAssetCreated(
        address indexed assetAddress,
        address indexed companyWallet,
        string companyName,
        address indexed creator,
        uint256 initialValuation,
        uint256 maxTokenSupply
    );

    // --- Errors ---
    error Factory__ZeroAddress();
    error Factory__ImplementationNotSet();
    error Factory__InvalidAmount();
    error Factory__ValuationAlreadyExists();
    error Factory__ValuationNotFound();
    error Factory__AssetCreationFailed();
    error Factory__NotCompanyWallet();
    error Factory__PriceCannotBeZero();
    error Factory__NotAuthorized();
    error Factory__NotAI();

    /**
     * @notice Constructor
     * @param _assetImplementation Address of the master ZenovaAsset contract implementation.
     * @param _acceptedCurrencyAddr Address of the ERC20 token for transactions (e.g., USDC).
     */
    constructor(address _assetImplementation, address _acceptedCurrencyAddr) {
        if (_assetImplementation == address(0)) {
            revert Factory__ImplementationNotSet();
        }
        if (_acceptedCurrencyAddr == address(0)) {
            revert Factory__ZeroAddress();
        }
        zenovaAssetImplementation = _assetImplementation;
        acceptedCurrency = IERC20(_acceptedCurrencyAddr);

        // Grant deployer DEFAULT_ADMIN_ROLE and AI_ROLE for the factory itself
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(AI_ROLE, msg.sender);
        // Set AI_ROLE to be managed by DEFAULT_ADMIN_ROLE
        _setRoleAdmin(AI_ROLE, DEFAULT_ADMIN_ROLE);
    }

    // Override the onlyAI modifier from ZenovaRoles to use this contract's AccessControl
    modifier onlyAI() {
        if (!hasRole(AI_ROLE, msg.sender)) {
            revert Factory__NotAI(); // Or a factory-specific not AI error
        }
        _;
    }

    /**
     * @notice AI submits a company's valuation and suggested initial token price.
     * @dev Only callable by AI_ROLE. This valuation is stored pending asset creation.
     *      The AI address calling this function will later be granted both AI_ROLE and ADMIN_ROLE
     *      for the ZenovaAsset when it's created.
     * @param _companyWallet The company's representative wallet address.
     * @param _valuation The total company valuation in acceptedCurrency.
     * @param _initialPricePerToken The suggested price for one full token (e.g., 10^18 units) in acceptedCurrency.
     */
    function submitCompanyValuation(address _companyWallet, uint256 _valuation, uint256 _initialPricePerToken)
        external
        onlyAI
    {
        // Uses AI_ROLE from ZenovaRoles
        if (_companyWallet == address(0)) {
            revert Factory__ZeroAddress();
        }
        if (_valuation == 0) {
            revert Factory__InvalidAmount();
        }
        if (_initialPricePerToken == 0) {
            revert Factory__PriceCannotBeZero();
        }
        // Using companyWallet as a key for pending valuations. One valuation per company at a time.
        if (assetInitialValuations[_companyWallet].exists) {
            revert Factory__ValuationAlreadyExists();
        }

        assetInitialValuations[_companyWallet] = CompanyInitialValuation({
            companyWallet: _companyWallet,
            valuation: _valuation,
            initialPricePerToken: _initialPricePerToken,
            evaluatorAI: msg.sender,
            assessmentTimestamp: uint64(block.timestamp),
            exists: true
        });

        emit CompanyValuationSubmitted(_companyWallet, _valuation, _initialPricePerToken, msg.sender);
    }

    /**
     * @notice Creates a new ZenovaAsset (tokenized shares) for a company with a submitted valuation.
     * @dev Only callable by AI_ROLE. Uses the valuation previously submitted by the same AI.
     *      The calling AI address will be granted all roles on the new ZenovaAsset.
     * @param _companyWallet The company's wallet, must match a submitted valuation.
     * @param _companyInfo Basic information about the company for the asset token, using IZenovaAsset.CompanyInfo type.
     * @return assetAddress The address of the newly created ZenovaAsset contract.
     */
    function createZenovaAsset(address _companyWallet, ZenovaAsset.CompanyInfo calldata _companyInfo)
        external
        onlyAI
        returns (address assetAddress)
    {
        // Only AI_ROLE can create assets
        if (_companyWallet == address(0)) {
            revert Factory__ZeroAddress();
        }
        if (_companyInfo.issuingCompanyWallet != _companyWallet) {
            revert Factory__NotCompanyWallet(); // Ensure CompanyInfo struct matches the valued company wallet
        }

        CompanyInitialValuation storage valuationDetails = assetInitialValuations[_companyWallet];
        if (!valuationDetails.exists) {
            revert Factory__ValuationNotFound();
        }

        // Ensure the AI calling this function is the same one that submitted the valuation
        if (valuationDetails.evaluatorAI != msg.sender) {
            revert Factory__NotAuthorized();
        }

        assetAddress = Clones.clone(zenovaAssetImplementation);
        if (assetAddress == address(0)) {
            revert Factory__AssetCreationFailed();
        }

        // Initialize the asset with the calling AI address as the initial admin
        IZenovaAsset(assetAddress).initialize(msg.sender, _companyInfo, address(acceptedCurrency));

        // Set company valuation and supply
        IZenovaAsset assetContract = IZenovaAsset(assetAddress);
        assetContract.setCompanyValuationAndSupply(
            valuationDetails.valuation, valuationDetails.initialPricePerToken, msg.sender
        );

        allZenovaAssets.push(assetAddress);
        companyToAssets[_companyWallet].push(assetAddress);
        valuationDetails.exists = false; // Mark valuation as used

        uint256 maxSupply = assetContract.maxTokenSupply();

        emit ZenovaAssetCreated(
            assetAddress, _companyWallet, _companyInfo.name, msg.sender, valuationDetails.valuation, maxSupply
        );

        return assetAddress;
    }

    // --- Getter Functions ---
    function getAllAssets() external view returns (address[] memory) {
        return allZenovaAssets;
    }

    function getAssetsByCompany(address _companyWallet) external view returns (address[] memory) {
        return companyToAssets[_companyWallet];
    }

    function getSubmittedValuation(address _companyWallet) external view returns (CompanyInitialValuation memory) {
        return assetInitialValuations[_companyWallet];
    }

    function getAssetFullDetails(address _assetAddress) external view returns (ZenovaAsset.FullAssetDetails memory) {
        if (_assetAddress == address(0)) revert Factory__ZeroAddress();
        return IZenovaAsset(_assetAddress).getFullAssetDetails();
    }

    function getMultipleAssetFullDetails(address[] calldata _assetAddresses)
        external
        view
        returns (ZenovaAsset.FullAssetDetails[] memory)
    {
        ZenovaAsset.FullAssetDetails[] memory allDetails = new ZenovaAsset.FullAssetDetails[](_assetAddresses.length);
        for (uint256 i = 0; i < _assetAddresses.length; i++) {
            allDetails[i] = this.getAssetFullDetails(_assetAddresses[i]);
        }
        return allDetails;
    }

    function totalAssets() external view returns (uint256) {
        return allZenovaAssets.length;
    }

    // --- Comprehensive Analytics Functions (Similar to Credora) ---

    /**
     * @notice Comprehensive details about a company including all their assets and valuations.
     */
    struct CompanyComprehensiveDetails {
        address companyWallet;
        CompanyInitialValuation pendingValuation; // If any valuation is pending
        address[] assetAddresses; // All assets created for this company
        ZenovaAsset.FullAssetDetails[] assetDetails; // Full details of all assets
        uint256 totalMarketCap; // Combined market cap of all assets
        uint256 totalTokensIssued; // Total tokens issued across all assets
        uint256 totalTradingVolume; // Combined trading volume across all assets
        bool hasActiveAssets; // Whether company has any active trading assets
    }

    /**
     * @notice Platform-wide financial and operational snapshot.
     */
    struct PlatformSnapshot {
        uint256 totalAssetsCreated;
        uint256 totalCompaniesOnboarded;
        uint256 totalActiveAssets; // Assets with trading enabled
        uint256 totalMarketCapitalization; // Sum of all asset market caps
        uint256 totalTradingVolume; // Sum of all trading volume
        uint256 totalFeesCollected; // Sum of all fees collected
        uint256 averageAssetMarketCap; // Average market cap per asset
        uint256 totalTokensInCirculation; // Sum of all tokens in circulation
        uint256 totalMaxTokenSupply; // Sum of all max token supplies
        address largestAssetByMarketCap; // Asset with highest market cap
        address mostActiveAssetByVolume; // Asset with highest trading volume
    }

    /**
     * @notice User's comprehensive portfolio across all Zenova assets.
     */
    struct UserPortfolioDetails {
        address userAddress;
        uint256 totalPortfolioValue; // Total value of all holdings
        uint256 totalInvestedAmount; // Total amount invested across all assets
        uint256 totalRealizedPnL; // Total realized profit/loss
        uint256 totalUnrealizedPnL; // Total unrealized profit/loss
        uint256 totalFeesPaid; // Total fees paid across all assets
        uint256 numberOfAssetsHeld; // Number of different assets held
        address[] heldAssetAddresses; // Addresses of assets user holds
        ZenovaAsset.UserAssetInfo[] assetHoldings; // Detailed holdings for each asset
        bool isActiveTrader; // Whether user has traded recently
    }

    /**
     * @notice Retrieves comprehensive details about a company including all their assets.
     * @dev Makes external calls to all company assets. Intended for off-chain consumption.
     * @param _companyWallet The company's wallet address.
     * @return details A CompanyComprehensiveDetails struct with all company information.
     */
    function getCompanyComprehensiveDetails(address _companyWallet)
        external
        view
        returns (CompanyComprehensiveDetails memory details)
    {
        details.companyWallet = _companyWallet;
        details.pendingValuation = assetInitialValuations[_companyWallet];
        details.assetAddresses = companyToAssets[_companyWallet];

        uint256 assetCount = details.assetAddresses.length;
        details.assetDetails = new ZenovaAsset.FullAssetDetails[](assetCount);

        for (uint256 i = 0; i < assetCount; i++) {
            IZenovaAsset asset = IZenovaAsset(details.assetAddresses[i]);
            details.assetDetails[i] = asset.getFullAssetDetails();

            // Aggregate metrics
            details.totalMarketCap += details.assetDetails[i].pricingDetails.marketCap;
            details.totalTokensIssued += details.assetDetails[i].currentTotalSupply;

            // Get trading metrics for volume
            ZenovaAsset.TradingMetrics memory metrics = asset.getTradingMetrics();
            details.totalTradingVolume += metrics.totalVolumeTraded;

            // Check if any asset is actively trading
            if (details.assetDetails[i].isTradingActive) {
                details.hasActiveAssets = true;
            }
        }

        return details;
    }

    /**
     * @notice Provides a comprehensive platform-wide financial and operational snapshot.
     * @dev Iterates through all assets making external calls. Intended for off-chain use.
     * @return snapshot A PlatformSnapshot struct with aggregated platform data.
     */
    function getPlatformSnapshot() external view returns (PlatformSnapshot memory snapshot) {
        snapshot.totalAssetsCreated = allZenovaAssets.length;

        // Count unique companies
        address[] memory uniqueCompanies = new address[](snapshot.totalAssetsCreated);
        uint256 uniqueCompanyCount = 0;

        uint256 maxMarketCap = 0;
        uint256 maxVolume = 0;

        for (uint256 i = 0; i < snapshot.totalAssetsCreated; i++) {
            IZenovaAsset asset = IZenovaAsset(allZenovaAssets[i]);
            ZenovaAsset.FullAssetDetails memory assetDetails = asset.getFullAssetDetails();
            ZenovaAsset.TradingMetrics memory metrics = asset.getTradingMetrics();

            // Aggregate financial metrics
            snapshot.totalMarketCapitalization += assetDetails.pricingDetails.marketCap;
            snapshot.totalTradingVolume += metrics.totalVolumeTraded;
            snapshot.totalFeesCollected += metrics.totalFeesCollected;
            snapshot.totalTokensInCirculation += assetDetails.currentTotalSupply;
            snapshot.totalMaxTokenSupply += assetDetails.maxTokenSupply;

            // Track active assets
            if (assetDetails.isTradingActive) {
                snapshot.totalActiveAssets++;
            }

            // Find largest asset by market cap
            if (assetDetails.pricingDetails.marketCap > maxMarketCap) {
                maxMarketCap = assetDetails.pricingDetails.marketCap;
                snapshot.largestAssetByMarketCap = allZenovaAssets[i];
            }

            // Find most active asset by volume
            if (metrics.totalVolumeTraded > maxVolume) {
                maxVolume = metrics.totalVolumeTraded;
                snapshot.mostActiveAssetByVolume = allZenovaAssets[i];
            }

            // Count unique companies (simplified approach)
            address companyWallet = assetDetails.companyDetails.issuingCompanyWallet;
            bool isNewCompany = true;
            for (uint256 j = 0; j < uniqueCompanyCount; j++) {
                if (uniqueCompanies[j] == companyWallet) {
                    isNewCompany = false;
                    break;
                }
            }
            if (isNewCompany) {
                uniqueCompanies[uniqueCompanyCount] = companyWallet;
                uniqueCompanyCount++;
            }
        }

        snapshot.totalCompaniesOnboarded = uniqueCompanyCount;

        // Calculate averages
        if (snapshot.totalAssetsCreated > 0) {
            snapshot.averageAssetMarketCap = snapshot.totalMarketCapitalization / snapshot.totalAssetsCreated;
        }

        return snapshot;
    }

    /**
     * @notice Retrieves a user's comprehensive portfolio across all Zenova assets.
     * @dev Makes external calls to all assets. Intended for off-chain consumption.
     * @param _user The user's address.
     * @return portfolio A UserPortfolioDetails struct with complete portfolio information.
     */
    function getUserPortfolioDetails(address _user) external view returns (UserPortfolioDetails memory portfolio) {
        portfolio.userAddress = _user;

        // First pass: count assets where user has holdings
        uint256 heldAssetCount = 0;
        for (uint256 i = 0; i < allZenovaAssets.length; i++) {
            IZenovaAsset asset = IZenovaAsset(allZenovaAssets[i]);
            if (asset.balanceOf(_user) > 0) {
                heldAssetCount++;
            }
        }

        portfolio.numberOfAssetsHeld = heldAssetCount;
        portfolio.heldAssetAddresses = new address[](heldAssetCount);
        portfolio.assetHoldings = new ZenovaAsset.UserAssetInfo[](heldAssetCount);

        // Second pass: populate holdings data
        uint256 currentIndex = 0;
        for (uint256 i = 0; i < allZenovaAssets.length; i++) {
            IZenovaAsset asset = IZenovaAsset(allZenovaAssets[i]);
            ZenovaAsset.UserAssetInfo memory userInfo = asset.getUserAssetInfo(_user);

            if (userInfo.tokenBalance > 0) {
                portfolio.heldAssetAddresses[currentIndex] = allZenovaAssets[i];
                portfolio.assetHoldings[currentIndex] = userInfo;
                currentIndex++;
            }

            // Aggregate portfolio metrics (include all assets user has ever traded)
            portfolio.totalPortfolioValue += userInfo.tokenBalanceValue;
            portfolio.totalInvestedAmount += userInfo.totalPurchaseValue;
            portfolio.totalRealizedPnL += userInfo.realizedPnL;
            portfolio.totalUnrealizedPnL += userInfo.unrealizedPnL;
            portfolio.totalFeesPaid += userInfo.totalFeesPaid;

            // Check if user is active trader (traded in last 30 days)
            if (userInfo.lastTradeTimestamp > 0 && block.timestamp - userInfo.lastTradeTimestamp <= 30 days) {
                portfolio.isActiveTrader = true;
            }
        }

        return portfolio;
    }

    /**
     * @notice Gets detailed information for multiple assets in a single call.
     * @dev Optimized for frontend consumption to reduce RPC calls.
     * @param _assetAddresses Array of asset addresses to get information for.
     * @return assetDetails Array of FullAssetDetails for each requested asset.
     * @return tradingMetrics Array of TradingMetrics for each requested asset.
     * @return marketAnalysis Array of MarketAnalysis for each requested asset.
     */
    function getMultipleAssetAnalytics(address[] calldata _assetAddresses)
        external
        view
        returns (
            ZenovaAsset.FullAssetDetails[] memory assetDetails,
            ZenovaAsset.TradingMetrics[] memory tradingMetrics,
            ZenovaAsset.MarketAnalysis[] memory marketAnalysis
        )
    {
        uint256 length = _assetAddresses.length;
        assetDetails = new ZenovaAsset.FullAssetDetails[](length);
        tradingMetrics = new ZenovaAsset.TradingMetrics[](length);
        marketAnalysis = new ZenovaAsset.MarketAnalysis[](length);

        for (uint256 i = 0; i < length; i++) {
            IZenovaAsset asset = IZenovaAsset(_assetAddresses[i]);
            assetDetails[i] = asset.getFullAssetDetails();
            tradingMetrics[i] = asset.getTradingMetrics();
            marketAnalysis[i] = asset.getMarketAnalysis();
        }

        return (assetDetails, tradingMetrics, marketAnalysis);
    }
}
