import {getSingleOfferFromOlx, searchOffersOnOlx} from "../olx/service";
import {OlxSearchParams, RentOffer} from "./types";
import {getSingleOfferFromOtodom} from "../otodom/service";
import {logger} from "../../utils/logger";

export const searchOffers = async (
  timestampFrom: number,
  city: string,
  searchParams: OlxSearchParams = {},
  queryText?: string
): Promise<RentOffer[]> => {
  logger.info(`Start searching offer in ${city} with search params: ${JSON.stringify(searchParams)}`);

  const offers = await searchOffersOnOlx(timestampFrom, city, searchParams, queryText);
  const olxUrls = offers.filter(offer => !offer.url.includes("otodom")).map(offer => offer.url);
  const otodomUrls = offers.filter(offer => offer.url.includes("otodom")).map(offer => offer.url);

  logger.info(`Found ${olxUrls.length} OLX offers and ${otodomUrls.length} OTODOM offers. Total: ${olxUrls.length + otodomUrls.length}`);

  const detailedOffers = await Promise.all([
    ...olxUrls.map(getSingleOfferFromOlx),
    ...otodomUrls.map(getSingleOfferFromOtodom)
  ])
  return detailedOffers.filter(offer => offer != null);
}