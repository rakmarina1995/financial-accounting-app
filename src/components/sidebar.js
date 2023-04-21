import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Auth} from "../services/auth.js";

export class Sidebar {
    constructor() {
        this.category = document.getElementById('category');
        this.arrow = document.getElementById('arrow');
        this.navItemOptions = document.getElementById('nav-item-options');
        this.balance = document.getElementById('balance');
        this.user = document.getElementById('user');
        this.userInfo = Auth.getUserInfo();
        this.init();
    }

    init() {

        this.getBalance();
        this.user.innerText = this.userInfo.fullName;
        this.category.onclick = (e) => {
            this.arrow.classList.toggle('arrow-rotate');
            this.navItemOptions.classList.toggle('show');

        }
    }
    async getBalance(){
        try {
            const result = await CustomHttp.request(config.host + '/balance');
            if (result) {
                if (result.error) {
                    throw new Error(result.message);
                }
                this.balance.innerText = result.balance +'$';
            }
        } catch (error) {
            return console.log(error);
        }
    }
    async updateBalance(newBalance) {
        try {
            const result = await CustomHttp.request(config.host + '/balance', 'PUT', {
                newBalance: newBalance,
            });
            if (result) {
                if (result.error) {
                    throw new Error(result.message);
                }
                this.balance.innerText = result.balance +'$';
            }
        } catch (error) {
            return console.log(error);
        }
    }

}