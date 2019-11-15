requirejs.config({
    bundles: {
        'entistimeline_v10.js': ['entistimeline_loader']
    }
})

define(
    [
        'entistimeline_loader',
        'module'
    ],
    function (t, module) {
        'use strict';

        // Extract init configuration
        var cfg = module.config().timelines;
        if (cfg != null) {
            for (var i = 0; i < cfg.length; i++) {
                var timelineCfg = cfg[i];
                var loader = new t.TimelineLoader();
                if (timelineCfg.timelineUrl != null)
                    loader.loadFromUrl(timelineCfg.timelineUrl, timelineCfg.panelId, timelineCfg.customTheme);
                else if (timelineCfg.timelineSpec != null)
                    loader.load(timelineCfg.timelineSpec, timelineCfg.panelId, timelineCfg.customTheme);
                else
                    console.error("Timeline URL not specified in configuration. Please see the docs.");
            }
        }
    }
);