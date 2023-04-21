import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class CategoryEdit {
    constructor() {
        this.category=window.location.hash.split('/')[1];
        this.idCategory = window.location.hash.split('=')[1];
        this.categoryName = document.getElementById('category-name');
        this.saveBtn = document.getElementById('save');
        this.cancelBtn = document.getElementById('cancel');
        this.init();
    }

    async init() {
        if (this.idCategory) {
            try {
                const result = await CustomHttp.request(config.host + '/categories/'+ this.category+'/'+ this.idCategory);
                if (result) {
                    if (result.error || !result.title) {
                        throw new Error(result.message);
                    }
                    this.categoryName.value = result.title;
                }
            } catch (error) {
                console.log(error);
            }
            this.saveBtn.onclick = () => {
                if (this.categoryName.value) {
                    this.editCategory();
                } else {
                    this.categoryName.style.borderColor = 'red';
                }

            }
        } else {
            window.location.href = '#/'+this.category;
        }
        this.cancelBtn.onclick = () => {
            window.location.href = '#/'+this.category;
        }
    }

    async editCategory() {
        try {
            const result = await CustomHttp.request(config.host + '/categories/'+this.category+'/' + this.idCategory, 'PUT', {
                title: this.categoryName.value
            });
            if (result) {
                if (result.error || !result.title || !result.id) {
                    throw new Error(result.message);
                }
                window.location.href = '#/'+this.category;
            }
        } catch (error) {
            console.log(error);
        }
    }

}