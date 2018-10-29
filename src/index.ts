/*
 * magic-viewport
 */

interface MVInterface {
    fontSize: number
    baseWidth: number
    baseScale: number
}

const opt: MVInterface ={
    fontSize: 14,
    baseWidth: 540,
    baseScale: 0,
}

class MagicViewport {
    private bScale: number;
    private fSize: number;
    private bWidth: number;
    private dpr: number;
    private timer: number;
    constructor(opt: MVInterface) {
        this.bScale = opt.baseScale
        this.fSize = opt.fontSize
        this.bWidth = opt.baseWidth
        this.dpr = 0
        this.timer = 0
        this.init()
    }
    get $Win() {
        return window
    }
    get $doc() {
        return window.document
    }
    get $html() {
        return this.$doc.documentElement
    }
    get $dpr() {
        return this.$Win.devicePixelRatio || 1
    }
    get $version() {
        return (
            this.$Win.navigator.appVersion.match(/android/ig),
            this.$Win.navigator.appVersion.match(/iphone/ig)
        )
    }
    
    init() {
        this.$Win.addEventListener('resize', ()=> {
            clearTimeout(this.timer);
            this.timer = setTimeout(this.geneteMeta, 300);
        }, false);
        this.$Win.addEventListener('pageshow', (e) =>{
            if (e.persisted) {
                clearTimeout(this.timer);
                this.timer = setTimeout(this.geneteMeta, 300);
            }
        }, false);

        if (this.$doc.readyState === 'complete') {
            this.$doc.body.style.fontSize = 12 * this.dpr + 'px';
        } else {
            this.$doc.addEventListener('DOMContentLoaded', (e) =>{
                // @ts-ignore
                this.$doc.body.style.fontSize = 12 * this.dpr + 'px';
            }, false);
        }

    }
    
    
    setRootDpr() {
        const DPR = this.$dpr;
        if (this.$version) {
            if (DPR && DPR>=3) {
                this.dpr = DPR
            } else if (DPR && DPR>=2) {
                this.dpr = 2
            } else {
                this.dpr = 1
            }
        }
    }

    setRootSize() {
        this.setRootDpr()
        let htmlWidth;
        // @ts-ignore
        htmlWidth = this.$html.getBoundingClientRect().width || this.$html.clientWidth;
        htmlWidth / this.dpr > this.bWidth && (htmlWidth = this.bWidth * this.dpr)
        let fontSize = htmlWidth / 10;
        // @ts-ignore
        this.$html.style.fontSize = fontSize + "px";
        // @ts-ignore
        this.$html.setAttribute('data-dpr', this.dpr);
    }

    geneteMeta() {
        this.setRootSize()
        let metaViewport = document.querySelector('meta[name="viewport"]')
        // @ts-ignore
        metaViewport && (metaViewport.remove ? metaViewport.remove() : metaViewport.parentElement.removeChild(metaViewport));
        metaViewport = this.$doc.createElement("meta");
        metaViewport.setAttribute("name", "viewport");
        metaViewport.setAttribute("content", "width=device-width, initial-scale=" + this.dpr + ", maximum-scale=" + this.dpr + ", minimum-scale=" + this.dpr + ", user-scalable=no");
        if (this.$doc.firstElementChild) {
            this.$doc.firstElementChild.appendChild(metaViewport)
        } else {
            const div = this.$doc.createElement("div");
            div.appendChild(metaViewport)
            this.$doc.write(div.innerHTML)
        }
    }

}

export = new MagicViewport(opt)

