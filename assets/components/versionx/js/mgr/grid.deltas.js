VersionX.grid.Deltas = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        url: VersionX.config.connector_url,
        id: 'versionx-grid-deltas',
        itemId: 'versionx-grid-deltas',
        cls: 'versionx-grid-deltas',
        bodyCssClass: 'versionx-grid-deltas-body',
        baseParams: {
            action: 'mgr/deltas/getlist',
            principal_package: config.principal_package,
            principal_class: config.principal_class,
            principal: config.principal,
            type: config.type,
        },
        params: [],
        fields: [
            {name: 'id', type: 'int'},
            {name: 'username', type: 'string'},
            {name: 'time_start', type: 'string'},
            {name: 'time_end', type: 'string'},
            {name: 'diffs', type: 'string'},
        ],
        paging: true,
        remoteSort: true,
        stripeRows: false,
        showActionsColumn: false,
        hideHeaders: true,
        autoExpandColumn: 'time_end',
        autoHeight: true,
        columns: [{
            header: 'Versions',
            dataIndex: 'time_end',
            renderer: this.diffColumnRenderer
        },{
            header: 'Details',
            dataIndex: 'id',
            fixed: true,
            width: 150,
            renderer: this.detailColumnRenderer,
            hidden: true
        }]
        ,tbar: [{
            xtype: 'versionx-field-search',
            grid: this,
            width: 400,
        },'->',{
            xtype: 'datefield',
            name: 'date_from',
            emptyText: 'Date from...',
            format: 'Y-m-d',
        },{
            xtype: 'datefield',
            name: 'date_to',
            emptyText: 'Date to...',
            format: 'Y-m-d',
        }]
    });
    VersionX.grid.Deltas.superclass.constructor.call(this,config);
    this.config = config;
    this.on('click', this.handleClick, this);
};
Ext.extend(VersionX.grid.Deltas, MODx.grid.Grid, {
    search: function (tf, nv, ov) {
        let s = this.getStore();
        s.baseParams.query = tf.getValue();
        this.getBottomToolbar().changePage(1);
        this.refresh();
    },
    handleClick: function(e) {
        var t = e.getTarget(),
            className = t.className.split(' ')[0],
            that = this;

        switch (className) {
            case 'versionx-diff-revert-btn':
                // Confirm revert with user, and send request
                MODx.msg.confirm({
                    title: 'Confirm Revert',
                    text: 'Are you sure you want to revert to the before state of this change?',
                    url: VersionX.config.connector_url,
                    params: {
                        action: 'mgr/deltas/revert',
                        id: t.dataset.id,
                        principal: that.config['principal'],
                        type: that.config['type'],
                    },
                    listeners: {
                        'success': {fn: function() {
                                location.reload();
                            }, scope:this}
                    },
                });
            break;

            case 'versionx-diff-revert-all-btn':
                let time = Ext.util.Format.date(t.dataset.time_start,
                    `${MODx.config.manager_date_format} H:i:s`)
                MODx.msg.confirm({
                    title: 'Time Travel: Revert All Fields to ' + time,
                    text: `<p>Are you sure you want to revert all fields to this point in time?
                               <strong>${time}</strong>
                           </p>`,
                    url: VersionX.config.connector_url,
                    params: {
                        action: 'mgr/deltas/revert',
                        id: t.dataset.id,
                        time_travel: true,
                        principal: that.config['principal'],
                        type: that.config['type'],
                    },
                    listeners: {
                        'success': {fn: function() {
                                location.reload();
                            }, scope:this}
                    },
                });
                break;
        }
    },
    diffColumnRenderer: function(v, p, rec) {
        let diffs = rec.get('diffs'),
            version_id = rec.get('id'),
            name = rec.get('username'),
            time_start = rec.get('time_start'),
            time_end = rec.get('time_end');

        return `<div class="versionx-grid-diff-container">
                    <div class="versionx-grid-timeline">
                        <div class="versionx-grid-timeline-point"></div>
                    </div>
                    <div class="versionx-grid-column-diff">
                        <div class="versionx-diff-top-row">
                            <div class="versionx-diff-top-row-left">
                                <div class="versionx-diff-times">${time_end}</div>
                                <div class="versionx-diff-usernames">${name}</div>
                            </div>
                            <div class="versionx-diff-top-row-right">
                                <button class="versionx-diff-revert-btn x-button x-button-small primary-button" type="button" data-id="${version_id}">
                                    Revert
                                </button>
                                <button class="versionx-diff-revert-all-btn x-button x-button-small primary-button" type="button" data-time_start="${time_start}" data-id="${version_id}">
                                    Time Travel
                                </button>
                                <div class="versionx-diff-menu"></div>
                            </div>
                        </div>
                        <div class="versionx-diff-list">
                            ${diffs}
                        </div>
                    </div>
                </div>`;
    },
    detailColumnRenderer: function(v, p, rec) {

    },
});
Ext.reg('versionx-grid-deltas', VersionX.grid.Deltas);
