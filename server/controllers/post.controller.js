import Post from "../models/post.model.js"
import cloudinary from "../lib/cloudinary.js"
import Notification from "../models/notification.model.js"

export const getFeedPosts = async (req, res) => {
    try {
        const posts = await Post.find({ author: { $in: req.user.connections } })
            .populate("author", "name username profilePicture headline")
            .populate("comments.user", "name profilePicture")
            .sort({ createdAt: -1 })

        res.status(200).json(posts)
    } catch (error) {
        console.log("Error in getFeedPosts");

    }
}

export const createPost = async (req, res) => {
    try {
        const { content, image } = req.body;
        let newPost;

        if (image) {
            const imgResponse = await cloudinary.uploader.upload(image);
            newPost = new Post({
                author: req.user._id,
                content,
                image: imgResponse.secure_url
            })
        }
        else {
            newPost = new Post({
                author: req.user._id,
                content
            })
        }

        await newPost.save()

        res.status(201).json(newPost)

    } catch (error) {
        console.log("Error in Create Post");
    }
}

export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id

        const post = await Post.findById(postId)

        if (!post) {
            res.status(400).json({
                msg: "post not found"
            })
        }

        if (post.author.toString() !== userId.toString()) {
            res.status(403).json({
                msg: "You can delete posts"
            })
        }

        if (post.image) {
            await cloudinary.uploader.destroy(post.image.split("/").pop().split(".")[0])
        }

        await Post.findByIdAndDelete(postId)

        res.status(200).json({
            msg: "Deleted Post"
        })
    } catch (error) {
        console.log("Error in deleting post", error);
    }
}

export const getPostsById = async (req, res) => {
    try {
        const postId = req.params.id
        const post = Post.findById(postId)
            .populate("author", "name username profilePicture headline")
            .populate("comments.user", "name profilePicture username headline")

        res.status(200).json(post)
    } catch (error) {
        console.log("Error in getting post by id");

    }
}

export const createComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const { content } = req.body

        const post = await Post.findByIdAndUpdate(
            postId,
            {
                $push: { commets: { user: req.user._id, content } }
            },
            { new: true }
        ).populate("author", "name email username headline profilePicture")

        //create notification

        if (post.author.toString !== req.user._id.toString()) {
            const newNotification = new Notification({
                recipient: post.author,
                type: "comment",
                relatedUser: req.user._id,
                relatedPost: postId
            })

            await newNotification.save()
            res.status(200).json(post)
        }

    } catch (error) {
        console.log("Error in createComment")
    }
}

export const likePost = async (req, res) => {
    try {
        const postId = req.params.id
        const post = await Post.findById(postId)
        const userId = req.user._id

        if (post.likes.includes(userId)) {
            //liked
            post.likes = post.likes.filter(id => id.toString() !== userId.toString())
        }
        else {
            unliked
            post.likes.push(userId)
            if (post.author.toString() !== userId.toString()) {
                const newNotification = new Notification({
                    recipient: post.author,
                    type: "like",
                    relatedUser: userId,
                    realatedPost: postId
                })

            }
        }
        await post.save()
        res.json(200).json(post)
    } catch (error) {
        console.log("Error in Like posts", error);
        
    }
}