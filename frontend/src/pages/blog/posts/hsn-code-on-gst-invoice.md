---
title: HSN Code on a GST Invoice: Rules, Digits Required & Common Codes (2026)
slug: hsn-code-on-gst-invoice
description: How many HSN digits your GST invoice needs in 2026, where HSN/SAC codes go on the invoice, the HSN summary for GSTR-1, common codes for services and goods, and penalties for wrong codes.
keywords: HSN code on invoice, HSN code GST invoice, how many digits HSN code, SAC code services invoice, HSN summary GSTR-1, HSN code list India, wrong HSN code penalty
date: 2026-10-22
author: DoAide Team
readTime: 7 min read
---

Every GST tax invoice in India must carry the right **HSN code** (for goods) or **SAC code** (for services) on each line item. It sounds like a small detail, but the HSN code decides the tax rate applied, flows into your GSTR-1 HSN summary, and a wrong or missing code can mean notices and penalties.

This guide covers how many digits you need, where the code goes on the invoice, and the codes most small businesses and freelancers actually use. When you're ready, the [free invoice generator](/create?template=gst-compliant) fills HSN columns and builds the HSN summary table for you.

> General information, not tax advice. Rates and notifications change — confirm your codes on the official GST portal or with a CA.

## What is an HSN code?

**HSN (Harmonised System of Nomenclature)** is the international system for classifying goods, maintained by the World Customs Organization and used by Indian GST law to decide which tax rate applies. India extends the 6-digit international codes to 8 digits for customs; GST invoices use 4, 6 or 8 digits depending on your turnover.

Services use **SAC (Services Accounting Codes)** — 6-digit codes starting with 99.

## How many HSN digits do you need in 2026?

Under Notification 78/2020 (Central Tax), the requirement depends on your **aggregate turnover in the previous financial year**:

| Aggregate turnover | HSN digits required on invoice |
| --- | --- |
| Up to ₹5 crore (B2B invoices) | 4 digits |
| Up to ₹5 crore (B2C invoices) | 4 digits (optional) |
| Above ₹5 crore | 6 digits |
| Imports/exports (customs) | 8 digits |

Two practical notes:

- For businesses above ₹5 crore, e-invoicing also applies, and the IRN schema validates the HSN code — a wrong-length code gets the invoice rejected.
- Even where 4 digits are enough, quoting 6 is never wrong. More digits are always acceptable; fewer are not.

## Where does the HSN code go on the invoice?

Rule 46 of the CGST Rules requires the HSN/SAC code **against each line item** on a tax invoice. A compliant layout has:

1. An **HSN/SAC column** in the line items table, next to the description
2. A **taxable value** column (quantity × rate, before tax)
3. The **CGST/SGST or IGST** amounts, per rate
4. Ideally, an **HSN-wise summary** table — this mirrors what you file in Table 12 of GSTR-1, so matching the invoice to the return becomes copy-paste

The [GST-compliant template](/template/gst-compliant) in DoAide Invoicer does all four automatically, including the HSN summary grouped by code and rate.

## Common SAC codes for freelancers and service businesses

| Service | SAC code |
| --- | --- |
| Software development & IT consulting | 998314 / 998313 |
| Website & app design | 998314 |
| Graphic design | 998391 |
| Advertising & digital marketing | 998361 |
| Content writing & translation | 998397 |
| Photography & videography | 998381 |
| Management consulting | 998311 |
| Accounting & bookkeeping | 998222 |
| Legal services | 998211 |
| Training & coaching | 999293 |
| Renting commercial property | 997212 |

## Common HSN chapters for goods

| Goods | HSN chapter |
| --- | --- |
| Textiles & garments | 61–63 |
| Electronics & mobiles | 85 |
| Furniture | 94 |
| Food products | 16–21 |
| Pharma | 30 |
| Plastic articles | 39 |
| Books & printed matter | 49 |

Always drill down to the 4/6-digit code within the chapter — the rate can change with the sub-heading (famously, parathas and rotis have been taxed differently).

## What happens if the HSN code is wrong or missing?

- **Penalty:** Section 125 of the CGST Act allows a general penalty (up to ₹25,000 for wrong or missing HSN details); Section 122 can also apply for incorrect invoices.
- **GSTR-1 mismatch:** The HSN summary in Table 12 of GSTR-1 is validated, and mismatches trigger notices.
- **Buyer's ITC risk:** A defective invoice can complicate your customer's input tax credit claim — B2B clients will push back.
- **Wrong tax rate:** The most expensive mistake — classifying under the wrong code can mean collecting 12% where 18% applied, and the difference comes out of your pocket with interest.

## How to find the right code

1. Search the **GST portal's HSN search** (Services → User Services → Search HSN Code) — the official source.
2. Check your **supplier's invoices** — for traded goods, the code you buy under is usually the code you sell under.
3. Look at **industry associations'** published rate lists.
4. When genuinely ambiguous, ask a CA — the cost of an hour of advice is far less than a reclassification demand.

## Frequently Asked Questions

### Is HSN code mandatory on every GST invoice?

Yes, for registered businesses. If your turnover was up to ₹5 crore, 4 digits are mandatory on B2B invoices (optional on B2C). Above ₹5 crore, 6 digits are mandatory on all invoices.

### What is the difference between HSN and SAC codes?

HSN codes classify goods; SAC codes classify services. SAC codes are 6 digits and always start with 99. Both appear in the same column on a GST invoice.

### Can I use 8-digit HSN codes on a GST invoice?

Yes. More digits than required is always acceptable. 8 digits are mandatory only in customs documents for imports and exports.

### Do unregistered businesses need HSN codes on invoices?

No. If you are not GST-registered, you issue a bill of supply style invoice without GST or HSN codes. HSN requirements apply to registered persons issuing tax invoices.

### Where do I find the HSN summary for GSTR-1?

Table 12 of GSTR-1 asks for an HSN-wise summary of outward supplies: HSN code, quantity, taxable value and tax amounts, grouped by code. If your invoices carry an HSN summary table, this is a direct copy — the GST template in DoAide Invoicer generates it per invoice.
