window.onload = function() {

  chrome.cookies.get({ url: 'http://departr.solt.biz', name: 'bg_id'},
    function (cookie) {
      if (cookie) {
        var a = document.getElementById('credits_link')
        a.href = "http://500px.com/photo/" + cookie.value;
      }
  });

  chrome.cookies.get({ url: 'http://departr.solt.biz', name: 'bg_user'},
    function (cookie) {
      if (cookie) {
        var a = document.getElementById('credits_link')
        a.innerText = decodeURIComponent(cookie.value).replace(/\+/g," ");
      }
  });

}
