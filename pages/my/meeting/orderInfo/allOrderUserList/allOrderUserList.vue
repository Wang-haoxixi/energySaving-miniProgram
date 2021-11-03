<template>
	<view class="container">
		<view class="content">
			<view class="flexColumnStart" v-for="(item,index) of userList" :key="index" :class="index<userList.length-1?'borderBottom':''" style="padding:30rpx 0rpx 40rpx;" @tap="goDetails(item)">
				<view class="userIcon">
					联系人{{index+1}}
				</view>
				<view class="flexRow" style="width: 100%;">
					<view class="">
						<view class="color_303031 name">
							{{item.name}}
						</view>
						<view class="color_666769 phone">
							{{item.phone}}
						</view>
					</view>
					<image v-if="oss" :src="oss+'icon_right_gray_gray.png'" class="rightImg"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id:'',
				oss:'',
				userList:[]
			};
		},
		onLoad(options) {
			this.oss=this.$oss
			const{id}=options
			this.id= id
			this.$http.get('qms/conference_enrole_form/contacts_simple',{
				params:{
					enroleId:id
				}
			}).then(res=>{
				this.userList=res.data.data
				console.log(this.userList)
			})
		},
		methods:{
			goDetails(item){
				uni.navigateTo({
					url:`/pages/my/meeting/orderInfo/allOrderUserList/orderUserInfoDetails/orderUserInfoDetails?id=${item.id}`
				})
			}
		}	
	}
</script>

<style lang="scss">
	.rightImg{
		width: 48rpx;
		height: 48rpx;
		margin-right: -14rpx;
	}
	.name{
		font-size: 32rpx;
		line-height: 44rpx;
		margin-bottom: 6rpx;
	}
	.phone{
		font-size: 28rpx;
		line-height: 40rpx;
	}
	.userIcon{
		background-color: #F4F5F6;
		padding: 10rpx 24rpx;
		border-radius:10rpx;
		font-size: 24rpx;
		margin-bottom:30rpx;
	}
	page{
		background-color: #F5f7f8;
	}
.container{
	padding: 32rpx;
}
.content{
	background-color: #FFFFFF;
	padding: 0rpx 32rpx;
	border-radius: 30rpx;
}
.borderBottom{
		border-bottom: 2rpx solid #EFF0F1;
	}
</style>
