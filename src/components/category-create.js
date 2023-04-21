import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
export class CategoryCreate{
    constructor() {
        this.category=window.location.hash.split('/')[1];
        this.newCategory = document.getElementById('new-category');
        this.createCategoryBtn = document.getElementById('create-category');
        this.cancelBtn = document.getElementById('cancel');
        this.init();
    }
    init() {
        this.cancelBtn.onclick = () => {
            window.location.href = '#/'+this.category;
        }
        this.createCategoryBtn.onclick = () => {
            if (this.newCategory.value) {
                this.createCategory(this.newCategory.value);
            } else {
                this.newCategory.style.borderColor='red';
            }
        }
    }
    async createCategory(category) {
        try {
            const result = await CustomHttp.request(config.host + '/categories/'+this.category, 'POST', {
                title: category
            });
            if (result) {
                if (result.error) {
                    throw new Error(result.message);
                }
                window.location.href = '#/'+this.category;
            }
        } catch (error) {
            this.newCategory.style.borderColor='red';
            console.log(error);
        }
    }

}