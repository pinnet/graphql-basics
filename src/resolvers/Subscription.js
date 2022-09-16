import { GraphQLYogaError } from '@graphql-yoga/node'
const Subscription = {
    post:{
         subscribe: (_,__,{pubSub}) => pubSub.subscribe(`post`),
         resolve: (payload) => payload,
    },
    comment:{
        subscribe: (parent,{ postId },{ db, pubSub },info) => {
            const post = db.posts.find((post) => post.id === postId && post.published)
            if (!post){ throw new GraphQLYogaError('Post does not exist.',{ code: 'POST_UNKNOWN' }) }
            return pubSub.subscribe(`comment ${postId}`)
           
        },
        resolve: (payload) => payload,
    }

}

export { Subscription as default }
