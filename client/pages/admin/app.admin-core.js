import '../../../../core/client/modules/common/base/alert-dialog/assets/stylesheets/alert-dialog.scss';
import '../../../../core/client/modules/common/base/loading-handler/assets/stylesheets/core.loading-handler.scss';

import coreBaseModule from '../../../../core/client/modules/common/base/core.base.module';
import sessionModule from '../../../../core/client/modules/common/session/core.session.module';

export default angular.module("app.admin-core", [
    coreBaseModule,
    sessionModule
]).name;