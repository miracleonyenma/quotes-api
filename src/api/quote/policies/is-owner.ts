/**
 * is-owner policy
 */

export default (policyContext, config, { strapi }) => {
  // Add your own logic here.
  strapi.log.info("In is-owner policy.");

  const user = policyContext.state.user;
  const { documentId } = policyContext.request.params;

  console.log({
    user,
    documentId,
  });

  const canDoSomething = true;

  if (canDoSomething) {
    return true;
  }

  return false;
};
