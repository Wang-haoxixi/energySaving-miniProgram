<template>
	<view class="">
		<view class="talk">
			<view class="talk-item" v-for="(item,index) in thoughts.records" :key="index" @tap="goThoughtsDetails(item)">
				<view class="talk-item-title flexRow">
					<view class="flexRowStart">
						<image class="avatar" :src="item.avatar" mode="aspectFill" @tap.stop="goCannerCard(item)"></image>
						<view class="talk-item-title-text">
							<view class="name color_303031 bold talk-item-title-text-name">{{ $isEmpty(item.userName)?'':item.userName }}</view>
							<view class="color_919397" style="font-size: 24rpx;line-height: 34rpx;margin-top: 10rpx;">{{$isEmpty(item.createTime)?'':item.createTime}}</view>
						</view>
					</view>
					<view class="" @tap.stop="deleteThought(item,index)">
						<image v-if="userId == id && oss" :src="oss+'icon_delect.png'" mode="" style="width: 44rpx;height: 44rpx;"></image>
					</view>
				</view>
				<view v-if="item.content" class="talk-text quadraEllipsis color_303031">
					{{ $isEmpty(item.content)?'':item.content }}
				</view>
				<view v-if="item.images.length == 1" class="talk-imgs">
					<image mode="aspectFill" class="talk-img-single"
					 :src="item.images[0]" @tap.stop="previewImage(item.images,0)"></image>
				</view>
				<view v-else class="talk-imgs">
					<image mode="aspectFill" class="talk-img"
					 :src="item2" v-for="(item2,index2) in item.images" :key="index2" @tap.stop="previewImage(item.images,index2)"></image>
				</view>
				<view class="attachContent" v-if="item.attach" @tap.stop="goRelationDetails(item)">
					<view class="flexRowStart wrapAttach" style="background-color: #F4F5F6">
						<image class="attachImg" v-if="item.attach.type== 'material' && oss" :src="oss+'icon_icanThought_material.png'"></image>
						<image class="attachImg" v-else-if="item.attach.type== 'activity' && oss" :src="oss+'icon_icanThought_activity.png'"></image>
						<image class="attachImg" v-else-if="item.attach.type=='task' && oss" :src="oss+'icon_thoughtsRelation_task.png'"></image>
						<image class="attachImg" v-else-if="item.attach.type=='questionnaire' && oss" :src="oss+'icon_icanThought_questionnaire.png'"></image>
						<image class="attachImg" v-else-if="item.attach.type =='products' || item.attach.type == 'program' && oss" :src="oss+'icon_icanThought_magicBox.png'"></image>
						<view class="attachInfo">
							<view class="color_303031 bold" v-if="item.attach.type== 'material'">
								材料
							</view>
							<view class="color_303031 bold" v-else-if="item.attach.type== 'activity'">
								活动
							</view>
							<view class="color_303031 bold" v-else-if="item.attach.type=='task'">
								任务
							</view>
							<view class="color_303031 bold" v-else-if="item.attach.type=='questionnaire'">
								问卷
							</view>
							<view class="color_303031 bold" v-else-if="item.attach.type =='products' || item.attach.type == 'program' ">
								魔方
							</view>
							<view class="singleEllipsis color_666769 attachTitle">
								{{item.attach.title}}
							</view>
						</view>
					</view>
				</view>
				<view class="reply" v-if="!$isEmpty(item.transmittedThoughts)">
					<!-- <view class="talk-item-title">
						<image class="avatar" :src="item.transmittedThoughts.avatar"></image>
						<view class="talk-item-title-text">
							<view class="name">{{ item.transmittedThoughts.userName}}</view>
						</view>
					</view> -->
					<view class="talk-text quadraEllipsis">
						<text @tap.stop="goCannerCard(item.transmittedThoughts)" class="color_2F80FF" style="margin-right: 20rpx;">@{{item.transmittedThoughts.userName}}:</text> {{item.transmittedThoughts.content}}
					</view>
					<view v-if="item.transmittedThoughts.images.length == 1" class="talk-imgs">
						<image mode="aspectFill" class="talk-img-single" :src="item.transmittedThoughts.images[0]" @tap.stop="previewImage(item.transmittedThoughts.images,0)"></image>
					</view>
					<view v-else class="talk-imgs">
						<image mode="aspectFill" class="talk-img" :src="item2" v-for="(item2,index2) in item.transmittedThoughts.images"
						 :key="index2" @tap.stop="previewImage(item.transmittedThoughts.images,index2)"></image>
					</view>
					<view class="attachContent" v-if="item.transmittedThoughts.attach"  @tap.stop="goRelationDetails(item.transmittedThoughts)">
						<view class="flexRowStart wrapAttach" style="background-color: #FFFFFF;">
							<image class="attachImg" v-if="item.transmittedThoughts.attach.type== 'material' && oss" :src="oss+'icon_icanThought_material.png'"></image>
							<image class="attachImg" v-else-if="item.transmittedThoughts.attach.type== 'activity' && oss" :src="oss+'icon_icanThought_activity.png'"></image>
							<image class="attachImg" v-else-if="item.transmittedThoughts.attach.type=='task' && oss" :src="oss+'icon_thoughtsRelation_task.png'"></image>
							<image class="attachImg" v-else-if="item.transmittedThoughts.attach.type=='questionnaire' && oss" :src="oss+'icon_icanThought_questionnaire.png'"></image>
							<image class="attachImg" v-else-if="item.transmittedThoughts.attach.type =='products' || item.attach.type == 'program' && oss" :src="oss+'icon_icanThought_magicBox.png'"></image>
							<view class="attachInfo">
								<view class="color_303031 bold" v-if="item.transmittedThoughts.attach.type== 'material'">
									材料
								</view>
								<view class="color_303031 bold" v-else-if="item.transmittedThoughts.attach.type== 'activity'">
									活动
								</view>
								<view class="color_303031 bold" v-else-if="item.transmittedThoughts.attach.type=='task'">
									任务
								</view>
								<view class="color_303031 bold" v-else-if="item.transmittedThoughts.attach.type=='questionnaire'">
									问卷
								</view>
								<view class="color_303031 bold" v-else-if="item.transmittedThoughts.attach.type =='products'|| item.attach.type == 'program' ">
									魔方
								</view>
								<view class="singleEllipsis color_666769 attachTitle">
									{{item.transmittedThoughts.attach.title}}
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="talk-end">
					<view class="center" v-if="$isEmpty(item.transmittedThoughts)" @tap.stop="commentsOpen('share',item)">
						<image v-if="oss" class="talk-icon" :src="oss+'thought_share.png'"></image>
						<view class="talk-end-text">{{ $isEmpty(item.transmittedTimes)?'0':item.transmittedTimes}}</view>
					</view>
					<view class="center">
						<image v-if="oss" class="talk-icon" :src="oss+'thought_comment.png'"></image>
						<view class="talk-end-text">{{ $isEmpty(item.commentNum)?'0':item.commentNum}}</view>
					</view>
					<view class="center" @tap.stop="addThumbsUp(item)">
						<image v-if="oss && item.praiseStatus == 1" class="talk-icon" :src="oss+'thought_praise.png'"></image>
						<image v-if="oss && item.praiseStatus == 0" class="talk-icon" :src="oss+'thought_unPraise.png'"></image>
						<view class="talk-end-text">{{ $isEmpty(item.thumbsUpCount)?0:item.thumbsUpCount}}</view>
					</view>
				</view>
			</view>
		</view>
		<uni-load-more :status="moreStatus"></uni-load-more>
		<view class="bottom-safe" style="height: 112rpx;"></view>
		<uni-popup ref="dialog" type="bottom">
			 <view class="popDialog">
			 	<view class="color_666769 message">
			 		是否删除动态
			 	</view>
				<view class="flexRow">
					<view class="button noRepeat" @tap="cancel">
						取消
					</view>
					<view class="button repeatNow" @tap="pass">
						确定
					</view>
				</view>
			 </view>
		</uni-popup>
		<uni-popup ref="popup" type="bottom">
			<view class="popup_input">
				<textarea :placeholder="placeholder" placeholder-style="inputDefault" v-model="input" fixed="true" adjust-position="true"
				 show-confirm-bar="false" cursor-spacing="80"></textarea>
				<view v-if="input.length>0" class="color_F74437" style="margin-left: 20rpx;" @tap="sendInput">发送</view>
				<view v-else style="margin-left: 20rpx;color: #F7443780;">发送</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		getCompanyStation,
		previewImage,
		imageError
	} from '@/common/utils.js';
	export default {
		data() {
			return {
				id:'',
				oss:'',
				thoughts:{},
				moreStatus:"more",
				userId:'',
				deleteId:'',
				deleteIndex:'',
				placeholder : '请输入分享内容',
				input:''
			};
		},
		onLoad(options) {
			this.oss =this.$oss
			const {id} =options
			// console.log(id)
			this.id=id
			this.userId = uni.getStorageSync('userinfo').user_id;
			this.$http.get('dms/thoughts/page', {
				params: {
					id: id
				}
			}).then(res => {
				this.thoughts = res.data.data;
				this.thoughts.records.forEach(item => {
					item.avatar=imageError(item.avatar, this.oss)
				})
				if (this.thoughts.current == this.thoughts.pages) {
					this.moreStatus = 'noMore';
				} else if (this.thoughts.pages == 0) {
					this.moreStatus = 'noMore';
				}
			});
		},
		onReachBottom() {
			let that = this;
			if (that.thoughts.current < that.thoughts.pages) {
				that.moreStatus = 'loading';
				that.$http.get('dms/thoughts/page', {
					params: {
						id: that.id,
						current: that.thoughts.current + 1
					}
				}).then(res => {
					that.thoughts.current = res.data.data.current;
					that.thoughts.records = that.thoughts.records.concat(res.data.data.records);
					that.thoughts.records.forEach(item => {
						item.avatar=imageError(item.avatar, that.oss)
					})
					that.moreStatus = 'more';
				});
			} else {
				that.moreStatus = 'noMore';
			}
		},
		methods:{
			goThoughtsDetails(item) {
				uni.navigateTo({
					url: `/pages/find/attention/detail/detail?id=${item.thoughtsId}`
				})
			},
			goRelationDetails(item){
				if(item.attach.type=='activity'){
					uni.navigateTo({
						url:`/pages/contacts/soWorkbench/soInfo/soActivity/soActivityDetails/soActivityDetails?id=${item.attach.relationId}`
					})
				}else if(item.attach.type=='questionnaire'){
					uni.navigateTo({
						url:`/pages/contacts/soWorkbench/soInfo/soQuestionnaire/questionnaireDetails/questionnaireDetails?id=${item.attach.relationId}`
					})
				}else if(item.attach.type=='material'){
					uni.navigateTo({
						url:`/pages/contacts/soWorkbench/soInfo/soMaterial/materialKind/materialDetails/materialDetails?id=${item.attach.relationId}`
					})
				}else if(item.attach.type=='products' || item.attach.type == 'program'){
					uni.navigateTo({
						url:`/pages/find/magicBox/detail/detail?id=${item.attach.relationId}`
					})
				}else if(item.attach.type=='task'){
					uni.navigateTo({
						url:`/pages/ican/taskDetail/taskDetail?taskId=${item.attach.relationId}`
					})
				}
			},
			goCannerCard(item) {
				// console.log(item)
				uni.navigateTo({
					url: `/pages/find/cannerCard/cannerCard?id=${item.userId}`
				})
			},
			addThumbsUp(item) {
				this.$http.get('dms/app/add_thumbs_up/' + item.thoughtsId).then(res => {
					if (res.data.data == true) {
						if (item.praiseStatus == 0) {
							item.praiseStatus = 1;
							item.thumbsUpCount++
						} else if (item.praiseStatus == 1) {
							item.praiseStatus = 0;
							item.thumbsUpCount--
						}
					}
				});
			},
			deleteThought(item,index){
				this.$refs.dialog.open()
				this.deleteId = item.thoughtsId
				this.deleteIndex =index
			},
			cancel(){
				this.$refs.dialog.close()
				this.deleteId = ""
				this.deleteIndex =""
			},
			pass(){
				let that= this
				that.$http.get('dms/thoughts/delete/'+that.deleteId).then(res=>{
					if(res.data.code == 1){
						uni.showToast({
							title:res.data.message,
							icon:"none",
							success: () => {
								that.$refs.dialog.close()
								that.deleteId = ""
								that.deleteIndex =""
							}
						})
					}else{
						uni.showToast({
							title:"删除成功",
							icon:"none",
							duration:1000,
							success: () => {
								setTimeout(()=>{
									that.thoughts.records.splice(that.deleteIndex,1)
									that.$refs.dialog.close()
									that.deleteId=""
									that.deleteIndex=""
								},1000)
							}
						})
					}
				})
			},
			commentsOpen(type, item) {
				this.thoughtsId = item.thoughtsId
				this.$refs.popup.open()
			},
			sendInput() {
				let that = this
				that.$http.post('dms/thoughts/create', {
					content: that.input,
					transmitId: that.thoughtsId,
					status: 0
				}).then(res => {
					that.$refs.popup.close();
					that.input = ''
					if (res.data.code == 1) {
						uni.showToast({
							icon: 'none',
							title: res.data.message
						})
					} else {
						uni.showToast({
							title: "分享成功",
							icon: "success",
							duration: 1000
						});
					}
				});
			},
			previewImage,
			getCompanyStation
		}
	}
</script>

<style lang="scss" scoped>
.attachContent{
		margin-top: 30rpx;
		.wrapAttach{
			margin: 0 40rpx; 
			padding: 34rpx 40rpx 30rpx 30rpx;
			border-radius: 30rpx;
			.attachImg{
				width:76rpx;
				height: 76rpx;
			}
			.attachInfo{
				flex: 1;
				min-width: 0;
				margin-left: 20rpx;
				font-size: 28rpx;
				line-height: 40rpx;
				.attachTitle{
					margin-top: 10rpx;
					font-size: 24rpx;
					line-height: 34rpx;
				}
			}
		}
	}
	.talk {
		.talk-item {
			padding-top: 46rpx;
			border-bottom: 0.3rpx solid #EFF0F1;
	
			.talk-item-title {
				padding: 0 32rpx;
				display: flex;
				align-items: center;
				margin-bottom: 30rpx;
	
				.avatar {
					width: 92rpx;
					height: 92rpx;
					border-radius: 50%;
				}
	
				.talk-item-title-text {
					margin-left: 24rpx;
					.talk-item-title-text-name{
						font-size: 28rpx;
						line-height: 40rpx;
					}
					.talk-item-title-text-company{
						font-size: 24rpx;
						line-height: 34rpx;
						margin-top: 10rpx;
					}
	
					.name {
						color: #303031;
						font-size: 28rpx;
						line-height: 38rpx;
					}
	
					.company {
						color: #919397;
						font-size: 22rpx;
						line-height: 32rpx;
					}
				}
	
			}
	
			.talk-text {
				padding: 0 40rpx 0 20rpx;
				margin-left: 20rpx;
				color: #303031;
				font-size: 28rpx;
				line-height: 48rpx;
			}
	
			.talk-imgs {
				padding-left: 40rpx;
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
	
				.talk-img {
					margin-top: 30rpx;
					margin-right: 29rpx;
					width: 204rpx;
					height: 204rpx;
					border-radius: 20rpx;
				}
	
				.talk-img-single {
					margin-top: 30rpx;
					width: 460rpx;
					height: 616rpx;
					border-radius: 20rpx;
				}
			}
	
			.talk-end {
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 26rpx;
				color: #565B5F;
				line-height: 36rpx;
	
				.talk-icon {
					padding: 30rpx 0rpx 40rpx 0rpx; 
					height: 44rpx;
					width: 44rpx;
				}
	
				.talk-end-text {
					margin-left: 10rpx;
					padding: 30rpx 0rpx 40rpx 0rpx; 
				}
			}
		}
	}
	.reply {
		margin-top: 30rpx;
		background-color: #F4F5F6;
		padding: 30rpx 0;
	}
	
	.center {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.popDialog{
		padding: 32rpx;
		background-color: #FFFFFF;
		.message{
			font-size: 28rpx;
			line-height: 52rpx;
			margin: 48rpx 0;
			text-align: center;
		}
		.noRepeat{
			flex: 1;
			background: #F5f7f8;
			color: #565B5F;
			margin-right: 30rpx;
		}
		.repeatNow{
			flex: 1;
		}
	}
	.popup_input {
		padding: 32rpx;
		background-color: #FFFFFF;
		display: flex;
		font-size: 28rpx;
		align-items: flex-end;
	}
	.inputDefault {
		color: #919397;
		padding: 20rpx;
		line-height: 48rpx;
	}
	
	textarea {
		flex: 1;
		padding: 20rpx;
		line-height: 48rpx;
		background-color: #F4F5F6;
		color: #666769;
		border-radius: 20rpx;
		height: 184rpx;
	}
</style>
