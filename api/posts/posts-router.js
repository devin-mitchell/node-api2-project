const express = require('express')
const Posts = require('./posts-model')

const router = express.Router()


router.get('/api/posts', async (req, res) => {
    try {
        const posts = await Posts.find()
        res.status(200).json(posts)
    } catch (err) {
        res.status(500).json({
            message: "The posts information could not be retrieved",
            error: err.message
        })
    }
})

router.get('/api/posts/:id', async (req, res) => {
    try {
        const post = await Posts.findById(req.params.id)
        if(!post) {
            res.status(404).json({
                message: "The post with the specified ID does not exist"
            })
        } else {
            res.status(200).json(post)
        }
    } catch (err) {
        res.status(500).json({
            message: "The post information could not be retrieved"
        })
    }
})

router.post('/api/posts', async (req, res) => {
    try {
        if (!req.body.title || !req.body.contents) {
            res.status(400).json({
                message: "Please provide title and contents for the post"
            })
        } else {
            const newPostID = await Posts.insert(req.body)
            const post =  await Posts.findById(newPostID.id)
            res.status(201).json(post)
        }
    } catch (err) {
        res.status(500).json({
            message: "There was an error while saving the post to the database",
            error: err.message
        })
    }
})

router.put('/api/posts/:id', async (req, res) => {
    if (!req.body.title || !req.body.contents) {
        res.status(400).json({
            message: "Please provide title and contents for the post"
        })
    } else {
        try{
            const post = await Posts.update(req.params.id, req.body)
            if (!post) {
                res.status(404).json({
                message: "The post with the specified ID does not exist"
                })
            } else {
                const updated = await Posts.findById(req.params.id)
                res.status(200).json(updated)
            }
        } catch (err) {
            res.status(500).json({
                message: "The post information could not be modified"
            })
        }
    }
})

router.delete('/api/posts/:id', async (req, res) => {
    try {
        const removedPost = await Posts.findById(req.params.id)
        const remove = await Posts.remove(req.params.id)
        if(!removedPost) {
            res.status(404).json({
                message: "The post with the specified ID does not exist"
            })
        } else {
            res.status(200).json(removedPost)
        }
    } catch (err) {
        res.status(500).json({
            message: 'The post could not be removed',
            error: err.message
        })
    }
})

router.get('/api/posts/:id/comments', async (req, res) => {
    try {
        const comments = await Posts.findPostComments(req.params.id)
        if(comments.length === 0) {
            res.status(404).json({
                message: "The post with the specified ID does not exist"
            })
        } else {
            res.status(200).json(comments)
        }
    } catch (err) {
        res.status(500).json({
            message: "The comments information could not be retrieved",
            error: err.message
        })
    }
})


module.exports = router;
