// Create a new table called "ActiveItem"
// Add items when they are listed on the marketplace
// Remove them when they are bought or cancelled

Moralis.Cloud.afterSave("ItemListed", async (request) => {
    // Every event gets triggered twice, once on "unconfirmed" and again on "confirmed"
    const logger = Moralis.Cloud.getLogger()
    const confirmed = request.object.get("confirmed")
    logger.info(`Marketplace: Object ${request.object}`)

    if (confirmed) {
        logger.info("Found Item!")
        const ActiveItem = Moralis.Object.extend("ActiveItem")

        // delete already listed item in case the listing is updated, since in that case as well "ItemListed" event is triggered
        const query = new Moralis.Query(ActiveItem)
        query.equalTo("nftAddress", request.object.get("nftAddress"))
        query.equalTo("tokenId", request.object.get("tokenId"))
        query.equalTo("marketplaceAddress", request.object.get("address"))
        query.equalTo("seller", request.object.get("seller"))
        const alreadyListedItem = await query.first()
        if (alreadyListedItem) {
            logger.info(`Deleting ${alreadyListedItem.id}`)
            await alreadyListedItem.destroy()
            logger.info(
                `Deleted item with tokenId: ${request.object.get(
                    "tokenId"
                )} at address: ${request.object.get("address")} since the listing is being updated`
            )
        }

        const activeItem = new ActiveItem()
        activeItem.set("marketplaceAddress", request.object.get("address"))
        activeItem.set("nftAddress", request.object.get("nftAddress"))
        activeItem.set("price", request.object.get("price"))
        activeItem.set("tokenId", request.object.get("tokenId"))
        activeItem.set("seller", request.object.get("seller"))
        logger.info(
            `Adding address: ${request.object.get("address")}, tokenId: ${request.object.get(
                "tokenId"
            )}`
        )
        logger.info("Saving...")
        await activeItem.save()
    }
})

Moralis.Cloud.afterSave("ItemCancelled", async (request) => {
    const logger = Moralis.Cloud.getLogger()
    const confirmed = request.object.get("confirmed")
    logger.info(`Marketplace: Object ${request.object}`)

    if (confirmed) {
        const ActiveItem = Moralis.Object.extend("ActiveItem")
        const query = new Moralis.Query(ActiveItem)
        query.equalTo("marketplaceAddress", request.object.get("address"))
        query.equalTo("nftAddress", request.object.get("nftAddress"))
        query.equalTo("tokenId", request.object.get("tokenId"))
        logger.info(`Marketplace | Query: ${query}`)
        const cancelledItem = await query.first()
        logger.info(`Marketplace | CancelledItem: ${cancelledItem}`)
        if (cancelledItem) {
            logger.info(
                `Deleting ${request.object.get("tokenId")} at address ${request.object.get(
                    "address"
                )} since it was cancelled`
            )
            await cancelledItem.destroy()
        } else {
            logger.info(
                `No item found with address: ${request.object.get(
                    "address"
                )} and tokenId: ${request.object.get("tokenId")} `
            )
        }
    }
})

Moralis.Cloud.afterSave("ItemBought", async (request) => {
    const logger = Moralis.Cloud.getLogger()
    const confirmed = request.object.get("confirmed")
    logger.info(`Marketplace: Object ${request.object}`)

    if (confirmed) {
        const ActiveItem = Moralis.Object.extend("ActiveItem")
        const query = new Moralis.Query(ActiveItem)
        query.equalTo("marketplaceAddress", request.object.get("address"))
        query.equalTo("nftAddress", request.object.get("nftAddress"))
        query.equalTo("tokenId", request.object.get("tokenId"))
        logger.info(`Marketplace | Query: ${query}`)
        const boughtItem = await query.first()
        logger.info(`Marketplace | BoughtItem: ${boughtItem}`)
        if (boughtItem) {
            logger.info(
                `Deleting ${request.object.get("tokenId")} at address ${request.object.get(
                    "address"
                )} since it was bought`
            )
            await boughtItem.destroy()
        } else {
            logger.info(
                `No item found with address: ${request.object.get(
                    "address"
                )} and tokenId: ${request.object.get("tokenId")} `
            )
        }
    }
})
