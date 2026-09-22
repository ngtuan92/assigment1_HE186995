const express = require('express');
const app = express();

app.use(express.json());

app.get('/', async(req, res)=>{
    try {
        res.send({message: 'Welcome to Practical Exam!'});
    } catch (error) {
        res.send({error: error.message});
    }
});
app.use("/articles", require("./routes/articleRoutes"));
app.use("/comments", require("./routes/commentRouter"));

const PORT = process.env.PORT || 9999;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));