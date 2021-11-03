<template>
	<view class="container">
		<view class="flexRow" style="margin-bottom: 40rpx;">
			<view class="color_303031 bold">
				设置收费宝贝
			</view>
			<view style="margin-right: -16rpx;">
				<switch color="#F74437" :checked="status==true" @change="switchChangecharge" style="transform:scale(0.7)" />
			</view>
		</view>
		<view class="">
			<input :disabled="status==false" type="number" :maxlength="numStatus?'4':'10'" v-model="num" placeholder="0" @input="checkNum" style="background-color: #F4F5F6;padding: 20rpx;border-radius: 30rpx;"/>
		</view>
		<view class="color_919397" style="margin: 30rpx 0rpx 60rpx;">
			注:金额范围大于0贝，小于等于3000贝
		</view>
		<view class="button" v-if="status==true" style="width: 686rpx;" @tap="confirm">
			确定
		</view>
		<view class="button" v-else style="width: 686rpx;color: #FFFFFF;background-color: #919397;">
			确定
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				status:'',
				num:'',
				//控制大于3000后，限制最大长度
				numStatus:false,
				id:''
			};
		},
		onLoad(options) {
			// console.log(options)
			this.status =JSON.parse(options.status)
			// console.log(this.status)
			this.id=options.id
			if(this.status ==true){
				this.num = options.num
				// console.log(this.num)
			}
		},
		methods:{
			confirm(){
				if(this.num==''||this.num==0){
					uni.showToast({
						title:"请输入有效金额",
						icon:'none'
					})
				}else{
					this.$http.post(`admin/app/open/charge?cost=${this.num}&orgId=${this.id}&isCharge=true`).then(res=>{
						if(res.data.code==1){
							uni.showToast({
								title:res.data.message,
								icon:"none"
							})
						}else{
							uni.navigateBack({
								delta:1
							})
						}
					})
				}
			},
			switchChangecharge(e){
				this.status =e.detail.value
				if(this.status ==false){
					this.num =''
					this.$http.post(`admin/app/open/charge?cost=0&orgId=${this.id}&isCharge=false`).then(res=>{
						if(res.data.code==1){
							uni.showToast({
								title:res.data.message,
								icon:"none"
							})
						}else{
							uni.navigateBack({
								delta:1
							})
						}
					})
				}
			},
			checkNum(e){
				if(this.num>3000){
					this.num=3000
					this.numStatus=true
				}else if(this.num<0){
					this.num = 0
					this.numStatus=false
				}else{
					this.numStatus=false
				}
			}
		}
	}
</script>

<style lang="scss">
.container{
	padding:32rpx;
	font-size: 28rpx;
	line-height: 40rpx;
}
</style>
