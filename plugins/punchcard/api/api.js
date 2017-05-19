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
            const app_id = params.app_id;
            const field = params.qstring.dow + "-" + params.qstring.hour;
            // increase one every time
            dow_hour[field] = 1;
            events.forEach((e) => {
                // Remove Session prefix
                if(e.key.startsWith('[CLY]_'))
                    e.key = e.key.charAt(6).toUpperCase() + e.key.slice(7);
                common.db.collection('timesofday').update({
                    _id: common.md5Hash(app_id + e.key)
                },
                {
                    $set: {
                        app_id: app_id,
                        e: e.key,
                    },
                    $inc: dow_hour
                },
                { upsert: true }) 
            })
            return true;
        }
        return false;
    });
   plugins.register("/i/apps/delete", function(ob){
		var appId = ob.appId;
		common.db.collection('timesofday').remove({'app_id': common.db.ObjectID(appId)},function(){});
	});
	
	plugins.register("/i/apps/reset", function(ob){
		var appId = ob.appId;
		common.db.collection('timesofday').remove({'app_id': common.db.ObjectID(appId)},function(){});
	});
    
    plugins.register("/i/apps/clear_all", function(ob){
        var appId = ob.appId;
		common.db.collection('timesofday').remove({'app_id': common.db.ObjectID(appId)},function(){});
    });
    
    plugins.register("/i/apps/clear", function(ob){
		var appId = ob.appId;
        var ids = ob.ids;
		common.db.collection('timesofday').remove({$and:[{'app_id': common.db.ObjectID(appId)}, {'app_id': {$nin:ids}}]},function(){});
	});
 
}(plugin));

module.exports = plugin;
