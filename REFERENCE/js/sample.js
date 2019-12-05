/**
 * ui.js ^^!! ^^
 */
(function(window, $, TweenMax, Swiper, _, App){
  "use strict";

  var mq     = window.matchMedia('screen and (max-width:767px)'),
      mode   = 'prod',
      config = {
        set: function(mode) {
          if(typeof mode === 'string' && mode === 'dev') {
            mode = 'dev';
            window.App = App;
          } else {
            delete window.App;
          }
        },
        get: function() {
          return mode;
        },
        init: function(){
          var html = "<div class='mConsole' style='width:100%;padding:15px;box-sizing:border-box;position:fixed;bottom:0;left:0;z-index:10000;background-color:#000;font-size:16px;color:#fff;'></div>"
          $("body").append(html);
          return this;
        },
        log: function() {
          $(".mConsole").text([].join.call(arguments, ', '));
        }
      };

  // Device    
  var MOBILE = 'MOBILE',
      PC     = 'PC',
      device;

  // Component
  function Tab() {
    return {
      namespace: 'Tab',
      events: {
        CLICK_TAB: 'click.tab'
      },
      init: function() {
        this.wrapperClass = '.tabWrap';
        this.btnTabClass = '.btnTab';
        this.tabConClass = '.tabCon';
        this.activeClass = 'on';
        this.disabeldClass = 'disabled';

        this.$wrap = App.$body.find(this.wrapperClass);
        this.$btnTab = this.$wrap.find(this.btnTabClass);
        this.$tabCon = this.$wrap.find(this.tabConClass);

        this.addEvents();
      },
      addEvents: function() {
        var _this = this;
        function handleClicked(e) {
          e.stopPropagation();
          if($(this).hasClass(_this.disabeldClass)) return;
          var index = $(this).index();
          $(this).addClass(_this.activeClass).siblings().removeClass(_this.activeClass);
          _this.$tabCon.removeClass(_this.activeClass).eq(index).addClass(_this.activeClass);

        }
        _this.$btnTab.off(_this.events.CLICK_TAB).on(_this.events.CLICK_TAB, handleClicked);


      }
    }
  }

  function SelectBox(el) {
    this.namespace = 'SelectBox';
    this.$el = $(el);
    this.init = function(device) {
      this.btnSelectClass = '.btnSelect',
      this.optionListClass = '.optionList';
      this.optionClass = '.option';
      this.openClass = 'open';
      this.selectedClass = 'selected';
      this.disabledClass = 'disabled';

      this.$btnSelect = this.$el.find(this.btnSelectClass);
      this.$optionList = this.$el.find(this.optionListClass);
      this.$option = this.$el.find(this.optionClass);
      this.addEvents(device);
    }
  }

  SelectBox.prototype.events = {
    CLICK_OPEN_SELECT: 'click.open',
    CLICK_OPTION: 'click.option'
  }

  SelectBox.prototype.addEvents = function(device) {
    var _this = this;
    function handleChanged() {
      if($(this).hasClass(_this.disabledClass)) return
      
      if($(this).toggleClass(_this.openClass).hasClass(_this.openClass)) {
        _this.$option.on(_this.events.CLICK_OPTION, function(){
          var text = $(this).find("span").text();
          $(this).addClass(_this.selectedClass).siblings().removeClass(_this.selectedClass);
          _this.$btnSelect.trigger(_this.events.CLICK_OPEN_SELECT).find("span").text(text);
        })
      } else {
        _this.$option.off(_this.events.CLICK_OPTION);
      }
    }
    _this.$btnSelect.off(_this.events.CLICK_OPEN_SELECT).on(_this.events.CLICK_OPEN_SELECT, handleChanged);
    _this.$btnSelect.find("> span").on(_this.events.CLICK_OPEN_SELECT, function(e){
      e.stopPropagation();
      $(this).parent(_this.btnSelectClass).trigger(_this.events.CLICK_OPEN_SELECT);
    })
    $(document).off(_this.events.CLICK_OPEN_SELECT).on(_this.events.CLICK_OPEN_SELECT, function(e){
      if(e.target.nodeName !== "BUTTON" && !$(e.target).hasClass(_this.btnSelectClass)) {
        $(_this.btnSelectClass).filter("[class*="+ _this.openClass +"]").trigger(_this.events.CLICK_OPEN_SELECT);
      } 
    }) 
  }

  function Popup() {
    return {
      namespace: 'Popup',
      events: {
        CLICK_OPEN_POPUP: 'click.openPopup',
        CLICK_CLOSE_POPUP: 'click.closePopup'
      },
      init: function(device) {
        this.wrapperClass = '[class*="popTy"]';
        this.btnOpenClass = '.btnPopOpen';
        this.btnCloseClass = '.btnPopClose';

        this.backDropPopupClass = 'popTyBackDrop';
        this.fullPopupClass = 'popTyFull';
        this.toastPopupClass = 'popTyToast';

        this.$wrap = App.$body.find(this.wrapperClass).not(".apAlert");  // (KGC) apAlert은 제외처리
        this.$btnPopOpen = App.$body.find(this.btnOpenClass);
        this.$btnPopClose = App.$body.find(this.btnCloseClass).not(".apBtnPopClose");  // (KGC) apBtnPopClose은 제외처리

        this.$wrap.removeAttr("style");
        App.$dim.removeAttr("style");

        this.addEvents(device);
      },
      addEvents: function(device) {
        var _this = this;
        _this.$btnPopOpen.off(_this.events.CLICK_OPEN_POPUP).on(_this.events.CLICK_OPEN_POPUP, function(){
          var id = $(this).data("id");
          _this.handleOpenPopup.apply(_this, [id, device]);
        })
        _this.$btnPopClose.off(_this.events.CLICK_CLOSE_POPUP).on(_this.events.CLICK_CLOSE_POPUP, function(){
          var id = $(this).parents(_this.wrapperClass).attr("id");
          _this.handleClosePopup.apply(_this, [id, device])
        })
                
        //App.utils.hasJqueryObject(_this.$btnPopOpen) && _this.$btnPopOpen.trigger(_this.events.CLICK_OPEN_POPUP);
      },
      handleOpenPopup: function(id, device) {
        var _this = this;
        var $target = $("#" + id);
        if(device === MOBILE) {
          if($target.hasClass(this.backDropPopupClass)) { // 백 드롭
            TweenMax.to($target, .35, { y: 0 + '%', autoAlpha: 1, ease: Power1.easeOut });
            TweenMax.to(App.$dim, .45, { autoAlpha: 1, ease: Linear.easeNone })
            App.$dim.off(this.events.CLICK_CLOSE_POPUP).on(this.events.CLICK_CLOSE_POPUP, _.bind(this.handleClosePopup, this, id, device));
          } else if($target.hasClass(this.fullPopupClass)) { // 풀 팝업
            TweenMax.set($target, { display: 'block' })
          } else if($target.hasClass(this.toastPopupClass)) { // 토스트 팝업
            TweenMax.to($target, .45, { x: -50 + '%', y: 0 + '%', autoAlpha: 1, ease: Linear.easeOut, onComplete: function(){
              TweenMax.delayedCall(1, function(){
                _this.handleClosePopup(id, device);
              })
            }})
          } else  { // 레이어 팝업
            TweenMax.to($target, .65, { autoAlpha: 1, ease: Power1.easeOut })
            TweenMax.to(App.$dim, .45, { autoAlpha: 1, ease: Linear.easeNone })
            App.$dim.off(this.events.CLICK_CLOSE_POPUP).on(this.events.CLICK_CLOSE_POPUP, _.bind(this.handleClosePopup, this, id, device));
          }
         
        } else {
          if($target.hasClass(this.toastPopupClass)) { // 토스트 팝업
            TweenMax.to($target, .45, { x: -50 + '%', y: 0 + '%', autoAlpha: 1, ease: Linear.easeOut, onComplete: function(){
              TweenMax.delayedCall(1, function(){
                _this.handleClosePopup(id, device);
              })
            }})
          } else { // 레이어 팝업
            TweenMax.to($target, .65, { autoAlpha: 1, ease: Power1.easeOut })
            TweenMax.to(App.$dim, .45, { autoAlpha: 1, ease: Linear.easeNone })
            App.$dim.off(this.events.CLICK_CLOSE_POPUP).on(this.events.CLICK_CLOSE_POPUP, _.bind(this.handleClosePopup, this, id, device));
          }
        }
      },
      handleClosePopup: function(id, device) {
        var $target = $("#" + id);
        if(device === MOBILE) {
          if($target.hasClass(this.backDropPopupClass)) { // 백 드롭
            TweenMax.to($target, .35, { y: 100 + '%', autoAlpha: 0, ease: Power1.easeOut })
            TweenMax.to(App.$dim, .45, { autoAlpha: 0, ease: Linear.easeNone })
            App.$dim.off(this.events.CLICK_CLOSE_POPUP);
          } else if($target.hasClass(this.fullPopupClass)) { // 풀 팝업
            TweenMax.set($target, { display: 'none' })
            
          } else if($target.hasClass(this.toastPopupClass)) { // 토스트 팝업
            TweenMax.to($target, .45, { x: -50 + '%', y: 100 + '%', autoAlpha: 0, ease: Linear.easeOut })
          } else { // 레이어 팝업
            TweenMax.to($target, .65, { autoAlpha: 0, ease: Power1.easeOut })
            TweenMax.to(App.$dim, .45, { autoAlpha: 0, ease: Linear.easeNone })
            App.$dim.off(this.events.CLICK_CLOSE_POPUP);
          }
        } else {
          if($target.hasClass(this.toastPopupClass)) { // 토스트 팝업
            TweenMax.to($target, .45, { x: -50 + '%', y: 100 + '%', autoAlpha: 0, ease: Linear.easeOut })
          } else { // 레이어 팝업
            TweenMax.to($target, .65, { autoAlpha: 0, ease: Power1.easeOut })
            TweenMax.to(App.$dim, .45, { autoAlpha: 0, ease: Linear.easeNone })
            App.$dim.off(this.events.CLICK_CLOSE_POPUP);
          }

        }
      }
    }
  }

  function mapToSwipe(options){
    var CONTAINER_CLASS = 'containerModifierClass';

    var ElementInstanceOf = options[CONTAINER_CLASS] instanceof HTMLElement;
    
    return function() {
      return new Swiper(
        ElementInstanceOf ? options[CONTAINER_CLASS] : '.' + options[CONTAINER_CLASS], 
        ElementInstanceOf 
        ? _.extend({}, options, { containerModifierClass: _.isString($(options[CONTAINER_CLASS]).attr("class")) && _.first($(options[CONTAINER_CLASS]).attr("class").split(" ")) })
        : options
      );
    }
  }

  function Toggle() {
    return {
      namespace: 'Toggle',
      events: {
        CLICK_TOGGLE: 'click.toggle'
      },
      init: function() {
        this.toggleTargetClass = '.toggle';
        this.toggleClass = 'on';

        this.$toggleTarget = App.$body.find(this.toggleTargetClass);

        this.addEvents();
        
      },
      addEvents: function() {
        var _this = this;
        function handleToggle(e) {
          e.stopPropagation();
          if($(this).parents(_this.toggleTargetClass).toggleClass(_this.toggleClass).hasClass(_this.toggleClass)) {
            $(this).parents(_this.toggleTargetClass).siblings().removeClass(_this.toggleClass);
          }
        }
        _this.$toggleTarget.off(_this.events.CLICK_TOGGLE).on(_this.events.CLICK_TOGGLE, ".btnToggle", handleToggle);

        $(document).off(_this.events.CLICK_TOGGLE).on(_this.events.CLICK_TOGGLE, function(e){
          if(e.target.nodeName !== 'BUTTON' && !$(e.target).parents().hasClass("toggle")) {
            if(App.utils.hasJqueryObject($(".icoInfo")) && document.querySelector(".icoInfo").nodeName === 'BUTTON' && $(".icoInfo").parents(".toggle").hasClass("on")) {
              $(".icoInfo").trigger(_this.events.CLICK_TOGGLE);
            }
          }
        })

      }
    }
  }


  function Fold() {
    return {
      namespace: "Fold",
      events: {
        CLICK_FOLD: "click.fold"
      },
      init: function() {
        this.foldClass = '.fold';
        this.toggleClass = 'on';
        this.$fold = App.$body.find(this.foldClass);
        this.addEvents();
      },
      addEvents: function() {
        var _this = this;
        function handleClicked() {
          $(this).parent(_this.foldClass).toggleClass(_this.toggleClass)
        }
        _this.$fold.off(_this.events.CLICK_FOLD).on(_this.events.CLICK_FOLD, "button", handleClicked);
      }
    }
  }

  function Flip() {
    return {
      namespace: 'Profile Flip',
      events: {
        CLICK_FLIP: 'click.flip'
      },
      init: function() {
        this.flipClass = '.flip';
        this.toggleClass = 'on';

        this.$flip = App.$body.find(this.flipClass);
        this.addEvents();
      },
      addEvents: function() {
        var _this = this;
        function handleClicked(e) {
          e.stopPropagation();
          if(!$(this).find(".fold").hasClass("on")) return;
          $(this).toggleClass(_this.toggleClass);

        };
        _this.$flip.off(_this.events.CLICK_FLIP).on(_this.events.CLICK_FLIP, handleClicked)
      }
    }
  }

  function StarPoints() {
    function utils(e){
      var x = 0, rect = this.$starWrapper.get(0).getBoundingClientRect();
      switch(e.type) {
        case 'mousemove':
          x = (e.pageX - rect.left)- window.pageXOffset; 
          break;
        case 'touchmove':
          x = (e.originalEvent.targetTouches[0].pageX - rect.left)- window.pageXOffset;
          break;
      }
      return x;
    };
    return {
      namespace: 'STAR POINT',
      events: {
        CLICK_RESET_BUTTON: 'click.reset',
        CLICK_CONFIRM_BUTTON: 'click.confirm',
      },
      init: function() {
        var _this = this;
        this.wrapperClass = '.startPointsWrap';
        this.childClass = '.icoStarPoint';
        this.childActiveClass = 'on';
        this.pointClass = '.point';
      
        this.mainTxtClass = '.mainTxt';
        this.finishedTxtClass = '.finishedTxtWrap';

        this.isMouseMoveStart = false;
        
        this.$starWrapper = App.$body.find(this.wrapperClass);
        this.$starChild = this.$starWrapper.find(this.childClass);
        this.$point = this.$starWrapper.find(this.pointClass);

        this.$mainTxt = App.$body.find(this.mainTxtClass);
        this.$finishedTxt = App.$body.find(this.finishedTxtClass);

        this.grid = [];

        this.point = 0;
    
        this.$starChild.each(function(idx){
          _this.grid.push($(this).outerWidth(true) * idx);
        })

        this.addEvents();
      },
      addEvents: function() {
        var _this = this;

        function PopupController(id) {
          var self = this;
          this.$elem = $("#" + id);
          this.activeIndex = 0;

          _this.pointsArray = _.map(new Array(App.swiperGovernance.slides.length), function(){ return });
  
          App.swiperGovernance.on("touchEnd", function(){
            self.activeIndex = $(this.$el).find(".swiper-slide-active").index();
          })
          App.swiperGovernance.on("slideChangeTransitionEnd", function(){
            self.activeIndex = $(this.$el).find(".swiper-slide-active").index();
          })

          this.reset = function() {
            //App.popup.handleClosePopup(id, device);
            _this.$point.text(0);
            _this.$starChild.removeClass(_this.childActiveClass);
            //this.$elem.find(".btnPrimaryTy03").off(_this.events.CLICK_RESET_BUTTON);
            //this.$elem.find(".btnPrimaryTy01").off(_this.events.CLICK_CONFIRM_BUTTON)
          }
          
          // this.open = function(count) {
          //   App.popup.handleOpenPopup(id, device);
          //   this.changeCount(count);
          //   this.initEvent();
          // }

          this.confirm = function(count) {
            var self = this;
            this.changeCount(count);
            this.reset();
            _this.pointsArray = _.map(_this.pointsArray, function(value, key){
              return (key === self.activeIndex) ? _this.point : value
            })
            var $currentTarget = $(".fold").eq(this.activeIndex);

            if($currentTarget.parents(".card").hasClass("on")) {
              $currentTarget.parents(".card").removeClass("on");
              TweenMax.delayedCall(.35, function(){
                $currentTarget.removeClass("on").parents(".card").addClass("finish");
                $currentTarget.find(".back").prepend("<p class='finishedTxt'>평점주기 완료</p>")
                TweenMax.fromTo($currentTarget.find(".finishedTxt"), .45, { opacity:0 }, { opacity:1, ease: Linear.easeNone, onComplete: function(){
                  App.swiperGovernance.slideTo(self.activeIndex + 1);
                }})
              })
            } else {
              $currentTarget.removeClass("on").parents(".card").addClass("finish");
              $currentTarget.find(".back").prepend("<p class='finishedTxt'>평점주기 완료</p>")
              TweenMax.fromTo($currentTarget.find(".finishedTxt"), .45, { opacity:0 }, { opacity:1, ease: Linear.easeNone, delay:.35, onComplete: function(){
                App.swiperGovernance.slideTo(self.activeIndex + 1);
              }})
            }

            if(this.activeIndex === (App.swiperGovernance.slides.length -1) && $(".fold.on").length <= 0) { // 완료
              TweenMax.delayedCall(1, function(){
                console.log('완료');
                //App.popup.handleOpenPopup("alertPopup");
              })
            }
          }

          // this.initEvent = function() {
          //   this.$elem.find(".btnPrimaryTy03").off(_this.events.CLICK_RESET_BUTTON).on(_this.events.CLICK_RESET_BUTTON, function(){
          //     self.reset();
          //   })
          //   this.$elem.find(".btnPrimaryTy01").off(_this.events.CLICK_CONFIRM_BUTTON).on(_this.events.CLICK_CONFIRM_BUTTON, function(){
          //     self.confirm();
          //   })
          // }

          this.changeCount = function(count) {
            this.$elem.find(".count").text(count);
          }
        }
        
        _this.ctrl = new PopupController("starPointPopup")

        function handlePointerDown() {
          if(_this.ctrl.activeIndex === (App.swiperGovernance.slides.length -1) && $(".fold.on").length <= 0) return;

          if($(".fold").eq(_this.ctrl.activeIndex).parent(".card").hasClass("finish")) return;

          _this.isMouseMoveStart = true;
          _this.$mainTxt.hide();
          _this.$finishedTxt.show();
        }
        function handlePointerMove(e) {
    
          if(!_this.isMouseMoveStart) return;
    
          var pos = utils.call(_this, e);
          
          _this.point = _this.$starChild.filter("[class*="+ _this.childActiveClass +"]").length;
    
          _this.$starChild.each(function(idx){
            var offsetLeft = _this.grid[idx];
            
            if(offsetLeft < pos) {
              $(this).addClass(_this.childActiveClass)
            } else {
              if (pos < 0) return;
              $(this).removeClass(_this.childActiveClass);
            }
          })
          _this.$point.text(_this.point);
          _this.$finishedTxt.find(".myPoint").text(_this.point);
        }
        function handlePointerUp(e) {
          _this.point = _this.$starChild.filter("[class*="+ _this.childActiveClass +"]").length;;
          _this.isMouseMoveStart = false;
          if(_this.point <= 0) return;

          // if(_this.ctrl.activeIndex === (App.swiperGovernance.slides.length -1) && $(".fold.on").length <= 0) { // 완료
          //   return;
          // } else {
          //   _this.ctrl.confirm(_this.point);
          // }

          _this.$mainTxt.show();
          _this.$finishedTxt.hide();
        }
        function handleStarPointDown() {
          if($(".fold").eq(_this.ctrl.activeIndex).parent(".card").hasClass("finish")) return;

          var index = $(this).index()
          _this.$starChild.removeClass(_this.childActiveClass);
          for(var i = 0; i <= index; i++) {
            _this.$starChild.eq(i).addClass(_this.childActiveClass);
          }
          _this.point = index + 1;
          _this.$point.text(_this.point);
        }
        _this.$starWrapper.off("touchstart mousedown").on("touchstart mousedown", handlePointerDown);
        _this.$starWrapper.off("touchmove mousemove").on("touchmove mousemove", handlePointerMove);
        _this.$starWrapper.off("touchend mouseup").on("touchend mouseup", handlePointerUp);
        _this.$starChild.off("touchstart mousedown").on("touchstart mousedown", handleStarPointDown);
      },
      getPoint: function(index) {
        return (_.isNumber(index) && (index >= 0 && index <= this.pointsArray.length -1) && this.pointsArray.length > 0) ? this.pointsArray[index] : null;
      },
      getPointsAll: function() {
        return this.pointsArray.length > 0 ? this.pointsArray : null;
      }
    }
  }

  function Notice() {
    return {
      namespace: 'Notice',
      events: {
        CLICK_TOGGLE_NOTICE: 'click.notice'
      },
      init: function() {
        this.icoNoticeClass = 'icoNotice';
        this.userInfoClass = 'userInfo';
        this.noticeLayerClass = '.noticeLayer';
        this.userInfoLayerClass = '.userInfoLayer';
        this.toggleClass = 'active';

        this.$icoNotice = App.$body.find('.' + this.icoNoticeClass).not(".apGnbPopBut");  // (KGC) 대상 제외
        this.$userInfo = App.$body.find('.' + this.userInfoClass).not(".apGnbPopBut");  // (KGC) 대상 제외
        this.$noticeLayer = App.$body.find(this.noticeLayerClass);
        this.$userInfoLayer = App.$body.find(this.userInfoLayerClass);

        this.addEvents();
      },
      addEvents: function() {
        var _this = this;
        function handleClicked() {
          var Class = $(this).attr("class").split(" ");
          if($(this).toggleClass(_this.toggleClass).hasClass(_this.toggleClass)) {
            _.contains(Class, _this.icoNoticeClass) 
            ? _this.$noticeLayer.addClass(_this.toggleClass) 
            : _this.$userInfoLayer.addClass(_this.toggleClass);
          } else {
            _.contains(Class, _this.icoNoticeClass) 
            ? _this.$noticeLayer.removeClass(_this.toggleClass) 
            : _this.$userInfoLayer.removeClass(_this.toggleClass);
          }
        }
        _this.$icoNotice.off(_this.events.CLICK_TOGGLE_NOTICE).on(_this.events.CLICK_TOGGLE_NOTICE, handleClicked);
        _this.$userInfo.off(_this.events.CLICK_TOGGLE_NOTICE).on(_this.events.CLICK_TOGGLE_NOTICE, handleClicked);
      }
    }
  }

  function LNB() {
    return {
      namespace: 'LNB',
      events: {
        SCROLL_LNB: 'scroll.lnb'
      },
      init: function() {
        this.wrapperClass = '#lnb';
        this.footerClass = '#footer';

        this.$wrapper = App.$body.find(this.wrapperClass);
        this.$footer = App.$body.find(this.footerClass);

        this.addEvents();
      },
      addEvents: function() {
        var _this = this, timer = null;
        function handleScroll() {
          if(timer) clearTimeout(timer);

          var viewTop = $(this).scrollTop(),
              viewHeight = $(this).outerHeight(true),
              viewBottom = viewTop + viewHeight;

          var elementTop = _this.$footer.offset().top,
              elementHeight = _this.$footer.outerHeight(true);

          var gap = viewBottom - elementTop;
          var percent = Math.min(gap / elementHeight, 1);
          if(gap > 0) {
            TweenMax.set(_this.$wrapper, { y: - _this.$wrapper.outerHeight(true) * percent + 'px' })
          } else {
            TweenMax.set(_this.$wrapper, { y: 0 + 'px' })
          }
          timer = setTimeout(function(){
            (viewTop <= 0 && gap > 0) && TweenMax.set(_this.$wrapper, { y: 0 + 'px' })
          }, 500)
        }
        App.$window.off(_this.events.SCROLL_LNB).on(_this.events.SCROLL_LNB, handleScroll);
      }
    }
  }

  function GNB() {
    return {
      namespace: 'GNB',
      events: {
        SCROLL_GNB: 'scroll.gnb'
      },
      init: function() {
        this.gnbClass = '#gnb';
        this.activeClass = 'on';

        this.$gnb = App.$body.find(this.gnbClass);

        this.addEvents();
      },
      addEvents: function() {
        var _this = this;
        function handleScroll() {
          var sTop = $(this).scrollTop();
          if(sTop > 0) {
            _this.$gnb.addClass(_this.activeClass);
          } else {
            _this.$gnb.removeClass(_this.activeClass);
          }
        }
        App.$window.off(_this.events.SCROLL_GNB).on(_this.events.SCROLL_GNB, handleScroll);
      }
    }

  }

  function History() {
    return {
      namespace: 'History',
      events: {
        CLICK_HISTORY: 'click.history'
      },
      init: function() {
        this.wrapperClass = '.historyWrap';
        this.openClass = '.btnFold';
        this.activeClass = 'on';

        this.$wrapper = App.$body.find(this.wrapperClass);

        this.addEvents();
      },
      addEvents: function() {
        var _this = this;
        function handleClicked() {
          if($(this).toggleClass(_this.activeClass).hasClass(_this.activeClass)) {
            $(this).siblings(_this.wrapperClass).find("li").show();
            $(this).find("span").text("접기")
          } else {
            $(this).siblings(_this.wrapperClass).find("li").hide().eq(0).show();
            $(this).find("span").text("더보기")
          }
        }
        $(document).off(_this.events.CLICK_HISTORY).on(_this.events.CLICK_HISTORY, _this.openClass, handleClicked);
      }
    }
  }

  function Siren() {
    return {
      namespace: 'Siren',
      events: {
        CLICK_SIREN: 'click.siren'
      },
      init: function() {
        this.wrapperClass = '.sirenLastResulteArea';
        this.buttonClass = '[class*="btnSiren"]';
        this.closeClass = 'btnSirenClose';
        this.openClass = 'btnSirenOpen';

        this.$wrapper = App.$body.find(this.wrapperClass);
        this.$button = App.$body.find(this.buttonClass);

        this.addEvents();
      },
      addEvents: function() {
        var _this = this;
        function handleClicked() {
          var Class = $(this).attr("class").split(" ");
          
          if(_.contains(Class, _this.openClass)) {
            _this.$wrapper.show();
            $(this).removeClass([_this.openClass, _this.closeClass].join(' ')).addClass(_this.closeClass);
            !_.contains(Class, "type02") ? $(this).find("span").text("사이렌 사유 및 해명 접기") : $(this).find("span").text("사이렌 울리기 결과 접기")
          } else {
            _this.$wrapper.hide();
            $(this).removeClass([_this.openClass, _this.closeClass].join(' ')).addClass(_this.openClass);
            !_.contains(Class, "type02") ? $(this).find("span").text("사이렌 사유 및 해명 열기") : $(this).find("span").text("사이렌 울리기 결과 열기")
          }
        
        }
        _this.$button.off(_this.events.CLICK_SIREN).on(_this.events.CLICK_SIREN, handleClicked);
      }
    }
  }

  function TabScroll() {
    return {
      namespace: 'TabScroll',
      events: {
        SCROLL_TAB: 'scroll.tab',
      },
      init: function(device) {
        this.btnTabWrapperClass = '.btnTabWrap';
        this.$btnTabWrapper = App.$body.find(this.btnTabWrapperClass);

        this.addEvents(device);

      },
      addEvents: function(device) {
        var _this = this, offsetTop = _this.$btnTabWrapper.offset().top, top = device === 'MOBILE' ? $("#gnb").outerHeight(true) : $("#header").outerHeight(true);
        function handleScroll() {
          var sTop = $(this).scrollTop();
          if(sTop > offsetTop - top) {
            TweenMax.set(_this.$btnTabWrapper, { position: "fixed", top: top, })
          } else {
            _this.$btnTabWrapper.removeAttr("style");
          }
        }
        App.$window.off(_this.events.SCROLL_TAB).on(_this.events.SCROLL_TAB, handleScroll);
      }
    }
  }

  function textCounter() {
    return {
      namespace: 'textCounter',
      init: function() {
        var counter = { var: 0 };
        var counterWrap = App.$body.find(".amountWrap").find(".current");
        var counterNum = counterWrap.text().replace(/[^0-9]/g,'');

        var counter02 = { var: 0 };
        var counterWrap02 = App.$body.find(".campaignDetail").find(".txtWrap p");
        var counterNum02 = counterWrap02.text().replace(/[^0-9]/g,'');

        TweenMax.to(counter, 1, {
          var: counterNum, 
          onUpdate: function () {
            var _result = Math.ceil(counter.var).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,'); 
            counterWrap.html(_result + '원');
          },
          ease:Circ.easeOut,
          roundProps: "var"
        });
        
        TweenMax.to(counter02, 1, {
          var: counterNum02, 
          onUpdate: function () {
            var _result = Math.ceil(counter02.var); 
            counterWrap02.html(_result + '%');
          },
          ease:Circ.easeOut,
          roundProps: "var"
        }); 
      }
    }
  }


  function barAnimate() {
    return {
      namespace: 'barAnimate',
      init: function() {

        var _this = this;
        _this.chartItem = App.$body.find(".chartAnimate");


        $(window).on('scroll',function() {
          _this.addEvents(_this.chartItem);
        }).trigger('scroll');
      },
      addEvents: function(element) {
        $(element).each(function(idx){
          var pageTop = $(window).scrollTop();
          var pageBottom = pageTop + $(window).height();
          var elementTop = $(this).offset().top;
          var elementBottom = elementTop + $(this).height();

          if ((elementTop <= pageBottom) && (elementBottom >= pageTop)){
            $(this).addClass("active");
          } else {
            $(this).removeClass("active");
          }
        });
        
      }
    }
  }

  function roundStartBtn() {
    return {
      namespace: 'roundStartBtn',
      init: function() {

        var _this = this;
        _this.roundStartBtn = App.$body.find(".roundStartBtn");

        _this.roundStartBtn.on('click',function(){
          $(this).addClass("hide");
          TweenMax.to(App.$dim, 1, { autoAlpha: 0, ease: Linear.easeNone })
          //App.$dim.removeAttr("style");
          console.log()
        });
      }
    }
  }

  // Util
  App.utils = {
    hasJqueryObject: function($elem) {
      return $elem.length > 0;
    },
    initialize: function(modules, device){
      var _this = this;
      _.each(modules, function(module){
        if(module && _.isObject(module) && _.has(module, "init")) { // Object
          console.log(module.namespace + ' Initialize');
          module.init(device);
        } else if(module && _.isArray(module)) { // Array
          _this.initialize(module);
        }
      })
    }
  }

  // Create
  App.create = function(namespace, value) {
    this[namespace] = _.isFunction(value) ? value() : value;
  }
 
  App.ready = function() {
    var _this = this;
    _this.$window = $(window);
    _this.$body = $("body");
    _this.$dim = $(".dim").not(".apDim"); // (KGC) apDim은 제외처리

    var MODULE_NAME = {
      TAB: 'tab',
      TOGGLE: 'toggle',
      POPUP: 'popup',
      SELECT_BOX: 'selectBox',
      SWIPER_CAMPAIGN: 'swiperCampaign',
      SWIPER_ITEM: 'swiperItem',
      SWIPER_MAIN: 'swiperMain',
      SWIPER_GOVERNANCE: 'swiperGovernance',
      ISCROLL: 'iscroll',
      FOLD: 'fold',
      FLIP: 'flip',
      STAR_POINT: 'starPoint',
      NOTICE_LAYER: 'noticeLayer',
      GNB: 'gnb',
      HISOTRY: 'histroy',
      SIREN: 'siren',
      TAB_SCROLL: 'tabScroll',
      ADMIN_MANAGER_SWIPER: 'adminManagerSwiper',
      ADMIN_SELECT_SWIPER: 'adminSelectSwiper',
      ADMIN_LNB_SCROLL: 'adminLNBScroll',
      TEXT_COUNTER: 'textCounter', //[2019-11-19] 그래프 숫자 모션
      BAR_ANIMATE: 'barAnimate', //[2019-11-19] 그래프 숫자 모션
      STARTBTN: 'roundStartBtn', //[2019-11-26] 스타트 버튼 모션
      HOME_ANIMATE: 'homeAnimate', //[2019-12-04] 메인 모션
    }
    
    // Object Module
    _this.utils.hasJqueryObject(_this.$body.find(".tabWrap")) && _this.create(MODULE_NAME.TAB, Tab) // Tab
    _this.utils.hasJqueryObject(_this.$body.find("[class*='popTy']")) && _this.create(MODULE_NAME.POPUP, Popup);
    _this.utils.hasJqueryObject(_this.$body.find(".toggle")) && _this.create(MODULE_NAME.TOGGLE, Toggle);
    _this.utils.hasJqueryObject(_this.$body.find(".amountWrap")) && _this.create(MODULE_NAME.TEXT_COUNTER, textCounter);
    _this.utils.hasJqueryObject(_this.$body.find(".chartAnimate")) && _this.create(MODULE_NAME.BAR_ANIMATE, barAnimate);
    _this.utils.hasJqueryObject(_this.$body.find(".roundStartBtn")) && _this.create(MODULE_NAME.STARTBTN, roundStartBtn);
    // _this.utils.hasJqueryObject($(".scrollWrap")) &&  _this.create(MODULE_NAME.ISCROLL, mapToIscroll(".scrollWrap", { scrollbars: true, mouseWheel: true, fadeScrollbars: true }))
    _this.utils.hasJqueryObject(_this.$body.find(".motionAnimate")) && _this.create(MODULE_NAME.HOME_ANIMATE, homeAnimate);


    if(_this.utils.hasJqueryObject(_this.$body.find(".swiper-container-main"))) {
      _this.create(MODULE_NAME.SWIPER_MAIN, mapToSwipe({
        containerModifierClass: 'swiper-container-main',
        wrapperClass: 'swiper-wrapper-main',
        slideClass: 'swiper-slide-main',
        slidesPerView: 'auto',
        spaceBetween: 280,
        initialSlide: 1,
        allowTouchMove: false,
        centeredSlides: true,
        navigation: {
          prevEl: '.swiper-button-prev-main',
          nextEl: '.swiper-button-next-main'
        },
        scrollbar: {
          el: '.swiper-scrollbar',
          dragSize: 17,
          draggable: true,
        },
        breakpoints: {
          767: {
            slidesPerView: 'auto',
            spaceBetween: 16,
            initialSlide: 0,
            // width: 300,
            allowTouchMove: true,
            centeredSlides: false,
          }
        }
      }))
    }
    _this.utils.hasJqueryObject(_this.$body.find(".fold")) && _this.create(MODULE_NAME.FOLD, Fold)
    _this.utils.hasJqueryObject(_this.$body.find(".flip")) && _this.create(MODULE_NAME.FLIP, Flip)

    if(_this.utils.hasJqueryObject(_this.$body.find(".swiper-container-governance"))) {
      _this.create(MODULE_NAME.SWIPER_GOVERNANCE, mapToSwipe({
        containerModifierClass: 'swiper-container-governance',
        wrapperClass: 'swiper-wrapper-governance',
        slideClass: 'swiper-slide-governance',
        // speed: 800,
        slidesPerView: 'auto',
        spaceBetween: 67,
        centeredSlides: true,
        // allowTouchMove: false,
        breakpoints: {
          767: {
            initialSlide: 0,
            spaceBetween: 16,
          }
        },
      }))
    }

    _this.utils.hasJqueryObject(_this.$body.find(".startPointsWrap")) && _this.create(MODULE_NAME.STAR_POINT, StarPoints);
    _this.utils.hasJqueryObject(_this.$body.find(".layer")) && _this.create(MODULE_NAME.NOTICE_LAYER, Notice);

    // 관리자 LNB 스와이퍼 
    if(_this.utils.hasJqueryObject(_this.$body.find(".swiper-container-manager"))) {
      _this.create(MODULE_NAME.ADMIN_MANAGER_SWIPER, mapToSwipe({
        containerModifierClass: 'swiper-container-manager',
        wrapperClass: 'swiper-wrapper-manager',
        slideClass: 'swiper-slide-manager',
        slidesPerView: 3,
        spaceBetween: 12,
        allowTouchMove: false,
        navigation: {
          prevEl: '.swiper-button-prev-manager',
          nextEl: '.swiper-button-next-manager',
          hideOnClick: true,
        }
      }))
    }

    // 관리자 선택 스와이퍼
    if(_this.utils.hasJqueryObject(_this.$body.find(".swiper-container-select"))) {
      _this.create(MODULE_NAME.ADMIN_SELECT_SWIPER, mapToSwipe({
        containerModifierClass: 'swiper-container-select',
        wrapperClass: 'swiper-wrapper-select',
        slideClass: 'swiper-slide-select',
        slidesPerView: 4,
        spaceBetween: 90,
        allowTouchMove: false,
        navigation: {
          prevEl: '.swiper-button-prev-select',
          nextEl: '.swiper-button-next-select',
          hideOnClick: true,
        }
      }))
    }
    // 관리자 LNB 스크롤
    _this.utils.hasJqueryObject(_this.$body.find("#lnb")) && _this.create(MODULE_NAME.ADMIN_LNB_SCROLL, LNB);

    (_this.utils.hasJqueryObject(_this.$body.find(".floating")) && device === MOBILE) && _this.create(MODULE_NAME.GNB, GNB);

    (_this.utils.hasJqueryObject(_this.$body.find(".btnFold")) && _this.utils.hasJqueryObject(_this.$body.find(".historyWrap"))) && _this.create(MODULE_NAME.HISOTRY, History);

    _this.utils.hasJqueryObject(_this.$body.find(".sirenLastResulteArea")) && _this.create(MODULE_NAME.SIREN, Siren);

    _this.utils.hasJqueryObject(_this.$body.find(".myPageCherryWrap ").not(".popContents")) && _this.create(MODULE_NAME.TAB_SCROLL, TabScroll);


    // Array Module
    if(_this.utils.hasJqueryObject(_this.$body.find(".selectBoxWrap"))) {
      _this.create(MODULE_NAME.SELECT_BOX, []);
      _this.$body.find(".selectBoxWrap").each(function(){
        var all = [];
        $(this).find("[class*='selectBox']").each(function(){
          all.push(new SelectBox(this))
        })
        _this[MODULE_NAME.SELECT_BOX].push(all);
      })
    }

    if(_this.utils.hasJqueryObject(_this.$body.find(".swiper-container-item"))) {
      _this.create(MODULE_NAME.SWIPER_ITEM, []);
      _this.$body.find(".swiper-container-item").each(function(idx){
        var $this = $(this);
        _this[MODULE_NAME.SWIPER_ITEM].push(
          mapToSwipe({
            containerModifierClass: this,
            wrapperClass: 'swiper-wrapper-item',
            slideClass: 'swiper-slide-item',
            slidesPerView: 3,
            slidesPerGroup: 3,
            spaceBetween: 20,
            allowTouchMove: false,
            breakpoints: {
              767: {
                slidesPerView: 'auto',
                slidesPerGroup: 1,
                spaceBetween: 16,
                allowTouchMove: true,
              }
            },
            on: {
              init: function(){

                var self = this;
                var ul = document.createElement("ul"), fragment = document.createDocumentFragment();
                ul.setAttribute("class", "swiper-wrapper");
              
                var len = self.slides.length % 3 === 0 ? self.slides.length / 3 : (self.slides.length / 3) + 1;

                for(var i = 1; i <= len; i++) {
                  (function(j){
                    var li = document.createElement("li"),
                        text = document.createTextNode(j);
                    li.setAttribute("class", "swiper-slide");
                    li.appendChild(text);
                    fragment.appendChild(li);
                  })(i)
                }

                ul.appendChild(fragment);
                $this.find(".swiper-pagination-item").append(ul);

                self.paginationSwiper = mapToSwipe({
                  containerModifierClass: $this.find(".swiper-pagination-item").get(0),
                  slidesPerView: 4,
                  slidesPerGroup: 4,
                  spaceBetween: 24,
                  slideToClickedSlide: true,
                  allowTouchMove: false,
                  navigation: {
                    prevEl: $this.find(".swiper-button-prev-item").get(0),
                    nextEl: $this.find(".swiper-button-next-item").get(0)
                  },
                  on: {
                    init: function(){
                      $this.find(".swiper-pagination-item .swiper-slide").off("click").on("click", function(){
                        $(this).addClass("active").siblings().removeClass("active");
                        var index = $(this).index();
                        self.slideTo(index * 3);
                      })
                    },
                  }
                })()
              },
              resize: function(){
                var self = this;
                $this.find(".swiper-pagination-item .swiper-slide").off("click").on("click", function(){
                  var index = $(this).index();
                  self.slideTo(index * 3);
                })
              }
            }
          })()
        )
      })
    }
   
    if(_this.utils.hasJqueryObject(_this.$body.find(".swiper-container-campaign"))) { // Swiper Content Item
      
      _this.create(MODULE_NAME.SWIPER_CAMPAIGN, []);
      _this.$body.find(".swiper-container-campaign").each(function(){
        var spaceBetween = _this.utils.hasJqueryObject($(this).find("[class*='icoSns']")) ? 26 : 18;
        _this[MODULE_NAME.SWIPER_CAMPAIGN].push(
          mapToSwipe({
            containerModifierClass: this,
            wrapperClass: 'swiper-wrapper-campaign',
            slideClass: 'swiper-slide-campaign',
            slidesPerView: 'auto',
            spaceBetween: spaceBetween,
            // allowTouchMove: _this.utils.hasJqueryObject($(".myPageCherryWrap")) ? true : false,
            breakpoints: {
              767: {
                allowTouchMove: true,
                spaceBetween: 18,
              }
            },
          })()
        )
      })
      
    }


    return this;
  }


  App.init = function() {
    //console.log("현재 디바이스는 " + device + " 입니다.");
    this.utils.initialize(this, device);
  }

  window.caasUiInit = function() {
	    device = mq.matches ? MOBILE : PC;
	    App.ready().init();
	    mq.addListener(function(_mq){
	      device = _mq.matches ? MOBILE : PC;
	      App.init(device);
	    })
	    window.config = config;
      window.Popup = App.popup && App.popup;

      if(App.starPoint) {
        window.Governance = App.starPoint;
        window.Governance.Swiper = App.swiperGovernance;
      } 

      
	    window.device = {
	      get: function() {
	        return device;
	      }
	    }
  }

  $(function(){
	  window.caasUiInit();
  })

  //[2019-12-04] 메인 모션
  function homeAnimate() {
    return {
      namespace: 'homeAnimate',
      init: function() {

        var _this = this;
        _this.motionItem = App.$body.find(".motionAnimate");


        $(window).on('scroll',function() {
          _this.addEvents(_this.motionItem);
        }).trigger('scroll');
      },
      addEvents: function(element) {
        $(element).each(function(idx){
          var pageTop = $(window).scrollTop();
          var pageBottom = pageTop + $(window).height();
          var elementTop = $(this).offset().top;
          var elementBottom = elementTop + $(this).height();

          if ((elementTop <= pageBottom) && (elementBottom >= pageTop)){
            $(this).addClass("active");
          } else {
            $(this).removeClass("active");
          }
        });
      }
    }
  }
})(this, jQuery, TweenMax, Swiper, _, window.App || {})

/**
 *  Popup: Popup 핸들링 method: handleOpenPopup, handleClosePopup
 *  mq: 현재 디바이스 확인 method: get
 *  vvVv
 *  */ 

/**
 * 
 * @param {String} id 
 * @param {String} device
 * 
 * @return void 
 */

function mapToIscroll(id, device) {
  var Popup = document.getElementById(id);

  if(device === 'PC') { // PC
    Popup.IscrollObject =  Popup.IscrollObject || new IScroll(".scrollWrap", { 
        scrollbars: true, mouseWheel: true, fadeScrollbars: true 
      }); 
    //console.log(Popup.IscrollObject)
  } else { // Mobile
    $(Popup).find(".scrollWrap").children().first().removeAttr("style");
    Popup.IscrollObject ? Popup.IscrollObject.destroy() : null;
  }

}

// [2019-10-31] 추가
new Swiper(".swiper-container-popup", { 
  slidesPerView: 5,
  spaceBetween: 14,
  navigation: {
    prevEl: '.swiper-button-prev',
    nextEl: '.swiper-button-next'
  }
})