import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {Chart} from "chart.js/auto";
import {PieController} from "chart.js/auto";
import {ArcElement} from "chart.js/auto";
import {Colors} from 'chart.js';

export class Main {
    constructor() {

        this.pieIncome = document.getElementById('income-pie').getContext('2d');
        this.pieExpense = document.getElementById('expense-pie').getContext('2d');
        this.btn = document.getElementsByClassName('filter-btn');
        this.interval = document.getElementById('interval');
        this.dateFrom = document.getElementById('date-from');
        this.dateTo = document.getElementById('date-to');
        this.popup = document.getElementById('wrapper-popup');
        this.popupBtnYes = document.getElementById('popup-btn-yes');
        this.popupBtnNo = document.getElementById('popup-btn-no');
        this.incomeOperations = null;
        this.expenseCategories = null;
        this.incomeCategories = null;
        this.chartIncome = null;
        this.chartExpense = null;
        this.init();
    }

    init() {
        $('.filter-btn').click((e) => {
            $('.filter-btn').removeClass('chosen-filter');
            e.target.classList.toggle('chosen-filter');
        });

        this.getOperations();
        for (let i = 0; i < this.btn.length - 1; i++) {
            this.btn[i].onclick = () => {
                this.clearPie();
                this.getOperations(this.btn[i].getAttribute('id'));
            }
        }
        this.interval.onclick = () => {
            if (!this.dateFrom.value) {
                this.dateFrom.style.borderBottom = "1px solid red";
            }
            if (!this.dateTo.value) {
                this.dateTo.style.borderBottom = "1px solid red";
            }
            this.dateFrom.onchange = () => {
                this.dateFrom.style.borderBottom = "1px solid transparent";
                if (this.dateFrom.value && this.dateTo.value) {
                    this.clearPie();
                    this.getOperations(this.interval.getAttribute('id'));
                }

            }
            this.dateTo.onchange = () => {
                this.dateTo.style.borderBottom = "1px solid transparent";
                if (this.dateFrom.value && this.dateTo.value) {
                    this.clearPie();
                    this.getOperations(this.interval.getAttribute('id'));
                }
            }


        }

    }

    async getOperations(filter = null) {
        const dateFrom = document.getElementById('date-from');
        const dateTo = document.getElementById('date-to');
        if (filter === 'interval') {
            filter = "interval&dateFrom=" + dateFrom.value + "&dateTo=" + dateTo.value;
        }

        try {
            const result = await CustomHttp.request(config.host + '/operations' + (filter ? '?period=' + filter : ''));
            if (result) {
                if (result.error) {
                    throw new Error(result.message);
                }
                this.operations = result;
                this.incomeOperations = this.operations.filter(item => item.type === 'income');
                this.expenseOperations = this.operations.filter(item => item.type === 'expense');
                this.getCategories('income');
                this.getCategories('expense');

            }
        } catch (error) {
            return console.log(error);
        }
    }

    async getCategories(type) {
        try {
            const result = await CustomHttp.request(config.host + '/categories/' + type);
            if (result) {
                if (result.error) {
                    throw new Error(result.message);
                }
                if (type==='income'){
                    this.incomeCategories = result;
                    this.getData(type,this.incomeCategories,this.incomeOperations);
                }
                if (type==='expense'){
                    this.expenseCategories = result;
                    this.getData(type,this.expenseCategories,this.expenseOperations);
                }


            }
        } catch (error) {
            return console.log(error);
        }
    }

    getData(type,categories,operations) {
        let valueArray = [], labelArray = [];
            categories.forEach(item => {
                let allOperationsOfCategory = operations.filter(operation => operation.category === item.title);
                let value = allOperationsOfCategory.reduce((total, element) => {
                    return total + element.amount;
                }, 0);

                if (value) {
                    valueArray.push(value);
                    labelArray.push(item.title);
                }
            });
        this.showPie(type,valueArray, labelArray);
    }


    showPie(type,values, labels) {
        const data = {
            labels: labels,
            datasets: [{
                label: 'Сумма',
                data: values,
                backgroundColor: [
                    '#DC3545',
                    '#FD7E14',
                    '#FFC107',
                    '#20C997',
                    '#0D6EFD'
                ],
                hoverOffset: 4
            }]
        };
        const config = {
            type: 'pie',
            data: data,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    colors: {
                        forceOverride: true
                    }
                }
            },
        };
        Chart.register(PieController);
        Chart.register(ArcElement);
        Chart.register(Colors);
        if (type==='income'){
            this.chartIncome = new Chart(this.pieIncome, config);
        }
        if (type==='expense'){
            this.chartExpense = new Chart(this.pieExpense, config);
        }

    }


    clearPie() {
        this.chartIncome.destroy();
        this.chartExpense.destroy();

    }


}
