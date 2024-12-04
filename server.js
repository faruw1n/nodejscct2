const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/:number/news/for/:category', async (req, res) => {
    const { number, category } = req.params;

    if (!Number.isInteger(Number(number)) || Number(number) <= 0) {
        return res.status(400).send('Invalid number');
    }
    const categories = ['business', 'economic', 'finances', 'politics'];
    if (!categories.includes(category)) {
        return res.status(400).send('Invalid category');
    }
    const rssUrl = `https://www.vedomosti.ru/rss/rubric/${category}`;
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

    try {
        const response = await axios.get(apiUrl);

        if (response.data.status !== 'ok') {
            return res.status(500).send('Error fetching news');
        }
        const newsItems = response.data.items.slice(0, Number(number));

        res.render('news', {
            number,
            category,
            newsItems
        });

    } catch (error) {
        res.status(500).send('Error fetching data');
    }
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
