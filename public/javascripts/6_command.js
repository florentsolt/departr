var Command = {
    data: [], // Set in index view
    pattern: /\{\w+\}/,
    patternsCleaner: /^\{|\}$/g,
    refresh: false, // A light ask to refresh the page
    form: "<div id='command-form'><label for='name'>Name</label><input type='text' name='name'><label for='value'>Command</label><input type='text' name='url'></div>",
    selected: false,

    // Open the window to edit all commands
    edit: function(e) {
        if (e) e.stop();

        var modal = new SimpleModal({ draggable: false, width: 900 });
        modal.addButton("Add", "btn primary", Command.add);
        modal.addButton("Revert", "btn primary", function() {
            this.hide();
            var modal = new SimpleModal({draggable:false});
            modal.show({
                model: "confirm",
                callback: function() {
                    window.parent.location.href = '/command/revert';
                },
                title: "Are you sure ?",
                contents: "Warning, this will reset all your commands to the default ones."
            });
        });
        modal.addButton("Save", "btn primary", Command.save);
        modal.addButton("Cancel", "btn secondary", function() {
            this.hide();
        });
        modal.show({
            model: "modal",
            title: "Edit commands",
            contents: "<div id='commands'>" + Command.data.map(function(item, index, array) {
                return "<div class='command'>" + 
                    "<div class='name'>" + item.name + "</div>" +
                    "<div class='url'>" + item.url + "</div>" +
                "</div>";
            }).join('') + "</div>"
        });

        $('commands').getElements('.command').each(function(item) {
            item.addEvent('click', function(e) {
                e.stop();
                modal.hide();
                Command.update(this);
            });
        });
    },

    // Open the window to update one command
    update: function(item) {
        var modal = new SimpleModal({ draggable: false, width: 400 });
        var name = item.getElement('.name').get('text');
        var url = item.getElement('.url').get('text');
        var index = -1;

        for (var i = 0; i < Command.data.length; i++) {
            if (Command.data[i].name == name) {
                index = i;
                break;
            }
        }

        if (i == -1) {
            Application.notice("Record not found");
            return;
        }

        modal.addButton("Delete", "btn primary", function() {
            Command.data.splice(index, 1);
            this.hide();
            Command.edit();
        });

        var ok = modal.addButton("Ok", "btn primary", function() {
            var inputs = $('command-form').getElements('input');
            Command.data[index] = {
                name: inputs[0].value,
                url: inputs[1].value
            };
            this.hide();
            Command.edit();
        });

        modal.addButton("Cancel", "btn secondary", function() {
            this.hide();
            Command.edit();
        });

        modal.show({
            model: "modal",
            title: "Update command",
            contents: Command.form
        });

        var inputs = $('command-form').getElements('input');
        inputs[0].value = Command.data[index].name;
        inputs[1].value = Command.data[index].url;
        inputs[0].focus();
        inputs.each(function(input) {
            input.addEvent('keydown', function(e) {
                if (e.key === 'enter') ok.fireEvent('click');
            });
        });
    },

    // Open the window to add a command
    add:function() {
        this.hide();
        var modal = new SimpleModal({ draggable: false, width: 400 });

        var ok = modal.addButton("Ok", "btn primary", function() {
            var inputs = $('command-form').getElements('input');
            Command.data.push({
                name: inputs[0].value,
                url: inputs[1].value
            });
            this.hide();
            Command.edit();
        });

        modal.addButton("Cancel", "btn secondary", function() {
            this.hide();
            Command.edit();
        });

        modal.show({
            model: "modal",
            title: "Add a new command",
            contents: Command.form
        });

        var inputs = $('command-form').getElements('input');
        inputs[0].focus();
        inputs.each(function(input) {
            input.addEvent('keydown', function(e) {
                if (e.key === 'enter') ok.fireEvent('click');
            });
        });
    },

    // Save all commands
    save: function() {
        var result = [];
        new Request({
            url: '/command/save',
            urlEncoded: false,
            headers: { 'Content-Type': 'application/json' },
            onFailure: function() {
                Application.notice('An error occured');
            }
        }).post(JSON.encode(Command.data));
        this.hide();
    },

    submit: function(e) {
        if (e)
            e.stop();

        // Check if a question is needed
        var matches = $('input').value.match(Command.pattern);
        if (matches) {
            var answer = $('answer');
            var label = matches[0].replace(Command.patternsCleaner, '').replace(/(.)$/, "<span>$1</span>");
            $('label').set('html', label + ' &raquo; ');
            answer.value = '';
            $('question').setStyle('display', 'block');
            answer.focus();
            return;

        } else {
            // No question remaining
            $('question').setStyle('display', 'none');
        }

        var defaultSearch = 'http://www.google.' + Settings.google_domain + '/search?ie=UTF-8&oe=UTF-8&q=' + encodeURIComponent(this.input.value);

        if (Settings.google_feeling_lucky) {
            e = this.input.lastEvent;
            if (e && e.key == "enter" && (e.alt || e.control || e.meta || e.shift)) {
                Command.go(defaultSearch + '&btnI=1');
                return;
            }
        }

        // Execute selected command
        if (Command.selected) {
            Command.go(Command.selected);
            return
        }

        // Default command
        if (!this.input.value.match(/^\s*$/)) {
            if (this.input.value.match(/^\s*(ftp|http|https):\/\//i)) {
                // If it's an url
                Command.go(this.input.value);
            } else if (this.input.value.match(/^\s*[a-z0-9]([-a-z0-9]*[a-z0-9])?\.[a-z]{2,}/i)) {
                // If it's a domain
                Command.go('http://' + this.input.value.replace(/^\s+/, ''));
            } else {
                // Fallback to google
                Command.go(defaultSearch);
            }
        }

        return;
    },

    go: function(url) {
        if (Settings.open_in_new_page) {
            $('input').value = '';
            $('answer').value = '';
            $('input').blur(); $('input').focus(); // prevent strange auto completion
            window.open(url, "_blank");
        } else {
            window.location.href = url;
        }
    },

    init: function() {
        Command.autocompleter = new MooComplete('input', {
            list: Command.data,
            size: 10,
            mode: 'partial',
            render: function(command) {
                return new Element('span', {html: command.name});
            },
            get: function(command) {
                return command.name;
            },
            set: function(command) {
                if (command) {
                    Command.selected = command.url;
                    return command.name;
                } else {
                    Command.selected = false;
                    return "";
                }
            },
            filters:[function(o,v) {
                return o.match(new RegExp(v.escapeRegExp().replace(/\s+/, '.*'), 'i'))
            }]
        });

        // Hook command line submit
        $('commandline').addEvent('submit', Command.submit);

        // Hook input keypress to auto submit
        $('input').addEvent('keydown', function(e) {
            if (e && e.key && !e.shift && e.key == 'enter') {
                e.stop();
                $('commandline').fireEvent('submit');
            }
        });

        // Hook answer keypress to fill the main input with answers
        $('answer').addEvent('keydown', function(e) {
            if (e && e.key && !e.shift) {
                if (e.key == 'enter') {
                    e.stop();
                    var answer = $('answer').value;
                    if (answer.match(/^\s*$/)) return;
                    var keyword = $('input').value.match(Command.pattern);
                    $('input').value = $('input').value.replace(Command.pattern, answer);
                    Command.selected = Command.selected.replace(keyword[0], encodeURIComponent(answer));
                    $('commandline').fireEvent('submit');

                } else if (e.key == 'esc') {
                    $('question').setStyle('display', 'none');
                    $('input').focus();
                }
            }
        });

        // Focus management
        window.addEvent('click', function(e) {
            if ($('commandline').getStyle('display') == 'block' && !$('simple-modal')) {
                $('input').focus();
            }
        });

        window.addEvent('load', function() {
            top.focus();
            window.focus();
            $('input').focus();
        });

        if ($('date')) {
            var today = new Date;
            var weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            $('date').getElement('.day').set('text', today.getDate());
            $('date').getElement('.wday').set('text', weekdays[today.getDay()]);
        }
    }
};

