/**
  * If the Querys failed.
  * @constructor
  * @param {} sender - The sender.
  * @param {} args - The arguments.
 */
function onQueryFailed(sender, args) {
    SP.UI.Notify.addNotification('Request failed. ' + args.get_message() + '\n' +
    args.get_stackTrace(), true);
}
/**
     * Scallbacks the specified dialog result.
     * @constructor
     * @param {string} dialogResult - The dialog result
     * @param {string} returnValue - The return value.
     */
function scallback(dialogResult, returnValue) {
    if (dialogResult == SP.UI.DialogResult.OK) {
        SP.UI.ModalDialog.RefreshPage(SP.UI.DialogResult.OK);
    }
}
/**
* Modifies the ribbon.
*/
function ModifyRibbon() {
    var pm = SP.Ribbon.PageManager.get_instance();
    pm.add_ribbonInited(function () {
        AddDGDTab();
    });
    var ribbon = null;
    try {
        ribbon = pm.get_ribbon();
    }
    catch (e) { }
    if (!ribbon) {
        if (typeof (_ribbonStartInit) == "function")
            _ribbonStartInit(_ribbon.initialTabId, false, null);
    }
    else {
        AddDGDTab();
    }
}
/**
 * Pads numbers to four digits.
 * @constructor
 * @param {integer} number - The number.
 */
function padToFour(number) {
    if (number <= 9999) { number = ("000" + number).slice(-4); }
    return number;
}
/**
 * Pads numbers to two digits.
 * @constructor
 * @param {integer} number - The number.
 */
function padToTwo(number) {
    if (number <= 99) { number = ("0" + number).slice(-2); }
    return number;
}
/**
 * Validates the URL input.
 * @constructor
 * @param {string} url - The URL.
 */
function validateUrl(url) {
    var re = new RegExp(/^(((ftp|http|https):\/\/)|(\/))(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/);
    return url.match(re);
}