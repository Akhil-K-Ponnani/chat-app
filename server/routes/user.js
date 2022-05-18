import express from 'express';
import chats from '../data.js';
const router = express.Router();

/* GET home */
router.get('/', (req, res) => {
    res.send('Home')
});

/* GET chats */
router.get('/chats', (req, res) => {
    res.send(chats)
});

/* GET chats/:id */
router.get('/chats/:id', (req, res) => {
    let chat = chats.find(chat => chat._id === req.params.id)
    res.send(chat)
})

export default router;