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

const db = {
    users,
    posts,
    comments,
}

export { db as default }