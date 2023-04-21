import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Sidebar} from "./sidebar";

export class OperationEdit {
    constructor() {
        this.idOperation = window.location.hash.split('=')[1];
        this.categories = null;
        this.typeOperation = document.getElementById('select-type');
        this.categoryOperation = document.getElementById('select-category');
        this.amountOperation = document.getElementById('operation-amount');
        this.dateOperation = document.getElementById('operation-date');
        this.commentOperation = document.getElementById('operation-comment');
        this.saveBtn = document.getElementById('save');
        this.cancelBtn = document.getElementById('cancel');
        this.idCategory = null;
        this.balance = parseInt(document.getElementById('balance').innerText);
        this.sidebar = new Sidebar();

        this.init();
    }

    async init() {
        try {
            const result = await CustomHttp.request(config.host + '/operations/' + this.idOperation);
            if (result) {
                if (result.error) {
                    throw new Error(result.message);
                }
                if (result.type) {
                    if (result.type === 'income') {
                        this.balance - Number(result.amount);
                    }
                    if (result.type === 'expense') {
                        this.balance + Number(result.amount);
                    }
                    this.getCategories(result.type, result.category);
                    this.typeOperation.value = result.type;

                }
                this.amountOperation.value = Number(result.amount);
                this.dateOperation.value = result.date;
                this.commentOperation.value = result.comment;

            }
        } catch (error) {
            console.log(error);
        }
        this.saveBtn.onclick = () => {
            this.getIdCategory(this.typeOperation.value,this.categoryOperation.value);
            // this.editOperation();
        }
        this.cancelBtn.onclick = () => {
            window.location.href = '#/operations';
        }
    }

    async getCategories(type, category) {
        try {
            const result = await CustomHttp.request(config.host + '/categories/' + type);
            if (result) {
                if (result.error) {
                    throw new Error(result.message);
                }
                this.categories = result;
                this.showCategories(category);
            }
        } catch (error) {
            console.log(error);
        }
    }

    showCategories(category) {
        const categoryOptions = this.categoryOperation.options;
        categoryOptions.length = 1;

        this.categories.forEach(item => {
            const optionElement = document.createElement('option');
            optionElement.className = 'category-option';
            optionElement.setAttribute('name', 'category');
            optionElement.setAttribute('value', item.title);
            if (optionElement.value === category) {
                optionElement.selected = true;
            }
            optionElement.innerText = item.title;
            this.categoryOperation.appendChild(optionElement);
        })
    }

    async getIdCategory(type,categoryValue) {
        try {
            const result = await CustomHttp.request(config.host + '/categories/' + type);
            if (result) {
                if (result.error) {
                    throw new Error(result.message);
                }
                const allCategories=result;
                const category = allCategories.find(item => {
                    return item.title === categoryValue;
                });
                if (category && category.id){
                    this.editOperation(category.id);
                }

            }
        } catch (error) {
            return console.log(error);
        }
    }

    async editOperation(categoryId) {

        try {
            const result = await CustomHttp.request(config.host + '/operations/' + this.idOperation, 'PUT', {
                type: this.typeOperation.value,
                amount: this.amountOperation.value,
                date: this.dateOperation.value,
                comment: this.commentOperation.value,
                category_id: categoryId,
            });
            if (result) {
                if (result.error || !result.type || !result.amount || !result.comment || !result.date || !result.category || !result.id) {
                    throw new Error(result.message);
                }
                if (result.type === 'income') {
                    this.sidebar.updateBalance(this.balance + Number(result.amount));
                }
                if (result.type === 'expense') {
                    this.sidebar.updateBalance(this.balance - Number(result.amount));
                }
                window.location.href = '#/operations';
            }
        } catch (error) {
            console.log(error);
        }
    }


}