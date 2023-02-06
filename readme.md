# Gift Card Pro - Custom Form Snippets

This repository contains the Shopify snippets to create a custom Gift Card Pro purchasing flow.
If you are planning to use the default purchase flow built into Gift Card Pro, then these are not required.

## Installation

[Instructions are also available in an article on out Gift Card Pro Support Site.](https://docs.giftcardpro.app/article/creating-a-custom-purchase-flow/)

If you are using the Shopify online store, we recommend doing installation on a separate duplicate theme. Once changes are successfully made, the theme can then be published to apply those changes to your storefront.

Start by creating a new product to be used as your gift card. This product only needs to have the product type "Gift-Card-Pro" to function with the additional fields.

**Please note:** Do not use a product in the "Gift Cards" product category or any product that appears in the "View gift card products" section of your dashboard. Use of these products alongs side Gift Card Pro's properties will result in gift cards being double issued, and should be avoided.

[Learn more about gift card products and Shopify gift cards.](https://help.shopify.com/en/manual/products/gift-card-products)

As a part of the installation, the two additional snippets from here will need to be added to your theme.

 - gift-card-pro-form.liquid
 - gift-card-pro-form.js

gift-card-pro-form.liquid should be added to your theme as a snippet. create a new snippet named gift-card-pro-form.liquid and copy the contents in.

gift-card-pro-form.js should be added to your theme as an asset. This can be uploaded or copied into a new asset named gift-card-pro-form.js

Make sure the snippets are added correctly now to avoid issues later on.

Find the add to cart button in your product template and add the following liquid directly above your add to cart button, this should give your product all the required properties to create a gift card.

```
{% if product.type == "Gift-Card-Pro" %}
     {% render 'gift-card-pro-form' %}
{% endif %}
```

Once an order is created in Shopify, Gift Card Pro will look for the properties in the item, and issue a gift card. If the "_gcp_delivery_time" property is set to "Send Later", and a delivery date is selected, the Gift Card will be scheduled for that particular date and time.

If an error appears instead of the fields, please make sure gift-card-pro-form.liquid and gift-card-pro-form.js have been added to your theme correctly, and that the liquid tag rendering it is valid.

Once you have completed the order, the line item in Shopify should contain all of the properties added in the form.

To hide any "hidden" line item properties, please refer to the article [Preventing “Hidden” Line Item Properties from Displaying on Your Store.](https://docs.giftcardpro.app/article/preventing-hidden-line-item-properties-from-displaying-on-your-store-%e2%9c%8f%ef%b8%8f/)
