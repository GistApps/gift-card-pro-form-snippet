//Javascript for GCP custom flow
  (function(selectedVariant) {

    var gcpForm = {

      /**
       * Settings for the form. This includes any fields that are required, option selectors for the product variant, and the default image for the gift card made through GCP and if it should be forced.
       */
      settings: {

        /**
         * Required fields used by the showForm and hideForm functions. These fields are necessary to allow form submission while the form is hidden because of the "send to self" toggle.
         *
         * @var {Array} gcpForm.settings.requiredElements                       list of required form elements
         */
        requiredElements: [
          document.querySelector("#gcpRecipientName input"),
          document.querySelector("#gcpSenderName input"),
          document.querySelector("#gcpRecipientEmail input"),
        ],

        /**
         * Product variant selectors. These are necessary to allow the setImage function to accurately change the image based on the selected variant.
         *
         * @var {null | HTMLCollection} gcpForm.settings.option1                First variant selection option
         * @var {null | HTMLCollection} gcpForm.settings.option2                Second variant selection option
         * @var {null | HTMLCollection} gcpForm.settings.option3                Third variant selection option
         */
        productOptionInputs:{
          option1: document.querySelectorAll('[name="option1"]'),
          option2: document.querySelectorAll('[name="option2"]'),
          option3: document.querySelectorAll('[name="option3"]'),
        },

        /**
         * Default gift card image. Used as a fallback for the gift card image if setImage fails, or if useDefaultImage is true.
         *
         * @var {String} gcpForm.settings.defaultImage                          Default gift card image and fallback image
         */
        defaultImage: "",

        /**
         * Switch for forcing use of the default gift card image. While set to true, the gift card image will be set to the value of defaultImage and not change.
         *
         * This should be set to false if the gift card product has an option selector for images.
         *
         * @var {Boolean} gcpForm.settings.useDefaultImage                      Decides if defaultImage should be forced as the giftcard image
         */
        useDefaultImage: false

      },

      /**
       * State variables.
       *
       * @var {null | Object} gcpForm.state.product                             the currenty shopify product object.
       * @var {null | Integer} gcpForm.state.variantId                          starting variant id for the product.
       */
      state: {
        product: null,
        variantId: null,
      },

      /**
       * Gets the shopify product, then sets up all initial variables.
       */
      scaffold: function() {

        gcpForm.functions.getProduct()
        .then(function(response) {
          gcpForm.state.product = response.product;
          gcpForm.functions.setCurrentVariantId();
          gcpForm.events();

          if (gcpForm.settings.useDefaultImage) {
            gcpForm.elements.selectedImage.setAttribute("value", gcpForm.settings.defaultImage);
          } else {
            gcpForm.functions.setImage();
          }

        });

      },

      /**
       * Initializer.
       */
      init: function() {

        gcpForm.scaffold();

      },

      /**
       * Form Elements.
       *
       * @var {Element} gcpForm.elements.sendToSelfInput                        Target element for the event listener to toggle self sending
       * @var {Element} gcpForm.elements.sendNowInput                           Target element for the event listener to send the gift card now
       * @var {Element} gcpForm.elements.sendLaterInput                         Target element for the event listener to send the gift card later
       * @var {Element} gcpForm.elements.datePicker                             Container element of datePickerField. Will be hidden by sendNowInput and shown by sendLaterInput
       * @var {Element} gcpForm.elements.datePickerField                        Form field for the date picker
       * @var {Element} gcpForm.elements.selectedImage                          Gift Card Image field GCP will use this field as the selected card image
       * @var {Element} gcpForm.elements.recipientDetailsSection                Form container will be hidden or shown by the sendToSelf
       */
      elements: {
        sendToSelfInput: document.querySelector("#gcpSendToSelf input"),
        sendNowInput: document.querySelector("#gcpSendNowButton"),
        sendLaterInput: document.querySelector("#gcpSendLaterButton"),
        datePicker: document.querySelector("#gcpDeliveryDate"),
        datePickerField: document.querySelector("#gcpDeliveryDate input"),
        selectedImage: document.querySelector('[name="properties[_gcp_selected_card_image]"]'),
        recipientDetailsSection: document.querySelector("#gcpRecipientDetailsSection")
      },

      /**
       * Sets up all event listeners
       */
      events: function() {
        //Send To Self
        gcpForm.elements.sendToSelfInput.addEventListener('change', gcpForm.functions.toggleSendToSelf);
        //Send Now
        gcpForm.elements.sendNowInput.addEventListener('click', gcpForm.functions.hideDatePicker);
        //Send Later
        gcpForm.elements.sendLaterInput.addEventListener('click', gcpForm.functions.showDatePicker);
        //Product Options
        if(!gcpForm.settings.useDefaultImage){
          gcpForm.functions.addVariantEventListeners(gcpForm.settings.productOptionInputs.option1);
          gcpForm.functions.addVariantEventListeners(gcpForm.settings.productOptionInputs.option2);
          gcpForm.functions.addVariantEventListeners(gcpForm.settings.productOptionInputs.option3);
        }
      },

      functions: {

        /**
         * sets the ID from the product id hidden field
         */
        setCurrentVariantId: function() {
          gcpForm.state.variantId = document.querySelector('[name="id"]').value;
        },

        /**
         * Requests the product from the Shopify API and returns a promise.
         */
        getProduct: function() {

          return new Promise(function(resolve, reject) {
            fetch(window.location.pathname + '.json')
            .then(function(r){return r.json()})
            .then(resolve)
            .catch(reject)
            ;
          });

        },

        /**
         * Iterates through an array of HTML elements and adds event listeners to trigger setImage on any inputs.
         *
         * @param {null | array} option
         * @returns {boolean}
         */
        addVariantEventListeners: function(option) {

          if(option === null){
            return false;
          }

          //var elements = option.querySelectorAll('input');

          for(el of option){
            if (typeof(el) !== "object" || el === null) return false;
            el.addEventListener('click', gcpForm.functions.setImage);
          }

          return true;


        },

        /**
         * Shows the datePicker field.
         */
        showDatePicker: function() {
          gcpForm.functions.showElement(gcpForm.elements.datePicker);
          gcpForm.functions.makeRequired([gcpForm.elements.datePickerField]);;
        },

        /**
         * Hides the datePicker field.
         */
        hideDatePicker: function() {
          gcpForm.functions.hideElement(gcpForm.elements.datePicker);
          gcpForm.functions.makeOptional([gcpForm.elements.datePickerField]);
        },


        /**
         * Takes an element, then sets it's display to none.
         *
         * @param {Element} el
         * @returns {boolean}
         */
        hideElement: function(el) {

          if (typeof(el) == 'undefined') {
            return false;
          }

          el.style.display = "none";

          return true;

        },

        /**
         * Takes an element, then sets it's display to block.
         *
         * @param {Element} el
         * @returns {boolean}
         */
        showElement: function(el) {

          if (typeof(el) == 'undefined') {
            return false;
          }

          el.style.display = "block";

          return true;

        },

        /**
         * Takes an array of elements and sets a required attribute.
         *
         * @param {Element} el
         * @returns {boolean}
         */
        makeRequired: function(els) {

          if (typeof(els) === 'undefined') {
            return false;
          }

          for(el of els){
            if(typeof el === 'object') el.setAttribute("required","");
          }

          return true;

        },

        /**
         * Takes an array of elements and removes their required attribute.
         *
         * @param {Element} el
         * @returns {boolean}
         */
        makeOptional: function(els) {

          if (typeof(els) === 'undefined') {
            return false;
          }

          for(el of els){
            if(typeof el === 'object') el.removeAttribute("required");
          }

          return true;

        },

        /**
         * Calls hideElement and makeOptional or showElement and makeRequired
         */
        toggleSendToSelf: function() {
          if(this.checked){
            gcpForm.elements.sendNowInput.click();
            gcpForm.functions.hideElement(gcpForm.elements.recipientDetailsSection);
            gcpForm.functions.makeOptional(gcpForm.settings.requiredElements);
          } else {
            gcpForm.functions.showElement(gcpForm.elements.recipientDetailsSection);
            gcpForm.functions.makeRequired(gcpForm.settings.requiredElements);
          }
        },

        /**
         * Takes a container element of options and searches them for a checked input.
         * Returns the checked input or null if input is not found.
         *
         * @param {NodeList} optionInputs
         * @returns {string | null}
         */
        findCheckedOption: function(optionInputs) {

          var optionValue = null;

          if (
            optionInputs === null ||
            typeof optionInputs === undefined ||
            optionInputs.length === 0 ||
            typeof optionInputs !== "object"
          ) {
            return optionValue;
          }

          optionInputs.forEach(function(optionInput) {

            if(optionInput.checked) {
              optionValue = optionInput.value;
            }

          });


          return optionValue;

        },

        /**
         * sets the selected image to the default image.
         * will log an error if no default image is set.
         */
        setDefaultImage: function() {
          try {
            gcpForm.elements.selectedImage.setAttribute("value", gcpForm.settings.defaultImage);
          } catch(err) {
            console.error("Default image is undefined! ", error);
          }
        },

        /**
         * Get the current selected variant from a Shopify product form.
         * @returns {object} Shopify product variant json data
         * @throws {Error}
         */
        getCurrentVariant: function() {

          const option1 = gcpForm.functions.findCheckedOption(gcpForm.settings.productOptionInputs.option1),
                option2 = gcpForm.functions.findCheckedOption(gcpForm.settings.productOptionInputs.option2),
                option3 = gcpForm.functions.findCheckedOption(gcpForm.settings.productOptionInputs.option3);

          //finding the variant
          const currentVariant = gcpForm.state.product.product.variants.find(function(variant){
            return (
              variant.option1 === option1 &&
              variant.option2 === option2 &&
              variant.option3 === option3
            );
          });

          //throws an exception if no variant is found
          if (typeof currentVariant === 'undefined') {
            throw new Error("No matching variants found");
          }

          if (typeof (currentVariant.image_id) === 'undefined') {
            throw new Error("Failed to obtain variant");
          }

          return currentVariant;

        },

        /**
         * Goes to find the image with an id matching the variant's image_id
         * @param  {object} currentVariant
         * @returns {mixed|object|null}
         */
        findVariantImage: function(currentVariant) {

          const images = (() => {

            if (
              typeof(gcpForm.state.product.product.images) != 'undefined' &&
              Array.isArray(gcpForm.state.product.product.images)
            ) {
              return gcpForm.state.product.product.images;
            }

            return [];

          })();

          const variantImage = images.find(function(image){

            if (image.id !== currentVariant.image_id) {
              return false;
            }

            return true;

          });

          return variantImage;

        },

        /**
         * uses findCheckedOption to get user input, then attempts to find the variant corrisponding to the selected options.
         * if unsuccessful, defaultImage will be called as a fallback.
         */
        setImage: function() {

          try {

            const currentVariant = gcpForm.functions.getCurrentVariant();
            const image          = gcpForm.functions.findVariantImage(currentVariant);

            gcpForm.elements.selectedImage.setAttribute("value", image.src);

          } catch(err) {

            console.warn("An error occured", err);
            return gcpForm.functions.setDefaultImage();

          }

        },

      }

    };

    gcpForm.init();

  })();
