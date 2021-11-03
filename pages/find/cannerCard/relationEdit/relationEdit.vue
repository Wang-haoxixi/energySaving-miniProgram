<template>
	<view class="container">
		<view class="flexRowStart info">
			<image class="imgAvatar" :src="data.avatar" mode="aspectFill"></image>
			<view class="content">
				<view class="color_303031 realName">
					{{$isEmpty(data.realName)?'':data.realName}}
				</view>
				<view class="color_919397 company">
					{{getCompanyStation(data.company,data.station)}}
				</view>
			</view>
		</view>
		<view class="remark">
			<textarea v-model="valueInfo" />
			<text class="color_919397 mark">附言</text>
		</view>
		<view class="button sendBtn" @tap="confirmAdd()">
			发送
		</view>
	</view>
</template>

<script>
	import {
		getCompanyStation
	} from '@/common/utils.js';
	export default {
		data() {
			return {
				data:{},
				name:'',
				valueInfo:''
			};
		},
		onLoad(options) {
			const {id,name}=options
			this.name=name
			console.log(id)
			if(name=='friend'){
				uni.setNavigationBarTitle({
					title:"添加好友"
				})
			}else if(name == 'master'){
				uni.setNavigationBarTitle({
					title:"拜师"
				})
			}
			this.$http.get('admin/app/card/'+ id).then(res=>{
				// console.log(res)
				this.data=res.data.data.card
			})
		},
		methods:{
			getCompanyStation,
			confirmAdd(){
				if(this.name=='friend'){
					this.$http.post('admin/friend/create',{
						remarks:this.valueInfo,
						receiveId:this.data.userId
					}).then(res=>{
						// console.log(res)
						if(res.data.code==0){
							uni.showToast({
								title:'发送请求成功',
								icon:"success",
								duration:1000,
								success() {
									setTimeout(()=>{
										uni.navigateBack({
											delta:1
										})
									},1000)
								}
							})
						}else{
							uni.showToast({
							    title: res.data.message,
							    icon:'none'
							});
						}
					})
				}else if(this.name=='master'){
					this.$http.post('admin/mentor/apprentice',{
						remarks:this.valueInfo,
						masterId:this.data.userId
					}).then(res=>{
						// console.log(res)
						if(res.data.code==0){
							uni.showToast({
								title:'发送请求成功',
								icon:"success",
								duration:1000,
								success() {
									setTimeout(()=>{
										uni.navigateBack({
											delta:1
										})
									},1000)
								}
							})
						}else{
							uni.showToast({
							    title: res.data.message,
							    icon:'none'
							});
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss">
.container{
	padding: 60rpx 40rpx;
	.info{
		margin-bottom: 64rpx;
		.imgAvatar{
			margin-right: 24rpx;
			width: 92rpx;
			height: 92rpx;
			border-radius: 50%;
		}
		.content{
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			.realName{
				font-size: 28rpx;
				line-height: 40rpx;
				margin-bottom: 10rpx;
			}
			.company{
				font-size: 22rpx;
				line-height: 32rpx;
			}
		}
	}
	.remark{
		position: relative;
		margin-bottom: 60rpx;
		textarea{
			border-radius: 30rpx;
			padding: 84rpx 30rpx;
			background-color: #F4F5F6;
			width: 610rpx;
			color: #666769;
			font-size: 28rpx;
			line-height: 48rpx;
		}
		.mark{
			position: absolute;
			top: 30rpx;
			left: 30rpx;
			font-size: 24rpx;
			line-height: 34rpx;
		}
	}
	.sendBtn{
		width: 670rpx;
	}
}
</style>
