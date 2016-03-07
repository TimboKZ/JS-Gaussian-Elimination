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
        Core.prototype.start = function () {
            //this.workspace.html('');
        };
        return Core;
    }());
    GaussianElimination.Core = Core;
    var Step = (function () {
        function Step() {
        }
        return Step;
    }());
    var Operation = (function () {
        function Operation() {
        }
        return Operation;
    }());
    var MatrixFactory = (function () {
        function MatrixFactory() {
        }
        return MatrixFactory;
    }());
    GaussianElimination.MatrixFactory = MatrixFactory;
    var Matrix = (function () {
        function Matrix() {
        }
        return Matrix;
    }());
})(GaussianElimination || (GaussianElimination = {}));
var core = new GaussianElimination.Core($('#workspace'));
core.start();
