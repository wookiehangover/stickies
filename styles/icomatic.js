var IcomaticUtils = (function() {
return {
fallbacks: [{ from: 'circleoutline', 'to': '\ue013' },{ from: 'imageoutline', 'to': '\ue027' },{ from: 'videocamera', 'to': '\ue044' },{ from: 'arrowright', 'to': '\ue003' },{ from: 'attachment', 'to': '\ue005' },{ from: 'googleplus', 'to': '\ue024' },{ from: 'arrowdown', 'to': '\ue001' },{ from: 'arrowleft', 'to': '\ue002' },{ from: 'backlight', 'to': '\ue008' },{ from: 'checkmark', 'to': '\ue012' },{ from: 'instagram', 'to': '\ue029' },{ from: 'nextlight', 'to': '\ue02f' },{ from: 'audiooff', 'to': '\ue006' },{ from: 'bookmark', 'to': '\ue00a' },{ from: 'calendar', 'to': '\ue00d' },{ from: 'collapse', 'to': '\ue016' },{ from: 'computer', 'to': '\ue018' },{ from: 'download', 'to': '\ue01a' },{ from: 'facebook', 'to': '\ue01e' },{ from: 'favorite', 'to': '\ue01f' },{ from: 'feedback', 'to': '\ue020' },{ from: 'listview', 'to': '\ue02b' },{ from: 'location', 'to': '\ue02c' },{ from: 'question', 'to': '\ue038' },{ from: 'settings', 'to': '\ue03d' },{ from: 'tileview', 'to': '\ue041' },{ from: 'arrowup', 'to': '\ue004' },{ from: 'comment', 'to': '\ue017' },{ from: 'preview', 'to': '\ue036' },{ from: 'refresh', 'to': '\ue039' },{ from: 'retweet', 'to': '\ue03a' },{ from: 'camera', 'to': '\ue00f' },{ from: 'cancel', 'to': '\ue010' },{ from: 'circle', 'to': '\ue014' },{ from: 'delete', 'to': '\ue019' },{ from: 'expand', 'to': '\ue01d' },{ from: 'flickr', 'to': '\ue021' },{ from: 'folder', 'to': '\ue022' },{ from: 'github', 'to': '\ue023' },{ from: 'pencil', 'to': '\ue032' },{ from: 'plugin', 'to': '\ue034' },{ from: 'search', 'to': '\ue03c' },{ from: 'tablet', 'to': '\ue03f' },{ from: 'unlock', 'to': '\ue042' },{ from: 'alert', 'to': '\ue000' },{ from: 'audio', 'to': '\ue007' },{ from: 'brush', 'to': '\ue00b' },{ from: 'build', 'to': '\ue00c' },{ from: 'cloud', 'to': '\ue015' },{ from: 'email', 'to': '\ue01b' },{ from: 'error', 'to': '\ue01c' },{ from: 'group', 'to': '\ue025' },{ from: 'image', 'to': '\ue028' },{ from: 'minus', 'to': '\ue02e' },{ from: 'phone', 'to': '\ue033' },{ from: 'print', 'to': '\ue037' },{ from: 'share', 'to': '\ue03e' },{ from: 'back', 'to': '\ue009' },{ from: 'call', 'to': '\ue00e' },{ from: 'chat', 'to': '\ue011' },{ from: 'home', 'to': '\ue026' },{ from: 'like', 'to': '\ue02a' },{ from: 'lock', 'to': '\ue02d' },{ from: 'next', 'to': '\ue030' },{ from: 'page', 'to': '\ue031' },{ from: 'plus', 'to': '\ue035' },{ from: 'save', 'to': '\ue03b' },{ from: 'text', 'to': '\ue040' },{ from: 'user', 'to': '\ue043' },{ from: 'view', 'to': '\ue045' },{ from: 'wifi', 'to': '\ue046' }],
substitute: function(el) {
    var curr = el.firstChild;
    var next, alt;
    var content;
    while (curr) {
        next = curr.nextSibling;
        if (curr.nodeType === Node.TEXT_NODE) {
            content = curr.nodeValue;
            for (var i = 0; i < IcomaticUtils.fallbacks.length; i++) {
                content = content.replace( IcomaticUtils.fallbacks[i].from, function(match) {
                    alt = document.createElement('span');
                    alt.setAttribute('class', 'icomatic-alt');
                    alt.innerHTML = match;
                    el.insertBefore(alt, curr);
                    return IcomaticUtils.fallbacks[i].to;
                });
            }
            alt = document.createTextNode(content);
            el.replaceChild(alt, curr);
        }
        curr = next;
    }
},
run: function(force) {
    force = typeof force !== 'undefined' ? force : false;
    var s = getComputedStyle(document.body);
    if (('WebkitFontFeatureSettings' in s)
        || ('MozFontFeatureSettings' in s)
        || ('MsFontFeatureSettings' in s)
        || ('OFontFeatureSettings' in s)
        || ('fontFeatureSettings' in s))
        if (!force)
            return;
    var els = document.querySelectorAll('.icomatic');
    for (var i = 0; i < els.length; i++)
        IcomaticUtils.substitute(els[i]);
}
} // end of object
} // end of fn
)()