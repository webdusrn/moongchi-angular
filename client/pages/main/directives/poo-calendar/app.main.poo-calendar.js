export default function pooCalendar ($filter, metaManager, poosManager, dialogHandler) {
    'ngInject';

    var templatePath = metaManager.std.templatePath;
    var attachZero = $filter('attachZero');

    return {
        restrict: 'AE',
        scope: {
            ngYear: '=',
            ngMonth: '=',
            ngPetId: '='
        },
        templateUrl: templatePath + 'main/directives/poo-calendar/app.main.poo-calendar.html',
        link: function (scope, element, attr) {
            var SIZE = 31;

            scope.calendars = [];
            scope.calenders = [[{
                date: 0,

            }], [], [], [], []];
            scope.pooList = [];

            scope.$watch('ngYear', function (newVal, oldVal) {
                if (newVal != oldVal && newVal) {
                    findPoos();
                }
            }, true);

            scope.$watch('ngMonth', function (newVal, oldVal) {
                if (newVal != oldVal && newVal) {
                    findPoos();
                }
            }, true);

            scope.$watch('ngPetId', function (newVal, oldVal) {
                if (newVal != oldVal && newVal) {
                    findPoos();
                }
            }, true);

            findPoos();

            function findPoos () {
                var query = {
                    petId: scope.ngPetId,
                    pooYear: scope.ngYear,
                    pooMonth: scope.ngMonth,
                    size: SIZE
                };

                poosManager.findPoos(query, function (status, data) {
                    if (status == 200) {
                        scope.pooList = data.rows;
                        generateCalendar(data.rows, scope.ngYear, scope.ngMonth);
                    } else if (status == 404) {
                        scope.pooList = [];
                        generateCalendar([], scope.ngYear, scope.ngMonth);
                    } else {
                        dialogHandler.alertError(status, data);
                    }
                });
            }

            function generateCalendar (poos, year, month) {
                var pooIndex = 0;
                var currentDate = 1;
                var firstDayIndex = new Date(year + '-' + attachZero(month) + '-01').getDay();
                var dateLength = 32 - new Date(year, month - 1, 32).getDate();
                var totalDate = firstDayIndex + 1 + dateLength;
                var weekLength = parseInt(totalDate / 7) + restDate(totalDate);

                scope.calendars = [[]];
                for (var i=0; i<firstDayIndex; i++) {
                    scope.calendars[0].push({
                        date: null,
                        pooIndex: null,
                        poo: null
                    });
                }
                for (var i=0; i<7 - firstDayIndex; i++) {
                    var calendarItem = {
                        date: currentDate,
                        poo: null,
                        pooIndex: null
                    };
                    if (poos && poos.length && new Date(poos[0].pooDate).getDate == currentDate) {
                        calendarItem.poo = poos.splice(0, 1)[0];
                        calendarItem.pooIndex = pooIndex;
                        pooIndex++;
                    }
                    scope.calendars[0].push(calendarItem);
                    currentDate++;
                }
                for (var i=1; i<weekLength; i++) {
                    var weekArray = [];
                    for (var j=0; j<7; j++) {
                        if (currentDate <= dateLength) {
                            var calendarItem = {
                                date: currentDate,
                                poo: null,
                                pooIndex: null
                            };
                            if (poos && poos.length && new Date(poos[0].pooDate).getDate == currentDate) {
                                calendarItem.poo = poos.splice(0, 1)[0];
                                calendarItem.pooIndex = pooIndex;
                                pooIndex++;
                            }
                            weekArray.push(calendarItem);
                            currentDate++;
                        } else {
                            weekArray.push({
                                date: null,
                                pooIndex: null,
                                poo: null
                            });
                        }
                    }
                    scope.calendars.push(weekArray);
                }
            }

            function restDate (totalDate) {
                if (totalDate % 7) {
                    return 1;
                } else {
                    return 0;
                }
            }
        }
    }
}