import {CustomHttp} from "../services/custom-http.js";
import {Auth} from "../services/auth.js";
import config from "../../config/config.js";

export class Form {
    constructor(page) {
        this.page = page;
        this.processElement = null;
        this.rememberMe = false;
        const accessToken = localStorage.getItem(Auth.accessTokenKey);
        if (accessToken) {
            location.href = '#/main';
            return;
        }
        this.fields = [
            {
                name: 'email',
                element: null,
                id: 'email',
                regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                valid: false
            },
            {
                name: 'password',
                element: null,
                id: 'password',
                regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                valid: false
            }
        ];
        if (this.page === 'signup') {
            this.fields.unshift({
                    name: 'fullName',
                    element: null,
                    id: 'fullName',
                    regex: /^[А-Я][А-Яа-я]+\s*[А-Я][А-Яа-я]+\s*[А-Я][А-Яа-я]+\s*$/,
                    valid: false
                },
                {
                    name: 'passwordRepeat',
                    element: null,
                    id: 'passwordRepeat',
                    regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                    valid: false
                });
        }
        const that = this;
        this.fields.forEach(item => {
            item.element = document.getElementById(item.id);
            item.element.onchange = function () {
                that.validateField.call(that, item, this)
            }
        })

        this.processElement = document.getElementById('process');
        this.processElement.onclick = function () {
            that.processForm();
        }

    }

    validateField(field, element) {
        if (!element.value || !element.value.match(field.regex)) {
            if (this.page === 'signup') {
                if (element.name === 'repeatPassword') {
                    const password = this.fields(item => item.name === 'password');
                    if (element.value !== password.element.value) {
                        element.style.borderColor = 'red';
                        field.valid = false;
                    }
                }
            }
            element.style.borderColor = 'red';
            field.valid = false;
        } else {
            element.removeAttribute('style');
            field.valid = true;
        }
        this.validateForm();
    }

    validateForm() {


        const validForm = this.fields.every(item => item.valid);
        if (this.page === 'login') {
            this.rememberMe = document.getElementById('rememberMe').checked;
        }
        if (validForm) {
            this.processElement.removeAttribute('disabled');
        } else {
            this.processElement.setAttribute('disabled', 'disabled');
        }
        return validForm;
    }

    async processForm() {
        if (this.validateForm()) {
            const email = this.fields.find(item => item.name === 'email').element.value;
            const password = this.fields.find(item => item.name === 'password').element.value;

            if (this.page === 'signup') {
                try {
                    const result = await CustomHttp.request(config.host + '/signup', 'POST', {
                        name: this.fields.find(item => item.name === 'fullName').element.value.split(' ')[0],
                        lastName: this.fields.find(item => item.name === 'fullName').element.value.split(' ')[1],
                        email: email,
                        password: password,
                        passwordRepeat: this.fields.find(item => item.name === 'passwordRepeat').element.value
                    });
                    if (result) {
                        if (result.error && !result.user) {
                            throw new Error(result.message);
                        }

                    }
                } catch (error) {
                    return console.log(error);
                }

            }
            try {
                const result = await CustomHttp.request(config.host + '/login', 'POST', {
                    email: email,
                    password: password,
                    rememberMe: this.rememberMe
                });
                if (result) {
                    if (result.error || !result.tokens.accessToken || !result.tokens.refreshToken || !result.user) {
                        throw new Error(result.message);
                    }

                    Auth.setTokens(result.tokens.accessToken, result.tokens.refreshToken);
                    Auth.setUserInfo({
                        fullName: result.user.name + " " + result.user.lastName,
                        userId: result.user.id,
                        email: email
                    });
                    location.href = '#/main';
                }
            } catch (error) {
                console.log(error);
            }

        }
    }
}