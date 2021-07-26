# magic-viewport


直接在引入

```js
<script src="">
```



scale：是为了解决dpr的问题。scale 与 dpr  换算保证 设备像素与css像素 一比一的映射，

```js
var isAndroid = win.navigator.appVersion.match(/android/gi);
var isIPhone = win.navigator.appVersion.match(/iphone/gi);
var devicePixelRatio = win.devicePixelRatio;
if (isIPhone) {
 // iOS下，对于2和3的屏，用2倍的方案，其余的用1倍方案
 if (devicePixelRatio >= 3 && (!dpr || dpr >= 3)) { 
 dpr = 3;
 } else if (devicePixelRatio >= 2 && (!dpr || dpr >= 2)){
 dpr = 2;
 } else {
 dpr = 1;
 }
} else {
 // 其他设备下，仍旧使用1倍的方案
 dpr = 1;
}
scale = 1 / dpr;

 var meta = document.createElement('meta');
 // dpr
 meta.setAttribute('content', 'initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no');
 document.getElementsByTagName('head')[0].appendChild(meta);
```


rem： 是为了解决不同机型不同宽度的问题

拿到设计稿，该怎么下手？

通过上面的 rem 换算，我们能够知道，如何把视觉稿（750px）中元素的 px 转换成 rem。

（1）设置 html font-size，如将手机屏幕分成10份【方便换算】：

```js
 // rem
 document.addEventListener('DOMContentLoaded', function (e) {
  document.getElementsByTagName('html')[0].style.fontSize = window.innerWidth / 10 + 'px';
 }, false);
```

（2）假设设计稿上的元素宽度为 375px，则转成rem元素宽度：

x = (375/750) * 10rem =  5rem
