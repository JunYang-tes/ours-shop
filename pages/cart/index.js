// pages/cart/index.js
const app = getApp()
import * as userAPI from "../../api/user"
const regeneratorRuntime = require("../../libs/rgen-rt.js")
import {
  PageEx
} from "../page"

PageEx({
  /**
   * 页面的初始数据
   */
  data: {
    /**
     * {
     *  _id,name,count,price,
     * selected:boolean
     * }
     */
    cart: [],
    selected:0,
    amount:0
  },

  async fetchData() {
    try {
      this.setData({
        cart: await userAPI.getShoppingCart(this.userId)
      })
    } catch (e) {

    }
  },
  async onMakeOrder(){
    console.log("make order")
    let cart= this.data.cart.filter(c=>c.selected)
      .map(c=>({
        itemId:c._id,
        count:c.count
      }))
    if(cart.length){
      try{
        await userAPI.makeOrder(this.userId,cart)
        wx.showToast({
          title:"定单已提交，可在个人中心查看"
        })
      }catch(e){
        console.log(e)
        if(e.error && e.error.type==="store-less-then-order"){
          const data= e.error.data
          this.showToast(`${data.name}库存不足，库单量${data.store}，需求量:${data.needs}`,4000)
        }else{
          this.showToast(`未能提交定单，请稍后重试,错误消息为:${e.message}`,3000);
        }
      }
    } else {
      this.showToast("请先选中购物车中的商品",2000)
    }
  },
  onBeforeSetData(data){
    if(data.cart){
      let selected=data.cart.filter(i=>i.selected)
      data.selected = selected.length
      data.amount = selected.reduce((p,n)=>p+n.price*n.count,0)
    }
  },
  onItemTap(e) {
    const itemId = e.currentTarget.dataset.itemid
    const item = this.data.cart.find(c=>c._id===itemId)
    item.selected = !item.selected
    this.setData({
      cart:[...this.data.cart]
    })
  },
  async onDelete({
    currentTarget
  }) {
    const itemId = currentTarget.dataset.itemid
    console.log("delete:", itemId)
    try {
      await userAPI.deleteItemInCart(this.userId, itemId)
      this.setData({
        cart: this.data.cart.filter((c) => c._id !== itemId)
      })
    } catch (e) {
      console.log(e)
      this.showToast("未能删除商品，请重试")
    }
  },
  onInc({
    currentTarget
  }) {
    this.timeConsuming(async() => {
      const itemId = currentTarget.dataset.itemid
      await userAPI.addToCart(this.userId, itemId)
      const item = this.data.cart.find(c => c._id === itemId)
      item.count++
        this.setData({
          cart: [...this.data.cart]
        })
    })
  },
  onDec({
    currentTarget
  }) {
    this.timeConsuming(async() => {
      const itemId = currentTarget.dataset.itemid
      await userAPI.addToCart(this.userId, itemId, -1)
      let itemIdx = this.data.cart.findIndex(c => c._id === itemId)
      let item = this.data.cart[itemIdx]
      item.count--
        if (item.count === 0) {
          this.setData({
            cart: this.data.cart.filter(c => c._id !== itemId)
          })
        } else {
          this.setData({
            cart: [...this.data.cart]
          })
        }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(app.globalData.userInfo){
      this.userId = app.globalData.userInfo._id
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.fetchData()
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
  onPullDownRefresh: async function () {
    await this.fetchData()
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

  }
})