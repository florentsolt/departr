window.addEvent('domready', function() {
  Application.init();
  Command.init();
  if (Cookie.read('bg_id') && Cookie.read('bg_user')) {
    var credits = $('credits');
    var a = new Element('a', {
      'href': 'http://500px.com/photo/' + Cookie.read('bg_id'),
      'text': '© ' + Cookie.read('bg_user').replace(/\+/g," ")
    }).inject(credits)
  }
});
