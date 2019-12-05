/*
* 연습 
*/
(function(window, $, TweenMax, _, App){
    "use strict";/* js 엄격모드 : 
                실수를 에러(undefined)로 보여지게 해서 해결하기 쉽게 만든다. strict 모드는 변수 이름의 맵핑을 단순화
                단점:   1. 읽기 전용 객체에 쓰는 것이 불가 
                        2. get으로 선언된 객체는 수정 불가
                        3. 확장 불가 객체 확장 불가
                        4. delete를 호출 불가
                        5. 함수의 동일한 매개 변수 이름을 선언하는 것이 불가
                        6. 8진수 숫자 리터럴 및 이스케이프 문자를 사용 불가
                */

    function hasJqueryObject($elem) { return $elem.length > 0; }
    App.motion = {
        events: {
            SCROLL_MOT: 'scroll.motion'
        },
        init: function() {
            var _this = this;
            _this.motionItem = App.$body.find(".motion");
    
            _this.addEvents(_this.motionItem);
        },
        addEvents: function(element) {
            $(element).each(function(idx){
                var pageTop = $(window).scrollTop();
                var pageBottom = pageTop + $(window).height();
                var elementTop = $(this).offset().top;
                var elementBottom = elementTop + $(this).height();
        
                if ((elementTop <= pageBottom) && (elementBottom >= pageTop)){
                    $(this).addClass("active");
                    console.log(elementTop, pageBottom, '/' , elementBottom, pageTop);
                } else {
                    $(this).removeClass("active");
                    console.log('1') //이부분이 잘 안됨..
                }
            });
        }
    }
    $(function(){
        App.$body = $("body");
        App.$dim = $(".dim");
        $(window).on('scroll',function() { 
            hasJqueryObject(App.$body.find(".motion")) && App.motion.init();
        }).trigger('scroll');
    })


})(this, jQuery, TweenMax, _, window.App || {})