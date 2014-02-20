/* Greatly inspired by https://github.com/ErikDubbelboer/MooComplete */
var AutoComplete = new Class({
    
    Implements: [Options, Events],

    options: {
        list: [],
        size: 10,
        filters: [
            function(o, v) { return (o.indexOf(v) == 0); },
            function(o, v) { return ((v.length > 1) && (o.indexOf(v) > 0)); }
        ],
        render: function(v) { return new Element('span', {'text': v}); },
        get: function(v) { return v; },
        set: function(v) { return v; }
    },

    initialize: function(element, options) {
        this.setOptions(options);

        // allow id and dom object selection 
        this.element = typeOf(element)==='string' ? $(element) : element;

        // for older versions of IE this doesn't work, for those you need to set autocomplete=off in the html.
        this.element.setAttribute('autocomplete', 'off');

        // disable auto correct and capitalize on iPhone and iPad.
        this.element.setAttribute('autocorrect', 'off');
        this.element.setAttribute('autocapitalize', 'off');

        this.box = new Element('div', {
            'class':  'autocomplete',
            'styles': {
                'position': 'absolute',
                'display':  'none'
            }
        }).inject(document.body);

        // build suggestions elements
        this.setList(this.options.list);

        // reposition on a resize.
        window.addEvent('resize', this.position.bind(this));

        this.element.addEvents({
            'keydown': this.onKeydown.bind(this),
            'keyup': this.onKeyup.bind(this),
            'blur': this.onBlur.bind(this)
        });
        
        return this;
    },

    setList: function(list) {
        this.hover = false;
        this.options.list = list;
        this.suggestions = [];
        this.box.empty();
        list.each(function(value) {
            var div = new Element('div');
            // don't use mouseover since that will bug when the user has the mouse below the input box while typing
            div.addEvent('mousemove', function() {
                this.showHover(div);
            }.bind(this))
            .adopt(this.options.render(value))
            .store('value', value);

            this.suggestions.push(div);
            this.box.adopt(div);
        }, this);
    },

    position: function() {
        this.box.setStyles({
            'width': (this.element.getWidth() - 2)+'px',
            'top':   (this.element.getCoordinates().top + this.element.getHeight())+'px',
            'left':  this.element.getCoordinates().left +'px'
        });
    },

    showHover: function(div) {
        if (!div || div == this.hover) return;
        if (this.hover) this.hover.removeClass('hovered');
        this.hover = div.addClass('hovered');
        this.element.set('value', this.options.set(div.retrieve('value')));
    },

    isHidden: function() {
        return this.box.getStyle('display') == 'none';
    },

    hide: function() {
        this.box.setStyle('display', 'none');
    },

    onKeydown: function(e) {
        switch(e.key) {
            case 'up':
                e.stop();
                if (this.hover) this.showHover(this.hover.getPrevious('.match'));
                break;

            case 'down':
                e.stop();
                if (this.hover) {
                    this.showHover(this.hover.getNext('.match'));
                } else {
                    this.showHover(this.box.getFirst('.match'))
                }
                break;

            case 'esc':
                this.hide();
                this.fireEvent('abort');
                break;

            case 'enter':
            case 'tab':
                if (!this.isHidden()) {
                    e.stop();
                    if (this.hover != false) {
                        this.fireEvent('complete', [this.hover.retrieve('value')]);
                        this.hide();
                    } else {
                        this.showHover(this.box.getFirst('.match'))
                    }
                }
                break;
        }
    },

    onKeyup: function(e) {
        switch(e.key) {
            case 'up':
            case 'down':
            case 'esc':
            case 'enter':
                break;

            default:
                var value = this.element.get('value').toLowerCase();

                if (value.length == 0) {
                    this.hide();
                    return;
                }

                var count = 0;

                this.options.filters.each(function(f) {
                    if (count == this.options.size) return;

                        this.box.getChildren().each(function(div) {
                            if (f(this.options.get(div.retrieve('value')).toLowerCase(), value)) {
                                div.addClass('match');
                                if (++count == this.options.size) return false;
                            } else {
                                div.removeClass('match');
                            }
                        }, this);
                }, this);

                // If no suggestions, no need to show the box
                if (count > 0) {
                    this.position();
                    this.box.setStyle('display', 'block');
                } else if (!this.isHidden()) {
                    this.hide();
                    this.fireEvent('abort');
                }
        };
    },

    onBlur: function() {
        this.hover = false;
        this.hide.delay(100, this);
    }

});

