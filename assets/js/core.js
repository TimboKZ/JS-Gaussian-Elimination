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
                that.workspace.html('');
                var inputMatrix = new InputMatrix(that.workspace, function (numbers, divider) {
                    that.start.call(that, numbers, divider);
                }, a, b, c);
                inputMatrix.render();
                inputMatrix.getInput();
            });
            startMatrix.render();
            startMatrix.getInput();
        };
        Core.prototype.start = function (numbers, divider) {
            console.log(this);
            this.workspace.html('');
            this.initialMatrix = new Matrix(this.workspace, numbers, divider);
            this.initialMatrix.render();
            this.nextStep();
        };
        Core.prototype.nextStep = function () {
            var operation = new Operation();
        };
        return Core;
    }());
    GaussianElimination.Core = Core;
    var Operation = (function () {
        function Operation() {
        }
        return Operation;
    }());
    var Step = (function () {
        function Step() {
        }
        return Step;
    }());
    GaussianElimination.Step = Step;
    var Matrix = (function () {
        function Matrix(target, numbers, divider) {
            this.target = target;
            this.numbers = numbers;
            this.divider = divider;
            this.createNode();
        }
        Matrix.prototype.createNode = function () {
            this.node = HTML.matrixBlock();
            for (var i = 0; i < this.numbers.length; i++) {
                var tr = HTML.tr();
                var numberCounter = 0;
                for (var k = 0; k < this.numbers[0].length + 1; k++) {
                    if (k == this.divider) {
                        tr.append(HTML.divider());
                    }
                    else {
                        var td = HTML.td('' + this.numbers[i][numberCounter]);
                        tr.append(td);
                        numberCounter++;
                    }
                }
                this.node.find('tbody').append(tr);
            }
        };
        Matrix.prototype.render = function () {
            this.target.append(this.node);
        };
        return Matrix;
    }());
    GaussianElimination.Matrix = Matrix;
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
            var block = HTML.matrixBlock('mini-inputs');
            for (var i = 0; i < this.a; i++) {
                var tr = HTML.tr();
                this.inputs[i] = [];
                var inputCounter = 0;
                for (var k = 0; k < this.b + (this.c > 0 ? this.c + 1 : 0); k++) {
                    if (k == this.b) {
                        tr.append(HTML.divider());
                    }
                    else {
                        var input = HTML.numberInput((i + 1) + ',' + (inputCounter + 1));
                        this.inputs[i][inputCounter] = input;
                        tr.append(HTML.td().append(input));
                        inputCounter++;
                    }
                }
                block.find('tbody').append(tr);
            }
            this.target.append(block);
        };
        InputMatrix.prototype.getInput = function () {
            var that = this;
            this.inputs[0][0].focus();
            for (var i = 0; i < this.a; i++) {
                for (var k = 0; k < this.b + this.c; k++) {
                    console.log(i + ', ' + k);
                    if (i == that.a - 1 && k == that.b + that.c - 1) {
                        this.inputs[i][k].keyup(function (e) {
                            if (e.which == 13) {
                                if (that.validateInput()) {
                                    that.fetchNumbers();
                                }
                            }
                        });
                    }
                    else {
                        (function () {
                            var row = i, column = k;
                            if (k == that.b + that.c - 1) {
                                row++;
                                column = 0;
                            }
                            else {
                                column++;
                            }
                            that.inputs[i][k].keyup(function (e) {
                                if (e.which == 13) {
                                    that.inputs[row][column].focus();
                                }
                            });
                        })();
                    }
                }
            }
        };
        InputMatrix.prototype.validateInput = function () {
            var pass = true;
            $('.error-input').removeClass('error-input');
            for (var i = 0; i < this.a; i++) {
                for (var k = 0; k < this.b + this.c; k++) {
                    if (!this.isNumber(this.inputs[i][k].val())) {
                        this.inputs[i][k].addClass('error-input');
                        pass = false;
                    }
                }
            }
            if (pass)
                this.errorManager.clear();
            else
                this.errorManager.error('Fields highlighted in red do not contain valid integers');
            return pass;
        };
        InputMatrix.prototype.isNumber = function (number) {
            return !isNaN(parseInt(number));
        };
        InputMatrix.prototype.fetchNumbers = function () {
            var numbers = [];
            for (var i = 0; i < this.a; i++) {
                numbers[i] = [];
                for (var k = 0; k < this.b + this.c; k++) {
                    numbers[i][k] = parseInt(this.inputs[i][k].val());
                }
            }
            this.callback(numbers, this.b);
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
            if (!this.isNumber(this.a.val()) || parseInt(this.a.val()) < 2) {
                this.errorManager.error('A should be an integer greater than one!');
                this.a.addClass('error-input');
                return false;
            }
            if (!this.isNumber(this.b.val()) || parseInt(this.b.val()) < 2) {
                this.errorManager.error('B should be an integer greater than one!');
                this.b.addClass('error-input');
                return false;
            }
            if (!this.isNumber(this.c.val()) || parseInt(this.c.val()) < 0) {
                this.errorManager.error('C should be an integer greater than or equal to zero!');
                this.c.addClass('error-input');
                return false;
            }
            this.a.removeClass('error-input');
            this.b.removeClass('error-input');
            this.c.removeClass('error-input');
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
        HTML.matrixBlock = function (_class) {
            if (_class === void 0) { _class = ''; }
            return $('<div class="block matrix ' + _class + '"> <table><tbody></tbody></table></div>');
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
