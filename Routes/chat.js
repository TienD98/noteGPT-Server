const express = require("express");
const chatRouter = express.Router();
const OpenAi = require("openai");
const pool = require("../DB/db");
const openai = new OpenAi();

chatRouter.get('/', async (req, res) => {
    const question = req.body.question
    const userid = 1;
    await pool.query("INSERT INTO chat (role, user_id, content, time) VALUES ('user', $1, $2, now())", [userid, question]);

    const chatsData = await pool.query("select role, content from chat where user_id = $1", [userid]);
    let notegpt = {
        messages: chatsData.rows,
        model: "gpt-3.5-turbo"
    }

    const completion = await openai.chat.completions.create(notegpt);
    const answer = completion.choices[0].message.content;
    if (answer) {
        pool.query("insert into chat (role, user_id, content, time) values ('assistant', 1, $1, now())", [answer]);
    }
    // console.log(chatsData.rows);
    res.status(200).send(answer);
})

module.exports = chatRouter