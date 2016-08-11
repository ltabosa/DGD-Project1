/**
  * If the Querys failed.
  * @constructor
  * @param {} sender - The sender.
  * @param {} args - The arguments.
 */
function onQueryFailed(sender, args) {
 
    /// <summary>
    /// If the Querys failed.
    /// </summary>
    /// <param name="sender">The sender.</param>
    /// <param name="args">The arguments.</param>
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
    
    /// <summary>
    /// Scallbacks the specified dialog result.
    /// </summary>
    /// <param name="dialogResult">The dialog result.</param>
    /// <param name="returnValue">The return value.</param>
    if (dialogResult == SP.UI.DialogResult.OK) {
        SP.UI.ModalDialog.RefreshPage(SP.UI.DialogResult.OK);
    }
}
/**
* Modifies the ribbon.
*/
function ModifyRibbon() {
    
    /// <summary>
    /// Modifies the ribbon.
    /// </summary>
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
    /// <summary>
    /// Pads numbers to four digits.
    /// </summary>
    /// <param name="number">The number.</param>
    if (number <= 9999) { number = ("000" + number).slice(-4); }
    return number;
}
/**
 * Pads numbers to two digits.
 * @constructor
 * @param {integer} number - The number.
 */
function padToTwo(number) {
    /// <summary>
    /// Pads numbers to two digits.
    /// </summary>
    /// <param name="number">The number.</param>
    if (number <= 99) { number = ("0" + number).slice(-2); }
    return number;
}
/**
 * Validates the URL input.
 * @constructor
 * @param {string} url - The URL.
 */
function validateUrl(url) {
    /// <summary>
    /// Validates the URL input.
    /// </summary>
    /// <param name="url">The URL.</param>
    var re = new RegExp(/^(((ftp|http|https):\/\/)|(\/))(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/);
    return url.match(re);
}