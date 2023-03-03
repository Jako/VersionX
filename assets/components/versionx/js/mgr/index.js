Ext.onReady(function() {
    MODx.load({
        xtype: 'versionx-page-home',
        renderTo: 'versionx'
    });
});

VersionX.panel.Home = function(config) {
    config = config || {};
    Ext.applyIf(config, {
        id: 'versionx-panel-home',
        cls: 'container',
        layout: 'anchor',
        items: [{
            html: `
                <div class="versionx-header">
                    <h2>${_('versionx')}</h2>
                    <div class="version">3</div>
                </div>
                <p class="versionx-description">${_('versionx.description')}</p>
            `,
            cls: 'modx-page-header',
        },{
            xtype: 'versionx-grid-objects',
            cls: 'main-wrapper',
        }]
    });
    VersionX.panel.Home.superclass.constructor.call(this, config);
};
Ext.extend(VersionX.panel.Home, MODx.Panel);
Ext.reg('versionx-panel-home', VersionX.panel.Home);

VersionX.page.Home = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        border: false,
        id : 'versionx-page-wrapper',
        components: [{
            cls: 'container',
            xtype: 'versionx-panel-home'
        }],
        buttons: this.getButtons(config)
    });
    VersionX.page.Home.superclass.constructor.call(this,config);
};
Ext.extend(VersionX.page.Home, MODx.Component,{
    getButtons: function() {
        var buttons = [{
            text: _('help_ex'),
            handler: this.loadHelpPane,
            scope: this,
            id: 'modx-abtn-help'
        }];

        if (!VersionX.config.has_donated) {
            buttons.push([{
                text: _('versionx.donate'),
                handler: this.donate,
                scope: this
            }]);
        }

        return buttons;
    },

    loadHelpPane: function() {
        MODx.config.help_url = 'https://docs.modx.com/3.x/en/extras/versionx/index#usage-features?embed=1';
        MODx.loadHelpPane();
    },

    donate: function() {
        window.open('https://modmore.com/extras/versionx/donate/');
    }
});
Ext.reg('versionx-page-home',VersionX.page.Home);