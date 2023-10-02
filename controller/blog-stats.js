const axios = require("axios");
const _ = require("lodash");
const { LRUCache } = require('lru-cache');

const cache = new LRUCache({ max: 100, maxAge: 2 * 60 * 1000 });

async function retrieveData() {
  const url = "https://intent-kit-16.hasura.app/api/rest/blogs";
  const config = {
    headers: {
      "x-hasura-admin-secret":
        "32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6",
    },
  };
  try {
    const response = await axios.get(url, config);
    const blogs = response.data.blogs;
    return blogs;
  } catch (error) {
    return [];
  }
}

const dataAnalysis =
  async function () {
    try {
      const blogs = await retrieveData();
      const query = "privacy";

      if (blogs.length > 0) {
        const analytics = {
          total_number_of_blogs: blogs.length,
          blog_with_longest_title: _.maxBy(blogs, (blog) => blog.title.length),
          number_of_blogs_with_title_privacy: _.filter(blogs, (blog) =>
            blog.title.toLowerCase().includes(query)
          ).length,
          blogs_with_unique_title: _.uniqBy(blogs, "title"),
        };
        return analytics;
      } else {
        return {};
      }
    } catch (error) {
      console.log("failed to get analytics ", error);
    }
  }

async function cachedAnalyticsData(fn) {
    const cacheKey = "unique_cache_key";

    const cachedResult = cache.get(cacheKey);
    if (cachedResult !== undefined) {
        return cachedResult;
    }

    try {
        const result = await fn();
        cache.set(cacheKey, result);
        return result;
    } catch (error) {
        console.error('Error ', error);
        throw error;
    }
};


async function stats(req, res) {
  try {
    const analytics = await cachedAnalyticsData(dataAnalysis);
    console.log(analytics.total_number_of_blogs);
    if (analytics.total_number_of_blogs) {
      res.status(200).json({ stats: analytics });
    } else {
      res.status(404).json({ error: "API Error. No data found" });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
}

module.exports = {
  stats,
  retrieveData,
};
