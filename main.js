import Vue from 'vue'
import App from './App'
import pinyin from 'js-pinyin'
import { http } from '@/common/service.js'
import {isEmpty} from '@/common/utils.js'

Vue.prototype.$isEmpty = isEmpty
Vue.prototype.$http = http
// Vue.prototype.$oss = 'https://woneng-oss.oss-cn-hangzhou.aliyuncs.com/wxapp/moduleStore/'
Vue.prototype.$oss = 'https://woneng-oss.oss-cn-hangzhou.aliyuncs.com/wxapp/EnergySaving/'
Vue.prototype.$ossUrl = (suffix) => {
	// return `https://woneng-oss.oss-cn-hangzhou.aliyuncs.com/wxapp/moduleStore/${suffix}`
	return `https://woneng-oss.oss-cn-hangzhou.aliyuncs.com/wxapp/EnergySaving/${suffix}` // 智慧节能宝 图库
}
//测试站
// Vue.prototype.$http_url = 'http://www.modulestore.cn:64082/api/'

// Vue.prototype.$http_url = 'http://183.131.134.242:15986/api/' // 智慧节能宝 测
Vue.prototype.$http_url = 'https://admin.jienengbao.top/api' // 智慧节能宝 正

//正式站
// Vue.prototype.$http_url = 'https://www.modulestore.cn/api/'
//确保小程序onLaunch事件里的异步事件完成后，在调用页面的onload
Vue.prototype.$onLaunched = new Promise(resolve => {
    Vue.prototype.$isResolve = resolve
})
Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
