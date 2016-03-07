/**
 * Gaussian elimination visualiser (https://github.com/TimboKZ/JS-Gaussian-Elimination)
 * Copyright (c) 2016 Timur Kuzhagaliyev (TimboKZ)
 */
module GaussianElimination {

    export class Core {

        private workspace:JQuery;
        private initialMatrix:Matrix;

        constructor(workspace:JQuery) {
            this.workspace = workspace;
        }

        public setup() {
            this.workspace.html('');
            var that = this;
            var startMatrix = new StartMatrix(this.workspace, function (a:number, b:number, c:number) {
                var inputMatrix = new InputMatrix(that.workspace, that.start, a, b, c);
                inputMatrix.render();
                inputMatrix.getInput();
            });
            startMatrix.render();
            startMatrix.getInput();
        }

        public start(numbers:number[][], divider:number) {
            this.workspace.html('');
            this.initialMatrix = new Matrix();
        }

    }

    class Step {

    }

    export class Matrix {

    }

    class Operation {

    }

    export class InputMatrix {

        private target:JQuery;
        private errorManager:ErrorManager;
        private callback:Function;
        private inputs:JQuery[][];
        private a:number;
        private b:number;
        private c:number;

        constructor(target:JQuery, callback:Function, a:number, b:number, c:number) {
            this.target = target;
            this.errorManager = new ErrorManager(this.target);
            this.callback = callback;
            this.inputs = [];
            this.a = a;
            this.b = b;
            this.c = c;
        }

        public render() {
            var block = HTML.matrixBlock();
            for(var i = 0; i < this.a; i++) {
                for(var k = 0;;) {

                }
            }
        }

        public getInput() {

        }

    }

    export class StartMatrix {

        private target:JQuery;
        private errorManager:ErrorManager;
        private callback:Function;
        private a:JQuery;
        private b:JQuery;
        private c:JQuery;

        constructor(target:JQuery, callback:Function) {
            this.target = target;
            this.errorManager = new ErrorManager(this.target);
            this.callback = callback;
        }

        public getInput() {
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
        }

        private validateInput():boolean {
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
        }

        private isNumber(number:string):boolean {
            return !isNaN(parseInt(number));
        }

        public render() {
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
        }

    }

    export class ErrorManager {

        private target:JQuery;

        constructor(target:JQuery) {
            this.target = target;
        }

        public error(message:string) {
            this.clear();
            this.target.prepend($('<div class="error">' + message + '</div>'));
        }

        public clear() {
            $('.error').remove();
        }

    }

    export class HTML {

        public static matrixBlock():JQuery {
            return $('<div class="block matrix"> <table><tbody></tbody></table></div>');
        }

        public static tr():JQuery {
            return $('<tr></tr>');
        }

        public static td(content:string = '', attributes:string = ''):JQuery {
            return $('<td ' + attributes + '>' + content + '</td>');
        }

        public static divider():JQuery {
            return $('<td class="divider"></td>');
        }

        public static numberInput(placeholder:string):JQuery {
            return $('<input type="number" placeholder="' + placeholder + '">');
        }

    }

}

$(document).ready(function () {
    var core = new GaussianElimination.Core($('#workspace'));
    core.setup();
    $('#reset').click(function () {
        core = new GaussianElimination.Core($('#workspace'));
        core.setup();
    });
});