/*
 * Copyright (c) 2017. Volodumur Hryvinskyi.  All rights reserved.
 * @author: <mailto:volodumur@hryvinskyi.com>
 * @github: <https://github.com/scriptua>
 */

define([
    "jquery",
    'mage/translate',
    'Magento_Customer/js/customer-data',
    'Magento_Catalog/product/view/validation',
    'colorBox'
], function ($, $t, $cd) {
    "use strict";

    $.widget(
        'script.QuickView',
        {
            options: {
                baseUrl: '/',
                showPopupTitle: true,
                popupTitle: $t('Script Quick View'),
                currentText: $t('Product {current} of {total}'),
                previousText: $t('Preview'),
                nextText: $t('Next'),
                closeText: $t('Close'),
                transition: "fade",
                speed: "300",
                maxWidth: "1260",
                initialWidth: "75",
                initialHeight: "75",
                itemClass: '.products.grid .item.product-item, .products.list .item.product-item',
                btnLabel: $t('Quick View'),
                btnContainer: '.product-item-info',
                handlerClassName: 'script-quick-view-button',
                additionClass: '',
                addToCartButtonSelector: '.action.tocart',
                addToCartButtonDisabledClass: 'disabled',
                addToCartButtonTextWhileAdding: $t('Adding...'),
                addToCartButtonTextAdded: $t('Added'),
                addToCartButtonTextDefault: $t('Add to Cart'),
                addToCartStatusSelector: 'script-add-cart-status',
                minicartSelector: '[data-block="minicart"]'
            },
            _create: function () {
                if (!$('body').hasClass('catalog-product-view')) {
                    this._initialButtons(this.options);
                    this._bindColorbox(this.options);
                }
            },
            _initialButtons: function (config) {
                $(config.itemClass).not(".product-item-widget").each(function () {
                    if (!$(this).find('.' + config.handlerClassName).length) {
                        var groupName = $(this).parent().attr('class').replace(' ', '-');
                        var productId = $(this).find('.price-final_price').data('product-id');
                        if (typeof productId !== 'undefined' && productId !== undefined && productId !== null) {
                            var url = config.baseUrl + 'script_quickview/catalog_product/view/id/' + productId;
                            var btnQuickView = '<div class="script-quick-view-btn-container">';
                            btnQuickView += '<a rel="' + groupName + '" class="' + config.handlerClassName + '" href="' + url + '"';
                            if (config.showPopupTitle) {
                                btnQuickView += ' title="' + config.popupTitle + '"';
                            }
                            btnQuickView += ' >';
                            btnQuickView += '<span>' + config.btnLabel + '</span></a>';
                            btnQuickView += '</div>';
                            $(this).find(config.btnContainer).prepend(btnQuickView);
                        }
                    }
                });
            },
            _bindColorbox: function (config) {
                var self = this;
                $('.' + config.handlerClassName).each(function () {
                    $(this).colorbox({
                        className: config.additionClass,
                        maxWidth: config.maxWidth,
                        initialWidth: config.initialWidth,
                        initialHeight: config.initialHeight,
                        current: config.currentText,
                        previous: config.previousText,
                        next: config.nextText,
                        close: config.closeText,
                        transition: config.transition,
                        speed: config.speed,
                        onLoad: function () {
                            $('#cboxClose').toggle();
                            if ($('#cboxNavigation').length) {
                                $('#cboxNavigation').hide();
                            }
                            if ($('#script-quick-view-tabs').length) {
                                $('#script-quick-view-tabs').hide().addClass('loading');
                            }
                            return false;
                        },
                        onComplete: function () {
                            self._repositionElements();
                            self._configurableProcess();
                            self._bundleProcess();
                            self._downloadProcess();
                            self._reviewProcess();
                            self.bindAjaxAddToCart();
                            $('#cboxContent').trigger('contentUpdated');
                        },
                        onClosed: function () {
                            $('#colorbox').removeClass('colorbox');
                        }
                    });
                });
            },
            _repositionElements: function () {
                $('#cboxLoadedContent').css({'height': 'auto'});
                $('#colorbox').addClass('colorbox');
                if (!$('#cboxNavigation').length) {
                    $('#cboxContent').append('<div id="cboxNavigation"></div>');
                    $('#cboxNext').appendTo('#cboxNavigation');
                    $('#cboxPrevious').appendTo('#cboxNavigation');
                    $('#cboxCurrent').appendTo('#cboxNavigation');
                } else {
                    if ($('#cboxNavigation #btnGotoProduct').length) {
                        $('#cboxNavigation #btnGotoProduct').remove();
                    }
                    if ($('#cboxNavigation').length) {
                        $('#cboxNavigation').show();
                    }
                }
                if ($('#cboxContent #btnGotoProduct').length) {
                    $('#cboxContent #btnGotoProduct').appendTo('#cboxNavigation');
                }
                $('#script-quick-view-tabs').removeClass('loading').show();
                $('#cboxClose').appendTo('#cboxWrapper').toggle();
            },
            _configurableProcess: function () {
                if ($('#cboxContent').find('.swatch-opt').length) {
                    $('#cboxContent').find('.field.configurable').hide();
                    setTimeout(function () {
                        $('#cboxContent').find('.swatch-opt').find('.swatch-option').each(function () {
                            var $elm = $(this);
                            $elm.on('click', function () {
                                $('#cboxContent').find('#product-addtocart-button').prop('disabled', true);
                                var opId = $elm.attr('option-id');
                                var $curOpt = $('#cboxContent').find('select.super-attribute-select option[value="' + opId + '"]').first();
                                if ($elm.hasClass('selected')) {
                                    $curOpt.parent().val('').trigger('change');
                                } else {
                                    $curOpt.parent().val(opId).trigger('change');
                                }
                                $('#cboxContent').find('#product-addtocart-button').prop('disabled', false);
                            });
                        });
                    }, 200);
                }
            },
            _bundleProcess: function () {
                if ($('#cboxContent').find('#bundle-slide').length) {
                    var $bundleBtn = $('#cboxContent').find('#bundle-slide');
                    var $bundleTabLink = $('#tab-label-script-quick-view-product-bundle-title');
                    $bundleTabLink.parent().hide();
                    $bundleBtn.off('click').on('click', function (e) {
                        e.preventDefault();
                        $bundleTabLink.parent().show();
                        $bundleTabLink.click();
                        return false;
                    });
                }
            },
            _downloadProcess: function () {
                if ($('#cboxContent').find('#downloadable-links-list').length) {
                    $('.box-tocart .field.qty').hide();
                }
            },
            _reviewProcess: function () {
                if ($('#cboxContent').find('#tab-label-script-quick-view-reviews-title').length) {
                    var $reviewsTabLink = $('#cboxContent').find('#tab-label-script-quick-view-reviews-title');
                    $('#cboxContent').find('.reviews-actions .action.view').click(function () {
                        $reviewsTabLink.click();
                    });
                    $('#cboxContent').find('.reviews-actions .action.add').click(function () {
                        $reviewsTabLink.click();
                        $('#cboxContent').find('#nickname_field').focus();
                    })
                }
            },
            bindAjaxAddToCart: function () {
                var self = this;
                if ($('#product_addtocart_form').length) {
                    $('#product_addtocart_form').mage('validation', {
                        radioCheckboxClosest: '.nested',
                        submitHandler: function (form) {
                            self.submitForm($(form));
                            return false;
                        }
                    });
                }
            },
            submitForm: function (form) {
                var self = this;
                if (form.has('input[type="file"]').length && form.find('input[type="file"]').val() !== '') {
                    self.element.off('submit');
                    form.submit();
                } else {
                    self.ajaxAddCart(form);
                }
            },
            ajaxAddCart: function (form) {
                var self = this;
                var url = form.attr('action'),
                    data = [];
                url = url.replace("checkout/cart", "script_quickview/index/updatecart");
                $.each(form.serializeArray(), function (key, val) {
                    if(val.value != '') {
                        data[key] = val;
                    }
                });

                $.ajax({
                    url: url, data: data, type: 'post', dataType: 'json', beforeSend: function () {
                        self.beforeAddToCart(form);
                    }, success: function (rs) {
                        if (rs.messages) {
                            if (!$('#' + self.options.addToCartStatusSelector).length) {
                                $('#quickview-info-main .product-add-form').prepend('<div id="' + self.options.addToCartStatusSelector + '">&nbsp;</div>');
                            }
                            $('#' + self.options.addToCartStatusSelector).fadeOut(100, function () {
                                var msg = '<div class="message ' + ((rs.status) ? 'success' : 'error') + '"><span>' + rs.messages + '</span></div>';
                                $('#' + self.options.addToCartStatusSelector).html(msg).fadeIn(200);
                            });
                        }
                        if (rs.minicart) {
                            $(self.options.minicartSelector).replaceWith(rs.minicart);
                            $(self.options.minicartSelector).trigger('contentUpdated');
                        }
                        self.afterAddToCart(form);
                    }
                });
            },
            beforeAddToCart: function (form) {
                var self = this;
                $(self.options.minicartSelector).trigger('contentLoading');
                var addToCartButton = $(form).find(self.options.addToCartButtonSelector);
                addToCartButton.addClass(self.options.addToCartButtonDisabledClass);
                addToCartButton.attr('title', self.options.addToCartButtonTextWhileAdding);
                addToCartButton.find('span').text(self.options.addToCartButtonTextWhileAdding);
            },
            afterAddToCart: function (form) {
                var self = this, sections = ['cart'], addToCartButton = $(form).find(this.options.addToCartButtonSelector);

                $cd.invalidate(sections);
                $cd.reload(sections, true);

                addToCartButton.find('span').text(this.options.addToCartButtonTextAdded);
                addToCartButton.attr('title', this.options.addToCartButtonTextAdded);
                setTimeout(function () {
                    addToCartButton.removeClass(self.options.addToCartButtonDisabledClass);
                    addToCartButton.find('span').text(self.options.addToCartButtonTextDefault);
                    addToCartButton.attr('title', self.options.addToCartButtonTextDefault);
                }, 1000);
                setTimeout(function () {
                    $('#' + self.options.addToCartStatusSelector).fadeOut('slow');
                }, 5000);
            }
        }
    );

    return $.script.QuickView;
});
