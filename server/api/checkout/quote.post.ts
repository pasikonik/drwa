import type { QuotePayload, QuoteResponse } from '~/types/shop'
import { computeOrder } from '../../utils/pricing'

/** Price preview (incl. discount code) for the checkout page. Throws 400 with the reason when the code is not valid. */
export default defineEventHandler(async (event): Promise<QuoteResponse> => {
  const { items, shippingMethod, discountCode } = (await readBody<QuotePayload>(event)) ?? ({} as QuotePayload)
  const { subtotal, discount, discountCode: code, shippingCost, total } = await computeOrder(items, shippingMethod, discountCode)
  return { subtotal, discount, discountCode: code, shippingCost, total }
})
