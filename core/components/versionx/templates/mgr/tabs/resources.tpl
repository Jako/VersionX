<script type="text/javascript">
    (function() {
        var added = false;
        MODx.on("ready", function() {
            if (added) {
                return;
            }
            added = true;
            MODx.addTab("modx-resource-tabs", {
                title: _('versionx.tabheader'),
                id: 'versionx-resource-tab',
                layout: 'anchor',
                defaults: {
                    anchor: '1',
                },
                items: [{
                    xtype: 'versionx-panel-resources',
                    width: 500
                },{
                    html: '<hr />',
                },{
                    layout: 'anchor',
                    items: [{
                        xtype: 'versionx-grid-resources'
                    }]
                }]
            });
        });
    })();
</script>
