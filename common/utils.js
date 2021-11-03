const goShippingAddress = () => {
	uni.navigateTo({
		url: '/pages/my/information/detail/shippingAddress/shippingAddress'
	})
}
const goCheckoutCounter = (id) => {
	uni.redirectTo({
		url: '/pages/find/checkoutCounter/checkoutCounter?id=' + id
	})
}
const goRecruit = (id) => {
	uni.navigateTo({
		url: '/pages/find/recruit/recruitDetail/recruitDetail?id=' + id
	})
}
const goTask = (id) => {
	uni.navigateTo({
		url: '/pages/ican/taskDetail/taskDetail?taskId=' + id
	})
}
const goActivity = (id) => {
	uni.navigateTo({
		url: '/pages/contacts/soWorkbench/soInfo/soActivity/soActivityDetails/soActivityDetails?id=' + id
	})
}
const goQuestionnaire = (id) => {
	uni.navigateTo({
		url: '/pages/contacts/soWorkbench/soInfo/soQuestionnaire/questionnaireDetails/questionnaireDetails?id=' + id
	})
}
const goMaterial = (id) => {
	uni.navigateTo({
		url: '/pages/contacts/soWorkbench/soInfo/soMaterial/materialKind/materialDetails/materialDetails?id=' + id
	})
}
const gomagicBox = (id) => {
	uni.navigateTo({
		url: '/pages/find/magicBox/detail/detail?id=' + id
	})
}
const gomagicBoxTag = (name) => {
	uni.navigateTo({
		url: '/pages/find/magicBox/more/more?typeDesc=' + name
	})
}
const goThoughts = (id) => {
	uni.navigateTo({
		url: '/pages/find/attention/detail/detail?id=' + id
	})
}
const goCannerCard = (id) => {
	uni.navigateTo({
		url: '/pages/find/cannerCard/cannerCard?id=' + id
	})
}
const goSoCard = (id) => {
	uni.navigateTo({
		url: '/pages/find/soCard/soCard?id=' + id
	})
}
const getCompanyStation = (company, station) => {
	if (!isEmpty(company) && !isEmpty(station)) {
		return company + " " + station;
	} else if (!isEmpty(company)) {
		return company;
	} else if (!isEmpty(station)) {
		return station;
	} else {
		return "暂无单位职务信息";
	}
}
const isEmpty = (item) => {
	if (item == undefined || item == '' || item == null) {
		return true;
	} else {
		return false;
	}
}
const previewImage = (imgs, index) => {
	imgs.forEach((item, index) => {
		if (item.substring(0, 2) == '//') {
			imgs[index] = 'https:' + item;
		}
	})
	uni.previewImage({
		urls: imgs,
		current: index,
		longPressActions: {
			itemList: ['发送给朋友', '保存图片', '收藏'],
			success: function(data) {
				console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
			},
			fail: function(err) {
				console.log(err.errMsg);
			}
		}
	});
}

const imageError = (item, oss) => {
	if(item.substring(0, 10) == 'http:https'){
		if (oss) {
			item = oss + 'default_personAvatar.png';
			return item
		}
	}else if (item.substring(0, 2) == '//'){
		if (oss) {
			item = oss + 'default_personAvatar.png';
			return item
		}
	}else if (item.substring(item.length - 4) == '.jpg' || item.substring(item.length -
			4) == '.png' || item.substring(item.length - 4) == '.JPG' || item.substring(item.length - 4) == '.PNG' || item.substring(
			item.length - 5) == '.jpeg' || item.substring(item.length - 4) == '/132' || item.substring(item.length - 4) ==
		'/100') {
		return item
	} else {
		if (oss) {
			item = oss + 'default_personAvatar.png';
			return item
		}
	}
}
const soImageError = (item, oss) => {
	if(item.substring(0, 10) == 'http:https'){
		if (oss) {
			item = oss + 'default_soAvatar.png';
			return item
		}
	}else if (item.substring(0, 2) == '//'){
		if (oss) {
			item = oss + 'default_soAvatar.png';
			return item
		}
	}else if (item.substring(item.length - 4) == '.jpg' || item.substring(item.length -
			4) == '.png' || item.substring(item.length - 4) == '.JPG' || item.substring(item.length - 4) == '.PNG' || item.substring(
			item.length - 5) == '.jpeg' || item.substring(item.length - 4) == '/132' || item.substring(item.length - 4) ==
		'/100') {
		return item
	} else {
		if (oss) {
			item = oss + 'default_soAvatar.png';
			return item
		}
	}
}

const avatarValid = item => {
	if (!item) {
		return false
	}
	if (item.substring(item.length - 4) == '.jpg' || item.substring(item.length -
			4) == '.png' || item.substring(item.length - 4) == '.JPG' || item.substring(item.length - 4) == '.PNG' || item.substring(
			item.length - 5) == '.jpeg' || item.substring(item.length - 4) == '/132' || item.substring(item.length - 4) ==
		'/100') {
		return item
	} else {
		return false
	}
}

const dateFormat = (date, fmt) => {
	let ret;
	const opt = {
		"Y+": date.getFullYear().toString(), // 年
		"m+": (date.getMonth() + 1).toString(), // 月
		"d+": date.getDate().toString(), // 日
		"H+": date.getHours().toString(), // 时
		"M+": date.getMinutes().toString(), // 分
		"S+": date.getSeconds().toString() // 秒
		// 有其他格式化字符需求可以继续添加，必须转化成字符串
	};
	for (let k in opt) {
		ret = new RegExp("(" + k + ")").exec(fmt);
		if (ret) {
			fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
		};
	};
	return fmt;
}

export {
	goShippingAddress,
	goCheckoutCounter,
	goRecruit,
	goTask,
	goActivity,
	goQuestionnaire,
	goMaterial,
	getCompanyStation,
	isEmpty,
	previewImage,
	goCannerCard,
	goSoCard,
	goThoughts,
	gomagicBox,
	gomagicBoxTag,
	imageError,
	soImageError,
	avatarValid,
	dateFormat
}
