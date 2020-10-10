import Router from 'express';

const routes = new Router();

import PostsController from './app/controllers/PostsController'
import UserController from './app/controllers/UserController'

routes.get('/posts/:user', PostsController.allPosts);
routes.get('/bestposts/:user', PostsController.bestPosts);
routes.get('/user/:user', UserController.findUser);


export default routes;