// pages/addGoods/addGoods.js
import CustomPage from '../../base/CustomPage'

CustomPage({

  /**
   * 页面的初始数据
   */
  data: {
    files: [],
    error: '',
    formData: {

    },
    rules: [{
      name: "desc",
      rules: {
        maxlength: 500,
        message: '描述最多500个字'
      }
    }, {
      name: 'name',
      rules: {
        required: true,
        message: '商品名称为必填项'
      },
    }, {
      name: 'price',
      rules: [{
        required: true,
        message: '商品名称为必填项'
      }, {
        range: [0, 9999999],
        message: '商品价格最大值为9999999，最小值为0'
      }],
    }, {
      name: 'amount',
      rules: [{
        required: true,
        message: '库存数量为必填项'
      }, {
        range: [0, 9999999],
        message: '商品价格最大值为9999999，最小值为0'
      }]
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.login().then(res => {
      console.log(res)
    })
    this.setData({
      selectFile: this.selectFile.bind(this),
      uplaodFile: this.uplaodFile.bind(this)
    })

  },
  formInputChange(e) {
    const {
      field
    } = e.currentTarget.dataset
    this.setData({
      [`formData.${field}`]: e.detail.value
    })
  },
  submitForm() {
    this.selectComponent('#form').validate((valid, errors) => {
      if (!valid) {
        const firstError = Object.keys(errors)
        if (firstError.length) {
          this.setData({
            error: errors[firstError[0]].message
          })
        }
      } else {

        const priceType = Number(this.data.formData.price) || false
        const amountType = Number(this.data.formData.price) || false

        if (typeof (priceType) !== "number") {
          this.setData({
            error: "商品价格请输入正确数字！"
          })
          return
        }
        if (typeof (amountType) !== "number") {
          this.setData({
            error: "库存数量请输入正确数字！"
          })
          return
        }
        if (this.data.files && this.data.files.length <= 0) {
          this.setData({
            error: "请至少上传一张商品图片！"
          })
          return
        }
        const params = {
          name: this.data.formData.name,
          price: Number(this.data.formData.price),
          amount: Number(this.data.formData.amount),
          fileList: this.data.files
        }

        console.log(params);
        wx.showLoading({
          title: '上传中...',
        })

        let tasks = []
        let fileCloudList = []
        params.fileList.map(item => {
          console.log(item);
          const promise = wx.cloud.uploadFile({
            cloudPath: 'goodsImage/' + Date.now() + item.url.match(/\.[^.]+?$/)[0], // 上传至云端的路径
            filePath: item.url, // 小程序临时文件路径
          }).then(res => {
            console.log(res.fileID)
            fileCloudList.push(res.fileID)
            tasks.push(promise)
          })
        })

        Promise.all(tasks).then(res => {
          console.log(params, fileCloudList);
          wx.hideLoading()
          return
          wx.cloud.callFunction({
            name: "goods",
            data: {
              action: "add",
              ...params,
              fileList: fileCloudList
            }
          }).then(res => {
            console.log(res)
            wx.showToast({
              title: '新增商品成功'
            })
          })
        })
        return
      }
    })
  },

  //选择图片
  chooseImage: function (e) {
    console.log(e);
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log(res);
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
      }
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  selectFile(files) {
    console.log('files', files)
    // 返回false可以阻止某次文件上传
  },
  uplaodFile(files) {
    console.log('upload files', files)
    // 文件上传的函数，返回一个promise
    return new Promise((resolve, reject) => {
      // setTimeout(() => {
      //   reject('some error')
      // }, 1000)
      resolve({
        urls: files.tempFilePaths
      })
    })
  },
  uploadError(e) {
    console.log('upload error', e.detail)
  },
  uploadSuccess(e) {
    console.log('upload success', e.detail)
    let data = [...this.data.files]
    e.detail.urls.map(item => {
      data.push({
        url: item
      })
    })
    console.log(data);
    this.setData({
      files: data
    });
  },
  uploadDelete(e) {
    let data = [...this.data.files]
    data.splice(e.detail.index, 1)
    console.log(data);
    this.setData({
      files: data
    });
  }
})