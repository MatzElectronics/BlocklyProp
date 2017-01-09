var utils = {
    showMessage: function (title, message) {
        bootbox.dialog({
            title: title,
            message: message,
            buttons: {
                confirm: {
                    label: "Ok",
                    className: "btn-primary"
                }
            }
        });
    },
    prompt: function (title, message, defaultValue, callback) {
        bootbox.prompt({
            title: title,
            value: defaultValue,
            message: message,
            callback: callback,
            buttons: {
                cancel: {
                    label: "Cancel",
                    className: "btn-default",
                    callback: callback
                },
                confirm: {
                    label: "Confirm",
                    className: "btn-primary",
                    callback: callback
                }
            }

        });
    },
    confirm: function (title, message, callback) {
        bootbox.dialog({
            title: title,
            message: message,
            buttons: {
                cancel: {
                    label: "Cancel",
                    className: "btn-default",
                    callback: function () {
                        callback(false);
                    }
                },
                confirm: {
                    label: "Confirm",
                    className: "btn-primary",
                    callback: function () {
                        callback(true);
                    }
                }
            }
        });
    },
    getUrlParameters: function (parameter, staticURL, decode) {
        /*
         Function: getUrlParameters
         Description: Get the value of URL parameters either from
         current URL or static URL
         Author: Tirumal
         URL: www.code-tricks.com
         */
        var currLocation = staticURL ? staticURL : window.location.search;

        var parArr = [];
        if (currLocation !== undefined && currLocation.split("?")[1] !== undefined) {
            parArr = currLocation.split("?")[1].split("&");
        }
        var returnBool = true;

        for (var i = 0; i < parArr.length; i++) {
            parr = parArr[i].split("=");
            if (parr[0] === parameter) {
                returnBool = true;
                return (decode) ? decodeURIComponent(parr[1]) : parr[1];
            } else {
                returnBool = false;
            }
        }

        if (!returnBool)
            return false;
    }

};

$(document).ready(function () {
    $(".external_link").click(function (e) {
        window.open($(this).attr("href"), "_blank");
        e.preventDefault();
    });
});