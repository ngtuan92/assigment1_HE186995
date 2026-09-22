const express = require("express");
const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "../data.json");
const data = require("../data.json");
const { comments, articles } = data;

const routes = express.Router();

const saveData = async () => {
    await fs.promises.writeFile(dataPath, JSON.stringify(data, null, 2), "utf-8");
};

routes.get("/", async (req, res, next) => {
    try {
        const result = comments.map((i) => {
            return {
                id: i.id,
                articleId: i.articleId,
                author: i.author,
                content: i.content,
                date: i.date
            };
        });
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

routes.get("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = comments.find((c) => c.id == id);
        if (!result) {
            return res.status(404).json({ message: "Comment not found" });
        }
        return res.status(200).json({
            id: result.id,
            articleId: result.articleId,
            author: result.author,
            content: result.content,
            date: result.date
        });
    } catch (error) {
        next(error);
    }
});

routes.post("/", async (req, res, next) => {
    try {
        const { id, articleId, author, content, date } = req.body || {};

        if (!id || !articleId || !author || !content || !date) {
            return res.status(400).json({ message: "All fields (id, articleId, author, content, date) are required" });
        }

        const article = articles.find((a) => a.id == articleId);
        if (!article) {
            return res.status(404).json({ message: "Article not found" });
        }

        const newComment = {
            id,
            articleId,
            author,
            content,
            date
        };

        comments.push(newComment);
        await saveData();

        res.status(201).json(newComment);
    } catch (error) {
        next(error);
    }
});


module.exports = routes;
