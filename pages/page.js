const regeneratorRuntime = require("../libs/rgen-rt.js")

export function PageEx(opt) {
  const toastDuration = opt.toastDuration || 1000
  let toastTimer1, toastTimer2;

  function showToast(message, duration) {
    this.setData({
      pageExToast: message,
      pageExToastEaseOut: false,
      pageExToastShow: true,
    })
    clearTimeout(toastTimer1)
    clearTimeout(toastTimer2)
    toastTimer1 = setTimeout(() => this.setData({
      pageExToastEaseOut: true
    }), duration || toastDuration)
    toastTimer2 = setTimeout(() => this.setData({
      pageExToastShow: false
    }), (duration || toastDuration) + 500)
  }

  function showLoading() {
    this.setData({
      pageExLoading: true
    })
  }

  function hideLoading() {
    this.setData({
      pageExLoading: false
    })
  }
  async function timeConsuming(fn) {
    this.showLoading()
    try {
      await fn()
    } catch (e) {

    }
    this.hideLoading()
  }

  function monkey(fn, before, after) {
    return async function (...args) {
      let error
      try{
        if (before) {
          await before.call(this, ...args)
        }
      }catch(e){
        error=e
      }
      fn.call(this, ...args)
      if(error){
        throw(error)
      }
      if (after) {
        after.call(this, ...args)
      }
    }
  }


  const page = Page({
    ...opt,
    onLoad(opts) {
      this.showToast = showToast
      this.showLoading = showLoading
      this.hideLoading = hideLoading
      this.timeConsuming = timeConsuming
      this.setData = monkey(this.setData, async(data) => {
        if (opt.onBeforeSetData) {
          await opt.onBeforeSetData.call({
            ...this,
            setData() {
              console.warn("Don't call setData in onBeforeSetData")
            }
          }, data)
        }
      })
      console.log("this is", this)
      if (opt.onLoad) {
        opt.onLoad.call(this, opts)
      }
    },
    async onPullDownRefresh() {
      if (opt.onPullDownRefresh) {
        this.showLoading()
        this.setData({
          pageExRefresh: true,
        })
        let msg = "已刷新"
        try {
          await opt.onPullDownRefresh.call(this)
        } catch (e) {
          msg = "未刷新，稍后重试"
        }
        wx.stopPullDownRefresh()
        this.setData({
          pageExRefresh: false
        })
        this.hideLoading()
        this.showToast(msg)
      }
    }
  })
  console.log(page)
  return page
}