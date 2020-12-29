var util = require('../../utils/util.js');
var api = require('../../config/api.js');
const app = getApp();
let timer;
let lastTime = 0;
let time = new Date();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        show: false,
        viewTo: "",
        viewToLeft: "",
        listHeight: 600,
        activeIndex: 0,
        tabIndex: 0,
        showModal: false,
        showCart: false,
        heigthArr: [],
        cart: [],
        totalMoney: 0,
        currFood: {},
        /*activesInfo: {
            1: {
                class: "manjian",
                text: "减"
            },
            2: {
                class: "xindian",
                text: "新"
            },
            3: {
                class: "zhekou",
                text: "折"
            },
            4: {
                class: "daijinquan",
                text: "券"
            },
            5: {
                class: "xinyonghu",
                text: "新"
            },
            6: {
                class: "peisong",
                text: "配"
            },
            7: {
                class: "lingdaijin",
                text: "领"
            },
            8: {
                class: "zengsong",
                text: "赠"
            }
        },*/
        storeInfo: {
            //服务端获取信息
            //storeId: 1,
            storeName: "竹林香米线",
            storeImgUrl: "/images/store.png",
            //score: 4.4,
            saleMonth: 835,
            minDelPrice: 2, //最小价格起送
            delPrice: 5,    // 配送价格
            //averagePrice: 15,
            //delTime: 30,
            //distance: 3.2,
            service: ["支持自取"],
            /*actives: [{
                activeId: 1,
                acticeText: "满20减10；满200减20；满1000减50；满1000减50；满1000减50"
            },
                {
                    activeId: 2,
                    acticeText: "本店新用户立减1元"
                },
                {
                    activeId: 3,
                    acticeText: "折扣商品9折起"
                }
            ],
            publicMsg: "欢迎光临本店,欢迎光临本店欢迎光临本店欢迎光临本店欢迎光临本店欢迎光临本店欢迎光临本店欢迎光临本店欢迎光临本店"*/
        },
        food: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(this.data.food)
        wx.setNavigationBarTitle({
            categoryName: this.data.storeInfo.storeName
        });
        this.setData({
            ['food']: getApp().globalData.food
        })
        // this.getStoreInfo()
    },

    getStoreInfo: function () {
        let that = this;
        util.request(api.StoreAllInfo, {"shopId": "A0000A"}, "GET")
            .then(function (res) {
                if (res.errno === 0) {
                    that.setData({
                        ['food']: res.data.food
                    })
                }
            }, function (err) {
                console.log(err)
            })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        //wx.hideTabBar();
        let height1, height2;
        let res = wx.getSystemInfoSync();
        let winHeight = res.windowHeight;
        this.setData({
            listHeight: winHeight - height1 - height2
        });
        this.calculateHeight();
        let query = wx.createSelectorQuery();
        query.select(".head").boundingClientRect();
        query.exec(res => {
            height1 = res[0].height;
            let query1 = wx.createSelectorQuery();
            query1.select(".tab").boundingClientRect();
            query1.exec(res => {
                height2 = res[0].height;
                this.setData({
                    listHeight: winHeight - height1 - height2
                });
                this.calculateHeight();
            });
        });
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
    },
    selectFood(e) {
        this.setData({
            activeIndex: e.target.dataset.index,
            viewTo: 'right' + e.target.dataset.titleid
        });
    },
    calculateHeight() {
        let heigthArr = [];
        let height = 0;
        heigthArr.push(height);
        var query = wx.createSelectorQuery();
        query.selectAll(".title-group").boundingClientRect();
        query.exec(res => {
            for (let i = 0; i < res[0].length; i++) {
                //console.log(res[0][i])
                height += parseInt(res[0][i].height);
                heigthArr.push(height);
            }
            this.setData({
                heigthArr: heigthArr
            });
        });
    },

    scroll: function (e) {
        /*let now = e.timeStamp;
        if (now - lastTime < 200){
            return
        }
        lastTime = now;
        let srollTop = e.detail.scrollTop + 100;
        for (let i = 0; i < this.data.heigthArr.length; i++) {
            if (
                srollTop >= this.data.heigthArr[i] &&
                srollTop < this.data.heigthArr[i + 1] &&
                this.data.activeIndex !== i
            ) {
                this.setData({
                    activeIndex: i,
                    viewToLeft: 'left' + i
                });
                return;
            }
        }*/

        clearTimeout(timer);
        timer = setTimeout(() => {
            let srollTop = e.detail.scrollTop + 100;
            for (let i = 0; i < this.data.heigthArr.length; i++) {
                if (
                    srollTop >= this.data.heigthArr[i] &&
                    srollTop < this.data.heigthArr[i + 1] &&
                    this.data.activeIndex !== i
                ) {
                    this.setData({
                        activeIndex: i,
                        viewToLeft: 'left' + i
                    });
                    return;
                }
            }
        }, 100)
    },
    add(e) {
        let groupindex = e.target.dataset.groupindex;
        let index = e.target.dataset.index;
        let countMsg =
            "food[" +
            groupindex +
            "].items[" +
            index +
            "].count";
        let count = this.data.food[groupindex].items[
            index
            ].count;
        let foodCountMsg = "food[" + groupindex + "].foodCount";
        let foodCount = this.data.food[groupindex].foodCount;
        let goodsSn = this.data.food[groupindex].items[
            index
            ].goodsSn;
        count += 1;
        foodCount += 1;
        this.setData({
            [countMsg]: count, //数据的局部更新
            [foodCountMsg]: foodCount
        });
        let cart = this.data.cart;
        let hasCart = false;
        for (var i = 0; i < cart.length; i++) {
            if (cart[i].goodsSn == goodsSn) {
                hasCart = true;
                break;
            }
        }
        if (hasCart) {
            cart[i].count++;
        } else {
            cart.push({
                ...this.data.food[groupindex].items[index],
                groupindex
            });
        }
        let totalMoney = this.data.totalMoney;
        totalMoney += this.data.food[groupindex].items[
            index
            ].counterPrice;
        this.setData({
            cart: cart,
            totalMoney: totalMoney
        });
    },
    reduce(e) {
        let groupindex = e.target.dataset.groupindex;
        let index = e.target.dataset.index;
        let countMsg =
            "food[" +
            groupindex +
            "].items[" +
            index +
            "].count";
        let count = this.data.food[groupindex].items[
            index
            ].count;
        let foodCountMsg = "food[" + groupindex + "].foodCount";
        let foodCount = this.data.food[groupindex].foodCount;
        let goodsSn = this.data.food[groupindex].items[
            index
            ].goodsSn;
        count -= 1;
        foodCount -= 1;
        this.setData({
            [countMsg]: count,
            [foodCountMsg]: foodCount
        });
        let cart = this.data.cart;
        for (var i = 0; i < cart.length; i++) {
            if (cart[i].goodsSn == goodsSn) {
                if (cart[i].count == 1) {
                    cart.splice(i, 1);
                } else {
                    cart[i].count--;
                }
                break;
            }
        }
        let totalMoney = this.data.totalMoney;
        totalMoney -= this.data.food[groupindex].items[
            index
            ].counterPrice;
        this.setData({
            cart: cart,
            totalMoney: totalMoney
        });
    },
    listCart() {
        if (this.data.cart.length > 0) {
            this.setData({
                showCart: !this.data.showCart
            })
        }
    },
    selectTabItem(e) {
        if (e.target.dataset.index) {
            this.setData({
                tabIndex: e.target.dataset.index
            });
        }
    },
    preventScrollSwiper() {
        return false;
    },
    showStoreDetail() {
        this.setData({
            showModal: true
        });
    },
    closeModal(e) {
        this.setData({
            showModal: false
        });
    },

    showPopup(e) {
        this.setData({
            currFood: e.currentTarget.dataset.good,
            show: true
        })

    },

    onClose() {
        this.setData({show: false});
    },

    onClickHide() {
        this.setData({show: false});
    },
});
