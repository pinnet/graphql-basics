import { createServer } from '@graphql-yoga/node'

const users= [{
    id: '1',
    name: "Danny",
    email:"danny@dannyarnold.com",
    age:52,
    },{
    id: '2',
    name: "Rupert",
    email:"rupert@dannyarnold.com",
    age:52,
    },{
    id: '3',
    name: "Bjork",
    email:"bjork@dannyarnold.com",
}]

const posts = [{
    id: '1',
    title: 'Wtf is up with that',
    body:'I know im pissed off as well',
    published: true,
    author: '1',
    },{
    id: '2',
    title: 'The more I learn the more I don\'t care',
    body:'Well enough said',
    published: true,
    author: '1',
    },{
    id: '3',
    title: 'I want to go home!',
    body:'Home sweet home',
    published: false,
    author: '2',
}]
const comments = [{
    id: '1',
    text: 'well seems legit',
    author: '3',
    post: '1',
    },{
    id: '2',
    text: 'thats true',
    author: '3',
    post: '1',
    },{
    id: '3',
    text: 'So do I man',
    author: '1',
    post: '3',
    },{
    id: '4',
    text: 'cool',
    author: '1',
    post: '3'
    },{
    id: '5',
    text: 'don\'t sweat it',
    author: '1',
    post: '3',
}]


const server = createServer({
    endpoint: '/',
    hostname: '0.0.0.0',
    schema: {
      typeDefs: /* GraphQL */ `
        type Query {
            posts(query: String): [Post!]!
            users(query: String): [User!]!
            comments:[Comment!]!
        }
        type User{
            id: ID!
            name: String!
            email: String!
            age: Int
            posts: [Post!]!
            comments: [Comment!]!
        }
        type Post{
            id: ID!
            title: String!
            body: String!
            published: Boolean!
            author: User!
            comments: [Comment!]!
        }
        type Comment{
            id: ID!
            text: String!
            author: User!
            posts: Post!           
        }
      `,
      resolvers: {
        Query: {
            users (parent,args,ctx,info) { 
                if(!args.query){
                    return users
                }
                return users.filter((user) => {
                    return user.name.toLocaleLowerCase().includes(args.query.toLocaleLowerCase())
                })
            },
            posts (parent,args,ctx,info) { 
                if(!args.query){
                    return posts
                }
                return posts.filter((post) => {
                    return post.title.toLocaleLowerCase().includes(args.query.toLocaleLowerCase()) ||
                    post.body.toLocaleLowerCase().includes(args.query.toLocaleLowerCase())
                })            
            },
            comments(parent,args,ctx,info) {
                    return comments
            }
        },
        Post: {
            author(parent,args,ctx,info) {
                return users.find((user) => {
                   return user.id === parent.author
                }) 
            },
            comments(parent,args,ctx,info){
                return comments.filter((comment) => {
                    return comment.post === parent.id
                 }) 
            }
        },
        User:{
            posts(parent,args,ctx,info){
                return posts.filter((post) => {
                    return post.author === parent.id
                 }) 
            },
            comments(parent,args,ctx,info){
                return comments.filter((comment) => {
                    return comment.author === parent.id
                 }) 
            }
        },
        Comment:{
            author(parent,args,ctx,info) {
                return users.find((user) => {
                   return user.id === parent.author
                }) 
            },
            posts(parent,args,ctx,info){
                return posts.find((post) => {
                    return post.id === parent.post
                 }) 
            }
        },
      },
    },
  })
  
  server.start()