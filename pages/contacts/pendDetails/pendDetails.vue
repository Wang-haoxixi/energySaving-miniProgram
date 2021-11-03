<template>
	<view>
		<view class="wrapContainer">
			<view class="flexRow" style="margin-bottom: 60rpx;">
				<view class="flexRowStart">
					<view class="">
						<image :src="avatar" class="avatarImg"></image>
					</view>
					<view class="">
						<view class="color_303031 name">
							{{$isEmpty(name)?'':name}}
						</view>
						<view class="color_919397 company">
							{{getCompanyStation(company,station)}}
						</view>
					</view>
				</view>
				<view class="color_BABEC0 time">
					{{$isEmpty(time)?'':time}}
				</view>
			</view>
			<view class="content">
				<textarea :value="text" class="txt"/>
				<text class="color_919397 txtTitle">附言</text>
			</view>
			<view class="flexRowStart">
				<view class="button cancelBtn" @tap="cancel()">
					拒绝
				</view>
				<view class="button passBtn" style="width: 320rpx;" @tap="pass()">
					同意
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {getCompanyStation} from "@/common/utils.js"
	export default {
		data() {
			return {
				id:'',
				time:'',
				text:'',
				name:'',
				avatar:'',
				company:'',
				station:'',
				userId:''
			};
		},
		onLoad(options) {
			const {id,time , text , type ,userId} = options
			this.$http.get('admin/app/card/' + userId).then(res=>{
				console.log(res)
				this.avatar = res.data.data.card.avatar
				this.company= res.data.data.card.company
				this.station =res.data.data.card.station
				this.name = res.data.data.card.realName
			})
			this.text=text
			this.time=time.substring(0,time.length-3)
			this.id =id
			if(type == 10041){
				uni.setNavigationBarTitle({
					title:"好友申请"
				})
			}else if(type == 10079){
				uni.setNavigationBarTitle({
					title:"+组织申请"
				})
			}else if(type == 10084){
				uni.setNavigationBarTitle({
					title:"拜师申请"
				})
			}else if(type == 10052){
				uni.setNavigationBarTitle({
					title:"组织邀请"
				})
			}else if(type == 10077){
				uni.setNavigationBarTitle({
					title:"组织管理者邀请"
				})
			}else if(type == 10198){
				uni.setNavigationBarTitle({
					title:"申请加入任务"
				})
			}
		},
		methods:{
			cancel(){
				this.$http.get(`ims/sys_msg/reject/${this.id}`).then(res=>{
					if(res.data.code ==0){
						uni.showToast({
							title:"已拒绝该请求",
							icon:"none",
							duration:1000,
							success: () => {
								setTimeout(()=>{
									uni.$emit('splice',this.id)
									uni.navigateBack({
										delta:1
									})
								},1000)
							}
						})
					}else{
						uni.showToast({
							title:res.data.message,
							icon:"none",
							duration:1000,
						})
					}
				})
			},
			pass(){
				this.$http.get(`ims/sys_msg/pass/${this.id}`).then(res=>{
					if(res.data.code ==0){
						uni.showToast({
							title:"已同意该请求",
							icon:"none",
							duration:1000,
							success: () => {
								setTimeout(()=>{
									uni.$emit('splice',this.id)
									uni.navigateBack({
										delta:1
									})
								},1000)
							}
						})
					}else{
						uni.showToast({
							title:res.data.message,
							icon:"none",
							duration:1000,
						})
					}
				})
			},
			getCompanyStation
		}
	}
</script>

<style lang="scss" scoped>
.wrapContainer{
	margin: 60rpx 40rpx;
	.avatarImg{
		width: 92rpx;
		height: 92rpx;
		border-radius: 50%;
		margin-right: 24rpx;
	}
	.name{
		font-size: 28rpx;
		line-height: 40rpx; 
		margin-bottom: 10rpx;	
	}
	.company{
		font-size: 22rpx;
		line-height: 32rpx;
	}
	.time{
		font-size: 20rpx;
		line-height: 28rpx;
	}
	.content{
		position: relative;
		margin-bottom: 60rpx;
	}
	.txt{
		background-color: #F5f7f8;
		border-radius: 30rpx;
		color: #666769;
		font-size: 28rpx;
		line-height: 48rpx;
		padding: 84rpx 30rpx;
	}
	.txtTitle{
		font-size: 24rpx;
		line-height: 34rpx;
		position: absolute;
		top: 30rpx;
		left: 30rpx;
	}
	.cancelBtn{
		width: 316rpx;
		background: #FFFFFF;
		color: #F74437;
		border: 2rpx solid #F74437;
		margin-right: 30rpx;
	}
}
</style>
