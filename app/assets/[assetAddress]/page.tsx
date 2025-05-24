

export default async function AssetPage({ params }: { params: Promise<{ assetAddress: string }> }) {
    const { assetAddress } = await params;
    return (
        <div>
            <h1>Asset Page</h1>
            <p>{assetAddress}</p>
        </div>
    )
}