<template>
	<view>
		<view class="container">
			<view class="flexRowStart" style="margin-bottom: 40rpx;">
				<view class="color_303031 bold" style="margin-right: 20rpx;">
					评分
				</view>
				<view class="" style="margin-top: 10rpx;">
					<uni-rate margin="20" size="40" :value="grade" @change="rankChange"></uni-rate>
				</view>
			</view>
			<textarea v-model="value" placeholder="评论" placeholder-class="txt" class="applyTxt" maxlength="-1" auto-height/>
		</view>
		<view class="wrapBtn">
			<view class="flexRow btn">
				<view class="button" style="flex: 1;" @tap="applyMagic">
					提交
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				value:'',
				grade:5,
				id:'',
				type:''
			};
		},
		onLoad(options) {
			const {id,type} =options
			this.id =id
			this.type =type
		},
		methods:{
			rankChange(e){
				this.grade =e.value
			},
			applyMagic(){
				if(this.value==""){
					uni.showToast({
						title:"请输入内容",
						icon:"none"
					})
					return false
				}else{
					this.$http.post('dms/shop_comment/create',{
						content:this.value,
						orderId:this.id,
						type:this.type,
						rank:this.grade
					}).then(res=>{
						if(res.data.code ==1 ){
							uni.showToast({
								title:res.data.message,
								icon:"none"
							})
							return false
						}else{
							uni.showToast({
								title:"评论成功",
								icon:"none",
								duration:1000,
								success: () => {
									setTimeout(()=>{
										uni.$emit("orderRefresh",true)
										uni.navigateBack({
											delta:1
										})
									},1000)
								}
							})
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.container{
		margin: 32rpx;
	}
	.txt{
		color: #BABEC0;
	}
	.applyTxt{
		width: 100%;
	}
.wrapBtn{
		z-index: 999;
		width: 100%; 
		position: fixed;
		bottom: 0rpx;
		border-radius: 20rpx;
		display: flex;
		background-color: #FFFFFF;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		.btn{
			width:686rpx;
			margin: 24rpx 32rpx
		}
	}
</style>
