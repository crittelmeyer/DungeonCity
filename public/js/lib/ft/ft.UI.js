/** 
 * @namespace Holds functionality for brickstream applications and libraries
 * @requires  Mustache
 * @requires  jQuery
 */
var ft = ft || {};


define(["jquery", "Mustache", "bootstrap"], function($, Mustache) {
  /**
   * Holds all of our dungeon generation code & returns the exposed public API
   * 
   * @return {Object}
   *
   * @author  Chris & John Rittelmeyer
   */
  ft.UI = (function() {


/**
     * Shows the loading spinner.
     *
     * @author  Chris Rittelmeyer
     */
    function _showLoader($container) {
      if ($container == null) $container = $('body');

      ft.Utilities.ajaxGet('templates/spinner.mustache', function(template) {
        var htmlString = Mustache.to_html(template, {});

        $container.append(htmlString);
        $container.find('.spinner').show();
        $container.css({
          opacity: "0.5",
          position: "relative"
        });
      });
    }

    /**
     * Hides the loading spinner.
     *
     * @author  Chris Rittelmeyer
     */
    function _hideLoader($container) {
      if ($container == null) $container = $('body');

      $container.find('.spinner').hide();
      $container.css({
        opacity: "",
        position: ""
      });
      $container.removeAttr('style');
    }

    /**
     * Adds standard behavior to a specified Twitter Bootstrap style drop-down.<br>
     * --Changes display text & value of drop-down when selection is made, then:<br>
     * --Executes callback, if provided.
     * 
     * @param  {jQuery_object}   $parent       Parent of the drop-down.
     * @param  {string}   list_item     CSS selector string of all of the drop-down's list items.
     * @param  {string}   action_button CSS selector string of the drop-down's action button.
     * @param  {boolean}   addCaret      If true, caret is appended after newly selected text.
     * @param  {Function} callback A function to execute each time a new selection is made.
     *
     * @author  Chris Rittelmeyer
     */
    function _handleDropDown($parent, list_item, action_button, addCaret, callback) {
      if (typeof addCaret == "undefined") addCaret = true;
      var $list_item = $parent.find(list_item), $action_button = $parent.find(action_button);

      $list_item.on('click', function() {
        //set text & value of new selection
        var newText = $(this).text().trim();
        $action_button.text(newText);
        if (addCaret) $action_button.append(' <span class="caret"></span>');
        $action_button.val(newText);

        if (callback) callback.call(this, newText);
      });
    }

    /**
     * Retrieves a mustache template from cache, if available. If unavailable, it retrieves it from file.
     * 
     * @param  {String}   name     Name of the template to retrieve.
     * @param  {Function} callback A function to execute after the template is retrieved.
     * 
     * @author Chris Rittelmeyer
     */
    function _getTemplate(name, callback) {
      var key, path;
      if (typeof name === "object") {
        //pull key and name from name param
        key = name.key;
        path = name.path;
        name = name.name;
      } else {
        //set default key & path
        key = path = "templates";
      }

      if (ft.UI[key] && ft.UI[key][name]) {
        //execute callback
        callback.call(this, ft.UI[key][name]);
      } else {
        ft.Utilities.ajaxGet(path + "/" + name + ".mustache", function(template) {
          //create cache if it doesn't exist
          if (!ft.UI[key]) ft.UI[key] = {};

          //cache template
          ft.UI[key][name] = template;

          //execute callback
          callback.call(this, template);
        });
      }
    }

    /**
     * Displays an alert using the alert template.
     * 
     * @param  {jQuery object}              $element         Element to prepend the output HTML to.
     * @param  {mustache template object}   alertTemplateObj JSON object to be parsed into alert mustache template.
     * @param  {Function} callback A function to execute after the alert is displayed.
     * 
     * @author  Chris Rittelmeyer
     */
    function _showAlert($element, alertTemplateObj, callback) {
      _getTemplate('alert', function(template) {
        //generate html string from template
        var htmlString = Mustache.to_html(template, alertTemplateObj);

        //clear any old errors & display error
        $element.find('.alert').remove();
        $element.prepend(htmlString);

        //execute callback
        if (callback) callback.call();
      });
    }

    return {
      showLoader: _showLoader,
      hideLoader: _hideLoader,
      handleDropDown: _handleDropDown,
      getTemplate: _getTemplate,
      showAlert: _showAlert
    };
  })();
});
