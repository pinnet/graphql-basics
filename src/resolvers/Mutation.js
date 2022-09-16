import { GraphQLYogaError } from '@graphql-yoga/node'
import { v4 as uuidv4 } from 'uuid'

const Mutation = {
    // ----------------------------------------------------------------------------------------- Users
    createUser(parent,args,{ db },info){
        const isEmailRegistered = db.users.some((user) => user.email === args.data.email)
        if(isEmailRegistered){ throw new GraphQLYogaError('Email is taken',{ code: 'EMAIL_EXISTS' }) }
        const user = {
            id: uuidv4(),
            ...args.data
        }
        db.users.push(user)
        return user
    },
    deleteUser(parent,args,{ db },info){
        const userIndex = db.users.findIndex((user) => user.id === args.id )
        if(userIndex === -1){ throw new GraphQLYogaError('User does not exist.',{ code: 'USER_UNKNOWN' }) }
        const deletedUser = db.users.splice(userIndex,1)
        db.posts = db.posts.filter((post) => {
                const match = post.author == args.id
                if(match){
                    db.comments = db.comments.filter((comment) => comment.post != post.id)
                }
               return !match
        })
        return deletedUser[0]
    },
    updateUser(parent,{ id,data },{ db },info){
        const user = db.users.find((user) => user.id === id )
        if(!user){ throw new GraphQLYogaError('User does not exist.',{ code: 'USER_UNKNOWN' }) }
        if (typeof data.email === 'string'){ 
            const isEmailRegistered = db.users.some((user) => user.email === data.email)
            if(isEmailRegistered){ throw new GraphQLYogaError('Email is taken',{ code: 'EMAIL_EXISTS' }) }
            user.email = data.email
        }
        if (typeof data.name === 'string'){ user.name = data.name }
        if (typeof data.age !== 'undefined' ){ user.age = data.age }
        return user
    },

    //------------------------------------------------------------------------------------------- Posts
    createPost(parent,args,{ db,pubSub },info){
        const userExists = db.users.some((user) => user.id === args.data.author)
        if (!userExists){ throw new GraphQLYogaError('User does not exist',{ code: 'USER_UNKNOWN' }) }
        const post = {
            id: uuidv4(),
            ...args.data
        }
        db.posts.push(post)
        if (post.published){ pubSub.publish('post',{ mutation: 'CREATED',data: post}) }
        return post
    },
    deletePost(parent,args,{ db, pubSub },info){
        const postIndex = db.posts.findIndex((post) => post.id === args.id )
        if(postIndex === -1){ throw new GraphQLYogaError('Post does not exist.',{ code: 'POST_UNKNOWN' }) }
        const [post] = db.posts.splice(postIndex,1)
        db.comments = db.comments.filter((comment) => comment.post != args.id)
        if (post.published){ pubSub.publish('post',{mutation: 'DELETED', data: post })}
        return post
    },
    updatePost(parent,{ id,data },{ db,pubSub },info){
        const post = db.posts.find((post) => post.id === id )
        const originalPost = { ...post }
        if(!post){ throw new GraphQLYogaError('Post does not exist.',{ code: 'POST_UNKNOWN' }) }
        if (typeof data.title === 'string'){ post.title = data.title }
        if (typeof data.body === 'string' ){ post.body = data.body }
        if (typeof data.published === 'boolean'){ 
            post.published = data.published

            if (originalPost.published && !data.published){
                pubSub.publish('post',{mutation: 'DELETED', data: originalPost })
            }
            else if (!originalPost.published && data.published){
                pubSub.publish('post',{mutation: 'CREATED', data: post })
            }
        } 
        else if(post.published){
            pubSub.publish('post',{mutation: 'UPDATED', data: post })
        }
        return post 
    },
    //--------------------------------------------------------------------------------------  Comments

    createComment(parent,{ data },{ db, pubSub },info){
        const userExists = db.users.some((user) => user.id === data.author)
        if (!userExists){ throw new GraphQLYogaError('User does not exist',{ code: 'USER_UNKNOWN' }) }
        const postExists = db.posts.some((post) => post.id === data.post && post.published)
        if (!postExists){ throw new GraphQLYogaError('Post does not exist',{ code: 'POST_UNKNOWN' }) }
        const comment = {
            id:uuidv4(),
            ...data
        }
        db.comments.push(comment)
        pubSub.publish(`comment ${comment.post}`,{mutation: 'CREATED',data: comment})
        return comment
    },
    deleteComment(parent,{ id,data },{ db, pubSub },info){
        const commentIndex = db.comments.findIndex((comment) => comment.id === id )
        if(commentIndex === -1){ throw new GraphQLYogaError('Comment does not exist.',{ code: 'COMMENT_UNKNOWN' }) }
        const [comment] = db.comments.splice(commentIndex,1)
        pubSub.publish(`comment ${comment.post}`,{mutation: 'DELETED',data: comment})
        return comment
    },
    updateComment(parent,{ id,data },{ db, pubSub },info){
        const comment = db.comments.find((comment) => comment.id === id )
        if(!comment){ throw new GraphQLYogaError('Comment does not exist.',{ code: 'COMMENT_UNKNOWN' }) }
        if (typeof data.text === 'string'){ comment.text = data.text  }
        pubSub.publish(`comment ${comment.post}`,{mutation: 'UPDATED',data: comment})
        return comment
    },
}

export { Mutation as default}