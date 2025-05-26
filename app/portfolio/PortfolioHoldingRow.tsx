import { motion } from 'framer-motion';
import { useAssetDetails } from '@/hooks/useAssetDetails';
// import { useAllAssetsWithDetails } from '@/hooks/useAllAssetsWithDetails'; // Removed
import { FormattedUserAssetInfo } from '@/src/mastra/tools/zenova/zenovaFormattedTypes';
import SciFiButton from '@/components/ui/SciFiButton';
import { formatAddressShort } from '@/src/mastra/tools/zenova/formatters';
import { Loader2, AlertTriangle } from 'lucide-react';

interface PortfolioHoldingRowProps {
  assetAddress: string;
  holding: FormattedUserAssetInfo;
  index: number; // For animation delay
  totalPortfolioValue: number; // New prop
}

// Helper function for robust financial value parsing
function parseFinancialValue(valueStr: string | undefined | null): number {
  if (valueStr == null) return 0;

  const cleaned = String(valueStr).replace(/[^\d.-]/g, '');

  if (!cleaned || cleaned === '.' || cleaned === '-') {
    return 0;
  }

  const num = parseFloat(cleaned);

  if (isNaN(num) || !isFinite(num)) {
    return 0;
  }
  return num;
}

export default function PortfolioHoldingRow({ assetAddress, holding, index, totalPortfolioValue }: PortfolioHoldingRowProps) {
  const { data: assetDetails, isLoading: isLoadingAssetName, error: errorAssetName } = useAssetDetails(assetAddress);
  // const { data: allAssetsData, isLoading: isLoadingAllAssets, error: errorAllAssets } = useAllAssetsWithDetails(); // Removed

  const pnl = parseFinancialValue(holding.unrealizedPnL);
  const currentAssetValue = parseFinancialValue(holding.tokenBalanceValue); // Renamed for clarity
  const totalPurchaseValue = parseFinancialValue(holding.totalPurchaseValue);
  const realizedPnLValue = parseFinancialValue(holding.realizedPnL);
  
  // New ownership calculation: (value of this asset / total portfolio value) * 100
  const ownershipOfPortfolio = totalPortfolioValue > 0 ? (currentAssetValue / totalPortfolioValue) : 0;

  let displayName = formatAddressShort(assetAddress);
  let displaySymbol = "(N/A)";

  if (isLoadingAssetName) {
    displayName = "Loading name...";
    displaySymbol = "LOD";
  }

  if (assetDetails && !('error' in assetDetails)) {
    displayName = assetDetails.companyDetails.name;
    displaySymbol = assetDetails.companyDetails.symbol;
  }

  if (errorAssetName) {
    displayName = "Error loading name";
    displaySymbol = "ERR";
  }
  
  const isAssetAddressValid = assetAddress && assetAddress !== "N/A";

  return (
    <motion.tr
      key={assetAddress}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
      className="border-b border-metamesh-gray hover:bg-metamesh-dark-light/50 transition-colors"
    >
      <td className="px-6 py-4 text-left">
        <div>
          <div className="font-semibold text-white" title={assetAddress}>{displayName}</div>
          <div className="text-sm text-gray-400">
            {isLoadingAssetName ? <Loader2 className="h-4 w-4 animate-spin inline-block" /> : displaySymbol}
          </div>
          {errorAssetName && <AlertTriangle className="h-4 w-4 text-red-500 inline-block ml-1" />}
        </div>
      </td>
      <td className="px-6 py-4 text-white text-center">{holding.tokenBalance}</td>
      <td className="px-6 py-4 text-white text-center">
        {ownershipOfPortfolio.toLocaleString('en-US', { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </td>
      <td className="px-6 py-4 text-white text-center">
        {currentAssetValue.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </td>
      <td className="px-6 py-4 text-white text-center">
        {totalPurchaseValue.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </td>
      <td className="px-6 py-4 text-center">
        <span className={`font-semibold ${pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {pnl >= 0 ? '+' : ''}{pnl.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
        </span>
      </td>
      <td className="px-6 py-4 text-center">
        <span className={`font-semibold ${realizedPnLValue >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {realizedPnLValue >= 0 ? '+' : ''}{realizedPnLValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
        </span>
      </td>
      <td className="px-6 py-4 text-center">
        <SciFiButton
          to={isAssetAddressValid ? `/assets/${assetAddress}` : '#'} 
          variant="outline"
          size="sm"
          disabled={!isAssetAddressValid || !!errorAssetName}
        >
          View Details
        </SciFiButton>
      </td>
    </motion.tr>
  );
} 