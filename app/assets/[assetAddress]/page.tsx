import Layout from "@/components/layout/Layout";
import AssetDetails from "@/components/assets/AssetDetails";
import PortfolioOnboardingFlow from "@/components/onboarding/PortfolioOnboardingFlow";

export default async function AssetPage({ params }: { params: Promise<{ assetAddress: string }> }) {
    const { assetAddress } = await params;
    return (
        <PortfolioOnboardingFlow>
            <AssetDetails assetAddress={assetAddress} />
        </PortfolioOnboardingFlow>
    )
}