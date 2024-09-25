import {i18n, telegramBot} from "./init";
import {OfferSummary} from "../scraper/common/types";

export const sendTelegramOfferAlert = async (offer: OfferSummary, telegram_chat_id: number) => {
  const message = buildOfferAlertMessage(offer);
  await sendTelegramMessage(telegram_chat_id, message);
}

// TODO: when adding user preferences user selected locale
const buildOfferAlertMessage = (offer: OfferSummary) =>
  i18n.t("en", "offer-alert-message", {
    title: offer.title,
    location: offer.location,
    price: offer.price,
    url: offer.url,
  })

const sendTelegramMessage = async (telegramChatId: number, message: string) => {
  // TODO: use MarkdownV2 instead of Markdown
  await telegramBot.api.sendMessage(telegramChatId, message, {parse_mode: "Markdown"})
}
