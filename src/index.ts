/*
 * magic-viewport
 */

interface MVInterface {
  fontSize: number;
  baseWidth: number;
  baseScale: number;
}

const opt: MVInterface = {
  fontSize: 14,
  baseWidth: 540,
  baseScale: 0
};

class MagicViewport {
  private bScale: number;
  private fSize: number;
  private bWidth: number;
  private dpr: number;
  private timer: any;

  constructor(opt: MVInterface) {
    this.bScale = opt.baseScale;
    this.fSize = opt.fontSize;
    this.bWidth = opt.baseWidth;
    this.dpr = 0;
    this.timer = 0;
    this.setRootDpr();
    this.init();
  }

  get $Win() {
    return window;
  }

  get $doc() {
    return window.document;
  }

  get docEle() {
    return this.$doc.documentElement;
  }

  get $dpr() {
    return this.$Win.devicePixelRatio || 1;
  }

  get $version() {
    return (
      this.$Win.navigator.appVersion.match(/android/gi) ||
      this.$Win.navigator.appVersion.match(/iphone/gi)
    );
  }

  init() {
    this.$Win.addEventListener(
      'resize',
      () => {
        clearTimeout(this.timer);
        this.timer = setTimeout(this.setRootDpr, 300);
      },
      false
    );
    this.$Win.addEventListener(
      'pageshow',
      e => {
        if (e.persisted) {
          clearTimeout(this.timer);
          this.timer = setTimeout(this.setRootDpr, 300);
        }
      },
      false
    );

    if (this.$doc.readyState === 'complete') {
      // this.$doc.body.style.fontSize = 12 * this.dpr + 'px';
    } else {
      this.$doc.addEventListener(
        'DOMContentLoaded',
        e => {
          // @ts-ignore
          // this.$doc.body.style.fontSize = 12 * this.dpr + 'px';
        },
        false
      );
    }
  }

  setRootDpr() {
    const DPR = this.$dpr;

    console.log(this.$version);

    if (this.$version) {
      if (DPR && DPR >= 3) {
        this.dpr = 3;
      } else if (DPR && DPR >= 2) {
        this.dpr = 2;
      } else {
        this.dpr = 1;
      }
    }

    this.bScale = 1 / this.dpr;

    let metaViewport = document.querySelector('meta[name="viewport"]');
    // @ts-ignore
    metaViewport &&
      (metaViewport.remove
        ? metaViewport.remove()
        : metaViewport.parentElement.removeChild(metaViewport));
    metaViewport = this.$doc && this.$doc.createElement('meta');
    metaViewport.setAttribute('name', 'viewport');
    metaViewport.setAttribute(
      'content',
      'width=device-width, initial-scale=' +
        this.bScale +
        ', maximum-scale=' +
        this.bScale +
        ', minimum-scale=' +
        this.bScale +
        ', user-scalable=no'
    );
    // @ts-ignore
    if (this.docEle.firstElementChild) {
      // @ts-ignore
      this.docEle.firstElementChild.appendChild(metaViewport);
    } else {
      let wrap = this.$doc.createElement('div');
      wrap.appendChild(metaViewport);
      this.$doc.write(wrap.innerHTML);
    }

    let htmlWidth;
    // @ts-ignore
    htmlWidth =
      this.docEle.getBoundingClientRect().width || this.docEle.clientWidth;
    htmlWidth / this.dpr > this.bWidth && (htmlWidth = this.bWidth * this.dpr);
    let fontSize = htmlWidth / 10;
    // @ts-ignore
    this.docEle.style.fontSize = fontSize + 'px';
    // @ts-ignore
    this.docEle.setAttribute('data-dpr', this.dpr);
  }
}

new MagicViewport(opt);
