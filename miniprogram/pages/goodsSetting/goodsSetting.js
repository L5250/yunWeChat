import CustomPage from '../../base/CustomPage'

CustomPage({
  data: {
    goodsData: [],
  },
  onLoad: function () {

    // this.getData()

    this.setData({
      // icon: base64.icon20,
      slideButtons: [{
        text: '普通',
        src: '/page/weui/cell/icon_love.svg', // icon的路径
      }, {
        text: '普通',
        extClass: 'test',
        src: '/page/weui/cell/icon_star.svg', // icon的路径
      }, {
        type: 'warn',
        text: '警示',
        extClass: 'test',
        src: '/page/weui/cell/icon_del.svg', // icon的路径
      }],
    });

  },

  slideButtonTap(e) {
    console.log('slide button tap', e.detail)
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