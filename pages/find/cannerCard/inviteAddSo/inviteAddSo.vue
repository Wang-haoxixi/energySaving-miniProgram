<template>
	<view class="container">
		<view class="search">
			<image v-if="oss" class="img" :src="oss+'icon_search_gray.png'"></image>
			<input placeholder="搜索" placeholder-class="inputDefault" @input="search" v-model="searchText"/>
		</view>
		<view class="soList" v-for="(item,index) of showList" :key="index" @tap="chooseSo(item)">
			<view class="flexRow">
				<image class="imgAvatar" :src="soImageError(item.avatar,oss)" mode="aspectFill"></image>
				<view class="content singleEllipsis name">
					{{$isEmpty(item.name)?'':item.name}}
				</view>
				<image class="joinImg" v-if="item.isJoinShow==1 && oss" :src="oss+'icon_inviteAddSo_soAvatar.png'"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		soImageError
	} from '@/common/utils.js'
	export default {
		data() {
			return {
				searchText: '',
				soList:[],
				showList:[],
				id:'',
				oss:''
			};
		},
		onLoad(options) {
			const{id}=options
			this.oss=this.$oss
			this.id=id
			this.$http.get('admin/app/card/' + options.id).then(res => {
				// console.log(res)
				this.soList = res.data.data.card.currentUserOrg;
				this.showList=this.soList
				// console.log(this.showList)
			});
		},
		methods:{
			soImageError,
			search() {
				this.showList = this.soList.filter(item => {
					return item.name.includes(this.searchText)
				})
			},
			chooseSo(item){
				if(item.isJoinShow==1){
					uni.showToast({
						title:"该成员已在此组织",
						icon:"none",
						duration:1000
					})
				}else if(item.isJoinShow==0){
					uni.showModal({
						content:"确认发出+组织邀请吗",
						cancelColor:'#666769',
						confirmColor:"#F74437",
						success: (res) => {
							if (res.confirm) {
								this.$http.post('admin/org/invite',{
									orgId:item.orgId,
									userId:this.id
								}).then(res=>{
									// console.log(res)
									if(res.data.code==0){
										uni.showToast({
											title:"邀请成功",
											icon:"success",
											duration:1000,
											success: () => {
												setTimeout(()=>{
													uni.navigateBack({
														delta:1
													})
												},1000)
											}
										})
									}
								})
							} else if (res.cancel) {
								return false
							}
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.inputDefault {
		font-size: 28rpx;
		color: #919397;
	}
	
	input {
		flex: 1;
		font-size: 28rpx;
		padding: 0 14rpx;
		color: #666769;
	}
.container{
	padding:0 32rpx;
	.search{
		margin: 16rpx 0;
		padding: 18rpx 32rpx;
		border-radius: 60rpx;
		background-color: #F5f7f8;
		display: flex;
		flex-direction: row;
		align-items: center;
		.img{
			height: 32rpx;
			width: 32rpx;
		}
	}
	.soList{
		margin-bottom:48rpx;
		.imgAvatar{
			height: 92rpx;
			width: 92rpx;
			border-radius: 50%;
		}
		.name{
			margin-left: 24rpx;
			flex: 200rpx 1 1;
		}
		.joinImg{
			margin-left: 20rpx;
			height: 32rpx;
			flex: 32rpx 0 0;
		}
	}
}
</style>
