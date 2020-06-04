/* eslint-disable no-undef */
/* eslint-disable func-names */

module.exports = function($, remote) {
  $('#header').load('../../app/view/components/header.html');

  $(document).ready(function() {
    function getWindow() {
      return remote.BrowserWindow.getFocusedWindow();
    }

    $('#btnCancel').click(function() {
      getWindow().close();
    });

    // $('#btnPlus').click(()=> {
    //     getWindow().isMaximized() ? getWindow().restore() : getWindow().maximize();
    // });

    $('#btnMinus').click(function() {
      getWindow().minimize();
    });
  });
};
