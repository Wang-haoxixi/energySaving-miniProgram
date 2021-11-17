<template>
	<view>
		<view class="container">
			<view class="wrapTitle">
				<view class="title" @tap="allClick()">
					<view :class="[{ active: isAllActive }, { unactive: !isAllActive }]">全部</view>
					<view class="titleLine" v-if="isAllActive"></view>
				</view>
				<view class="title" @tap="underwayClick()">
					<view :class="[{ active: isUnderwayActive }, { unactive: !isUnderwayActive }]">待付款</view>
					<view class="titleLine" v-if="isUnderwayActive"></view>
				</view>
				<view class="title" @tap="endClick()">
					<view :class="[{ active: isEndActive }, { unactive: !isEndActive }]">已付款</view>
					<view class="titleLine" v-if="isEndActive"></view>
				</view>
				<view class="title" @tap="refundClick()">
					<view :class="[{ active: isRefundActive }, { unactive: !isRefundActive }]">已退款</view>
					<view class="titleLine" v-if="isRefundActive"></view>
				</view>
				<view class="title" @tap="applyClick()">
					<view :class="[{ active: isApplyActive }, { unactive: !isApplyActive }]">已评价</view>
					<view class="titleLine" v-if="isApplyActive"></view>
				</view>
			</view>
			<swiper circular @change="swiperChange" class="safe-bottom" style="flex: 1;margin-top: 16rpx;" observer observerParents :current-item-id="item_id" ref="swiper">
				<swiper-item item-id="0">
					<scroll-view :scroll-top="30" scroll-y="true" class="scroll-Y" @scrolltolower="activityMoreAll">
						<view class="list" v-for="(item, index) in activityListAll" :key="index" @tap="goDetails(item)">
							<view class="color_303031 bold flexRowStart magicTitle">
								<image lazy-load="true" :src="soImageError(item.orgImg,$oss)" mode="aspectFill" class="orgImg"></image>
								<view class="singleEllipsis orgName">{{$isEmpty(item.orgName)?'':item.orgName}}</view>
								<!-- 非交易取消、非已评价才显示为免费票 -->
								<view class="color_3CD489 icon" v-if="item.isFree==1 && item.status!=2 && item.status!=3&& item.status!=4">
									免费票
								</view>
								<view class="color_F74437 icon" v-else-if="item.status==4">
									待联系
								</view>
								<view class="color_F74437 icon" v-else-if="item.status==0 && item.paymentMethod==0">
									待支付
								</view>
								<view class="color_3CD489 icon" v-else-if="item.paymentMethod==1 && item.status==1">
									宝贝支付-交易成功
								</view>
								<view class="color_919397 icon" v-else-if="item.paymentMethod==1 && item.status==2">
									宝贝支付-交易取消
								</view>
								<view class="color_919397 icon" v-else-if="item.paymentMethod==0 && item.status==2">
									交易取消
								</view>
								<view class="color_3CD489 icon" v-else-if="item.paymentMethod==2 && item.status==1">
									微信支付-交易成功
								</view>
								<view class="color_919397 icon" v-else-if="item.paymentMethod==2 && item.status==2">
									微信支付-交易取消
								</view>
								<view class="color_919397 icon" v-else-if="item.status==3">
									已评价
								</view>
								<view class="color_F74437 icon" v-else-if="item.status==5">
									退款中
								</view>
								<view class="color_3CD489 icon" v-else-if="item.status==6">
									退款成功
								</view>
								<view class="color_919397 icon" v-else-if="item.status==7">
									退款失败
								</view>
							</view>
							<view class="flexRowStart magicInfo">
								<image lazy-load="true" :src="item.goodsImg" mode="aspectFill" class="goodsImg"></image>
								<view class="wrapInfo">
									<view class="color_303031 doubleEllipsis goods">
										{{$isEmpty(item.goods)?'':item.goods}}
									</view>
									<view class="flexRow icon" v-if="item.isFree==0">
										<text class="color_303031  icon" v-if="item.payCurrency==1">{{$isEmpty(item.goodsPrice)?'0':item.goodsPrice}}贝</text>
										<text class="color_303031  icon" v-else-if="item.payCurrency==2">{{$isEmpty(item.goodsCash)?'0':item.goodsCash}}元</text>
										<text class="color_303031  icon" v-else>{{$isEmpty(item.goodsPrice)?'0':item.goodsPrice}}贝/{{$isEmpty(item.goodsCash)?'0':item.goodsCash}}元</text>
										<text class="color_919397" >X{{$isEmpty(item.goodsAmount)?'0':item.goodsAmount}}</text>
									</view>
									<view class="flexRow icon" v-if="item.isFree==1">
										<view class="color_303031 icon">
											0贝
										</view>
										<text class="color_919397" >X{{$isEmpty(item.goodsAmount)?'0':item.goodsAmount}}</text>
									</view>
								</view>
							</view>
							<view class="color_919397 numInfo">
								<text style="margin-right: 30rpx;">共{{$isEmpty(item.goodsAmount)?'0':item.goodsAmount}}件</text>
								<text style="margin-right: 20rpx;">合计:</text>
								<text class="color_F74437 " v-if="item.payCurrency == 2 &&item.isFree==0">{{$isEmpty(item.discountCash)?'0':item.discountCash}}元</text>
								<text class="color_F74437 " v-else-if="item.payCurrency == 1&&item.isFree==0">{{$isEmpty(item.discountPrice)?'0':item.discountPrice}}贝</text>
								<text class="color_F74437 " v-else-if="item.payCurrency == 9&&item.isFree==0">
									<text>{{$isEmpty(item.discountPrice)?'0':item.discountPrice}}贝/{{$isEmpty(item.discountCash)?'0':item.discountCash}}元</text>
						<!-- 			<text v-else-if="item.discountPrice>0">{{$isEmpty(item.discountPrice)?'0':item.discountPrice}}贝</text>
									<text v-else-if="item.discountCash>0">{{$isEmpty(item.discountCash)?'0':item.discountCash}}元</text> -->
								</text>
								<text class="color_F74437 " v-else>0贝</text>
							</view>
							<view class="order-type">
								<view v-if="item.orderType == 1" class="order-type-text">服务订单</view>
								<view v-else-if="item.orderType == 2" class="order-type-text">活动订单</view>
								<view class="">
									<view class="button applyBtn" @tap.stop="applyMagic(item)" v-if="item.status == 1 && item.orderType == 1">
										评论
									</view>
									<view class="">
										<view class="button cancelBtn" @tap.stop="cancelOrder(item,index)" v-if="item.status == 0 && item.isFree==0">
											取消订单
										</view>
										<view class="button payBtn" v-if="item.status ==0 &&  item.isFree==0" @tap="goCheckoutCounter(item.orderNumber)">
											继续付款
										</view>
									</view>
								</view>
							</view>
						</view>
						<image class="emptyImg" v-if="!activityListAll.length>0 &&oss" :src="oss+'pic_energy_default_wudingdan.png'" mode="aspectFit"></image>
						<uni-load-more :status="activityMoreStatusAll" v-if="activityListAll.length>0"></uni-load-more>
					</scroll-view>
				</swiper-item>
				<swiper-item item-id="1">
					<scroll-view :scroll-top="30" scroll-y="true" class="scroll-Y" @scrolltolower="activityMoreIng">
						<view class="list" v-for="(item, index) in activityListIng" :key="index" @tap="goDetails(item)">
							<view class="color_303031 bold flexRowStart magicTitle">
								<image lazy-load="true" :src="soImageError(item.orgImg,$oss)" mode="aspectFill" class="orgImg"></image>
								<view class="singleEllipsis orgName">{{$isEmpty(item.orgName)?'':item.orgName}}</view>
								<view class="color_3CD489 icon" v-if="item.isFree==1 && item.status!=2 && item.status!=3&& item.status!=4">
									免费票
								</view>
								<view class="color_F74437 icon" v-else-if="item.status==4">
									待联系
								</view>
								<view class="color_F74437 icon" v-else-if="item.status==0 && item.paymentMethod==0">
									待支付
								</view>
								<view class="color_3CD489 icon" v-else-if="item.paymentMethod==1 && item.status==1">
									宝贝支付-交易成功
								</view>
								<view class="color_919397 icon" v-else-if="item.paymentMethod==1 && item.status==2">
									宝贝支付-交易取消
								</view>
								<view class="color_919397 icon" v-else-if="item.paymentMethod==0 && item.status==2">
									交易取消
								</view>
								<view class="color_3CD489 icon" v-else-if="item.paymentMethod==2 && item.status==1">
									微信支付-交易成功
								</view>
								<view class="color_919397 icon" v-else-if="item.paymentMethod==2 && item.status==2">
									微信支付-交易取消
								</view>
								<view class="color_919397 icon" v-else-if="item.status==3">
									已评价
								</view>
								<view class="color_F74437 icon" v-else-if="item.status==5">
									退款中
								</view>
								<view class="color_3CD489 icon" v-else-if="item.status==6">
									退款成功
								</view>
								<view class="color_919397 icon" v-else-if="item.status==7">
									退款失败
								</view>
							</view>
							<view class="flexRowStart magicInfo">
								<image lazy-load="true" :src="item.goodsImg" mode="aspectFill" class="goodsImg"></image>
								<view class="wrapInfo">
									<view class="color_303031 doubleEllipsis goods">
										{{$isEmpty(item.goods)?'':item.goods}}
									</view>
									<view class="flexRow icon" v-if="item.isFree==0">
										<text class="color_303031 icon" v-if="item.payCurrency==1">{{$isEmpty(item.goodsPrice)?'0':item.goodsPrice}}贝</text>
										<text class="color_303031 icon" v-else-if="item.payCurrency==2">{{$isEmpty(item.goodsCash)?'0':item.goodsCash}}元</text>
										<text class="color_303031 icon" v-else>{{$isEmpty(item.goodsPrice)?'0':item.goodsPrice}}贝/{{$isEmpty(item.goodsCash)?'0':item.goodsCash}}元</text>
										<text class="color_919397">X{{$isEmpty(item.goodsAmount)?'0':item.goodsAmount}}</text>
									</view>
									<view class="flexRow icon" v-if="item.isFree==1">
										<view class="color_303031 icon" >
											0贝
										</view>
										<text class="color_919397">X{{$isEmpty(item.goodsAmount)?'0':item.goodsAmount}}</text>
									</view>
								</view>
							</view>
							<view class="color_919397 numInfo">
								<text style="margin-right: 30rpx;">共{{$isEmpty(item.goodsAmount)?'0':item.goodsAmount}}件</text>
								<text style="margin-right: 20rpx;">合计:</text>
								<text class="color_F74437 " v-if="item.payCurrency == 2&& item.isFree==0">{{$isEmpty(item.discountCash)?'0':item.discountCash}}元</text>
								<text class="color_F74437 " v-else-if="item.payCurrency == 1&& item.isFree==0">{{$isEmpty(item.discountPrice)?'0':item.discountPrice}}贝</text>
								<text class="color_F74437 " v-else-if="item.payCurrency == 9&& item.isFree==0">
									<text>{{$isEmpty(item.discountPrice)?'0':item.discountPrice}}贝/{{$isEmpty(item.discountCash)?'0':item.discountCash}}元</text>
								<!-- 	<text v-else-if="item.discountPrice>0">{{item.discountPrice}}贝</text>
									<text v-else-if="item.discountCash>0">{{item.discountCash}}元</text> -->
								</text>
								<text class="color_F74437 " v-else>0贝</text>
							</view>
							<view class="order-type">
								<view v-if="item.orderType == 1" class="order-type-text">服务订单</view>
								<view v-else-if="item.orderType == 2" class="order-type-text">活动订单</view>
								<view class="">
									<view class="button applyBtn" @tap.stop="applyMagic(item)" v-if="item.status == 1 && item.orderType == 1">
										评论
									</view>
									<view class="">
										<view class="button cancelBtn" @tap.stop="cancelOrder(item,index)" v-if="item.status == 0 && item.isFree==0">
											取消订单
										</view>
										<view class="button payBtn" v-if="item.status == 0 && item.isFree==0" @tap="goCheckoutCounter(item.orderNumber)">
											继续付款
										</view>
									</view>
								</view>
							</view>
						</view>
						<image class="emptyImg" v-if="!activityListIng.length>0 && oss" :src="oss+'pic_energy_default_wudingdan.png'" mode="aspectFit"></image>
						<uni-load-more :status="activityMoreStatusIng" v-if="activityListIng.length>0"></uni-load-more>
					</scroll-view>
				</swiper-item>
				<swiper-item item-id="2">
					<scroll-view :scroll-top="30" scroll-y="true" class="scroll-Y" @scrolltolower="activityMoreEnd">
						<view class="list" v-for="(item, index) in activityListEnd" :key="index" @tap="goDetails(item)">
							<view class="color_303031 bold flexRowStart magicTitle">
								<image lazy-load="true" :src="soImageError(item.orgImg,$oss)" mode="aspectFill" class="orgImg"></image>
								<view class="singleEllipsis orgName">{{$isEmpty(item.orgName)?'':item.orgName}}</view>
								<view class="color_3CD489 icon" v-if="item.isFree==1 && item.status!=2 && item.status!=3&& item.status!=4">
									免费票
								</view>
								<view class="color_F74437 icon" v-else-if="item.status==4">
									待联系
								</view>
								<view class="color_F74437 icon" v-else-if="item.status==0 && item.paymentMethod==0">
									待支付
								</view>
								<view class="color_3CD489 icon" v-else-if="item.paymentMethod==1 && item.status==1">
									宝贝支付-交易成功
								</view>
								<view class="color_919397 icon" v-else-if="item.paymentMethod==1 && item.status==2">
									宝贝支付-交易取消
								</view>
								<view class="color_919397 icon" v-else-if="item.paymentMethod==0 && item.status==2">
									交易取消
								</view>
								<view class="color_3CD489 icon" v-else-if="item.paymentMethod==2 && item.status==1">
									微信支付-交易成功
								</view>
								<view class="color_919397 icon" v-else-if="item.paymentMethod==2 && item.status==2">
									微信支付-交易取消
								</view>
								<view class="color_919397 icon" v-else-if="item.status==3">
									已评价
								</view>
								<view class="color_F74437 icon" v-else-if="item.status==5">
									退款中
								</view>
								<view class="color_3CD489 icon" v-else-if="item.status==6">
									退款成功
								</view>
								<view class="color_919397 icon" v-else-if="item.status==7">
									退款失败
								</view>
							</view>
							<view class="flexRowStart magicInfo">
								<image lazy-load="true" :src="item.goodsImg" mode="aspectFill" class="goodsImg"></image>
								<view class="wrapInfo">
									<view class="color_303031 doubleEllipsis goods">
										{{$isEmpty(item.goods)?'':item.goods}}
									</view>
									<view class="flexRow icon" v-if="item.isFree==0">
										<text class="color_303031  icon" v-if="item.payCurrency==1">{{$isEmpty(item.goodsPrice)?'0':item.goodsPrice}}贝</text>
										<text class="color_303031  icon" v-else-if="item.payCurrency==2">{{$isEmpty(item.goodsCash)?'0':item.goodsCash}}元</text>
										<text class="color_303031  icon" v-else>{{$isEmpty(item.goodsPrice)?'0':item.goodsPrice}}贝/{{$isEmpty(item.goodsCash)?'0':item.goodsCash}}元</text>
								<!-- 		<text class="color_F74437 bold icon" v-if="item.paymentMethod==1">{{item.goodsPrice}}贝</text>
										<text class="color_F74437 bold icon" v-if="item.paymentMethod==2">{{item.goodsCash}}元</text> -->
										<text class="color_919397" >X{{$isEmpty(item.goodsAmount)?'0':item.goodsAmount}}</text>
									</view>
									<view class="flexRow icon" v-if="item.isFree==1">
										<view class="color_303031 icon">
											0贝
										</view>
										<text class="color_919397" >X{{$isEmpty(item.goodsAmount)?'0':item.goodsAmount}}</text>
									</view>
								</view>
							</view>
							<view class="color_919397 numInfo">
								<text style="margin-right: 30rpx;">共{{$isEmpty(item.goodsAmount)?'0':item.goodsAmount}}件</text>
								<text style="margin-right: 20rpx;">合计:</text>
								<text class="color_F74437 " v-if="item.payCurrency == 2 && item.isFree==0">{{$isEmpty(item.discountCash)?'0': item.discountCash}}元</text>
								<text class="color_F74437 " v-else-if="item.payCurrency == 1&& item.isFree==0">{{$isEmpty(item.discountPrice)?'0':item.discountPrice}}贝</text>
								<text class="color_F74437 " v-else-if="item.payCurrency == 9&& item.isFree==0">
									<text>{{$isEmpty(item.discountPrice)?'0':item.discountPrice}}贝/{{$isEmpty(item.discountCash)?'0':item.discountCash}}元</text>
									<!-- <text v-else-if="item.discountPrice>0">{{item.discountPrice}}贝</text>
									<text v-else-if="item.discountCash>0">{{item.discountCash}}元</text> -->
								</text>
								<text class="color_F74437 " v-else>0贝</text>
							</view>
							<view class="order-type" v-if="item.orderType == 1">
								<view class="order-type-text">服务订单</view>
								<view class="button applyBtn" @tap.stop="applyMagic(item)" v-if="item.status == 1">
									评论
								</view>
							</view>
							<view class="order-type" v-else-if="item.orderType == 2">
								<view class="order-type-text">活动订单</view>
							</view>
							<!-- <view class="button" style="width: 136rpx;height: 50rpx;padding: 0;font-size: 24rpx;line-height: 34rpx;border-radius: 10rpx;">
									继续付款
								</view> -->
						</view>
						<image class="emptyImg" v-if="!activityListEnd.length>0 && oss" :src="oss+'pic_energy_default_wudingdan.png'" mode="aspectFit"></image>
						<uni-load-more :status="activityMoreStatusEnd" v-if="activityListEnd.length>0"></uni-load-more>
					</scroll-view>
				</swiper-item>
				<swiper-item item-id="3">
					<scroll-view :scroll-top="30" scroll-y="true" class="scroll-Y" @scrolltolower="activityMoreRefund">
						<view class="list" v-for="(item, index) in activityListRefund" :key="index" @tap="goDetails(item)">
							<view class="color_303031 bold flexRowStart magicTitle">
								<image lazy-load="true" :src="soImageError(item.orgImg,$oss)" mode="aspectFill" class="orgImg"></image>
								<view class="singleEllipsis orgName">{{$isEmpty(item.orgName)?'':item.orgName}}</view>
								<view class="color_3CD489 icon" v-if="item.isFree==1 && item.status!=2 && item.status!=3&& item.status!=4">
									免费票
								</view>
								<view class="color_F74437 icon" v-else-if="item.status==4">
									待联系
								</view>
								<view class="color_F74437 icon" v-else-if="item.status==0 && item.paymentMethod==0">
									待支付
								</view>
								<view class="color_3CD489 icon" v-else-if="item.paymentMethod==1 && item.status==1">
									宝贝支付-交易成功
								</view>
								<view class="color_919397 icon" v-else-if="item.paymentMethod==1 && item.status==2">
									宝贝支付-交易取消
								</view>
								<view class="color_919397 icon" v-else-if="item.paymentMethod==0 && item.status==2">
									交易取消
								</view>
								<view class="color_3CD489 icon" v-else-if="item.paymentMethod==2 && item.status==1">
									微信支付-交易成功
								</view>
								<view class="color_919397 icon" v-else-if="item.paymentMethod==2 && item.status==2">
									微信支付-交易取消
								</view>
								<view class="color_919397 icon" v-else-if="item.status==3">
									已评价
								</view>
								<view class="color_F74437 icon" v-else-if="item.status==5">
									退款中
								</view>
								<view class="color_3CD489 icon" v-else-if="item.status==6">
									退款成功
								</view>
								<view class="color_919397 icon" v-else-if="item.status==7">
									退款失败
								</view>
							</view>
							<view class="flexRowStart magicInfo">
								<image lazy-load="true" :src="item.goodsImg" mode="aspectFill" class="goodsImg"></image>
								<view class="wrapInfo">
									<view class="color_303031 doubleEllipsis goods">
										{{$isEmpty(item.goods)?'':item.goods}}
									</view>
									<view class="flexRow icon" v-if="item.isFree==0">
										<text class="color_303031  icon" v-if="item.payCurrency==1">{{$isEmpty(item.goodsPrice)?'0':item.goodsPrice}}贝</text>
										<text class="color_303031  icon" v-else-if="item.payCurrency==2">{{$isEmpty(item.goodsCash)?'0':item.goodsCash}}元</text>
										<text class="color_303031  icon" v-else>{{$isEmpty(item.goodsPrice)?'0':item.goodsPrice}}贝/{{$isEmpty(item.goodsCash)?'0':item.goodsCash}}元</text>
										<text class="color_919397">X{{$isEmpty(item.goodsAmount)?'0':item.goodsAmount}}</text>
									</view>
									<view class="flexRow icon" v-if="item.isFree==1">
										<view class="color_303031 icon">
											0贝
										</view>
										<text class="color_919397">X{{$isEmpty(item.goodsAmount)?'0':item.goodsAmount}}</text>
									</view>
								</view>
							</view>
							<view class="color_919397 numInfo">
								<text style="margin-right: 30rpx;">共{{$isEmpty(item.goodsAmount)?'0':item.goodsAmount}}件</text>
								<text style="margin-right: 20rpx;">合计:</text>
								<text class="color_F74437 " v-if="item.payCurrency == 2&& item.isFree==0">{{$isEmpty(item.discountCash)?'0':item.discountCash}}元</text>
								<text class="color_F74437 " v-else-if="item.payCurrency == 1&& item.isFree==0">{{$isEmpty(item.discountPrice)?'0':item.discountPrice}}贝</text>
								<text class="color_F74437 " v-else-if="item.payCurrency==9&& item.isFree==0">
									<text v-if="item.discountPrice>0 && item.discountCash>0">{{$isEmpty(item.discountPrice)?'0':item.discountPrice}}贝/{{$isEmpty(item.discountCash)?'0':item.discountCash}}元</text>
									<!-- <text v-else-if="item.discountPrice>0">{{item.discountPrice}}贝</text>
									<text v-else-if="item.discountCash>0">{{item.discountCash}}元</text> -->
								</text>
								<text class="color_F74437 " v-else>0贝</text>
							</view>
							<view class="order-type" v-if="item.orderType == 1">
								<view class="order-type-text">服务订单</view>
								<view class="button applyBtn" @tap.stop="applyMagic(item)" v-if="item.status == 1">
									评论
								</view>
							</view>
							<view class="order-type" v-else-if="item.orderType == 2">
								<view class="order-type-text">活动订单</view>
							</view>
						</view>
						<image class="emptyImg" v-if="!activityListRefund.length>0 && oss" :src="oss+'pic_energy_default_wudingdan.png'" mode="aspectFit"></image>
						<uni-load-more :status="activityMoreStatusRefund" v-if="activityListRefund.length>0"></uni-load-more>
					</scroll-view>
				</swiper-item>
				<swiper-item item-id="4">
					<scroll-view :scroll-top="30" scroll-y="true" class="scroll-Y" @scrolltolower="activityMoreApply">
						<view class="list" v-for="(item, index) in activityListApply" :key="index" @tap="goDetails(item)">
							<view class="color_303031 bold flexRowStart magicTitle">
								<image lazy-load="true" :src="soImageError(item.orgImg,$oss)" mode="aspectFill" class="orgImg"></image>
								<view class="singleEllipsis orgName">{{$isEmpty(item.orgName)?'':item.orgName}}</view>
								<view class="color_3CD489 icon" v-if="item.isFree==1 && item.status!=2 && item.status!=3&& item.status!=4">
									免费票
								</view>
								<view class="color_F74437 icon" v-else-if="item.status==4">
									待联系
								</view>
								<view class="color_F74437 icon" v-else-if="item.status==0 && item.paymentMethod==0">
									待支付
								</view>
								<view class="color_3CD489 icon" v-else-if="item.paymentMethod==1 && item.status==1">
									宝贝支付-交易成功
								</view>
								<view class="color_919397 icon" v-else-if="item.paymentMethod==1 && item.status==2">
									宝贝支付-交易取消
								</view>
								<view class="color_919397 icon" v-else-if="item.paymentMethod==0 && item.status==2">
									交易取消
								</view>
								<view class="color_3CD489 icon" v-else-if="item.paymentMethod==2 && item.status==1">
									微信支付-交易成功
								</view>
								<view class="color_919397 icon" v-else-if="item.paymentMethod==2 && item.status==2">
									微信支付-交易取消
								</view>
								<view class="color_919397 icon" v-else-if="item.status==3">
									已评价
								</view>
								<view class="color_F74437 icon" v-else-if="item.status==5">
									退款中
								</view>
								<view class="color_3CD489 icon" v-else-if="item.status==6">
									退款成功
								</view>
								<view class="color_919397 icon" v-else-if="item.status==7">
									退款失败
								</view>
							</view>
							<view class="flexRowStart magicInfo">
								<image lazy-load="true" :src="item.goodsImg" mode="aspectFill" class="goodsImg"></image>
								<view class="wrapInfo">
									<view class="color_303031 doubleEllipsis goods">
										{{$isEmpty(item.goods)?'':item.goods}}
									</view>
									<view class="flexRow icon" v-if="item.isFree==0">
										<text class="color_303031  icon" v-if="item.payCurrency==1">{{$isEmpty(item.goodsPrice)?'0':item.goodsPrice}}贝</text>
										<text class="color_303031  icon" v-else-if="item.payCurrency==2">{{$isEmpty(item.goodsCash)?'0':item.goodsCash}}元</text>
										<text class="color_303031  icon" v-else>{{$isEmpty(item.goodsPrice)?'0':item.goodsPrice}}贝/{{$isEmpty(item.goodsCash)?'0':item.goodsCash}}元</text>
										<text class="color_919397">X{{$isEmpty(item.goodsAmount)?'0':item.goodsAmount}}</text>
									</view>
									<view class="flexRow icon" v-if="item.isFree==1">
										<view class="color_303031 icon">
											0贝
										</view>
										<text class="color_919397">X{{$isEmpty(item.goodsAmount)?'0':item.goodsAmount}}</text>
									</view>
								</view>
							</view>
							<view class="color_919397 numInfo">
								<text style="margin-right: 30rpx;">共{{$isEmpty(item.goodsAmount)?'0':item.goodsAmount}}件</text>
								<text style="margin-right: 20rpx;">合计:</text>
								<text class="color_F74437 " v-if="item.payCurrency == 2&& item.isFree==0">{{$isEmpty(item.discountCash)?'0':item.discountCash}}元</text>
								<text class="color_F74437 " v-else-if="item.payCurrency == 1&& item.isFree==0">{{$isEmpty(item.discountPrice)?'0':item.discountPrice}}贝</text>
								<text class="color_F74437 " v-else-if="item.payCurrency==9&& item.isFree==0">
									<text v-if="item.discountPrice>0 && item.discountCash>0">{{$isEmpty(item.discountPrice)?'0':item.discountPrice}}贝/{{$isEmpty(item.discountCash)?'0':item.discountCash}}元</text>
									<!-- <text v-else-if="item.discountPrice>0">{{item.discountPrice}}贝</text>
									<text v-else-if="item.discountCash>0">{{item.discountCash}}元</text> -->
								</text>
								<text class="color_F74437 " v-else>0贝</text>
							</view>
							<view class="order-type" v-if="item.orderType == 1">
								<view class="order-type-text">服务订单</view>
								<view class="button applyBtn" @tap.stop="applyMagic(item)" v-if="item.status == 1">
									评论
								</view>
							</view>
							<view class="order-type" v-else-if="item.orderType == 2">
								<view class="order-type-text">活动订单</view>
							</view>
						</view>
						<image class="emptyImg" v-if="!activityListApply.length>0 && oss" :src="oss+'pic_energy_default_wudingdan.png'" mode="aspectFit"></image>
						<uni-load-more :status="activityMoreStatusApply" v-if="activityListApply.length>0"></uni-load-more>
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	import {
		goCheckoutCounter,
		soImageError,
		imageError
	} from '@/common/utils.js'
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import {
		isEmpty
	} from '@/common/utils.js'
	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
				activityinfoAll: {},
				activityinfoIng: {},
				activityinfoEnd: {},
				activityinfoRefund: {},
				activityinfoApply: {},
				activityListAll: [],
				activityListIng: [],
				activityListEnd: [],
				activityListRefund: [],
				activityListApply: [],
				isAllActive: true,
				isUnderwayActive: false,
				isEndActive: false,
				isRefundActive:false,
				isApplyActive: false,
				item_id: 0,
				activityMoreStatusAll: 'more',
				activityMoreStatusIng: 'more',
				activityMoreStatusEnd: 'more',
				activityMoreStatusRefund: 'more',
				activityMoreStatusApply: 'more',
				oss: '',
				status: false
			};
		},
		onLoad() {
			uni.$on("orderRefresh", data => {
				this.status = data
			})
			this.oss = this.$oss
			this.$http.get('fms/order/my/order_page').then(res => {
				// console.log(res)
				this.activityinfoAll = res.data.data;
				this.activityListAll = res.data.data.records;
				if (this.activityinfoAll.current == this.activityinfoAll.pages) {
					this.activityMoreStatusAll = 'noMore';
				} else if (this.activityinfoAll.pages == 0) {
					this.activityMoreStatusAll = 'noMore';
				}
			})
			this.$http.get('fms/order/my/order_page', {
				params: {
					status: 0
				}
			}).then(res => {
				// console.log(res)
				this.activityinfoIng = res.data.data;
				this.activityListIng = res.data.data.records;
				if (this.activityinfoIng.current == this.activityinfoIng.pages) {
					this.activityMoreStatusIng = 'noMore';
				} else if (this.activityinfoIng.pages == 0) {
					this.activityMoreStatusIng = 'noMore';
				}
			})
			this.$http.get('fms/order/my/order_page', {
				params: {
					status: 1
				}
			}).then(res => {
				// console.log(res)
				this.activityinfoEnd = res.data.data;
				this.activityListEnd = res.data.data.records;
				if (this.activityinfoEnd.current == this.activityinfoEnd.pages) {
					this.activityMoreStatusEnd = 'noMore';
				} else if (this.activityinfoEnd.pages == 0) {
					this.activityMoreStatusEnd = 'noMore';
				}
			})
			this.$http.get('fms/order/my/order_page', {
				params: {
					status: 6
				}
			}).then(res => {
				// console.log(res)
				this.activityinfoRefund = res.data.data;
				this.activityListRefund = res.data.data.records;
				if (this.activityinfoRefund.current == this.activityinfoRefund.pages) {
					this.activityMoreStatusRefund = 'noMore';
				} else if (this.activityinfoRefund.pages == 0) {
					this.activityMoreStatusRefund = 'noMore';
				}
			})
			this.$http.get('fms/order/my/order_page', {
				params: {
					status: 3
				}
			}).then(res => {
				// console.log(res)
				this.activityinfoApply = res.data.data;
				this.activityListApply = res.data.data.records;
				if (this.activityinfoApply.current == this.activityinfoApply.pages) {
					this.activityMoreStatusApply = 'noMore';
				} else if (this.activityinfoApply.pages == 0) {
					this.activityMoreStatusApply = 'noMore';
				}
			})
		},
		onShow() {
			if (this.status == true) {
				this.$http.get('fms/order/my/order_page').then(res => {
					// console.log(res)
					this.activityinfoAll = res.data.data;
					this.activityListAll = res.data.data.records;
					if (this.activityinfoAll.current == this.activityinfoAll.pages) {
						this.activityMoreStatusAll = 'noMore';
					} else if (this.activityinfoAll.pages == 0) {
						this.activityMoreStatusAll = 'noMore';
					}
				})
				this.$http.get('fms/order/my/order_page', {
					params: {
						status: 0
					}
				}).then(res => {
					// console.log(res)
					this.activityinfoIng = res.data.data;
					this.activityListIng = res.data.data.records;
					if (this.activityinfoIng.current == this.activityinfoIng.pages) {
						this.activityMoreStatusIng = 'noMore';
					} else if (this.activityinfoIng.pages == 0) {
						this.activityMoreStatusIng = 'noMore';
					}
				})
				this.$http.get('fms/order/my/order_page', {
					params: {
						status: 1
					}
				}).then(res => {
					// console.log(res)
					this.activityinfoEnd = res.data.data;
					this.activityListEnd = res.data.data.records;
					if (this.activityinfoEnd.current == this.activityinfoEnd.pages) {
						this.activityMoreStatusEnd = 'noMore';
					} else if (this.activityinfoEnd.pages == 0) {
						this.activityMoreStatusEnd = 'noMore';
					}
				})
				this.$http.get('fms/order/my/order_page', {
					params: {
						status: 6
					}
				}).then(res => {
					// console.log(res)
					this.activityinfoRefund = res.data.data;
					this.activityListRefund = res.data.data.records;
					if (this.activityinfoRefund.current == this.activityinfoRefund.pages) {
						this.activityMoreStatusRefund = 'noMore';
					} else if (this.activityinfoRefund.pages == 0) {
						this.activityMoreStatusRefund = 'noMore';
					}
				})
				this.$http.get('fms/order/my/order_page', {
					params: {
						status: 3
					}
				}).then(res => {
					// console.log(res)
					this.activityinfoApply = res.data.data;
					this.activityListApply = res.data.data.records;
					if (this.activityinfoApply.current == this.activityinfoApply.pages) {
						this.activityMoreStatusApply = 'noMore';
					} else if (this.activityinfoApply.pages == 0) {
						this.activityMoreStatusApply = 'noMore';
					}
				})
			}
		},
		onUnload() {
			uni.$off()
		},
		methods: {
			soImageError,
			imageError,
			goCheckoutCounter,
			applyMagic(item) {
				uni.navigateTo({
					url: `/pages/my/orderList/orderDetails/magicApply/magicApply?id=${item.orderId}&type=${item.orderType}`
				})
			},
			cancelOrder(item, index) {
				let that = this
				uni.showModal({
					content: "你确定要取消该订单吗？",
					success: function(res) {
						if (res.confirm) {
							that.$http.get('dms/order/cancel/' + item.orderNumber).then(res => {
								console.log(res)
								if (res.data.code == 1) {
									uni.showToast({
										title: res.data.message,
										icon: "none"
									})
								} else {
									uni.showToast({
										title: "取消成功",
										icon: "none",
										duration: 1000,
										success: () => {
											setTimeout(() => {
												item.status = 2
												if (that.item_id == 1) {
													that.activityListIng.splice(index, 1)
												}
											}, 1000)
										}
									})
								}
							})
						} else if (res.cancel) {}
					}
				})
			},
			swiperChange(e) {
				if (e.detail.current == 0) {
					this.allClick();
				} else if (e.detail.current == 1) {
					this.underwayClick();
				} else if (e.detail.current == 2) {
					this.endClick()
				} else if (e.detail.current == 3) {
					this.refundClick()
				} else if (e.detail.current == 4) {
					this.applyClick()
				}
			},
			activityMoreAll() {
				let that = this;
				if (that.activityinfoAll.current < that.activityinfoAll.pages) {
					that.activityMoreStatusAll = 'loading';
					that.$http.get('fms/order/my/order_page', {
						params: {
							current: that.activityinfoAll.current + 1
						}
					}).then(res => {
						that.activityinfoAll.current = res.data.data.current;
						that.activityListAll = that.activityListAll.concat(res.data.data.records);
						that.activityMoreStatusAll = 'more';
					});
				} else {
					that.activityMoreStatusAll = 'noMore';
				}
			},
			activityMoreIng() {
				let that = this;
				if (that.activityinfoIng.current < that.activityinfoIng.pages) {
					that.activityMoreStatusIng = 'loading';
					that.$http.get('fms/order/my/order_page', {
						params: {
							status: 0,
							current: that.activityinfoIng.current + 1
						}
					}).then(res => {
						that.activityinfoIng.current = res.data.data.current;
						that.activityListIng = that.activityListIng.concat(res.data.data.records);
						that.activityMoreStatusIng = 'more';
					});
				} else {
					that.activityMoreStatusIng = 'noMore';
				}
			},
			activityMoreEnd() {
				let that = this;
				if (that.activityinfoEnd.current < that.activityinfoEnd.pages) {
					that.activityMoreStatusEnd = 'loading';
					that.$http.get('fms/order/my/order_page', {
						params: {
							status: 1,
							current: that.activityinfoEnd.current + 1
						}
					}).then(res => {
						that.activityinfoEnd.current = res.data.data.current;
						that.activityListEnd = that.activityListEnd.concat(res.data.data.records);
						that.activityMoreStatusEnd = 'more';
					});
				} else {
					that.activityMoreStatusEnd = 'noMore';
				}
			},
			activityMoreRefund() {
				let that = this;
				if (that.activityinfoRefund.current < that.activityinfoRefund.pages) {
					that.activityMoreStatusRefund = 'loading';
					that.$http.get('fms/order/my/order_page', {
						params: {
							status: 6,
							current: that.activityinfoRefund.current + 1
						}
					}).then(res => {
						that.activityinfoRefund.current = res.data.data.current;
						that.activityListRefund = that.activityListRefund.concat(res.data.data.records);
						that.activityMoreStatusRefund = 'more';
					});
				} else {
					that.activityMoreStatusRefund = 'noMore';
				}
			},
			activityMoreApply() {
				let that = this;
				if (that.activityinfoApply.current < that.activityinfoApply.pages) {
					that.activityMoreStatusApply = 'loading';
					that.$http.get('fms/order/my/order_page', {
						params: {
							status: 3,
							current: that.activityinfoApply.current + 1
						}
					}).then(res => {
						that.activityinfoApply.current = res.data.data.current;
						that.activityListApply = that.activityListApply.concat(res.data.data.records);
						that.activityMoreStatusApply = 'more';
					});
				} else {
					that.activityMoreStatusApply = 'noMore';
				}
			},
			allClick() {
				// console.log(666)
				this.isAllActive = true;
				this.isUnderwayActive = false;
				this.isEndActive = false;
				this.isRefundActive=false
				this.isApplyActive = false
				this.item_id = 0;
				this.$http.get('fms/order/my/order_page').then(res => {
					// console.log(res)
					this.activityinfoAll = res.data.data;
					this.activityListAll = res.data.data.records;
					if (this.activityinfoAll.current == this.activityinfoAll.pages) {
						this.activityMoreStatusAll = 'noMore';
					} else if (this.activityinfoAll.pages == 0) {
						this.activityMoreStatusAll = 'noMore';
					}
				});
			},
			underwayClick() {
				this.isAllActive = false;
				this.isUnderwayActive = true;
				this.isEndActive = false;
				this.isRefundActive=false
				this.isApplyActive = false
				this.item_id = 1;
				this.$http.get('fms/order/my/order_page', {
					params: {
						status: 0
					}
				}).then(res => {
					// console.log(res)
					this.activityinfoIng = res.data.data;
					this.activityListIng = res.data.data.records;
					if (this.activityinfoIng.current == this.activityinfoIng.pages) {
						this.activityMoreStatusIng = 'noMore';
					} else if (this.activityinfoIng.pages == 0) {
						this.activityMoreStatusIng = 'noMore';
					}
				});
				// console.log(this.showList)
			},
			endClick() {
				this.isAllActive = false;
				this.isUnderwayActive = false;
				this.isEndActive = true
				this.isRefundActive=false
				this.isApplyActive = false
				this.item_id = 2
				this.$http.get('fms/order/my/order_page', {
					params: {
						status: 1
					}
				}).then(res => {
					// console.log(res)
					this.activityinfoEnd = res.data.data;
					this.activityListEnd = res.data.data.records;
					if (this.activityinfoEnd.current == this.activityinfoEnd.pages) {
						this.activityMoreStatusEnd = 'noMore';
					} else if (this.activityinfoEnd.pages == 0) {
						this.activityMoreStatusEnd = 'noMore';
					}
				});
				// console.log(this.showList)
			},
			refundClick() {
				this.isAllActive = false;
				this.isUnderwayActive = false;
				this.isEndActive = false
				this.isRefundActive=true
				this.isApplyActive = false
				this.item_id = 3
				this.$http.get('fms/order/my/order_page', {
					params: {
						status: 6
					}
				}).then(res => {
					// console.log(res)
					this.activityinfoRefund = res.data.data;
					this.activityListRefund = res.data.data.records;
					if (this.activityinfoRefund.current == this.activityinfoRefund.pages) {
						this.activityMoreStatusRefund = 'noMore';
					} else if (this.activityinfoRefund.pages == 0) {
						this.activityMoreStatusRefund = 'noMore';
					}
				});
				// console.log(this.showList)
			},
			applyClick() {
				this.isAllActive = false;
				this.isUnderwayActive = false;
				this.isEndActive = false;
				this.isRefundActive=false
				this.isApplyActive = true
				this.item_id = 4
				this.$http.get('fms/order/my/order_page', {
					params: {
						status: 3
					}
				}).then(res => {
					// console.log(res)
					this.activityinfoApply = res.data.data;
					this.activityListApply = res.data.data.records;
					if (this.activityinfoApply.current == this.activityinfoApply.pages) {
						this.activityMoreStatusApply = 'noMore';
					} else if (this.activityinfoApply.pages == 0) {
						this.activityMoreStatusApply = 'noMore';
					}
				});
			},
			goDetails(item) {
				uni.navigateTo({
					url: `/pages/my/orderList/orderDetails/orderDetails?orderNumber=${item.orderNumber}`
				})
			},
			isEmpty
		}
	}
</script>

<style lang="scss">
	.applyBtn {
		width: 160rpx;
		height: 60rpx;
		padding: 0;
		font-size: 26rpx;
		line-height: 36rpx;
		border-radius: 30rpx;
	}

	.payBtn {
		width: 160rpx;
		height: 60rpx;
		padding: 0;
		font-size: 26rpx;
		line-height: 36rpx;
		border-radius: 30rpx;
		margin-left: 30rpx;
	}

	.cancelBtn {
		width: 156rpx;
		height: 56rpx;
		background: #FFFFFF;
		color: #272727;
		border: 2rpx solid #EDEDED;
		padding: 0;
		font-size: 26rpx;
		line-height: 36rpx;
		border-radius: 30rpx;
	}

	.container {
		height: 100vh;
		display: flex;
		flex-direction: column;

		.wrapTitle {
			padding: 24rpx 32rpx 0;
			display: flex;
			background-color: #FFFFFF;

			.title {
				text-align: center;
				flex: 1;

				.titleLine {
					width: 20rpx;
					height: 6rpx;
					border-radius: 10rpx;
					// background: linear-gradient(180deg, #FF825C 0%, #FF3636 100%);
					background-color: #46B28B;
					margin: 10rpx auto;
				}
			}
		}

		.scroll-Y {
			height: 100%;
			width: 702rpx;
			margin: 0 auto;

			.list {
				margin-bottom: 16rpx;
				background-color: #FFFFFF;
				border-radius: 16rpx;
				position: relative;
				padding: 32rpx;

				.order-type {
					display: flex;
					justify-content: space-between;
					align-items: center;

					.order-type-text {
						font-size: 24rpx;
						line-height: 34rpx;
						color: #919397;
					}
				}

				.magicTitle {
					font-size: 30rpx;
					line-height: 42rpx;
					margin-bottom: 24rpx;

					.orgImg {
						width: 36rpx;
						height: 36rpx;
						margin-right: 20rpx;
						border-radius: 50%;
					}

					.orgName {
						flex: 1;
						min-width: 0;
					}

					.icon {
						font-weight: normal;
					}
				}

				.magicInfo {
					margin-bottom: 24rpx;

					.goodsImg {
						width: 184rpx;
						height: 184rpx;
						margin-right: 24rpx;
						border-radius: 16rpx;
					}

					.wrapInfo {
						flex: 1;
						height: 184rpx;
						display: flex;
						flex-direction: column;
						align-items: flex-start;
						justify-content: space-between;

						.goods {
							font-size: 30rpx;
							line-height: 42rpx;
							margin-bottom: 40rpx;
						}

						.icon {
							width: 100%;
							font-size: 30rpx;
							line-height: 42rpx;
						}
					}
				}

				.numInfo {
					font-size: 30rpx;
					line-height: 42rpx;
					margin-bottom: 24rpx;
					text-align: right;
				}
			}
		}
	}

	page {
		background-color: #F4F5F6;
	}

	.active {
		color: #272727;
		font-size: 36rpx;
		font-weight: bold;
		line-height: 50rpx;
	}

	.unactive {
		color: #919397;
		font-size: 28rpx;
		font-weight: normal;
		line-height: 50rpx;
	}

	.swiper-item {
		display: block;
		height: 100%;
		// line-height: 300rpx;
		text-align: center;
		background-color: #f4f5f6;
	}
</style>
