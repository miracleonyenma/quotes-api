// ./src/api/quote/routes/like-quote.ts

export default {
  routes: [
    {
      method: "POST",
      path: "/quotes/like/:documentId",
      handler: "quote.likeQuote",
    },
  ],
};
