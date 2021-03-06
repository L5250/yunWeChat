import CustomPage from '../../base/CustomPage'

CustomPage({
  data: {
    goodsData: [],
  },
  onLoad: function () {

    // this.getData()

  },
  onShow: function () {
    // this.getData()
  },
  onPullDownRefresh: function () {
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
      wx.stopPullDownRefresh({
        success: (res) => {},
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