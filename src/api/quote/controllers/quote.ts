// ./src/api/quote/controllers/quote.ts

/**
 * quote controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::quote.quote",
  ({ strapi }) => ({
    // overwrite defualt find controller
    async find(ctx, next) {
      // destructure to get `data` and `meta` which strapi returns by default
      const { data, meta } = await super.find(ctx);

      const quoteDocumentIds = data.map((quote) => quote.documentId);

      const quoteDocuments = await strapi
        .documents("api::quote.quote")
        .findMany({
          filters: {
            documentId: {
              $in: quoteDocumentIds,
            },
          },
          populate: {
            creator: {
              fields: ["id", "username", "email"],
            },
            likedBy: {
              fields: ["id", "username", "email"],
            },
          },
        });

      const populatedData = data.map((quote) => ({
        ...quote,
        creator: quoteDocuments.find((x) => x.documentId == quote.documentId)
          .creator,
        likedBy: quoteDocuments.find((x) => x.documentId == quote.documentId)
          .likedBy,
      }));

      // perform any other custom action
      return { populatedData, meta };
    },
    likeQuote: async (ctx, next) => {
      // get the document ID from the request parameters
      const { documentId } = ctx.params;

      try {
        // Retrieve the current user from the context's state
        const user = ctx.state.user;

        // Update the user's document in the database to connect the new quote
        const likedQuote = await strapi
          .documents("plugin::users-permissions.user")
          .update({
            documentId: user.documentId, // Use the user's document ID
            data: {
              likedQuotes: {
                connect: [documentId],
              },
            },
          });

        return likedQuote;
      } catch (error) {
        // Set the response status to 400 (Bad Request)
        ctx.response.status = 400;
        // Provide a response body with error details
        ctx.response.body = {
          statusCode: 400,
          error: "Unable to like quote",
          message: "An error occurred while connecting the quote to the user.",
        };
      }
    },
  })
);
