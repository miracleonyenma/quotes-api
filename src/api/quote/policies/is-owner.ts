// src/api/quote/policies/is-owner.ts

/**
 * is-owner policy
 */

import { errors } from "@strapi/utils";
const { PolicyError } = errors;

export default async (policyContext, config, { strapi }) => {
  // Add your own logic here.
  strapi.log.info("In is-owner policy.");

  // Get the user from the policy context
  const user = policyContext.state.user;
  // Get the documentId from the request params
  const { id: documentId } = policyContext.request.params;

  // Find the quote with the documentId and populate the creator relation
  const quote = await strapi
    .documents("api::quote.quote")
    .findOne({ documentId, populate: ["creator"] });

  // If the user is the creator of the quote, allow the action
  if (user.documentId == quote.creator.documentId) {
    return true;
  }

  // Otherwise, throw an error
  throw new PolicyError("User not allowed to perform this action");
};
