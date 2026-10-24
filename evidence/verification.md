# Browser verification

Checked on 22 October 2026 using Chrome with the site opened from disk.

- Home recommendation renders without JavaScript errors.
- FAQ search supports no matches and reset.
- Gallery opens, changes photos and closes with Escape.
- Visit rejects incomplete input and accepts a valid future date/time with a summary.
- Feedback produces a dated local review; repeated submission does not duplicate it.
- Basket survives reload.
- Menu renders 18 rows from data; name/category/price filters work together, including no matches and reset.
- Basket increase/decrease/remove recalculate totals; empty basket disables checkout.
- Review and demo confirmation show a receipt and clear the basket.
- Menu and viewer were checked at widths 375, 768 and 1440 pixels without horizontal overflow.

Screenshots: [375 px](menu-375.png), [768 px](menu-768.png), [1440 px](menu-1440.png).

These checks do not certify Git history, individual contribution, or a real restaurant integration.
