
import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

import Home from '~page/home.vue';
import User from '~page/user.vue';
import Detail from '~page/detail.vue';

export function createRouter() {
	return new Router({
		mode: 'history',
		routes: [
			{
				path: '/home',
				name: 'home',
				component: Home
			},
			{
				path: '/user/:id',
				name: 'user',
				component: User,
				children: [
					{
						path: 'detail',
						component: Detail
					}
				]
			},
		]
	});
}