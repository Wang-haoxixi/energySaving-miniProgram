<template>
	<view>
		<web-view :src="url"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url: '',
				name: '', // 分享标题
			};
		},
		onLoad(res) {
			console.log('onload..', res)
			if (res.type == 'agreementEnergySaving') {
				// this.url = 'https://www.h5.modulestore.cn?type=agreementEnergySaving' // 正式站
				this.url = 'https://h5.jienengbao.top/?type=agreementEnergySaving' //  智慧节能宝H5 正式站
			} else if (res.type == 'privacyEnergySaving') {
				// this.url = 'https://www.h5.modulestore.cn?type=privacyEnergySaving'
				this.url = 'https://h5.jienengbao.top/?type=privacyEnergySaving'
			} else if (res.type == 'redness') {
				// this.url = 'https://www.h5.modulestore.cn?type=previewEnergySaving'
				this.url = 'https://h5.jienengbao.top/?type=previewEnergySaving'
			} else if (res.type == 'userFaith') {
				// this.url = 'https://www.h5.modulestore.cn?type=userFaithEnergySaving'
				this.url = 'https://h5.jienengbao.top/?type=userFaithEnergySaving'
			} else if (res.type == 'questionnaireLogic') {
				this.url = 'https://h5.jienengbao.top/questionnaire_edit/'+ res.id +'/h5?token=' + uni.getStorageSync('userinfo').access_token
			} else if (res.type == 'banner') {
				this.url = JSON.parse(decodeURIComponent(res.url))
				this.name = res.name
			}
		},
		onShareAppMessage(res){
			// console.log('share..', res, encodeURIComponent(JSON.stringify(this.url)))
			if (res.from === 'button') { // 来自页面内分享按钮
				// console.log(res.target)
			}
			return {
				title: this.name,
				path: `/pages/webView/webView?type=banner&url=${encodeURIComponent(JSON.stringify(this.url))}`,
			}
		},
	}
</script>

<style lang="scss"></style>
