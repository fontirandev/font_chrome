'use strict';
window.browser = (function () {
    return window.msBrowser || window.browser || window.chrome;
})();

browser.storage.onChanged.addListener(function (changes, namespace) {
    inject_css();
    run_on_page();

    if (window.location.host.replace("www.", "") != 'youtube.com') {
        new MutationObserver(run_on_page).observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    else {
        browser.storage.local.get('font', function (items) {
            document.head.insertAdjacentHTML("beforeend", '<style>.ytp-caption-segment{font-family:' + items.font + ' !important }</style>');
        });
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
                        document.documentElement.style.setProperty(`--font`, items.font);
                        var elems = document.querySelectorAll('input,textarea,div,section,h1,h2,h3,h4,h5,h6,p,span,strong,ul,li,ol,dt,dd,dl,q,form,a,button,caption,table,tbody,th,tr,thead,small,select,option,nav')
                        elems.forEach(function (elem) {
                            elem.style.setProperty('font-family', items.font);
                            elem.style.setProperty('letter-spacing', '0px');
                        });
                    });
                }
                else {
                    browser.storage.local.get('font', function (items) {
                        document.documentElement.style.setProperty(`--font`, items.font);
                        var elems = document.querySelectorAll('input,textarea,div,section,h1,h2,h3,h4,h5,h6,p,span,strong,ul,li,ol,dt,dd,dl,q,form,a,button,caption,table,tbody,th,tr,thead,small,select,option,nav')
                        elems.forEach(function (elem) {
                            if ((elem.className != "Am Al editable LW-avf tS-tW") && (elem.className != "aoT")) {//classes of elements in gmail's compose page
                                elem.style.setProperty('font-family', items.font);
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
                                var element = document.createElement('style');
                                (element.type = 'text/css'),
                                    (element.innerText = styles),
                                    (element.id = 'custom-font');
                                document.head //injecting our css
                                    ? document.head.appendChild(element)
                                    : document.documentElement.appendChild(element);

                                document.body.style.setProperty('font-family', 'var(--font)');
                            }
                        });
                    });
                });
            }
        }
    });


};


inject_css();
run_on_page();
if (window.location.host.replace("www.", "") == 'youtube.com') {
    browser.storage.local.get('font', function (items) {
        document.head.insertAdjacentHTML("beforeend", '<style>.ytp-caption-segment{font-family:' + items.font + ' !important }</style>');
    });
}
if (window.location.host.replace("www.", "") == 'mail.google.com' || window.location.host.replace("www.", "") == 'twitter.com') {
    new MutationObserver(run_on_page).observe(document.body, {
        childList: true,
        subtree: true
    });
}


