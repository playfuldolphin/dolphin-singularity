# Dolphin Singularity merchandise

The storefront is `store.html`. It uses the existing static-site hosting and a Printful Quick Store for actual product options, Stripe-powered checkout, printing, shipping, and customer support. No Stripe secret or Printful API key belongs in this repository.

## Collection

| Product | Artwork | Intended blank/color | Initial print width |
| --- | --- | --- | --- |
| The Original Tee | `images/merch/dolphin-ivory-print.png` | Bella + Canvas 3001, Navy | 7 inches |
| The Original Hoodie | same ivory artwork | Gildan 18500, Navy | 6 inches |
| The Meeting Tee | `images/merch/whistle-meeting-print.png` | Bella + Canvas 3001, Natural | 7 inches |
| The Fluent Tee | `images/merch/fluent-dolphin-print.png` | Bella + Canvas 3001, Natural | 7 inches |
| The Highly Intelligent Tee | `images/merch/weird-noises-print.png` | Bella + Canvas 3001, Natural | 7 inches |

Blank availability, colors, print placement, and sizes must be confirmed in Printful's product editor. Use the transparent PNG artwork, not a garment mockup, as the print file. Check the editor's effective DPI and print-quality warnings at the actual chosen dimensions. Do not enlarge files just to change the DPI number. Preview images are AI-generated concepts; replace them with supplier mockups after configuring the real products.

## Activate product links

`merch-catalog.json` contains public product metadata only. Set each `productUrl` to the verified HTTPS product URL from the owner's Printful Quick Store. Set `priceLabel` only from the current listing; otherwise the UI can say “See current price.” Set `storeUrl` to the verified store address and `launchStatus` to `live` only when the store and customer checkout are ready. The frontend accepts only HTTPS `*.printful.me` product URLs.

Unconfigured products remain clearly labeled previews. Clicking a preview opens the design, not a fake cart. With JavaScript unavailable, the cards still link to their preview images.

## Account steps

The owner selected a US-only Printful Quick Store. The store-creation form is prepared as Dolphin Singularity with the requested address `dolphinsingularity.printful.me`; this is not proof of creation or availability. The owner must review and accept the Quick Stores terms. Printful's Billing → Quick Stores flow handles Stripe payout onboarding. The owner must personally provide any requested identity, banking, and tax information and accept associated agreements.

After setup, add the actual products, check pricing and variants, verify the public listings and checkout entry without placing a paid order, then activate the website links. Do not describe payouts, fulfillment, or checkout as connected until the account confirms that state.

## Current hosting

The repository deploys its `main` branch to GitHub Pages. Its configured custom domain is `dolphinsingularity.org`; changes on the repair branch are not published until merged/deployed. The separate `.com` domain needs DNS configuration. Printful Quick Stores does not use the custom domain; visitors continue from this site's shop page to Printful checkout.

## Primary references

- Quick Stores: https://help.printful.com/hc/en-us/articles/50265713299857-How-is-Quick-Stores-different-from-ecommerce-platform-integrations
- Stripe payment and payout flow: https://help.printful.com/hc/en-us/articles/50265775755281-How-do-Quick-Stores-payments-work
- File preparation: https://help.printful.com/hc/en-us/articles/50264019148177-How-should-I-prepare-my-print-file-for-the-best-results
- Customer issues and returns: https://help.printful.com/hc/en-us/articles/50265768078737-How-are-Quick-Stores-customer-issues-and-returns-handled
