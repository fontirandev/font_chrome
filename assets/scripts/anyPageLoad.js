'use strict';
window.browser = (function () {
    return window.msBrowser || window.browser || window.chrome;
})();

chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
    if (request.command == "revert") {
        var style = document.getElementById('fontiran_class');
        if (style != undefined) {
            document.head //removing our css
                ? document.head.removeChild(style)
                : document.documentElement.removeChild(style);


            var fontiran_youtube = document.getElementById("fontiran_youtube");
            if (fontiran_youtube != undefined)
                document.head.removeChild(fontiran_youtube);
        }
    }
});
browser.storage.onChanged.addListener(function (changes, namespace) {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
        if(key == 'font')
        {
            change_class();
        }
        if(key == 'site_urls')
        {
            run_on_page();
            inject_css();
            change_class();
        }
        if(key == 'fontCode')
        {
            inject_css();
        }
    }

    if (window.location.host.replace("www.", "") != 'youtube.com') {
        var dom_observer = new MutationObserver(run_on_page);
        var container = document.documentElement || document.body;
        var config = { childList: true, subtree: true };
        dom_observer.observe(container, config);
    }
});

function run_on_page() {
    browser.storage.local.get('site_urls', function (result) {
        let loc = window.location.host.replace("www.", "");
        let lo = loc + '/' + window.location.pathname.split("/")[1];
        if (result['site_urls'] != undefined) {
            if (result['site_urls'].includes(loc)) { //if current site is in active sites array()
                if (lo != 'mail.google.com/mail') {// if current url is in mail.google.com/mail
                    browser.storage.local.get('font', function (items) {
                        var elems = document.querySelectorAll('body,input,textarea,div,section,h1,h2,h3,h4,h5,h6,p,span,strong,ul,li,ol,dt,dd,dl,q,form,a,button,caption,table,tbody,th,tr,thead,small,select,option,nav')
                        elems.forEach(function (elem) {
                            //elem.style.setProperty('font-family', items.font);
                            elem.classList.add("fontIran");
                            elem.style.setProperty('letter-spacing', '0px');
                        });
                    });
                }
                else {
                    browser.storage.local.get('font', function (items) {
                        var elems = document.querySelectorAll('body,input,textarea,div,section,h1,h2,h3,h4,h5,h6,p,span,strong,ul,li,ol,dt,dd,dl,q,form,a,button,caption,table,tbody,th,tr,thead,small,select,option,nav')
                        elems.forEach(function (elem) {
                            if ((elem.className != "Am Al editable LW-avf tS-tW") && (elem.className != "aoT")) {//classes of elements in gmail's compose page
                                //elem.style.setProperty('font-family', items.font);
                                elem.classList.add("fontIran");
                                elem.style.setProperty('letter-spacing', '0px');
                            }
                        });
                    });
                }
            }
        }
    });


};

function inject_css() {
    browser.storage.local.get('site_urls', function (result) {
        let loc = window.location.host.replace("www.", "");
        let lo = loc + '/' + window.location.pathname.split("/")[1];
        if (result['site_urls'] != undefined) {
            if (result['site_urls'].includes(loc)) { //if current site is in active sites array()
                browser.storage.local.get('names', function (fonts) {//custom added font names
                    browser.storage.local.get('fontCode', function (data) {//custom added font codes
                        chrome.storage.local.get(["fonts_from_api"], function (names_result) {//fonts loaded from api
                            if ((fonts.names == undefined) && (names_result.fonts_from_api == undefined)) {
                                return;
                            } else {
                                var styles = '';
                                if (fonts.names != undefined) {
                                    let len = fonts['names'].length;

                                    for (let a = 0; a < len; a++) {
                                        styles = styles + `@font-face{  font-family:${fonts.names[a]};src: url('${data.fontCode[a]}');}`;
                                    }
                                }
                                if (names_result.fonts_from_api != undefined) {
                                    names_result.fonts_from_api.forEach(apiFont => {
                                        styles += `@font-face{  font-family:${apiFont['name']};src: url('${apiFont['path']}');}`
                                    });
                                }

                                if (document.getElementById('fontiran-font') != undefined) {
                                    var custom = document.getElementById('fontiran-font');
                                    document.head //removing our css
                                        ? document.head.removeChild(custom)
                                        : document.documentElement.removeChild(custom);

                                }
                                var element = document.createElement('style');
                                (element.type = 'text/css'),
                                    (element.innerText = styles),
                                    (element.id = 'fontiran-font');

                                document.head //injecting our css
                                    ? document.head.appendChild(element)
                                    : document.documentElement.appendChild(element);
                            }
                        });
                    });
                });
            }
        }
    });


};

function change_class() {
    browser.storage.local.get('site_urls', function (result) {
        let loc = window.location.host.replace("www.", "");
        if (result['site_urls'] != undefined) {
            if (result['site_urls'].includes(loc)) { //if current site is in active sites array()
                browser.storage.local.get('font', function (items) {

                    var style = document.getElementById('fontiran_class');
                    if (style != undefined) {
                        document.head //removing our css
                            ? document.head.removeChild(style)
                            : document.documentElement.removeChild(style);
                    }

                    var elements = document.createElement('style');
                    (elements.type = 'text/css'),
                        (elements.innerText = '.fontIran { font-family: ' + items.font + ' !important ;}'),
                        (elements.id = 'fontiran_class');


                    document.head //injecting our css
                        ? document.head.appendChild(elements)
                        : document.documentElement.appendChild(elements);


                    if (window.location.host.replace("www.", "") == 'youtube.com') {
                        browser.storage.local.get('font', function (items) {
                            if (document.getElementById('fontiran_youtube') != undefined) {
                                var fontiran_youtube = document.getElementById("fontiran_youtube");
                                document.head.removeChild(fontiran_youtube);
                            }
                            document.head.insertAdjacentHTML("beforeend", '<style id="fontiran_youtube">.ytp-caption-segment{font-family:' + items.font + ' !important }</style>');
                        });
                    }
                });
            }
            else {
                if (document.getElementById('fontiran_youtube') != undefined) {
                    var fontiran_youtube = document.getElementById("fontiran_youtube");
                    document.head.removeChild(fontiran_youtube);
                }
            }
        }
    });
}

inject_css();
change_class();
run_on_page();

if (window.location.host.replace("www.", "") == 'mail.google.com' || window.location.host.replace("www.", "") == 'twitter.com') {
    var dom_observer = new MutationObserver(run_on_page);
    var container = document.documentElement || document.body;
    var config = { childList: true, subtree: true };
    dom_observer.observe(container, config);
}


