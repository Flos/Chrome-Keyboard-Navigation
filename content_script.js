(function() {
    /**
     * This is a small polyfill to get event listeners to be
     * the same for all browsers.
     */
    if(!Element.prototype.addEventListener){var oListeners={};function runListeners(oEvent){if(!oEvent){oEvent=window.event}for(var lstId=0,elId=0,oEvtListeners=oListeners[oEvent.type];elId<oEvtListeners.aEls.length;elId++){if(oEvtListeners.aEls[elId]===this){for(lstId;lstId<oEvtListeners.aEvts[elId].length;lstId++){oEvtListeners.aEvts[elId][lstId].call(this,oEvent)}break}}}Element.prototype.addEventListener=function(sEventType,fListener){if(oListeners.hasOwnProperty(sEventType)){var oEvtListeners=oListeners[sEventType];for(var nElIdx=-1,elId=0;elId<oEvtListeners.aEls.length;elId++){if(oEvtListeners.aEls[elId]===this){nElIdx=elId;break}}if(nElIdx===-1){oEvtListeners.aEls.push(this);oEvtListeners.aEvts.push([fListener]);this["on"+sEventType]=runListeners}else{var aElListeners=oEvtListeners.aEvts[nElIdx];if(this["on"+sEventType]!==runListeners){aElListeners.splice(0);this["on"+sEventType]=runListeners}for(var lstId=0;lstId<aElListeners.length;lstId++){if(aElListeners[lstId]===fListener){return}}aElListeners.push(fListener)}}else{oListeners[sEventType]={aEls:[this],aEvts:[[fListener]]};this["on"+sEventType]=runListeners}};Element.prototype.removeEventListener=function(sEventType,fListener){if(!oListeners.hasOwnProperty(sEventType)){return}var oEvtListeners=oListeners[sEventType];for(var nElIdx=-1,elId=0;elId<oEvtListeners.aEls.length;elId++){if(oEvtListeners.aEls[elId]===this){nElIdx=elId;break}}if(nElIdx===-1){return}for(var lstId=0,aElListeners=oEvtListeners.aEvts[nElIdx];lstId<aElListeners.length;lstId++){if(aElListeners[lstId]===fListener){aElListeners.splice(lstId,1)}}}};

    var arrow_left = function(){jQuery.tabPrev()};
    var arrow_right = function(){jQuery.tabNext()};
    var arrow_up = function(){focusUp()};
    var arrow_down = function(){focusDown()};
    var key_escape = function(){closeTab()};

    var isPaused = false;

    var keycodes =
    {               // The keycodes for up down left and right movement.
        left:   37, // This defaults to the arrow keys, but you could
        up:     38, // just as easily set it to the WASD keys.
        right:  39, //
        down:   40, //
        esc:    27
    };

    // Special cases for which the normal finding function doesn't work.
    var specialCases = {
        "amazon.prime" :{
            "url" : function(){
                console.log("URL amazon prime");
                return ( ( window.location.host.indexOf('amazon') != -1 )
                && ( window.location.pathname.indexOf('/Prime-Instant-Video/') != -1 || window.location.pathname.indexOf('/dp/') != -1 || window.location.pathname.indexOf('/video/') != -1 ) );
            },
            "test": function(){
              this.optimize();
              jQuery.tabNext(); // Jump to next focusable element

              return true;
            },
            "optimize" : function(){
              var header = document.getElementById('header');
              var navbar = document.getElementById('navbar');
              var rhf = document.getElementById('rhf');
              var footer = document.getElementById('navFooter');
              var customerReviews = document.getElementById('dv-customer-reviews');
              var feedback = document.getElementById('dv-main-bottom-section');

              if(navbar) navbar.parentNode.removeChild(navbar);
              if(header) header.parentNode.removeChild(header);
              if(rhf) rhf.parentNode.removeChild(rhf);
              if(footer) footer.parentNode.removeChild(footer);
              if(customerReviews) customerReviews.parentNode.removeChild(customerReviews);
              if(feedback) feedback.parentNode.removeChild(feedback);

              var highlight = document.getElementById('dv-btn-minor');
              if(highlight) highlight.focus();

              var removeButton = document.getElementsByClassName('packshot-links');
              while(removeButton.length > 0){
                removeButton[removeButton.length-1].parentNode.removeChild(removeButton[removeButton.length-1]);
                removeButton = document.getElementsByClassName('packshot-links');
              }
            },
            "arrow_right" : function(){jQuery.tabNext()},
            "arrow_left" : function(){jQuery.tabPrev()}
        },
        "sample" :{
            "url" : "sample.url",
            "arrow_right" : function(){
            	var as = document.body.querySelectorAll('[href^=ap]');
            	nl = false;
            	for(var i = 0; i < as.length; i++){
            		if(as[i].textContent === ">") {
                        nl = as[i].href;
                    }
            	}
                return nl;
            },
            "arrow_left" : function(){
            	var as = document.body.querySelectorAll('[href^=ap]');
            	nl = false;
            	for(var i = 0; i < as.length; i++){
            		if(as[i].textContent === "<") {
                        nl = as[i].href;
                    }
            	}
                return nl;
            }
        },
    };

    function getDomain(url){
        return url.replace('http://','').replace('https://','').split(/[\/?#]/)[0];
    }

    function doIfNotPaused(callback) {
        chrome.extension.sendRequest({id: 'isPaused?'}, function(response) {
            isPaused = response.value;
            if(!isPaused) {
                callback();
            }
        });
    }

    // Checks if the url is one of the special cases above
    function checkIfSpecialCase() {
        var vreturn = false;
        $.each( specialCases, function(index, spec){
            if(isFunction(spec.url)){
                if(spec.url()) {
                    vreturn = spec;
                    console.log("spec.url is ", spec);
                }
                return false; // break out of each loop
            } else if(window.location.host.search(spec.url) != -1){
                // We have a special case!
                vreturn = spec;
                return false; // break out of each loop
            }
        });
        return vreturn;
    }

    function isFunction(functionToCheck) {
        var getType = {};
        return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
    }

    /**
     * Checks if current active element is an input,
     * i.e the user might want to press the left and right
     * keys to go left in right in the text they're
     * currently writing and won't want to navigate!
     */
    function checkIfInInput(){
        var el = document.activeElement;
        return (
            el && (
                (el.tagName.toLowerCase() == 'input' && el.type != 'checkbox') ||
                el.tagName.toLowerCase() == 'textarea' ||
                el.contentEditable.toLowerCase() == 'true'
            )
        );
    }

    function keypad(e){
        console.log("keyCode ", e.keyCode);
        //if(checkIfInInput()) return;

        doIfNotPaused(function() {
          var specialCase = checkIfSpecialCase();
          if(specialCase !== false && isFunction(specialCase.optimize)) specialCase.optimize();
        });

        if(isPaused) return;

        if(e.keyCode == keycodes.left && arrow_left !== false) {
          e.preventDefault();
          arrow_left();
        }
        else if(e.keyCode == keycodes.right && arrow_right !== false) {
          e.preventDefault();
          arrow_right();
        }
        else if(e.keyCode == keycodes.up && arrow_up !== false) {
          e.preventDefault();
          arrow_up();
        }
        else if(e.keyCode == keycodes.down && arrow_down !== false) {
          e.preventDefault();
          arrow_down();
        }
        else if(e.keyCode == keycodes.esc && keycodes !==false) {
          e.preventDefault();
          key_escape();
        }
    }

    function setKeypad(){
        document.addEventListener('keydown',function(e){
            keypad(e);
        }, false);
    }

    function start() {
        var specialCase = checkIfSpecialCase();
        var test = true;

        doIfNotPaused(function() {
          if(specialCase !== false){
            // Sometimes we need to test for certain things
            if(typeof specialCase.test !== "undefined" && isFunction(specialCase.test()) ){
              test = specialCase.test();
            }
            if(test === true){
              console.log('start specialCase ', specialCase);
              if(typeof specialCase.arrow_right !== "undefined"){
                arrow_right = specialCase.arrow_right;
              }
              if(typeof specialCase.arrow_left !== "undefined"){
                arrow_left = specialCase.arrow_left;
              }
            }
          }
        });
        setKeypad();
    }

    function closeTab(){
      chrome.runtime.sendMessage({id: "closeTab"},function(response){console.log("response: ",response)});
    }

    start();
})();
