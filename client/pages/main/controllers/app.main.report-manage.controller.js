export default function ReportManageCtrl ($scope, reportsManager, dialogHandler) {
    "ngInject";
    var vm = $scope.vm;

    vm.currentPage('reportManage');

    $scope.openModal = openModal;
    $scope.closeModal = closeModal;
    $scope.addReportSuccess = addReportSuccess;

    $scope.ready = false;
    $scope.more = false;
    $scope.modal = {
        add: false,
        detail: false
    };
    $scope.reports = {
        count: 0,
        rows: []
    };

    if (vm.isLoggedIn()) {
        findReports(true);
    }

    function findReports (refresh) {
        var last = null;
        if (refresh) {
            $scope.reports = {
                count: 0,
                rows: []
            };
        } else {
            var rows = $scope.reports.rows;
            last = rows[rows.length - 1].createdAt;
        }
        var query = {
            size: vm.defaultLoadingLength
        };
        if (last) query.last = last;
        reportsManager.findReports(query, function (status, data) {
            if (status == 200) {
                if (refresh) {
                    $scope.reports = data;
                } else {
                    $scope.reports.rows = $scope.reports.rows.concat(data.rows);
                }
                $scope.more = ($scope.reports.rows.length < $scope.reports.count);
            } else if (status == 404) {
                $scope.more = false;
            } else {
                dialogHandler.alertError(status, data);
            }
            $scope.ready = true;
        });
    }

    function openModal (key, index) {
        if (index !== undefined) {
            $scope.modal[key] = $scope.reports.rows[index];
        } else {
            $scope.modal[key] = true;
        }
    }

    function closeModal (key) {
        $scope.modal[key] = false;
    }

    function addReportSuccess (pet) {
        $scope.reports.count++;
        $scope.reports.rows.unshift(pet);
        closeModal('add');
    }
}