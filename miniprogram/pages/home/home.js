const app = getApp()
Page({
  data: {
    goodsData: [],
  },
  onLoad: function () {

    this.getData()

  },
  onShow: function () {
    // this.getData()
  },
  onPullDownRefresh: function () {
    wx.startPullDownRefresh()
    this.getData()
  },

  getData: function () {
    console.log(111);
    // 获取数据
    wx.cloud.callFunction({
      name: "goods",
      data: {
        action: "getData"
      }
    }).then(res => {
      console.log(res);
      this.setData({
        goodsData: res.result.data
      })
    }).catch(err => {
      console.log(err);
    })
  },

  goDetail: (e) => {
    console.log(e);
    wx.navigateTo({
      url: `../detail/detail?id=${e.currentTarget.dataset["id"]}`
    })
  }
})