const app = getApp()
const wxpay = require('../../utils/pay.js')
const CONFIG = require('../../config.js')
const WXAPI = require('../../wxapi/main')
Page({
  data: {

  },
  onLoad() {

  },
  onShow() {
    const token = wx.getStorageSync('token');
    if (!token) {
      app.goLoginPageTimeOut()
      return
    }
    WXAPI.checkToken(token).then(function (res) {
      if (res.code != 0) {
        wx.removeStorageSync('token')
        app.goLoginPageTimeOut()
      }
    })
    wx.checkSession({
      fail() {
        app.goLoginPageTimeOut()
      }
    })
    this.orderList()
  },

  orderList() {
    WXAPI.orderList({
      token: wx.getStorageSync('token')
    }).then(res => {
      if (res.code === 0) {
        res.data.orderList.forEach(ele => {
          ele.dingdanhao = ele.orderNumber.substring(ele.orderNumber.length - 4)
        })
        this.setData({
          orderList: res.data.orderList,
          logisticsMap: res.data.logisticsMap,
          goodsMap: res.data.goodsMap
        });
      }
    })
  },
  toPayTap: function (e) {
    const that = this;
    const orderId = e.currentTarget.dataset.id;
    let money = e.currentTarget.dataset.money;
    let _msg = '订单金额: ' + money + ' 元'

    wx.showModal({
      title: '请确认支付',
      content: _msg,
      confirmText: "确认支付",
      cancelText: "取消支付",
      success: function (res) {
        console.log(res);
        if (res.confirm) {
          that._toPayTap(orderId, money)
        } else {
          console.log('用户点击取消支付')
        }
      }
    });
  },
  _toPayTap: function (orderId, money) {
    const _this = this
    if (money <= 0) {
      // 直接使用余额支付
      WXAPI.orderPay(orderId, wx.getStorageSync('token')).then(function (res) {
        _this.onShow();
      })
    } else {
      wxpay.wxpay('order', money, orderId);
    }
  }
})