import Request from '@/utils/luch-request/index.js'

const errorCode = {
	"401": "当前操作没有权限或者登入过期",
	"403": "当前操作没有权限",
	"404": "资源不存在",
	"417": "未绑定登录账号，请使用密码登录后绑定",
	"426": "用户名不存在或密码错误",
	"429": "请求过频繁",
	"428": "验证码错误,请重新输入",
};
const getTokenStorage = () => {
	let token = 'Basic Z2RzOmdkcw=='
	try {
		token = uni.getStorageSync('token')
	} catch (e) {}
	return token
}

const http = new Request()
http.setConfig((config) => { /* 设置全局配置 */
	// config.baseUrl = 'http://192.168.0.153:8888/' // 鹏
	// config.baseUrl = 'http://192.168.0.186:9999/' // 鑫
	// config.baseUrl = 'http://192.168.0.250:8888/' //节能宝 本地测
	// config.baseUrl = 'http://183.131.134.242:15986/api/' //节能宝 测
	config.baseUrl = 'https://admin.jienengbao.top/api/' //节能宝 正式
	//测试站
	// config.baseUrl = 'http://www.modulestore.cn:64082/api/'
	//正式站
	// config.baseUrl = 'https://www.modulestore.cn/api'
	config.header = {
		...config.header,
	}
	return config
})

/**
 * 自定义验证器，如果返回true 则进入响应拦截器的响应成功函数(resolve)，否则进入响应拦截器的响应错误函数(reject)
 * @param { Number } statusCode - 请求响应体statusCode（只读）
 * @return { Boolean } 如果为true,则 resolve, 否则 reject
 */
// 有默认，非必写
http.validateStatus = (statusCode) => {
	return statusCode === 200
}

http.interceptor.request((config, cancel) => { /* 请求之前拦截器 */
	uni.showLoading({
		mask: true,
		title: '加载中'
	});
	config.header = {
		...config.header,
		Authorization: getTokenStorage()
	}
	/*
	if (!token) { // 如果token不存在，调用cancel 会取消本次请求，但是该函数的catch() 仍会执行
	  cancel('token 不存在') // 接收一个参数，会传给catch((err) => {}) err.errMsg === 'token 不存在'
	}
	*/
	return config
})

// 必须使用异步函数，注意
http.interceptor.response(async (response) => { /* 请求之后拦截器 */
	uni.hideLoading();
	if (response.data.code == 1) {
		uni.showToast({
			icon: 'none',
			title: response.data.message
		});
	}
	return response
}, (response) => { // 请求错误后执行
	uni.hideLoading();
	if (response.errMsg == 'request:fail ') {
		uni.showToast({
			icon: 'none',
			title: '网络请求失败，请检查网络连接！',
		});
	}
	for (var key in errorCode) {
		if (key == response.statusCode) {
			uni.showToast({
				icon: 'none',
				mask: true,
				title: errorCode[key],
				success() {
					if (response.statusCode == '401') {
						let pages = getCurrentPages();
						uni.setStorageSync('isGetUserInfo', true);
						console.error(uni.getStorageSync('isGetUserInfo'))
						if (pages.length < 2) {
							uni.navigateTo({
								url: '/pages/getUserInfo/getUserInfo',
								fail() {
									uni.setStorageSync('isGetUserInfo', false);
								}
							});
						} else {
							uni.redirectTo({
								url: '/pages/getUserInfo/getUserInfo',
								fail() {
									uni.setStorageSync('isGetUserInfo', false);
								}
							});
						}
					}
				}
			});
		}
	}
})

export {
	http
}
