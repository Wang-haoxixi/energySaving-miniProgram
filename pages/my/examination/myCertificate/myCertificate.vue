<template>
	<view class="container">
		<image :src="url[0]" @tap="previewImage(url,0)" mode="aspectFit" style="margin-bottom: 60rpx;width: 100%;"></image>
		<button open-type="share">分享我的证书</button>
	</view>
</template>

<script>
	import {
		previewImage,
	} from '@/common/utils.js';
	export default {
		data() {
			return {
				url:[],
				imgUrl:'',
				id:'',
				certificateName:''
			};
		},
		onLoad(options) {
			const{imgUrl,id,certificateName} = options
			this.url.push(imgUrl)
			this.imgUrl =imgUrl
			this.id=id
			this.certificateName=certificateName
		},
		onShareAppMessage(res) {
			this.$http.post('admin/mark/save',{
				section: 'examCertificate', //板块
				relationId: this.id,
				// #ifdef  MP-WEIXIN
				markSource: 'wechat',//留痕来源
				// #endif
				// #ifdef  MP-QQ
				markSource: 'qq',
				// #endif
				markTarget: 'wechat',//留痕目标
				markType: 'share',//留痕类型
				remark: '',
			}).then(res=>{
				console.log(res)
			});
			if (res.from === 'button') { // 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: '我分享了【' + this.certificateName + '】证书，快去看看吧',
				path: '/pages/my/examination/myCertificate/myCertificate?imgUrl=${this.imgUrl}&id=${this.id}&certificateName=${this.certificateName}'
			}
		},
		onShareTimeline(res) {
			this.$http.post('admin/mark/save',{
				section: 'examCertificate', //板块
				relationId: this.id,
				// #ifdef  MP-WEIXIN
				markSource: 'wechat',//留痕来源
				// #endif
				// #ifdef  MP-QQ
				markSource: 'qq',
				// #endif
				markTarget: 'moments',//留痕目标
				markType: 'share',//留痕类型
				remark: '',
			}).then(res=>{
				console.log(res)
			});
			if (res.from === 'button') { // 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: '我分享了【' + this.certificateName + '】证书，快去看看吧',
				imageUrl: this.imgUrl
			}
		},
		methods:{
			previewImage
		}
	}
</script>

<style lang="scss">
.container{
	padding: 40rpx;
}
::v-deep button{
	width: 292rpx;
	background-color: #F74437;
	font-size: 28rpx;
	line-height: 40rpx;
	font-weight: bold;
	border-radius: 44rpx;
	color: #FFFFFF;
	padding: 16rpx 62rpx;
}
</style>
