window.addEvent('domready', function() {
  Application.init();
  Command.init();
  var credits = $('credits');
  var a = new Element('a', {
    'href': 'http://500px.com/photo/' + Cookie.read('bg_id'),
    'text': '© ' + Cookie.read('bg_user').replace(/\+/g," ")
  }).inject(credits)
});
