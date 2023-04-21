import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class Category {
    constructor() {
        this.typeCategory = window.location.hash.split('/')[1];
        this.categories = null;
        this.categoryItems = document.getElementById('categories-items');
        this.popup = document.getElementById('wrapper-popup');
        this.popupBtnYes = document.getElementById('popup-btn-yes');
        this.popupBtnNo = document.getElementById('popup-btn-no');
        this.init();
    }

    async init() {
        try {
            const result = await CustomHttp.request(config.host + '/categories/' + this.typeCategory);
            if (result) {
                if (result.error) {
                    throw new Error(result.message);
                }
                this.categories = result;
                this.showCategories();
            }
        } catch (error) {
            return console.log(error);
        }

    }

    showCategories() {
        this.categories.forEach(item => {
            const wrapperElement = document.createElement('div');
            wrapperElement.className = 'col-sm-4';
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            const cardBodyElement = document.createElement('div');
            cardBodyElement.className = 'card-body';
            const cardTitleElement = document.createElement('h5');
            cardTitleElement.className = 'card-title';
            cardTitleElement.innerText = item.title;
            const editBtnElement = document.createElement('a');
            editBtnElement.setAttribute('href', '#/'+this.typeCategory+'/edit?id=' + item.id);
            editBtnElement.className = 'btn';
            editBtnElement.classList.add('btn-edit');
            editBtnElement.classList.add('btn-primary');
            editBtnElement.innerText = 'Редактировать';
            const deleteBtnElement = document.createElement('button');
            deleteBtnElement.setAttribute('id', 'delete-category');
            deleteBtnElement.className = 'btn';
            deleteBtnElement.classList.add('btn-delete');
            deleteBtnElement.innerText = 'Удалить';
            cardBodyElement.appendChild(cardTitleElement);
            cardBodyElement.appendChild(editBtnElement);
            cardBodyElement.appendChild(deleteBtnElement);
            cardElement.appendChild(cardBodyElement);
            wrapperElement.appendChild(cardElement);
            this.categoryItems.appendChild(wrapperElement);
            deleteBtnElement.onclick = () => {
                this.popup.style.display = 'block';
                this.popupBtnNo.onclick = () => {
                    window.location.href = '#/' + this.typeCategory;
                }
                this.popupBtnYes.onclick = () => {
                    this.deleteCategory(item.id);
                }
            }

        })
        const wrapperElement = document.createElement('div');
        wrapperElement.className = 'col-sm-4';
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        const cardBodyElement = document.createElement('div');
        cardBodyElement.className = 'card-body';
        const addCategoryElement = document.createElement('a');
        addCategoryElement.setAttribute('href', '#/'+this.typeCategory+'/create');
        addCategoryElement.setAttribute('id', 'create-category');
        addCategoryElement.className = 'add-card';
        addCategoryElement.innerText = '+';
        cardBodyElement.appendChild(addCategoryElement);
        cardElement.appendChild(cardBodyElement);
        wrapperElement.appendChild(cardElement);
        this.categoryItems.appendChild(wrapperElement);
    }
    async deleteCategory(id) {
        try {
            const result = await CustomHttp.request(config.host + '/categories/'+this.typeCategory+'/'+ id, 'DELETE');
            if (result) {
                if (result.error) {
                    throw new Error(result.message);
                }
                window.location.href = '#/'+this.typeCategory;
            }
        } catch (error) {
            console.log(error);
        }
    }

}