import {promisify,booleanPromisify} from "./index.js"
const authorize=booleanPromisify(wx.authorize)
export const openAPI={
  login:promisify(wx.login,wx),
  checkSession:booleanPromisify(wx.checkSession),
  authorize:(scope)=>authorize({scope}),
  getUserInfo:promisify(wx.getUserInfo)
}
export const settingAPI={
    openSetting:promisify(wx.openSetting),
    getSetting:promisify(wx.getSetting),
    hasSetting: (scope)=>{
       return settingAPI.getSetting()
            .then(({authSetting})=>authSetting[scope])
    }
}
const getStorage = promisify(wx.getStorage)
const setStorage = promisify(wx.setStorage)
export const storageAPI={
  /**
   * key:string => string
   */
  getStorage:(key)=>getStorage({
    key
  }).then(res=>res.data).catch(()=>undefined),
  /**
   * key:string,data:string/object
   */
  setStorage:(key,data)=>setStorage({
    key,
    data
  })
}