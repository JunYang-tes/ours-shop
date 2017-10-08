// pages/order/index.js
import * as userAPI from "../../api/user"
import {openAPI,settingAPI,storageAPI} from "../../utils/wx"
import {PageEx} from "../page"
const regeneratorRuntime=require("../../libs/rgen-rt.js")
const app = getApp()
PageEx({

  /**
   * 页面的初始数据
   */
  data: {
    type:"pending",
    orders:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.type = options.type || "pending"
    this.data.userId = app.globalData.userInfo && app.globalData.userInfo._id
    console.log("load..")
    this.setData({
      ...this.data
    })
    if(!app.globalData.userInfo){
      this.showToast("请先登录~")
    }

    this.fetchOrder()
  },
  switchType({currentTarget}){
    const type  = currentTarget.dataset.type
    this.data.type = type
    this.setData({
      type
    })
    this.fetchOrder()
  },
  async cancelOrder({currentTarget}){
    const orderId= currentTarget.dataset.orderid;
    try{
      await userAPI.cancelOrder(orderId);
    }catch(e){
      console.log(e)
      this.showToast("未能删除定单")
      return;
    }
    this.setData({
      orders:this.data.orders.filter(o=>o._id!==orderId)
    })
  },
  async fetchOrder(){
    await this.timeConsuming(async ()=>{
      if(this.data.userId){
        const orders = await userAPI.getOrders(this.data.userId,this.data.type)
        this.setData({
          orders
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function () {
    const orderType = await storageAPI.getStorage('orderType')
    console.log("order type:",orderType)
    if(orderType){
      this.data.type=orderType
    }
    this.fetchOrder()
  },
  onHide(){
    storageAPI.setStorage("orderType",this.data.type)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.fetchOrder()
  }
})