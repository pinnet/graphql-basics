import { GraphQLYogaError } from '@graphql-yoga/node'
import { v4 as uuidv4 } from 'uuid'

const Mutation = {
    createUser(parent,args,{ db },info){
        const isEmailRegistered = db.users.some((user) => user.email === args.data.email)
        if(isEmailRegistered){
            throw new GraphQLYogaError('Email is taken',{ code: 'EMAIL_EXISTS' })
        }
        const user = {
            id: uuidv4(),
            ...args.data
        }
        db.users.push(user)
        return user
    },
    deleteUser(parent,args,{ db },info){
        const userIndex = db.users.findIndex((user) => user.id === args.id )
        
        if(userIndex === -1){
            throw new GraphQLYogaError('User does not exist.',{ code: 'USER_UNKNOWN' })
        }
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
        if (typeof data.name === 'string'){
            user.name = data.name
        }
        if (typeof data.age !== 'undefined' ){
            user.age = data.age
        }
        return user
    },
    createPost(parent,args,{ db },info){
        const userExists = db.users.some((user) => user.id === args.data.author)
        if (!userExists){
            throw new GraphQLYogaError('User does not exist',{ code: 'USER_UNKNOWN' })
        }
        const post = {
            id: uuidv4(),
            ...args.data
        }
        db.posts.push(post)
        return post
    },
    deletePost(parent,args,{ db },info){
        const postIndex = db.posts.findIndex((post) => post.id === args.id )
        
        if(postIndex === -1){
            throw new GraphQLYogaError('Post does not exist.',{ code: 'POST_UNKNOWN' })
        }
        const deletedPost = db.posts.splice(postIndex,1)
        db.comments = db.comments.filter((comment) => comment.post != args.id)
        return deletedPost[0]
    },
    updatePost(parent,{ id,data },{ db },info){
        const post = db.posts.find((post) => post.id === id )
        if(!post){ throw new GraphQLYogaError('Post does not exist.',{ code: 'POST_UNKNOWN' }) }
        
        if (typeof data.title === 'string'){
            post.title = data.title
        }
        if (typeof data.body === 'string' ){
            post.body = data.body
        }
        if (typeof data.published === 'boolean'){
            post.published = data.published
        }

        return post 
    },
    createComment(parent,args,{ db },info){
        const userExists = db.users.some((user) => user.id === args.data.author)
        if (!userExists){
            throw new GraphQLYogaError('User does not exist',{ code: 'USER_UNKNOWN' })
        }
        const postExists = db.posts.some((post) => post.id === args.data.post && post.published)
        if (!postExists){
            throw new GraphQLYogaError('Post does not exist',{ code: 'POST_UNKNOWN' })
        }
        const comment = {

            id:uuidv4(),
            ...args.data
        }
        db.comments.push(comment)
        return comment
    },
    deleteComment(parent,args,{ db },info){
        const commentIndex = db.comments.findIndex((comment) => comment.id === args.id )
        if(commentIndex === -1){
            throw new GraphQLYogaError('Comment does not exist.',{ code: 'COMMENT_UNKNOWN' })
        }
        return db.comments.splice(commentIndex,1)[0]
    },
    updateComment(parent,{ id,data },{ db },info){
        const comment = db.comments.find((comment) => comment.id === id )
        if(!comment){ throw new GraphQLYogaError('Comment does not exist.',{ code: 'COMMENT_UNKNOWN' }) }
        
        if (typeof data.text === 'string'){
            comment.text = data.text
        }
        return comment
    },
}

export { Mutation as default}