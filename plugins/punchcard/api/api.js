const plugin = {}
	common = require('../../../api/utils/common.js'),
    plugins = require('../../pluginManager.js');


(function (plugin) {
    plugins.register("/i", function(ob) {
        var params = ob.params;
        // time of day parameter
        var dow_hour = {};
        if(params.qstring.begin_session || params.qstring.events) {
            const events = params.qstring.events;
            const app_key = params.qstring.app_key;
            const field = params.qstring.dow + "-" + params.qstring.hour;
            // increase one every time
            dow_hour[field] = 1;
            events.forEach((e) => {
                common.db.collection('timesofday').update({
                    _id: common.md5Hash(app_key + e.key)
                },
                {
                    $set: {
                        app_id: app_key,
                        e: e.key,
                    },
                    $inc: dow_hour
                },
                { upsert: true }) 
            })
        }
    })
}(plugin));

module.exports = plugin;
