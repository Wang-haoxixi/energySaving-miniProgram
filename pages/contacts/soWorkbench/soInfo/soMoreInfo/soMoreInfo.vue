<template>
	<view class="container">
		<view class="containerWrap">
			<view class="wrap">
				<view class="flexColumn memberList" @tap="goMemberInfo(item)" v-if="index<=10" v-for="(item,index) of memberList" :key="index" :class="{active:index!=4 && index!=9}">
					<image class="avatarImg" :src="item.avatar" mode="aspectFill"></image>
					<text class="color_666769 singleEllipsis realName">{{$isEmpty(item.realName)?'':item.realName}}</text>
					<image class="admin" v-if="item.isAdmin==2 && oss" :src="oss+'pic_so_info_owner.png'"></image>
					<image class="admin" v-if="item.isAdmin==1 && oss" :src="oss+'pic_so_info_administrator.png'"></image>
				</view>
				<view class="remark" @click="goMemberManagement()">
					<text v-if="soInfo.org.isAdmin==1 || soInfo.org.isAdmin==2" class="color_2F80FF">管理组织成员</text>
					<text v-else-if="soInfo.org.isAdmin==0" class="color_2F80FF">全部</text>
					<image v-if="oss" :src="oss+'icon_so_info_members.png'"></image>
				</view>
			</view>
			<view class="flexRow orgNameInfo">
				<view class="color_919397 singleEllipsis orgName">{{$isEmpty(orgInfo.name)?'':orgInfo.name}}</view>
			</view>
		</view>
		<view class="content">
			<view class="color_303031 bold sloganTitle">
				口号
			</view>
			<view class="flexRow info" @tap="checkSlogan">
				<view v-if="orgInfo.slogan==''" class="color_919397 title">
					做APP，就上组件宝
				</view>
				<view v-else class="color_919397 singleEllipsis title">
					{{$isEmpty(orgInfo.slogan)?'':orgInfo.slogan}}
				</view>
				<image v-if="oss" :src="oss+'icon_right_gray.png'"></image>
			</view>
			<!-- <view class="flexRow info">
				<view class="color_F74437 bold title">
					编辑资料
				</view>
				<image v-if="oss" :src="oss+'icon_right_gray.png'"></image>
			</view>
			<view class="flexRow info">
				<view class="color_F74437 bold title">
					设置
				</view>
				<image v-if="oss" :src="oss+'icon_right_gray.png'"></image>
			</view>
			<view class="flexRow info">
				<view class="color_303031 bold title">
					通知
				</view>
				<image v-if="oss" :src="oss+'icon_right_gray.png'"></image>
			</view> -->
		</view>
	</view>
</template>

<script>
	import {imageError} from '@/common/utils.js'
	export default {
		data() {
			return {
				memberList:[],
				soInfo:{},
				orgId:-1,
				slogan:'',
				oss:'',
				orgInfo:{}
			}
		},
		onLoad(options) {
			const {id}=options
			// console.log(id)
			this.oss=this.$oss
			this.orgId=id
			// console.log(this.orgId)
			this.$http.get(`admin/app/org/workplace/${id}`).then(res=>{
				// console.log(res)
				this.soInfo=res.data.data
				this.orgInfo=res.data.data.org
				this.slogan=this.soInfo.org.slogan
				// console.log(this.soInfo)
			})
			this.$http.get('admin/app/user/page',{
				params:{
					orgId:id
				}
			}).then(res=>{
				// console.log(res.data.data.result.records)
				// console.log(res)
				this.memberList=res.data.data.result.records
				this.memberList.forEach(item=>{
					item.avatar=imageError(item.avatar,this.oss)
				})
			})
		},
		methods: {
			goMemberInfo(item){
				uni.navigateTo({
					url:`/pages/find/cannerCard/cannerCard?id=${item.userId}`
				})
			},
			goMemberManagement(){
				uni.navigateTo({
					url:`/pages/contacts/soWorkbench/soInfo/soMoreInfo/memberManagement/memberManagement?orgId=${this.orgId}&isAdmin=${this.soInfo.org.isAdmin}`
				})
			},
			checkSlogan(){
				uni.navigateTo({
					url:`/pages/contacts/soWorkbench/soInfo/soMoreInfo/checkSlogan/checkSlogan?slogan=${this.slogan}`
				})
			}
		}
	}
</script>

<style lang="scss">
	.container{
		margin:40rpx;
		width: 670rpx;
		.containerWrap{
			.wrap{
				display: flex;
				flex-wrap: wrap;
				.memberList{
					position: relative;
					width:110rpx; 
					margin-bottom: 30rpx;
					.avatarImg{
						margin-bottom:10rpx;
						width: 110rpx;
						height: 110rpx;
						border-radius: 20rpx;
					}
					.realName{
						font-size:24rpx;
						width: 110rpx;
						text-align: center;
					}
					.admin{
						width: 110rpx;
						height: 32rpx;
						position: absolute;
						top: 78rpx;
					}
				}
				.remark{
					padding-top:30rpx;
					padding-bottom: 90rpx; 
					width: 100%; display: flex;
					justify-content: center;
					align-items: center;
					font-size: 24rpx;
					image{
						width: 44rpx;
						height: 44rpx;
					}
				}
			}
			.orgNameInfo{
				font-size: 28rpx;
				padding-bottom:24rpx;
				border-bottom: 0.3rpx solid #EFF0F1;
				.orgName{
					width: 100%;
				}
			}
		}
		.content{
			.sloganTitle{
				padding-top: 44rpx; 
				font-size: 28rpx;
			}
			.info{
				padding-top: 48rpx;
				padding-bottom: 24rpx;
				border-bottom: 0.3rpx solid #EFF0F1;
				font-size: 28rpx;
				.slogan{
					flex: 1;
					text-align: left;
				}
				image{
					width: 44rpx;
					height: 44rpx;
					margin-right: -16rpx;
				}
			}
		}
	}
	.active{
		margin-right: 30rpx;
	}
</style>
