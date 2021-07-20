const Comments = require('../models/commentModel');
const Posts = require('../models/postModel');

const commentCtrl = {
    createComment: async (req, res) => {
        try {
            const { postId, content, tag, reply, postUserId } = req.body;

            const post = await Posts.findById(postId);
            if(!post)
                return res.status(400).json({msg: "This Post does not exist."});

            if(reply){
                const cm = await Comments.findById(reply);
                if(!cm)
                    return res.status(400).json({msg: "This Comment does not exist."});
            }

            const newComment = new Comments({
                user: req.user._id, content, tag, reply, postUserId, postId
            });

            await Posts.findOneAndUpdate({_id: postId}, {
                $push: {comments: newComment._id}
            }, {new: true});

            await newComment.save();

            res.json({
                newComment
            })

        } catch (err) {
            return res.status(500).json({msg: err.message});
        }
    },
    updateComment: async (req, res) => {
        try {
            const { content } = req.body;

            const cm = await Comments.findOneAndUpdate({_id: req.params.id, user: req.user._id}, {
                content
            });

            // if(!cm) 
            //     return res.status(400).json({msg: "You can't edit this comment"});

            res.json({msg: "Comment Updated!!"})
        } catch (err) {
            return res.status(500).json({msg: err.message});
        }
    },
    likeComment: async (req, res) => {
        try {
            const comment = await Comments.find({_id: req.params.id, likes: req.user._id});
            if(comment.length > 0)
                return res.status(400).json({msg: "You already liked this Comment!"})

            await Comments.findOneAndUpdate({_id: req.params.id}, {
                $push: {likes: req.user._id}
            }, {new: true})

            res.json({
                msg: "Comment Liked!"
            })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    unLikeComment: async (req, res) => {
        try {
            await Comments.findOneAndUpdate({_id: req.params.id}, {
                $pull: {likes: req.user._id}
            }, {new: true})

            res.json({
                msg: "Comment Unliked!"
            })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    deleteComment: async (req, res) => {
        try {
            const t = await Comments.find({_id: req.params.id});

            console.log(t);

            const comment = await Comments.findOneAndDelete({
                _id: req.params.id,
                $or: [
                    {user: req.user._id},
                    {postUserId: req.user._id}
                ]
            })

            await Posts.findOneAndUpdate({_id: comment.postId}, {
                $pull: {comments: req.params.id}
            })

            res.json({msg: 'Deleted Comment!'})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
}

module.exports = commentCtrl;