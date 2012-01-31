var Application = {
    init: function() {
        // Sign In/Out & Dedicated GUI
        if (Cookie.read('user') && Cookie.read('session')) {
            // Signed in
 
            var signout = $('signout');
            signout.addEvent('click', function(e) {
                e.stop();
                Cookie.dispose('user');
                Cookie.dispose('session');
                Cookie.dispose('name');
                Cookie.dispose('provider');
                window.location.reload();
            }).setStyle('display', 'inline');

            // Edit commands
            $('edit').addEvent('click', Command.edit).setStyle('display', 'inline');

            // Settings
            $('settings').addEvent('click', Application.settings).setStyle('display', 'inline');

            new Element('a', {
                id: 'profile',
                text: Cookie.read('name')
            }).inject($('header'), 'top');
        } else {
            // Not signed in
            var signin = $('signin');
            if (signin) {
                signin.addEvent('click', function(e) {
                    e.stop();

                    var modal = new SimpleModal({
                        draggable: false,
                        hideFooter: true,
                        width: 420,
                        offsetTop: 150
                    });
                    modal.show({
                        model: "modal",
                        title: "Sign in",
                        contents: "<iframe frameborder='0' width='400' height='240' src='" + signin.href + "'></iframe>"
                    });
                }).setStyle('display', 'inline');
            }
        }

        // Help
        $('help').addEvent('click', Application.help);
    },

    // Display a notice (instead of alert)
    notice: function(msg) {
        var modal = new SimpleModal({
            draggable: false,
            hideHeader: true,
            closeButton: false,
            width: 300,
            offsetTop: 150
        });
        modal.show({
            model: "alert",
            contents: msg
        });
    },

    // Help
    help: function() {
        var modal = new SimpleModal({
            draggable: false,
            hideFooter: true,
            width: 900
        });
        modal.show({
            model: "modal-ajax",
            title: "Help",
            param: { url: "/help" }
        });
    },


    // Edit settings
    settings: function() {
        var modal = new SimpleModal({
            draggable: false,
            offsetTop: 150,
            width: 450
        });
        modal.addButton("Save", "btn primary", function() {
            this.hide();
            new Request({
                url: '/settings',
                urlEncoded: false,
                headers: { 'Content-Type': 'application/json' },
                onFailure: function() {
                    Application.notice('An error occured');
                }
            }).post(JSON.encode(Settings));
        })
        modal.show({
            model: "modal-ajax",
            title: "Settings",
            param: {
                url: "/settings",
                onRequestComplete: function() {
                    $('setting_default_search').addEvent('change', function() {
                        Settings.default_search = this.value;
                    });
                    $('setting_default_search').value = Settings.default_search;

                    $('setting_open_in_new_page').addEvent('click', function() {
                        Settings.open_in_new_page = !Settings.open_in_new_page;
                    })
                    $('setting_open_in_new_page').checked = (Settings.open_in_new_page === true);

                    $('setting_github').addEvent('click', function() {
                        Settings.github = !Settings.github;
                        $(window.parent.document).getElement('#github').setStyle('display', Settings.github === true ? 'block': 'none');
                    })
                    $('setting_github').checked = (Settings.github === true);

                    $('setting_calendar').addEvent('click', function() {
                        Settings.calendar = !Settings.calendar;
                        $(window.parent.document).getElement('#date').setStyle('display', Settings.calendar === true ? 'block': 'none');
                    })
                    $('setting_calendar').checked = (Settings.calendar === true);

                    $('setting_clock1').addEvent('change', function() {
                        Settings.clock1 = this.value;
                    });

                    $('setting_clock2').addEvent('change', function() {
                        Settings.clock2 = this.value;
                    });

                    $('setting_clock3').addEvent('change', function() {
                        Settings.clock3 = this.value;
                    });
                }
            }
        });
    }
}
