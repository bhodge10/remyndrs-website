/**
 * Platform detection and SMS link handling for Remyndrs.
 *
 * - Facebook/Instagram visitors get the GO start keyword (matches the
 *   parents landing page and Meta ads, so the backend can attribute
 *   the channel). All other visitors keep the message body authored
 *   in the HTML — "Hello" on the main pages, "GO" on the parents page.
 * - iOS: rewrites sms: links to use the & separator (required by iOS)
 * - Android: the authored sms:number?body= format is already correct,
 *   so no rewrite. (An earlier version rewrote these links to
 *   sms://number;?&body=, which opens a broken compose screen on many
 *   devices — do not reintroduce it.)
 * - Tracks actual taps on sms: links (sms_link_tap)
 * - Also handles data-mobile-text / data-desktop-text swaps on CTA buttons
 *
 * Loaded by index.html, index-parents.html, commands.html, and faq.html.
 */
document.addEventListener('DOMContentLoaded', function () {
    var ua = navigator.userAgent;
    var isIOS = /iPad|iPhone|iPod/.test(ua);
    var isAndroid = /Android/.test(ua);
    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);

    // --- Channel keyword from UTM parameters ---
    // Only rewrite to start words the backend is confirmed to recognize
    // ("Hello" and "GO"). Never substitute an unverified default: rewriting
    // an organic visitor's "Hello" to an unrecognized word silently kills
    // their signup at the very last step.
    var params = new URLSearchParams(window.location.search);
    var utmSource = (params.get('utm_source') || '').toLowerCase();
    var keyword = null; // null = leave the authored message body alone

    if (utmSource === 'facebook' || utmSource === 'instagram' || utmSource === 'fb' || utmSource === 'ig') {
        keyword = 'GO';
    }

    if (keyword) {
        document.querySelectorAll('a[href^="sms:"]').forEach(function (link) {
            var href = link.getAttribute('href');
            if (href.indexOf('body=Hello') !== -1) {
                link.setAttribute('href', href.replace('body=Hello', 'body=' + keyword));
            }
        });
    }

    // --- iOS: fix sms: link separator ---
    if (isIOS) {
        document.querySelectorAll('a[href^="sms:"]').forEach(function (link) {
            link.setAttribute('href', link.getAttribute('href').replace('?body=', '&body='));
        });
    }

    if (isAndroid && isMobile) {
        document.documentElement.classList.add('platform-android');
    }

    // --- Track actual taps on sms: links ---
    // Fires alongside any inline per-CTA handlers; beacon transport so the
    // event survives the jump into the Messages app.
    var platform = isAndroid ? 'android' : (isIOS ? 'ios' : 'other');
    document.querySelectorAll('a[href^="sms:"]').forEach(function (link) {
        link.addEventListener('click', function () {
            if (typeof gtag !== 'function') return;
            var body = (link.getAttribute('href').split('body=')[1] || '');
            var firstWord = '(none)';
            try {
                firstWord = decodeURIComponent(body).split(/[^A-Za-z]/)[0] || '(none)';
            } catch (e) { /* malformed encoding — keep (none) */ }
            gtag('event', 'sms_link_tap', {
                page: window.location.pathname.replace(/^\//, '').replace('.html', '') || 'index',
                keyword: firstWord,
                platform: platform,
                transport_type: 'beacon'
            });
        });
    });

    // --- CTA button text swap (mobile vs desktop) ---
    var ctaButtons = document.querySelectorAll('.cta-sms-button, .cta-sms-text');
    ctaButtons.forEach(function (button) {
        var mobileText = button.getAttribute('data-mobile-text');
        var desktopText = button.getAttribute('data-desktop-text');

        if (isMobile && mobileText) {
            button.textContent = mobileText;
        } else if (!isMobile && desktopText) {
            button.textContent = desktopText;
        }
    });
});
