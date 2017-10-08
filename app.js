//app.js
import * as userAPI from "./api/user"
import {openAPI,storageAPI} from "./utils/wx"
const regeneratorRuntime=require("./libs/rgen-rt.js")
App({
  onLaunch: async function () {
    try{
      console.log("Get user ID:")
      const userId=await storageAPI.getStorage("userId")
      console.log("userID",userId)
      this.globalData.userInfo=(await userAPI.getUserInfo(userId))
    }catch(e){

    }
  },
  globalData: {
    userInfo: null
  }
}) 