function focusable(){
  return $('a[href], area[href], input, select, textarea, button, iframe, object, embed, *[tabindex], *[contenteditable]')
.not('[tabindex=-1], [disabled], :hidden')
}

function focusDown(){
  var elements = focusable();
  var current = document.activeElement;

  var i = 0;

  $.each(elements, function(){
    if (this === current) return false;
    i++;
  })

  var currentRect = current.getBoundingClientRect();

  console.log(i,"Current top: ",currentRect.top,
              "bottom: ",currentRect.bottom,
              "right: ",currentRect.right,
              "left", currentRect.left );

  var currentRectCenterX = currentRect.right - currentRect.width/2;
    for (; i < elements.length; i++) {
      //jQuery.tabNext();
      // elements[i];
      var rect = elements[i].getBoundingClientRect();
      //console.log(i,,elements.length, rect.right, rect.left,rect.bottom,currentRect.bottom,currentRect.left-rect.left,currentRect.right-rect.right);
      //console.log(rect.top, rect.bottom, rect.right, rect.left);

      if(rect.top > currentRect.bottom
        && (  currentRectCenterX  > rect.left
          && currentRectCenterX < rect.right
          )
        )
      {
        // elements[i].style.backgroundColor = "#00D936";
        elements[i].focus();
      /*
        console.log(i,"New top: ",rect.top,
                      "bottom: ",rect.bottom,
                      "right: ",rect.right,
                      "left", rect.left );
      */
        return;
      }
      /*
      else{
        elements[i].style.backgroundColor = "#D93600";
      }
      */
    }
}

function focusUp(){
  var elements = focusable();
  var current = document.activeElement;

  var i = 0;

  $.each(elements, function(){
    if (this === current) return false;
    i++;
  })

  var currentRect = current.getBoundingClientRect();

  console.log(i,"Current top: ",currentRect.top,
              "bottom: ",currentRect.bottom,
              "right: ",currentRect.right,
              "left", currentRect.left );

  var currentRectCenterX = currentRect.right - currentRect.width/2;
    for (; i > 0; i--) {
      //jQuery.tabNext();
      // elements[i];
      var rect = elements[i].getBoundingClientRect();
      //console.log(i,,elements.length, rect.right, rect.left,rect.bottom,currentRect.bottom,currentRect.left-rect.left,currentRect.right-rect.right);
      //console.log(rect.top, rect.bottom, rect.right, rect.left);

      if(rect.top < currentRect.top
        && (  currentRectCenterX  > rect.left
          && currentRectCenterX < rect.right
          )
        )
      {
        //elements[i].style.backgroundColor = "#00D936";
        elements[i].focus();
        /*
        console.log(i,"New top: ",rect.top,
                      "bottom: ",rect.bottom,
                      "right: ",rect.right,
                      "left", rect.left );
        */
        return;
      }
      /*
      else{
        elements[i].style.backgroundColor = "#D93600";
      }
      */
    }
}
