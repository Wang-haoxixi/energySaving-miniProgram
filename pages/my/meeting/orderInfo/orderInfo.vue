<template>
	<view>
		<view class="page">
			<view class="top">
				<view class="flexRowStart">
					<image v-if="orderInfo.avatar" :src="imageError(orderInfo.avatar,$oss)" mode="aspectFill" class="avatar"></image>
					<view class="top-right">
						<view class="name">
							{{$isEmpty(orderInfo.userName)?'':orderInfo.userName}}
						</view>
						<view class="singleEllipsis company">
							{{getCompanyStation(orderInfo.userCompany,orderInfo.userStation)}}
						</view>
					</view>
				</view>
			</view>
			<view class="flexRow">
				<view class="title">
					填报信息
				</view>
				<image v-if="oss" :src="oss+'icon_myOrderInfoALl.png'" class="myOrderInfoALlImg" mode="aspectFit" @tap="checkUserList"></image>
			</view>
			<view class="content">
				<view class="flexRow content-item">
					<view class="subtitle">
						姓名
					</view>
					<view class="subcontent">
						{{$isEmpty(orderInfo.name)?'':orderInfo.name}}
					</view>
				</view>
				<view class="flexRow content-item">
					<view class="subtitle">
						手机号
					</view>
					<view class="subcontent">
						{{$isEmpty(orderInfo.phone)?'暂无':orderInfo.phone}}
					</view>
				</view>
				<view class="flexRow content-item" v-if="!$isEmpty(orderInfo.email)">
					<view class="subtitle">
						邮箱
					</view>
					<view class="subcontent">
						{{$isEmpty(orderInfo.email)?'暂无':orderInfo.email}}
					</view>
				</view>
				<view class="flexRow content-item" v-if="!$isEmpty(orderInfo.company)">
					<view class="subtitle">
						单位
					</view>
					<view class="subcontent">
						{{$isEmpty(orderInfo.company)?'暂无':orderInfo.company}}
					</view>
				</view>
				<view class="flexRow content-item" v-if="!$isEmpty(orderInfo.position)">
					<view class="subtitle">
						职务
					</view>
					<view class="subcontent">
						{{$isEmpty(orderInfo.position)?'暂无':orderInfo.position}}
					</view>
				</view>
			</view>
			<view class="flexRow title">
				<view>购买信息</view>
				<view class="color_919397 status" v-if="orderInfo.orderStatus==3">
					取消报名
				</view>
				<view class="color_F74437 status" v-if="orderInfo.orderStatus==0">
					待支付
				</view>
				<view class="flexRow" v-if="orderInfo.orderStatus==1">
					<text class="color_3CD489 status" v-if="orderInfo.paymentMethod==0">免费</text>
					<text class="color_3CD489 status" v-else-if="orderInfo.paymentMethod!=0">{{$isEmpty(orderInfo.paymentMethodName)?'':orderInfo.paymentMethodName}} - {{$isEmpty(orderInfo.orderStatusName)?'':orderInfo.orderStatusName}}</text>
					<text class="color_919397" style="margin: 0 20rpx;font-size: 20rpx;">|</text>
					<text class="color_919397 status">已核销: {{$isEmpty(orderInfo.cancelNum)?'0':orderInfo.cancelNum}}</text>
				</view>
			</view>
			<view class="content">
				<view class="flexRow" style="margin-bottom: 48rpx;">
					<view class="flexRowStart subtitle">
						<view class="color_303031 singleEllipsis bold" style="max-width: 280rpx;margin-right: 10rpx;">
							{{$isEmpty(orderInfo.ticketingName)?'':orderInfo.ticketingName}}
						</view>
						<view v-if="orderInfo.paymentMethod==0 &&orderInfo.paymentMethod!=''" class="color_FFFFFF bg_color_3CD489 icon">
							免
						</view>
						<view v-else class="color_FFFFFF bg_color_F74437 icon">
							付
						</view>
					</view>
					<view class="subtitle">
						<text class="color_919397 bold" style=" margin-right: 20rpx;">X</text>
						<text class="bold color_303031">{{$isEmpty(orderInfo.orderNum)?'0':orderInfo.orderNum}}张</text>
					</view>
				</view>
				<view class="flexRow subtitle">
					<view class="">
						支付金额
					</view>
					<view class="" v-if="orderInfo.paymentMethod==0 && orderInfo.paymentMethod!=''">
						免费
					</view>
					<view class="" v-if="orderInfo.paymentMethod==1">
						{{orderInfo.money}}贝
					</view>
					<view class="" v-if="orderInfo.paymentMethod==2">
						{{orderInfo.money}}元
					</view>
					<view class="" v-if="orderInfo.paymentMethod==''">
						0贝/0元
					</view>
				</view>
			</view>
			<view class="title">
				我的备注
			</view>
			<view v-if="orderInfo.remarks" class="remarks">
				{{$isEmpty(orderInfo.remarks)?'':orderInfo.remarks}}
			</view>
			<view v-else class="remarks">
				暂无备注
			</view>
		</view>
		<view class="btns">
			<view class="" v-if="orderInfo.isAdmin==true">
				<view v-if="orderInfo.orderStatus == 1 && orderInfo.auditStatus==1" class="flexRow wrapBtns">
					<view class="button color_F74437 rightBtn" @tap="agreeUser">
						同意
					</view>
					<view class="button leftBtn" @tap="refuseUser">
						拒绝
					</view>
				</view>
				<view v-else-if="orderInfo.orderStatus == 1 && orderInfo.auditStatus==2" class="flexRow wrapBtns">
					<view class="button color_F74437 rightBtn" @click="checkCode">
						查看签到码
					</view>
					<view class="button leftBtn" @tap="resetCheck">
						重新审核
					</view>
				</view>
				<view v-else-if="orderInfo.orderStatus == 1 && orderInfo.auditStatus==3" class="flexRow wrapBtns">
					<view class="button color_F74437 rightBtn" @click="checkReason">
						查看理由
					</view>
					<view class="button leftBtn" @tap="resetCheck">
						重新审核
					</view>
				</view>
			</view>
			<view class="" v-if="orderInfo.isAdmin==false">
				<view v-if="orderInfo.orderStatus == 1&& (orderInfo.auditStatus==0 ||orderInfo.auditStatus==2)" class="button singleCheckCode" @click="checkCode">
					查看签到码
				</view>
				<view v-else-if="orderInfo.orderStatus == 1&& orderInfo.auditStatus==3" class="button singleCheckReason" @click="checkReason">
					查看理由
				</view>
			</view>
		</view>
		<uni-popup ref="dialog" type="center">
			<view class="popDialog">
				<view class="flexRowStart" style="justify-content: center;">
					<view class="color_666769 message">
						是否通过审核？
					</view>
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
				<view class="color_303031 bold refuseReason">
					拒绝理由
				</view>
				<view class="" style="position: relative;margin: 48rpx 0;">
					<textarea :placeholder="placeholder" v-model="input" placeholder-class="inputTxt" fixed="true" show-confirm-bar="false"
					 cursor-spacing="80" maxlength="50" @input="checkInfo"></textarea>
					 <view class="color_BABEC0 remark" style="">
					 	你还可以输入{{limitNum}}字
					 </view>
				</view>
				<view class="flexRow">
					<view class="button cancelBtn" @tap="cancelRefuse">
						取消
					</view>
					<view class="button passBtn" @tap="submitRefuse">
						提交
					</view>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="refusedialog" type="center">
			<view class="popDialog">
				<view class="flexRowStart" style="justify-content: center;">
					<view class="color_666769 message">
						{{auditRemark}}
					</view>
				</view>
				<view class="flexRow">
					<view class="button" @tap="confirmRefuse" style="flex: 1;">
						确定
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		getCompanyStation,
		imageError
	} from '@/common/utils.js';
	export default {
		data() {
			return {
				orderInfo: {},
				enroleId: '',
				type:'',
				input:'',
				placeholder:'请输入拒绝理由,您填写的内容将会告知参会者',
				limitNum:50,
				auditRemark:'',
				oss:''
			};
		},
		onLoad(options) {
			this.oss=this.$oss
			const {
				enroleId,
				type
			} = options
			this.enroleId = enroleId
			this.type =type
			if(type ==1){
				//从名单管理过来
				uni.setNavigationBarTitle({
				    title: 'TA的信息'
				});
			}else{
				//从我的活动过来
				uni.setNavigationBarTitle({
				    title: '我的信息'
				});
			}
			this.$http.get('qms/conference_enrole/get', {
				params: {
					type: 1,
					id: enroleId
				}
			}).then(res => {
				// console.log(res)
				this.orderInfo = res.data.data
			})
		},
		methods: {
			getCompanyStation,
			imageError,
			checkInfo(e){
				// console.log(e)
				this.limitNum=50-e.detail.cursor
			},
			checkCode() {
				uni.navigateTo({
					url: `/pages/my/meeting/orderInfo/checkCode/checkCode?id=${this.enroleId}`
				})
			},
			checkUserList(){
				uni.navigateTo({
					url:`/pages/my/meeting/orderInfo/allOrderUserList/allOrderUserList?id=${this.orderInfo.id}`
				})
			},
			agreeUser(){
				this.$refs.dialog.open()
			},
			refuseUser(){
				this.$refs.popup.open()
			},
			resetCheck(){
				if(this.orderInfo.auditStatus==3){
					this.$refs.dialog.open()
				}else{
					this.$refs.popup.open()
				}
			},
			checkReason(){
				this.$refs.refusedialog.open()
				this.$http.get('qms/conference_enrole/get_remark',{
					params:{
						enroleId:this.enroleId
					}
				}).then(res=>{
					this.auditRemark=res.data.data
				})
			},
			confirmRefuse(){
				this.$refs.refusedialog.close()
			},
			cancel(){
				this.$refs.dialog.close()
			},
			pass(){
				this.$http.post('qms/conference_enrole/audit',{
					auditType:1,
					enroleId:this.enroleId
				}).then(res=>{
					console.log(res)
					this.$refs.dialog.close()
					if(res.data.code==0){
						this.orderInfo.auditStatus=2
					}
				})
			},
			cancelRefuse(){
				this.$refs.popup.close()
			},
			submitRefuse(){
				if(this.input.length == 0){
					uni.showToast({
						title:'请输入拒绝理由',
						icon:"none"
					})
				}else{
					this.$http.post('qms/conference_enrole/audit',{
						auditType:2,
						enroleId:this.enroleId,
						remark:this.input
					}).then(res=>{
						// console.log(res)
						this.$refs.popup.close()
						if(res.data.code==0){
							this.orderInfo.auditStatus=3
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.cancelBtn{
		flex: 1;
		margin-right: 20rpx;
		background: #F5f7f8;
		color: #565B5F;
	}
	.passBtn{
		flex: 1;
	}
	.refuseReason{
		font-size: 36rpx;
		line-height: 52rpx;
		margin-top: 32rpx;
	}
	.btns{
		z-index: 10; 
		width: 100%; 
		background-color: #FFFFFF; 
		position: fixed;
		bottom: 0rpx;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		.wrapBtns{
			width:686rpx;
			margin: 24rpx 32rpx;
			.rightBtn{
				flex: 1;
				margin-right: 30rpx;
				color: #565B5F;
				background: #F5f7f8;
			}
			.leftBtn{
				flex: 1;
			}
		}
		.singleCheckCode{
			width:686rpx;
			margin: 24rpx 32rpx
		}
		.singleCheckReason{
			width:686rpx;
			margin: 24rpx 32rpx
		}
	}
	.myOrderInfoALlImg{
		width: 160rpx;
		height: 60rpx;
		margin-top: 60rpx;
	}
	.remark{
		width: 640rpx;
		padding: 0 20rpx;
		background-color:#F5f7f8 ;
		text-align: right;
		font-size: 24rpx;
		line-height: 48rpx;
		border-bottom-right-radius:20rpx ;
		border-bottom-left-radius:20rpx ;
	}
	.popup_input {
		padding: 32rpx;
		background-color: #FFFFFF;
		// display: flex;
		font-size: 28rpx;
		// align-items: flex-end;
	}
	.inputTxt{
		color: #BABEC0;
		font-size: 28rpx;
		line-height: 48rpx;
	}
	
	textarea {
		width: 640rpx;
		padding: 20rpx;
		padding-bottom: 0rpx;
		font-size: 28rpx;
		line-height: 48rpx;
		background-color: #F5f7f8;
		color: #666769;
		border-top-left-radius:20rpx ;
		border-top-right-radius:20rpx ;
		height: 184rpx;
	}
	.popDialog {
		width: 590rpx;
		padding: 32rpx 32rpx 48rpx;
		background-color: #FFFFFF;
		// box-shadow: 0px -2rpx 4rpx 0px rgba(0, 0, 0, 0.03);
		.message{
			font-size: 28rpx;
			line-height: 52rpx;
			text-align: center;
			margin: 48rpx 0;
		}
	}
	.noRepeat {
		flex: 1;
		background: #F5f7f8;
		color: #565B5F;
		margin-right: 30rpx;
	}
		
	.repeatNow {
		flex: 1;
	}
	page {
		background-color: #F5f7f8;
	}

	.page {
		padding: 32rpx 32rpx 200rpx 32rpx;

		.top {
			padding: 32rpx;
			width: 622rpx;
			border-radius: 30rpx;
			background-color: #FFFFFF;

			.avatar {
				border-radius: 50%;
				margin-right: 24rpx;
				width: 112rpx;
				height: 112rpx;
			}

			.top-right {
				display: flex;
				flex-direction: column;
				align-items: flex-start;

				.name {
					color: #303031;
					font-size: 28rpx;
					padding-bottom: 10rpx;
					font-weight: bold;
				}

				.company {
					color: #919397;
					margin-top: 10rpx;
					font-size: 20rpx;
					padding-bottom: 10rpx;
					width: 460rpx;
				}
			}
		}

		.title {
			margin-top: 60rpx;
			color: #303031;
			font-weight: bold;
			font-size: 32rpx;
			line-height: 44rpx;

			.status {
				font-size: 24rpx;
				line-height: 34rpx;
			}
		}

		.content {
			border-radius: 20rpx;
			background-color: #FFFFFF;
			padding: 24rpx 30rpx;
			margin-top: 40rpx;

			.icon {
				width: 28rpx;
				line-height: 28rpx;
				font-size: 20rpx;
				line-height: 30rpx;
				border-radius: 50%;
				text-align: center;
			}

			.content-item {
				padding-top: 20rpx;
				padding-bottom: 20rpx;
			}

			.subtitle {
				color: #303031;
				font-weight: bold;
				font-size: 28rpx;
				line-height: 40rpx;
			}

			.subcontent {
				font-size: 28rpx;
				color: #919397;
				font-style: 28rpx;
				line-height: 40rpx;
			}
		}

		.remarks {
			margin-top: 40rpx;
			color: #919397;
			padding: 30rpx;
			font-size: 28rpx;
			line-height: 48rpx;
			background-color: #FFFFFF;
			border-radius: 30rpx;
		}
	}
</style>
