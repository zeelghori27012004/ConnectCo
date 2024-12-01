import Comment from "../Schema/Comment.js";
import Notification from "../Schema/Notification.js";
import aws from 'aws-sdk';
import { nanoid } from "nanoid";


const s3 = new aws.S3({
    region: 'ap-south-1',
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})


const deleteComments = ( _id ) => {
    Comment.findOneAndDelete({ _id })
    .then(comment => {

        if(comment.parent){
            Comment.findOneAndUpdate({ _id: comment.parent }, { $pull: { children: _id } })
            .then(data => console.log('comment delete from parent'))
            .catch(err => console.log(err));
        }

        Notification.findOneAndDelete({ comment: _id }).then(notification => console.log('comment notification deleted'))

        Notification.findOneAndUpdate({ reply: _id }, { $unset: { reply: 1 } }).then(notification => console.log('reply notification deleted'))

        Blog.findOneAndUpdate({ _id: comment.blog_id }, { $pull: { comments: _id }, $inc: { "activity.total_comments": -1 }, "activity.total_parent_comments": comment.parent ? 0 : -1 })
        .then(blog => {
            if(comment.children.length){
                comment.children.map(replies => {
                    deleteComments(replies)
                })
            }   
        })

    })
    .catch(err => {
        console.log(err.message);
    })
}

const generateUploadURL = async () => {

    const date = new Date();
    const imageName = `${nanoid}-${date.getTime()}.jpeg`;

    return await s3.getSignedUrlPromise('putObject', {
        Bucket: 'connectco-bucket',
        Key: imageName,
        Expires: 1000,
        ContentType: "image/jpeg"
    })
}

export {deleteComments, generateUploadURL};