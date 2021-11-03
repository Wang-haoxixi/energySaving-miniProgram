<template>
	<view>
		<view class="content">
			<image class="img" v-if="resultInfo.state==0 && oss" :src="oss+'ican_questionnaireResult_success.png'" mode="aspectFit"></image>
			<image class="img" v-if="resultInfo.state!=0 && oss" :src="oss+'icon_questionnaireResult_fail.png'" mode="aspectFit"></image>
			<view class="color_666769">
				<view class="contentWrap" v-if="resultInfo.state==0">
					<view>
						您已成功核销{{resultInfo.userName}}的签到码
					</view>
				</view>
				<!-- <view class="contentWrap" v-if="resultInfo.state==1">
					<view>
						{{resultInfo.userName}}的签到码已被核销，请不要重复核销
					</view>
				</view> -->
				<view class="contentWrap" v-if="resultInfo.state!=0">
					<view>
						请检查二维码是否正确或手机网络是否异常
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderNos:[],
				oss:'',
				resultInfo:''
			};
		},
		onLoad(options) {
			this.oss=this.$oss
			const {orderNos}=options
			let str = orderNos.replace('signIn','').replace('{','').replace('}','')
			console.log(str)
			this.orderNos.push(str)
			console.log(this.orderNos)
			this.$http.post('qms/conference_ticketing/write_off/scan_code',{
				orderNos:this.orderNos
			}).then(res=>{
				console.log(res)
				this.resultInfo =res.data.data
				if(this.resultInfo.state==0){
					uni.setNavigationBarTitle({
						title:"核销成功"
					})
				}else{
					uni.setNavigationBarTitle({
						title:"核销失败"
					})
				}
			})
		}
	}
</script>

<style lang="scss">
.content {
		margin: 0 auto;
		margin-top: 120rpx;
		margin-bottom: 60rpx;
		text-align: center;

		.img {
			margin-bottom: 40rpx;
			width: 150rpx;
			height: 150rpx;
		}

		.contentWrap {
			margin-bottom: 20rpx;
			font-size: 28rpx
		}
	}
</style>
