// pages/me/index.js
import * as userAPI from "../../api/user"
import {openAPI,settingAPI,storageAPI} from "../../utils/wx"
import {PageEx} from "../page"
const regeneratorRuntime=require("../../libs/rgen-rt.js")
const app = getApp()
const errorIcon="icon-exclamation-sign icon-error"

PageEx({

  /**
   * 页面的初始数据
   */
  data: {
    title:"个人中心",
    userInfo:{},
    hasUserInfo:false,
    addressIcon:"",
    renderLoginBtn:false,
  },
  addressIconTap(){
    if(this.data.addressIcon===errorIcon){
      this.showToast("未能设置收货地址，请稍后重试",2000)
    }
  },
  async switchTab({currentTarget}){
    let url = currentTarget.dataset.url
    let type = currentTarget.dataset.type
    console.log("switch to ",url)
    await storageAPI.setStorage("orderType",type)
    wx.switchTab({
      url,
      fail:console.log
    })
  },
  async updateUserAddress(addr){
    this.setData({
      addressIcon:"icon-spinner icon-spin"
    })
    if(addr){
      try{
        await userAPI.updateUserAddress(this.data.userInfo._id,addr)
        this.setData({
          addressIcon:"icon-ok icon-success"
        })
      }catch(e){
        console.log(e)
        this.setData({
          addressIcon:errorIcon
        })
      }
    }
  },
  inputAddrssConfirm:async function(e){
    console.log("update address",e)
    const addr= e.detail.value
    this.updateUserAddress(addr)
  },
  loginBtn:async function(){
    if(! await settingAPI.hasSetting("scope.userInfo")){
      await settingAPI.openSetting()
    }
    if(await settingAPI.hasSetting("scope.userInfo")){
      await this.login()
    }
  },
  setUserInfo(userInfo){
    app.globalData.userInfo = userInfo
    this.setData({
      userInfo:app.globalData.userInfo,
      hasUserInfo: true,
      renderLoginBtn: false
    })
    storageAPI.setStorage("userId",app.globalData.userInfo._id)
  },
  login:async function(){
    wx.showLoading()
    try{
      let auth= await openAPI.authorize("scope.userInfo")
      console.log("@login",auth)
      if(auth){
        console.log("Try login")
        let wxUserInfo = await openAPI.getUserInfo()
        let code = await openAPI.login()
      if (code.code) {
        this.setUserInfo( await userAPI.login(
          code.code,
          wxUserInfo
          )
        )
      } 
    }
  }catch(e){}
    wx.hideLoading()
    
  },
  /**t
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    if(app.globalData.userInfo){
      this.setData({
        userInfo:app.globalData.userInfo,
        hasUserInfo:true
      })
    }else{
      try{
        await openAPI.getUserInfo() //ask wx to open auth dialog
      }catch(e) {
        wx.showModal({
          title:"授权提示",
          content:"我们需要使用您的公开信息，以便为您提供服务~"
        })
      }
      if(await openAPI.authorize("scope.userInfo")){
        this.login()
      }else{
        this.setData({
          renderLoginBtn:true
        })
        console.log("Unauth")
      }
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log("hide")
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: async function () {
    let id;
    if(app.globalData.userInfo){
      id=app.globalData.userInfo._id
      this.setUserInfo(await userAPI.getUserInfo(id))
    }else{
      return loginBtn()
    }
  }

})