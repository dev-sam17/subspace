const _ = require('lodash');
const { retrieveData } = require('./blog-stats');

async function SearchQuery(query) {
    try {
        const blogs = await retrieveData();
        const search = query.toLowerCase();

        const results = _.filter(blogs, (blog) =>
            blog.title.toLowerCase().replace(/\s+/g, '').includes(search)
        );
        return results;
    } catch (error) {
        console.log("Failed to query data ", error);
    }
}

const memoizedSearchQuery = _.memoize(SearchQuery,(query) => query, {maxAge: 1000 * 60 * 2 });

async function searchResults(req, res) {
    try {
        const query = req.query.query;
        const results = await memoizedSearchQuery(query);

        if(results.length > 0) {
            res.status(200).json({ "Count": results.length, "Result": results });
        } else {
            res.status(404).json({ "Count": 0, "Result": "No Results Found" });
        }
        
    } catch (error) {
        res.status(500).json({"Error": error})
    }
}

module.exports = searchResults;
