<template>
	<view>
		<web-view :src="url"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url: ''
			};
		},
		onLoad(res) {
			// console.log(res)
			if (res.type == 'agreementEnergySaving') {
				// this.url = 'https://www.h5.modulestore.cn?type=agreementEnergySaving' // 正式站
				this.url = 'http://www.modulestore.cn:64083/?type=agreementEnergySaving' // 测试调试
			} else if (res.type == 'privacyEnergySaving') {
				// this.url = 'https://www.h5.modulestore.cn?type=privacyEnergySaving'
				this.url = 'http://www.modulestore.cn:64083/?type=privacyEnergySaving'
			} else if (res.type == 'redness') {
				// this.url = 'https://www.h5.modulestore.cn?type=previewEnergySaving'
				this.url = 'http://www.modulestore.cn:64083/?type=previewEnergySaving'
			} else if (res.type == 'userFaith') {
				// this.url = 'https://www.h5.modulestore.cn?type=userFaithEnergySaving'
				this.url = 'http://www.modulestore.cn:64083/?type=userFaithEnergySaving'
			} else if (res.type == 'questionnaireLogic') {
				this.url = 'https://www.h5.modulestore.cn/questionnaire_edit/'+ res.id +'/h5?token=' + uni.getStorageSync('userinfo').access_token
			}
		}
	}
</script>

<style lang="scss"></style>
