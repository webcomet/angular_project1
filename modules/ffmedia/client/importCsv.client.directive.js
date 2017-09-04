(function ($, angular) {
  'use strict';

  /**
   * @ngdoc function
   * @name ffmedia.directive:csvImport
   * @description
   */
  angular.module('ffmedia').directive("importCsv", importCsvDirective);

  function importCsvDirective() {
    return {
      restrict: 'E',
      controller: importCsvDirectiveController,
      controllerAs: 'vm',
      scope: {
        passCsvContent: '&'
      },
      template: importCsvDirectiveTemplate,
      link: importCsvDirectiveLink
    };
    
    function importCsvDirectiveController($scope){
      var vm = this;
      function setup() {
      }
      setup();
    }
    function importCsvDirectiveTemplate(){
      return '<div>' +
              '<input class="btn cta gray" type="file" accept=".csv"/>' +
              '</div>';
    }
    function importCsvDirectiveLink(scope, element) {
      function setup() {
        onEvents();
      }
      setup();
      function cleanCsvValue(value) {
        return value
                .replace(/^\s*|\s*$/g, "") // remove leading & trailing space
                .replace(/^"|"$/g, "") // remove " on the beginning and end
                .replace(/""/g, '"'); // replace "" with "
      }
      function csvToJSON(content) {
        var lines = content.csv.split('\n');
        var result = [];
        var start = 0;
        var columnCount = lines[0].split(content.separator).length;

        var headers = [];
        if (content.header) {
          headers = lines[0].split(content.separator);
          start = 1;
        }
        for (var i = start; i < lines.length; i++) {
          var obj = {};
          var currentline = lines[i].split(new RegExp(content.separator + '(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)'));
          if (currentline.length === columnCount) {
            if (content.header) {
              for (var j = 0; j < headers.length; j++) {
                obj[headers[j]] = cleanCsvValue(currentline[j]);
              }
            } else {
              for (var k = 0; k < currentline.length; k++) {
                obj[k] = cleanCsvValue(currentline[k]);
              }
            }
            result.push(obj);
          }
        }
        return result;
      }
      function onEvents() {
        element.on('change', function (changeEvent) {
          var files = changeEvent.target.files;
          if (files.length) {
            var r = new FileReader();
            r.onload = function (e) {
              var contents = e.target.result;
              scope.$apply(function () {
                var content = {
                  csv: contents.replace(/\r\n|\r/g, '\n'),
                  header: true,
                  separator: ','
                };
                if (files[0].type === 'text/csv' || files[0].type === 'application/download' || files[0].type === 'application/csv' || files[0].type === 'application/vnd.ms-excel') {
                  scope.passCsvContent({ content: { error: false, data: csvToJSON(content) } });
                } else {
                  scope.passCsvContent({ content: { error: true, data: 'Please import only CSV file.' } });
                }
              });
            };
            r.readAsText(files[0]);
          }
        });
      }
    }
  }
}(window.jQuery || window.$, window.angular));
