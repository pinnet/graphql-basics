import * as path from 'node:path'
import * as fs from 'node:fs'
import {fileURLToPath} from 'url';
import { createServer } from '@graphql-yoga/node'
import Query from './resolvers/Query.js'
import Mutation from './resolvers/Mutation.js'
import User from './resolvers/User.js'
import Post from './resolvers/Post.js'
import Comment from './resolvers/Comment.js'

import db from './db.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = createServer({
    endpoint: '/',
    hostname: '0.0.0.0',
    context:{ db },    
    schema: { 
        typeDefs: fs.readFileSync( path.join(__dirname,'schema.graphql'),'utf8'),
        resolvers: {
            Query,
            Mutation,
            User,
            Post,
            Comment,
        },
    },
  })
  
  server.start()