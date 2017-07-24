/*
 * Copyright (c) 2017. Volodumur Hryvinskyi.  All rights reserved.
 * @author: <mailto:volodumur@hryvinskyi.com>
 * @github: <https://github.com/scriptua>
 */

define([
    'jquery',
    'colorBox'
], function ($, colorBox) {
    "use strict";

    return {
        displayContent: function (prodUrl) {
            if (!prodUrl.length) {
                return false;
            }

            var url = window.script_quickview.baseUrl + 'script_quickview/index/updatecart';
            var showMiniCart = parseInt(window.script_quickview.showMiniCart);

            window.script_quickview.showMiniCartFlag = false;

            $.magnificPopup.open({
                items: {
                    src: prodUrl
                },
                type: 'iframe',
                closeOnBgClick: false,
                preloader: true,
                tLoading: '',
                callbacks: {
                    open: function () {
                        $('.mfp-preloader').css('display', 'block');
                    },
                    beforeClose: function () {
                        $('[data-block="minicart"]').trigger('contentLoading');
                        $.ajax({
                            url: url,
                            method: "POST"
                        });
                    },
                    close: function () {
                        $('.mfp-preloader').css('display', 'none');
                    },
                    afterClose: function () {
                        /* Show only if product was added to cart and enabled from admin */
                        if (window.script_quickview.showMiniCartFlag && showMiniCart) {
                            $("html, body").animate({scrollTop: 0}, "slow");
                            setTimeout(function () {
                                $('.action.showcart').trigger('click');
                            }, 1000);
                        }
                    }
                }
            });
        }
    };
});
