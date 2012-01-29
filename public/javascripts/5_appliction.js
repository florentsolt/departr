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
                    $('google_domain').addEvent('change', function() {
                        Settings.google_domain = this.value;
                    })
                    $('google_domain').value = Settings.google_domain;

                    $('google_feeling_lucky').addEvent('click', function() {
                        Settings.google_feeling_lucky = !Settings.google_feeling_lucky;
                    })
                    if (Settings.google_feeling_lucky)
                        $('google_feeling_lucky').checked = true;

                    $('open_in_new_page').addEvent('click', function() {
                        Settings.open_in_new_page = !Settings.open_in_new_page;
                    })
                    if (Settings.open_in_new_page)
                        $('open_in_new_page').checked = true;
                }
            }
        });
    }
}
