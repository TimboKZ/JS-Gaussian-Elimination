/**
 * Gaussian elimination visualiser (https://github.com/TimboKZ/JS-Gaussian-Elimination)
 * Copyright (c) 2016 Timur Kuzhagaliyev (TimboKZ)
 */
var GaussianElimination;
(function (GaussianElimination) {
    var Core = (function () {
        function Core(workspace) {
            this.workspace = workspace;
        }
        Core.prototype.setup = function () {
            this.workspace.html('');
            var that = this;
            var startMatrix = new StartMatrix(this.workspace, function (a, b, c) {
                var inputMatrix = new InputMatrix(that.workspace, that.start, a, b, c);
                inputMatrix.render();
                inputMatrix.getInput();
            });
            startMatrix.render();
            startMatrix.getInput();
        };
        Core.prototype.start = function (numbers, divider) {
            this.workspace.html('');
            this.initialMatrix = new Matrix();
        };
        return Core;
    }());
    GaussianElimination.Core = Core;
    var Step = (function () {
        function Step() {
        }
        return Step;
    }());
    var Matrix = (function () {
        function Matrix() {
        }
        return Matrix;
    }());
    GaussianElimination.Matrix = Matrix;
    var Operation = (function () {
        function Operation() {
        }
        return Operation;
    }());
    var InputMatrix = (function () {
        function InputMatrix(target, callback, a, b, c) {
            this.target = target;
            this.errorManager = new ErrorManager(this.target);
            this.callback = callback;
            this.inputs = [];
            this.a = a;
            this.b = b;
            this.c = c;
        }
        InputMatrix.prototype.render = function () {
            var block = HTML.matrixBlock();
            for (var i = 0; i < this.a; i++) {
                for (var k = 0;;) {
                }
            }
        };
        InputMatrix.prototype.getInput = function () {
        };
        return InputMatrix;
    }());
    GaussianElimination.InputMatrix = InputMatrix;
    var StartMatrix = (function () {
        function StartMatrix(target, callback) {
            this.target = target;
            this.errorManager = new ErrorManager(this.target);
            this.callback = callback;
        }
        StartMatrix.prototype.getInput = function () {
            var that = this;
            this.a.keyup(function (e) {
                if (e.which == 13) {
                    that.b.focus();
                }
            });
            this.b.keyup(function (e) {
                if (e.which == 13) {
                    that.c.focus();
                }
            });
            this.c.keyup(function (e) {
                if (e.which == 13) {
                    if (that.validateInput()) {
                        that.callback(parseInt(that.a.val()), parseInt(that.b.val()), parseInt(that.c.val()));
                    }
                }
            });
        };
        StartMatrix.prototype.validateInput = function () {
            if (!this.isNumber(this.a.val()) || parseInt(this.a.val()) < 1) {
                this.errorManager.error('A should be an integer greater than zero!');
                return false;
            }
            if (!this.isNumber(this.b.val()) || parseInt(this.b.val()) < 1) {
                this.errorManager.error('B should be an integer greater than zero!');
                return false;
            }
            if (!this.isNumber(this.c.val()) || parseInt(this.c.val()) < 0) {
                this.errorManager.error('C should be an integer greater than or equal to zero!');
                return false;
            }
            this.errorManager.clear();
            return true;
        };
        StartMatrix.prototype.isNumber = function (number) {
            return !isNaN(parseInt(number));
        };
        StartMatrix.prototype.render = function () {
            var block = HTML.matrixBlock();
            var tr = HTML.tr();
            tr.append(HTML.td('Left Matrix', 'colspan="2"'));
            tr.append(HTML.divider());
            tr.append(HTML.td('Right Matrix'));
            block.find('tbody').append(tr);
            tr = HTML.tr();
            var a = HTML.numberInput('A - rows');
            var b = HTML.numberInput('B - columns');
            var c = HTML.numberInput('C - columns');
            tr.append(HTML.td().append(a));
            tr.append(HTML.td().append(b));
            tr.append(HTML.divider());
            tr.append(HTML.td().append(c));
            block.find('tbody').append(tr);
            tr = HTML.tr();
            tr.append(HTML.td('A,B > 0', 'colspan="2"'));
            tr.append(HTML.divider());
            tr.append(HTML.td('C >= 0'));
            block.find('tbody').append(tr);
            this.target.append(block);
            a.focus();
            this.a = a;
            this.b = b;
            this.c = c;
        };
        return StartMatrix;
    }());
    GaussianElimination.StartMatrix = StartMatrix;
    var ErrorManager = (function () {
        function ErrorManager(target) {
            this.target = target;
        }
        ErrorManager.prototype.error = function (message) {
            this.clear();
            this.target.prepend($('<div class="error">' + message + '</div>'));
        };
        ErrorManager.prototype.clear = function () {
            $('.error').remove();
        };
        return ErrorManager;
    }());
    GaussianElimination.ErrorManager = ErrorManager;
    var HTML = (function () {
        function HTML() {
        }
        HTML.matrixBlock = function () {
            return $('<div class="block matrix"> <table><tbody></tbody></table></div>');
        };
        HTML.tr = function () {
            return $('<tr></tr>');
        };
        HTML.td = function (content, attributes) {
            if (content === void 0) { content = ''; }
            if (attributes === void 0) { attributes = ''; }
            return $('<td ' + attributes + '>' + content + '</td>');
        };
        HTML.divider = function () {
            return $('<td class="divider"></td>');
        };
        HTML.numberInput = function (placeholder) {
            return $('<input type="number" placeholder="' + placeholder + '">');
        };
        return HTML;
    }());
    GaussianElimination.HTML = HTML;
})(GaussianElimination || (GaussianElimination = {}));
$(document).ready(function () {
    var core = new GaussianElimination.Core($('#workspace'));
    core.setup();
    $('#reset').click(function () {
        core = new GaussianElimination.Core($('#workspace'));
        core.setup();
    });
});
