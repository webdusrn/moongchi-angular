export default function modalHandler () {
    'ngInject';

    var eventKey = 'keydown';

    this.focus = focus;
    this.eventBind = eventBind;

    function focus($target) {
        var y = window.pageYOffset;
        $target.focus();
        $target.focusin();
        window.scrollTo(0, y);
    }

    function eventBind($target, close) {
        $target.unbind(eventKey);
        $target.bind(eventKey, function (e) {
            var keyCode = (e.keyCode ? e.keyCode : e.which);
            if (keyCode == 27) close();
        });
    }
}