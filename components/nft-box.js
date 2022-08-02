import { useState, useEffect } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import Image from "next/image"
import { Card } from "web3uikit"
import { ethers } from "ethers"

import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import nftAbi from "../constants/BasicNft.json"

export default function NftBox({ price, nftAddress, tokenId, marketplaceAddress, seller }) {
    const { isWeb3Enabled } = useMoralis()
    const [imageUri, setImageUri] = useState("")
    const [tokenName, setTokenName] = useState("")
    const [tokenDescription, setTokenDescription] = useState("")

    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: nftAbi,
        contractAddress: nftAddress,
        functionName: "tokenURI",
        params: { tokenId },
    })

    useEffect(() => {
        async function updateUi() {
            // get the tokenUri
            // using the image tag from the tokenUri, get the image
            const tokenURI = await getTokenURI()
            if (tokenURI) {
                // IPFS Gateway: A server that will return IPFS files from a normal URL
                const requestUrl = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
                const tokenUriResponse = await (await fetch(requestUrl)).json()
                const imageUri = tokenUriResponse.image
                const imageUriUrl = imageUri.replace("ipfs://", "https://ipfs.io/ipfs/")
                setImageUri(imageUriUrl)
                setTokenName(tokenUriResponse.name)
                setTokenDescription(tokenUriResponse.description)
            }
        }
        if (isWeb3Enabled) {
            updateUi()
        }
    }, [isWeb3Enabled, getTokenURI])

    return (
        <div>
            <div>
                {imageUri ? (
                    <Card title={tokenName} description={tokenDescription}>
                        <div className="p-2">
                            <div className="flex flex-col items-end gap-2 ">
                                <div>#{tokenId}</div>
                                <div className="italic text-sm">Owned by {seller}</div>
                                <Image
                                    alt={tokenName}
                                    loader={() => imageUri}
                                    src={imageUri}
                                    height="200"
                                    width="200"
                                />
                                <div className="font-bold">
                                    {ethers.utils.formatUnits(price, "ether")} ETH
                                </div>
                            </div>
                        </div>
                    </Card>
                ) : (
                    <div>Loading...</div>
                )}
            </div>
        </div>
    )
}
