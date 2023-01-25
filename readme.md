# Gift Card Pro - Custom Form Snippets

This repository contains the Shopify snippets to create a custom Gift Card Pro purchasing flow.
If you are planning to use the default purchase flow built into Gift Card Pro, then these are not required.


#### Installation

Go to your live theme, and select "Edit Code" under the dropdown menu, create a new product template for your theme called "custom-gift-card-pro.liquid". Copy all the contents of your default product template to this template.

At this point, it is strongly recommended to duplicate your live theme before continuing, as certain changes can cause issues with your storefront.

Create a new gift card product and change it's template to "custom-gift-card-pro". **Do not assign a product category if possible!** If a product category needs to be assigned, do not assign the Gift Card category, this will cause gift cards issue through both shopify and gift card pro resulting in multiple gift cards from one purchase.

Find all of the remaining default product template files, duplicate them, change their names to begin with "custom-gift-card-pro" as well. If your default product template uses several snippets, it may be required to change any references to said snippets in your new template.

There are two files that need to be added to your Shopify theme:

 - gift_card_pro_form.html
 - gift_card_pro_form.js

*gift_card_pro_form.html* should have it's contents copied into a new snippet named `gift_card_pro_form.liquid` in your theme.
*gift_card_pro_form.js* needs be uploaded or copied as a new asset named `gift_card_pro_form.js` instead.

In the "custom-gift-card-pro.liquid" template, look for the variant selectors. It may be easier to find them if you navigate to your product page, then right click on them and select inspect to get a better idea of what they should look like. Once your variant selectors have been found, add `{% render 'gift_card_pro_form' %}` under them and any conditional logic surrounding them.


#### Testing and Potential Additional Steps.

At this point, the new form fields should appear but may not be functional yet. Try adding two gift cards to your cart, the first one should have all the fields are filled out correctly, while the second should have incorrectly filled or empty fields.

##### Correctly Filled Gift Card
After adding the one with filled fields, go to your cart page. If the properties appear, move on to testing the incorrectly filled gift card.
If no properties are displaying, add `.json` to the end of the address bar at the top of your browser. Check if the properties of gift card contains any property starting with `_gcp`. If the properties are showing here but not on the cart page, then a normal gift card pro snippet installation is required.
If the properties are missing from both the normal cart page and cart.json, Then an additional step must be taken.

###### Additional Setup Step
in *gift_card_pro_form.liquid*, at the end of each `input` and `textarea` tag, add `form="product-form-{{ section.id }}"` (ex: `<input type="checkbox" id="gcpSendToSelfCheck" value="true" name="properties[_gcp_send_to_self]" form="product-form-{{ section.id }}">`). this will allow the form fields to be read by the product form even if they're not within the product form.

##### Incorrectly Filled Gift Card
If the empty or incorrect gift card is able to submit, then the product form is currently has the `novalidate` property and must be changed.

###### Additional Setup Step
Find where your product form begins and remove the `novalidate` property from it, the product form can be either an HTML form tag `<form>` or a liquid form tag `{% form %}` so check for both.


#### Applying CSS to the Form

After the form's functionality has been tested, we can move on to styling it to look like the rest of the product page.

The form has three classes that can be used to apply CSS to it.

- `gcp_input` all textfields and the date picker
- `gcp_radio` all radio buttons
- `gcp_label` all labels

The following CSS will style the form to match the Dawn theme. These rules may also be a good starting point for your own CSS.

```
.gcp_input{
  margin: 1rem 0;
}

.gcp_input textarea{
  padding: 1rem !important;
  width: 100%;
  border: 1px solid;
}

.gcp_input input[type="text"]{
  padding: 1rem 2rem;
  width: 100%;
  border: 1px solid;
}

.gcp_radio input[type="radio"] {
  display: none;
}
.gcp_radio label {
  border: 1px solid;
  background: #FFF;
  display: inline-block;
  margin: 0.9rem 0 2rem;
  padding: 1rem 2rem;
  cursor: pointer;
  width: calc(50% - .2rem);
  text-align: center;
}
.gcp_radio input:checked+label{
  background: #000;
  color: #fff;
}
```

Inspecting various elements of your product page to see how they're styled may help with creating a coherent look on your gift card form.

For example, if your variant selectors or purchase button are styled in a specific way, creating similar rules for the send now and send later buttons will help them blend in.
