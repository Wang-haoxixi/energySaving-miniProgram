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
				this.url = 'https://h5.jienengbao.top/?type=agreementEnergySaving' //  节能保H5 正式站
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
			}
		}
	}
</script>

<style lang="scss"></style>
