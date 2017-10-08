//index.js
//获取应用实例
const app = getApp()
import * as itemsAPI from "../../api/items"
import * as userAPI from "../../api/user"
const regeneratorRuntime=require("../../libs/rgen-rt.js")
const data = {
    motto: 'Hello World',
    userInfo: {},
    itemsLoading:true,
    items:{
      loading:true,
      count:0,
      data:[]
    },
    recomendations:{
      loading:true,
      count:0,
      data:[]
    },
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
}
import {PageEx} from "../page"
PageEx({
  data,
  async onCartTap(e){
    let itemId = e.currentTarget.dataset.id
    console.log("add to cart",itemId)
    if(app.globalData.userInfo){
      try{
        await userAPI.addToCart(app.globalData.userInfo._id,itemId)
        this.showToast("已添加~",500)
      }catch(e){
        console.log(e)
        this.showToast("未能添加~")
      }
    }else{
      this.showToast("需要登陆")
      wx.navigateTo({
        url:"/pages/me/index"
      })
    }
  },

  fetchData(){
    return Promise.all( [itemsAPI.getRecommandation(3)
      .then(ret=>this.setData({
        recomendations:{
          loading: false,
          count: ret.length,
          data: ret
        }
      })),
    itemsAPI.getAll()
      .then(ret=>this.setData({
        items:{
          loading: false,
          ...ret
        }
      }))]
    )
  },

  onLoad: function () {
    this.fetchData()
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
   onPullDownRefresh(){
    console.log("refreash")

    return this.fetchData()

  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
