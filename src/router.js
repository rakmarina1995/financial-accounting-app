import {Sidebar} from "./components/sidebar.js";
import {Main} from "./components/main.js";
import {Form} from "./components/form.js";
import {Auth} from "./services/auth.js";
import {Operations} from "./components/operations.js";
import {OperationEdit} from "./components/operation-edit.js";
import {OperationCreate} from "./components/operation-create.js";
import {CategoryCreate} from "./components/category-create.js";
import {CategoryEdit} from "./components/category-edit.js";
import {Category} from "./components/category.js";

export class Router {
    constructor() {
        this.contentElement = document.getElementById('content');
        this.stylesElement = document.getElementById('styles');
        this.titleElement = document.getElementById('page-title');

        this.routes = [
            {
                route: '#/login',
                title: 'Войти в систему',
                template: 'templates/login.html',
                styles: 'styles/login.css',
                load: () => {
                    new Form('login');
                }
            },
            {
                route: '#/signup',
                title: 'Регистрация',
                template: 'templates/signup.html',
                styles: 'styles/login.css',
                load: () => {
                    new Form('signup');
                }
            },
            {
                route: '#/main',
                title: 'Главная',
                template: 'templates/main.html',
                styles: 'styles/main.css',
                load: () => {
                    new Sidebar();
                    new Main();
                }
            },
            {
                route: '#/income',
                title: 'Доходы',
                template: 'templates/income.html',
                styles: 'styles/income.css',
                load: () => {
                    new Sidebar();
                    new Category();
                }
            },
            {
                route: '#/income/edit',
                title: 'Редактирование категории доходов',
                template: 'templates/income-edit.html',
                styles: 'styles/income.css',
                load: () => {
                    new Sidebar();
                    new CategoryEdit();
                }
            },
            {
                route: '#/income/create',
                title: 'Создание категории доходов',
                template: 'templates/income-create.html',
                styles: 'styles/income.css',
                load: () => {
                    new Sidebar();
                    new CategoryCreate();
                }
            },
            {
                route: '#/expense',
                title: 'Расходы',
                template: 'templates/expense.html',
                styles: 'styles/expense.css',
                load: () => {
                    new Sidebar();
                    new Category();
                }
            },
            {
                route: '#/expense/edit',
                title: 'Редактирование категории расходов',
                template: 'templates/expense-edit.html',
                styles: 'styles/expense.css',
                load: () => {
                    new Sidebar();
                    new CategoryEdit();
                }
            },
            {
                route: '#/expense/create',
                title: 'Cоздание категории расходов',
                template: 'templates/expense-create.html',
                styles: 'styles/expense.css',
                load: () => {
                    new Sidebar();
                    new CategoryCreate();
                }
            },
            {
                route: '#/operations',
                title: 'Доходы и расходы',
                template: 'templates/operations.html',
                styles: 'styles/operations.css',
                load: () => {
                    new Sidebar();
                    new Operations();
                }
            },
            {
                route: '#/operations/edit',
                title: 'Редактирование дохода/расхода',
                template: 'templates/operations-edit.html',
                styles: 'styles/operations.css',
                load: () => {
                    new Sidebar();
                    new OperationEdit();
                }
            },
            {
                route: '#/operations/create',
                title: 'Создание дохода/расхода',
                template: 'templates/operations-create.html',
                styles: 'styles/operations.css',
                load: () => {
                    new Sidebar();
                    new OperationCreate();
                }
            }

        ]
    }

    async openRoute() {
        const urlRoute = window.location.hash.split('?')[0];
        if (urlRoute === '#/logout') {
            await Auth.logout();
            window.location.href = '#/login';
            return;
        }
        const newRoute = this.routes.find(item => item.route === urlRoute);
        if (!newRoute) {
            window.location.href = '#/login';
            return;
        }
        this.contentElement.innerHTML = await fetch(newRoute.template).then(response => response.text());
        this.stylesElement.setAttribute('href', newRoute.styles);
        this.titleElement.innerText = newRoute.title;

        newRoute.load();
    }
}