# Dolphin Singularity merchandise

`store.html` links to the US-only [Dolphin Singularity Printful Quick Store](https://dolphinsingularity.printful.me/). Printful hosts product options, Stripe-powered customer checkout, on-demand printing, shipping, and order support. No payment secrets belong in this repository.

## Published collection — October 6, 2026

| Product | Blank and color | Sizes | Price | Print file / dimensions | Printful quality | Product ID |
| --- | --- | --- | --- | --- | --- | --- |
| The Original Tee | Bella + Canvas 3001, Navy | XS–5XL | $29 | `dolphin-ivory-print.png`, 7 × 8.4 in | Good / 164 DPI | 478861615 |
| The Original Hoodie | Gildan 18500, Navy | S–5XL | $49 | same ivory art, 6 × 7.2 in | Good / 191 DPI | 478866239 |
| The Meeting Tee — Dolphin at Work | Bella + Canvas 3001, Natural | XS–4XL | $29 | `dolphin-laptop-print.png`, 10 × 6.67 in | Good / 154 DPI | 478862416 |
| The Fluent Tee | Bella + Canvas 3001, Natural | XS–4XL | $29 | `fluent-dolphin-print.png`, 9 × 9 in | Good / 139 DPI | 478865371 |
| The Highly Intelligent Tee — Weird Noises | Bella + Canvas 3001, Natural | XS–4XL | $29 | `weird-noises-print.png`, 10 × 10 in | Good / 125 DPI | 478864774 |

All products use DTG front prints and plain backs. Graphic tees are horizontally centered and moved approximately 1.9 inches down from the print area's top alignment, following the owner's request for lower chest placement. Meeting art has no text. Weird Noises retains the original approved artwork and is 43% wider than the initial 7-inch plan. Dimensions include transparent artwork margins; printed ink occupies a smaller area. Hoodie artwork sits above the pouch.

The website photos are actual supplier-generated mockups from these configured products. Mockups are not photographs of physical samples. Printful rated every final design “Good”; no physical sample or paid order was purchased. Artwork was not artificially enlarged to change DPI metadata. The old `whistle-meeting-print.png` is retained as an unused earlier design; the active Meeting Tee uses the laptop-only file.

## Product links

`merch-catalog.json` contains verified public product URLs, prices, and artwork metadata. Its `launchStatus` is `live` because all five listings and the customer checkout entry are available. This status does not assert that merchant payout onboarding is complete. Static HTML also contains purchase links and prices so ordering links work without JavaScript. Image previews, filters, and product details are enhanced by `js/merch-store.js`.

The Meeting Tee retains its original public URL slug even though its title and artwork changed. Preserve that verified URL unless Printful changes it.

## Owner-only payout step

The owner explicitly authorized accepting Printful's Quick Stores terms, and store 18866819 was created on October 6, 2026. Stripe payout onboarding remains unconfirmed. The latest observed Billing → Quick Stores screen showed “Set up payouts.” The owner must personally enter identity, banking, and tax information and accept any payout agreements in Printful/Stripe.

Customer checkout entry was verified with a Navy/M Original Tee at $29. The flow showed contact, shipping, and payment steps. No personal checkout information or payment was submitted, no paid order was placed, and the test cart was cleared. Completed payments, actual fulfillment, and merchant payouts have not been tested.

## Website deployment

The repository deploys `main` to GitHub Pages. The repair branch has not been merged or deployed. The configured domain is `dolphinsingularity.org`; the separate `.com` domain still needs DNS configuration. Printful Quick Stores remains on its own `printful.me` address.

## Primary references

- [T-shirt placement](https://www.printful.com/blog/t-shirt-design-placement-guide)
- [Quick Stores](https://help.printful.com/hc/en-us/articles/50265713299857-How-is-Quick-Stores-different-from-ecommerce-platform-integrations)
- [Stripe payments and payouts](https://help.printful.com/hc/en-us/articles/50265775755281-How-do-Quick-Stores-payments-work)
- [Print file preparation](https://help.printful.com/hc/en-us/articles/50264019148177-How-should-I-prepare-my-print-file-for-the-best-results)
- [Customer issues and returns](https://help.printful.com/hc/en-us/articles/50265768078737-How-are-Quick-Stores-customer-issues-and-returns-handled)
