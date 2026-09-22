const express = require("express");
const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "../data.json");
const data = require("../data.json");
const { articles } = data;

const routes = express.Router();

const saveData = async () => {
    await fs.promises.writeFile(dataPath, JSON.stringify(data, null, 2), "utf-8");
};


routes.get("/", async (req, res, next) => {
    try {
        const result = articles.map((i) => {
            return {
                id: i.id,
                title: i.title,
                content: i.content,
                author: i.author,
                date: i.date
            }
        })
        res.status(200).json(result);
    } catch (error) {
        next(error)
    }
});

routes.get("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = articles.find((a) => a.id == id);
        if (!result) {
            return res.status(404).json({ message: "Article not found" });
        }
        return res.status(200).json({
            id: result.id,
            title: result.title,
            content: result.content,
            author: result.author,
            date: result.date
        });
    } catch (error) {
        next(error);
    }
});

routes.post("/", async (req, res, next) => {
    try {
        const { id, title, content, author, date } = req.body || {};

        if (!id || !title || !content || !author || !date) {
            return res.status(400).json({ message: "All fields (id, title, content, author, date) are required" });
        }

        const newArticle = {
            id,
            title,
            content,
            author,
            date,
        };
        articles.push(newArticle);
        await saveData();
        res.status(201).json(newArticle);
    } catch (error) {
        next(error);
    }
});

routes.put("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const article = articles.find((a) => a.id == id);
        if (!article) {
            return res.status(404).json({ message: "Article not found" });
        }

        const { title, content, author, date } = req.body || {};
        article.title = title || article.title;
        article.content = content || article.content;
        article.author = author || article.author;
        article.date = date || article.date;

        await saveData();

        res.status(200).json(article);
    } catch (error) {
        next(error);
    }
});

routes.delete("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const index = articles.findIndex((a) => a.id == id);
        if (index === -1) {
            return res.status(404).json({ message: "Article not found" });
        }
        const deletedArticle = articles.splice(index, 1)[0];
        await saveData();
        res.status(200).json({ message: "Article deleted successfully", article: deletedArticle });
    } catch (error) {
        next(error);
    }
});

module.exports = routes;
