/*
 * magic-viewport
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    var opt = {
        fontSize: 14,
        baseWidth: 540,
        baseScale: 0,
    };
    var MagicViewport = /** @class */ (function () {
        function MagicViewport(opt) {
            this.bScale = opt.baseScale;
            this.fSize = opt.fontSize;
            this.bWidth = opt.baseWidth;
            this.dpr = 0;
            this.timer = 0;
            this.setRootDpr();
            this.init();
        }
        Object.defineProperty(MagicViewport.prototype, "$Win", {
            get: function () {
                return window;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MagicViewport.prototype, "$doc", {
            get: function () {
                return window.document;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MagicViewport.prototype, "docEle", {
            get: function () {
                return this.$doc.documentElement;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MagicViewport.prototype, "$dpr", {
            get: function () {
                return this.$Win.devicePixelRatio || 1;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MagicViewport.prototype, "$version", {
            get: function () {
                return (this.$Win.navigator.appVersion.match(/android/gi) ||
                    this.$Win.navigator.appVersion.match(/iphone/gi));
            },
            enumerable: true,
            configurable: true
        });
        MagicViewport.prototype.init = function () {
            var _this = this;
            this.$Win.addEventListener('resize', function () {
                clearTimeout(_this.timer);
                _this.timer = setTimeout(_this.setRootDpr, 300);
            }, false);
            this.$Win.addEventListener('pageshow', function (e) {
                if (e.persisted) {
                    clearTimeout(_this.timer);
                    _this.timer = setTimeout(_this.setRootDpr, 300);
                }
            }, false);
            if (this.$doc.readyState === 'complete') {
                // this.$doc.body.style.fontSize = 12 * this.dpr + 'px';
            }
            else {
                this.$doc.addEventListener('DOMContentLoaded', function (e) {
                    // @ts-ignore
                    // this.$doc.body.style.fontSize = 12 * this.dpr + 'px';
                }, false);
            }
        };
        MagicViewport.prototype.setRootDpr = function () {
            var DPR = this.$dpr;
            console.log(this.$version);
            if (this.$version) {
                if (DPR && DPR >= 3) {
                    this.dpr = 3;
                }
                else if (DPR && DPR >= 2) {
                    this.dpr = 2;
                }
                else {
                    this.dpr = 1;
                }
            }
            this.bScale = 1 / this.dpr;
            var metaViewport = document.querySelector('meta[name="viewport"]');
            // @ts-ignore
            metaViewport && (metaViewport.remove ? metaViewport.remove() : metaViewport.parentElement.removeChild(metaViewport));
            metaViewport = this.$doc && this.$doc.createElement("meta");
            metaViewport.setAttribute("name", "viewport");
            metaViewport.setAttribute("content", "width=device-width, initial-scale=" + this.bScale + ", maximum-scale=" + this.bScale + ", minimum-scale=" + this.bScale + ", user-scalable=no");
            // @ts-ignore
            if (this.docEle.firstElementChild) {
                // @ts-ignore
                this.docEle.firstElementChild.appendChild(metaViewport);
            }
            else {
                var wrap = this.$doc.createElement('div');
                wrap.appendChild(metaViewport);
                this.$doc.write(wrap.innerHTML);
            }
            var htmlWidth;
            // @ts-ignore
            htmlWidth = this.docEle.getBoundingClientRect().width || this.docEle.clientWidth;
            htmlWidth / this.dpr > this.bWidth && (htmlWidth = this.bWidth * this.dpr);
            var fontSize = htmlWidth / 10;
            // @ts-ignore
            this.docEle.style.fontSize = fontSize + "px";
            // @ts-ignore
            this.docEle.setAttribute('data-dpr', this.dpr);
        };
        return MagicViewport;
    }());
    new MagicViewport(opt);
    return new MagicViewport(opt);
});
