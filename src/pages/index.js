import {
    request
} from '../utils/lib/request'
import {
    showError
} from '../utils/lib/error'
import regeneratorRuntime from '../utils/third-party/runtime' // eslint-disable-line

let QQMapWX = require('../libs/qqmap-wx-jssdk.js')
const app = getApp()
Page({
    data: {
        location,
        today: [
            { img: 'images/体感.png' },
            { img: 'images/运动.png' },
            { img: 'images/旅游.png' },
            { img: 'images/紫外线.png' },
            { img: 'images/洗车.png' },
            {
                img: 'images/学习.png',
                name: '非常适宜'
            }
        ]
    },

    onLoad: function () {
    // 实例化API核心类
        this.qqmapsdk = new QQMapWX({
            key: '35EBZ-URMC5-6KRIU-QFYX4-YMDT6-FXFWI'
        })
        wx.getLocation({
            success: res => {
                // 调用接口
                this.qqmapsdk.reverseGeocoder({
                    location: {
                        latitude: res.latitude,
                        longitude: res.longitude
                    },
                    success: res => {
                        console.log(res.result.address_component.city)
                        this.setData({
                            location: res.result.address_component.city
                        })
                        // 查询当前城市天气
                        this.getWeather(res.result.address_component.city)
                    },
                    fail: res => {
                        console.log('fail')
                    }
                })
                console.log(res.latitude, res.longitude)
            }
        })

    },
    onShow: function() {
        if (app.globalData.city !== '') {
            this.setData({ location: app.globalData.city })
            this.getWeather(app.globalData.city)
        }
    },
    // 根据城市名称查询天气
    async getWeather(city) {
        let url1 = 'http://v.juhe.cn/weather/index'
        let data1 = {
            cityname: city,
            key: '26f2138cc64be1ca703fc9648f5034dd'
        }
        let that = this
        let res = await request({
            url: url1,
            data: data1,
            needLogin: false,
            method: 'GET'
        })
        console.log(res)
        if (res.data.result != null) {
            let temperature = res.data.result.sk.temp
            let weather = res.data.result.today.weather
            let wet = res.data.result.sk.humidity
            let wind = res.data.result.sk.wind_direction
            let future = res.data.result.future
            let todayt = res.data.result.today.temperature
            let today
            that.data.today[0].name = res.data.result.today.dressing_index
            that.data.today[1].name = res.data.result.today.exercise_index
            that.data.today[2].name = res.data.result.today.travel_index
            that.data.today[3].name = res.data.result.today.uv_index
            that.data.today[4].name = res.data.result.today.wash_index
            today = that.data.today
            console.log(that.data.today)
            that.setData({
                tempera: temperature,
                weather: weather,
                todayt: todayt,
                wet: wet,
                wind: wind,
                future: future,
                today: today
            })
        } else {
            showError('城市信息错误')
            wx.navigateTo({
                url: 'changeCity/changeCity',
            })
        }
    },

    // 跳转到切换城市页面
    toCity: function() {
        wx.navigateTo({
            url: 'changeCity/changeCity',
        })
    }
})
