import * as prismic from "@prismicio/client";

export const repositoryName = "500media";

export const createClient = (config: prismic.ClientConfig = {}) =>
  prismic.createClient(repositoryName, {
    fetchOptions: { next: { revalidate: 60, tags: ["prismic"] } },
    ...config,
  });
