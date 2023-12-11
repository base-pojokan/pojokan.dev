const appendScript = (src) => {
    const script = document.createElement('script');
    script.src = src;
    script.type = 'text/javascript';
    document.head.appendChild(script);
};

const getUrlVars = () => {
    let vars = [],
        hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
};

const sanitiseHash = href => href.match(/#/g) ? href.slice(0, href.indexOf('#')) : href;
const getFirstAnchor = href => {
    const anchor = href.slice(href.indexOf('#') + 1);
    console.log(href, 'href');
    return anchor.match('#') ? getFirstAnchor(anchor) : `#${anchor}`;
}

(() => {
    appendScript('https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js');
    appendScript('https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.4/umd/popper.min.js');
    appendScript('https://cdnjs.cloudflare.com/ajax/libs/mdbootstrap/4.8.8/js/mdb.min.js');

    var checkReady = callback => {
        if (window.jQuery) {
            callback(jQuery);
        } else {
            window.setTimeout(() => {
                checkReady(callback);
            }, 20);
        }
    };

    checkReady($ => {
        $(() => {
            appendScript('https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/js/bootstrap.min.js');
            setTimeout(() => {
                new WOW().init();
            }, 1200);

            $(() => {
                const includes = $('[data-include]'),
                    lang = getUrlVars().lang,
                    excludes = ['footer', 'navbar'];

                jQuery.each(includes, function () {
                    const include = $(this).data('include'),
                        suffix = sanitiseHash(!excludes.includes(include) ? (lang ? '-' + lang : '-en') : '');
                    $(this).load(`view/${include + suffix}.html`, () => {
                        if (lang) {
                            $('a').each(function () {
                                const href = $(this).attr('href');
                                if (href) {
                                    const anchor = href.match('#') ? getFirstAnchor(href) : null;
                                    let main = sanitiseHash(href);
                                    main += (!main.match(/lang/g)) ? '?lang=' + lang : '';
                                    $(this).attr('href', (anchor && anchor !== '/') ? (main + anchor) : main);
                                }
                            });
                        }
                    });
                });
            });
        });
    });
})();