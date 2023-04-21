import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Sidebar} from "./sidebar.js";

export class OperationCreate {
    constructor() {
        this.type=window.location.hash.split('=')[1];
        this.values = document.getElementsByClassName('input');
        this.typeOperation = document.getElementById('select-type');
        this.categoryOperation = document.getElementById('select-category');
        this.categories = null;
        this.amountOperation = document.getElementById('operation-amount');
        this.dateOperation = document.getElementById('operation-date');
        this.commentOperation = document.getElementById('operation-comment');
        this.saveBtn = document.getElementById('save');
        this.cancelBtn = document.getElementById('cancel');
        this.sidebar=new Sidebar();
        this.init();
    }

    init() {
       if (this.type){
           this.typeOperation.value=this.type;
       }
        if (this.typeOperation.options[this.typeOperation.selectedIndex].value) {
            this.type = this.typeOperation.options[this.typeOperation.selectedIndex].value;
            this.getCategories();
        }
        this.typeOperation.onchange = (e) => {
            if (this.typeOperation.options[this.typeOperation.selectedIndex].value) {
                this.type = this.typeOperation.options[this.typeOperation.selectedIndex].value;
                this.getCategories();
            }

        }

        this.saveBtn.onclick = () => {
            for (let i = 0; i < this.values.length; i++) {
                if (!this.values[i].value) {
                    this.values[i].style.borderColor = "red";
                } else {
                    this.values[i].style.borderColor = "#CED4DA";
                }
            }
            if (this.type && this.categoryOperation.value && this.amountOperation.value && this.dateOperation.value && this.commentOperation.value) {
                this.createOperation(this.type);
            }

        }
        this.cancelBtn.onclick = () => {
            window.location.href = '#/operations';

        }


    }

    async getCategories() {
        try {
            const result = await CustomHttp.request(config.host + '/categories/' + this.type);
            if (result) {
                if (result.error) {
                    throw new Error(result.message);
                }
                this.categories = result;
                this.showCategories();
            }
        } catch (error) {
            console.log(error);
        }
    }

    showCategories() {
        const categoryOptions = this.categoryOperation.options;
        categoryOptions.length = 1;

        this.categories.forEach(item => {
            const optionElement = document.createElement('option');
            optionElement.className = 'category-option';
            optionElement.setAttribute('name', 'category');
            optionElement.setAttribute('value', item.title);
            optionElement.innerText = item.title;
            this.categoryOperation.appendChild(optionElement);
        })
    }

    async createOperation(type) {
        const balance = parseInt(document.getElementById('balance').innerText);
        const category_id = this.categories.find(item => item.title === this.categoryOperation.value);
        if (type && category_id && category_id.id && this.amountOperation.value && this.dateOperation.value && this.commentOperation.value) {
            try {
                const result = await CustomHttp.request(config.host + '/operations', 'POST', {
                    type: type,
                    amount: Number(this.amountOperation.value),
                    date: this.dateOperation.value,
                    comment: this.commentOperation.value,
                    category_id: category_id.id
                });
                if (result) {
                    if (result.error) {
                        throw new Error(result.message);
                    }
                    if (type==='income'){
                        this.sidebar.updateBalance(balance+result.amount);
                    }
                     if (type==='expense'){
                         this.sidebar.updateBalance(balance-result.amount);
                     }
                    window.location.href = '#/operations';
                }
            } catch (error) {
                for (let i = 0; i < this.values.length; i++) {
                        this.values[i].style.borderColor = "red";
                }
                console.log(error);
            }
        } else {

            console.log('Необходимо заполнить все поля!');
        }

    }



}