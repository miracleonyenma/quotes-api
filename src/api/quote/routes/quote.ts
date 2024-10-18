// ./src/api/quote/routes/quote.ts

/**
 * quote router
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreRouter("api::quote.quote", {
  config: {
    // Configuration options for the router
    create: {
      // Attach the `on-quote-create` middleware to the `create` action
      middlewares: ["api::quote.on-quote-create"],
    },
    update: {
      // Attach the `ìs-owner` policy to update action
      policies: ["api::quote.is-owner"],
    },
    delete: {
      // Attach the `ìs-owner` policy to delete action
      policies: ["api::quote.is-owner"],
    },
  },
});
