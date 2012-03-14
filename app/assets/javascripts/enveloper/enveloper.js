/*!
 * https://github.com/dafa/enveloper
 *
 * Copyright 2012, Daria Paramonova
 * Licensed under the MIT license
 * http://www.opensource.org/licenses/mit-license.php
 */

var EnvelopeResizer = function(){
    if(jQuery.isReady){
       this.initialize();
     }else{
       $(document).ready(this.initialize.bind(this));
     }
}

EnvelopeResizer.prototype = {
    initialize: function(){
        var h = parseInt($.cookie('envelope-height')) || 480;
        var w  = parseInt($.cookie('envelope-width'))  || 320;
        this.height = $('#height')[0];
        this.width  = $('#width')[0];
        this.envelope = $('#envelope');
        this.frame    = $('#envelope iframe');
        this.portrait = $('#portrait');
        this.landscape = $('#landscape');
        this.models   = $('#model option');
        this.frame_error = $('#iframe-error');

        this.onHashChanged();
        this.setInputs(w, h);
        this.submitInputs();
        $(window).bind("hashchange", this.onHashChanged.bind(this));
        this.frame.load(this.onIframeLoad.bind(this));
        $('#model').change(this.onModelSelected.bind(this));
        $('#orientation').click(this.changeOrientation.bind(this));
        $('#submit-inputs').click(this.submitInputs.bind(this));
        $('#iframe-error-close').click(this.hideIframeError.bind(this));
        $('#new-window').click(this.openNewWindow.bind(this));
    },

    // partial actions
    setCookies: function(w, h){
        $.cookie('envelope-height', parseInt(h));
        $.cookie('envelope-width',  parseInt(w));
    },
    setInputs: function(w, h){
        this.width.value = w;
        this.height.value = h;
    },
    resizeEnvelope: function(w, h){
        this.envelope.animate({width: w+"px", height: h+"px"}, "slow");
    },
    markOrientation: function(is_portrait){
        this[is_portrait ? 'portrait' : 'landscape'].addClass("active-orientation");
        this[is_portrait ? 'landscape' : 'portrait'].removeClass("active-orientation");
    },
    chooseModel: function(w, h){
        var model_attr = (parseInt(w) <= parseInt(h)) ? (w+" "+h) : (h+" "+w)
        this.models.each(function(index){
            if(this.value == model_attr){
                this.selected = 'selected';
            }else{
                this.selected = undefined;
            }
        });
    },

    // user actions
    onModelSelected: function(event){
        var size = event.target.value.split(" ");
        var w = size[this.is_portrait ? 0 : 1];
        var h = size[this.is_portrait ? 1 : 0];
        if(!w || !h) return;

        this.setInputs(w, h);
        this.resizeEnvelope(w, h);
        this.setCookies(w, h);
    },
    changeOrientation: function(){
        this.setInputs(this.height.value, this.width.value);

        this.submitInputs();
    },
    submitInputs: function(){
        var w = parseInt(this.width.value) || 0;
        var h = parseInt(this.height.value) || 0;
        this.setInputs(w, h);
        this.resizeEnvelope(w, h);
        this.setCookies(w, h);
        this.is_portrait = (w <= h);
        this.markOrientation(this.is_portrait);
        this.chooseModel(w, h);
    },

    // link in frame clicked
    onIframeLoad: function (ev) {
        console.log(ev);
        window.clearTimeout(this.load_timer);
        this.hideIframeError();
        try{
            var path = this.frame[0].contentWindow.location.pathname;
            if(path && path!="blank"){
                window.location.hash = path;
            }

            this.frame.contents().find('a').each(function(index){
                if(this.href.match(/^[https?:\/\/|mailto]/) && !this.target){
                    this.target = '_parent';}
            });

            var title = this.frame[0].contentWindow.document.title;
            title = title && title.trim != "" ? title+" – enveloped for you" : "Enveloped for you"
            document.title = title;
        }catch(err){
            if(console && console.log){
                console.log("An error occured in iframe load observer");
                console.log(err);
            }
        }
    },

    // hash changed, should reload frame
    onHashChanged: function() {
        var hash = window.location.hash.replace(/^#/, '');
        if(!hash || hash == ""){
            hash = window.location.pathname+"/info.html"
        }
        if(hash && hash!=this.frame.attr("src")){
            window.clearTimeout(this.load_timer);
            this.load_timer = window.setTimeout(this.showIframeError.bind(this), 5000);
            this.frame.attr("src", hash);
        }
    },

    // stupid workaround of display forbidden by X-Frame-Options
    // works for webkit browsers for they never rizes iframe.load event
    // if refused to display. still FF rizes
    showIframeError: function() {
        this.frame.hide();
        this.frame_error.show();
    },

    hideIframeError: function() {
        this.frame_error.hide();
        this.frame.show();
    },

    // if the worst comes to the worst popup window with suitable size
    openNewWindow: function() {
        var url = this.frame.attr("src");
        window.open(url,'Enveloped for you','width='+this.envelope.width()+',height='+this.envelope.height())
    }
}