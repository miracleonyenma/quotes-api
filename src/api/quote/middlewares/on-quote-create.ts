// ./src/api/quote/middlewares/on-quote-create.ts

/**
 * `on-quote-create` middleware
 */

import type { Core } from "@strapi/strapi";

export default (config, { strapi }: { strapi: Core.Strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    strapi.log.info("In on-quote-create middleware.");

    // Retrieve the current user from the context's state
    const user = ctx.state.user;
    // Proceed to the next middleware or controller
    await next();
    try {
      // Update the user's document in the database to connect the new quote
      await strapi.documents("plugin::users-permissions.user").update({
        documentId: user.documentId, // Use the user's document ID
        data: {
          quotes: {
            connect: [ctx.response.body.data.documentId], // Connect the new quote's ID
          },
        },
      });
    } catch (error) {
      // Log the error to the console
      console.log(error);
      // Set the response status to 400 (Bad Request)
      ctx.response.status = 400;
      // Provide a response body with error details
      ctx.response.body = {
        statusCode: 400,
        error: "Bad Request",
        message: "An error occurred while connecting the quote to the user.",
      };
    }
  };
};
