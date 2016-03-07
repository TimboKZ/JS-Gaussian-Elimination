/**
 * Gaussian elimination visualiser (https://github.com/TimboKZ/JS-Gaussian-Elimination)
 * Copyright (c) 2016 Timur Kuzhagaliyev (TimboKZ)
 */
module GaussianElimination {

    export class Core {

        private workspace:JQuery;
        private initialMatrix:Matrix;
        private steps:Step[];

        constructor(workspace:JQuery) {
            this.workspace = workspace;
        }

        public setup() {
            this.workspace.html('');
            var that = this;
            var startMatrix = new StartMatrix(this.workspace, function (a:number, b:number, c:number) {
                that.workspace.html('');
                var inputMatrix = new InputMatrix(that.workspace, function (numbers:number[][], divider:number) {
                    that.start.call(that, numbers, divider);
                }, a, b, c);
                inputMatrix.render();
                inputMatrix.getInput();
            });
            startMatrix.render();
            startMatrix.getInput();
        }

        public start(numbers:number[][], divider:number) {
            console.log(this);
            this.workspace.html('');
            this.initialMatrix = new Matrix(this.workspace, numbers, divider);
            this.initialMatrix.render();
            this.nextStep(null);
        }

        public nextStep(previousStep:Step) {
            var that = this;
            var operation = new Operation(this.workspace, this.initialMatrix.rows());
            operation.render();
            operation.getInput(function (operations:string[]) {
                var matrix = new Matrix(previousStep != null ? previousStep.matrix() : this.initialMatrix, operations);
            });
        }

    }

    class Operation {

        private target:JQuery;
        private errorManager:ErrorManager;
        private rowCount:number;
        private callback:Function;
        private usedRows:number[];
        private operations:string[];
        private node:JQuery;
        private input:JQuery;

        constructor(target:JQuery, rowCount:number) {
            this.target = target;
            this.errorManager = new ErrorManager(this.target);
            this.rowCount = rowCount;
            this.usedRows = [];
            this.operations = [];
            this.createNode();
        }

        public render() {
            this.input = HTML.textInput('Enter operation');
            this.input.addClass('single-operation');
            this.node.find('.operations').append(this.input);
            this.target.append(this.node);
            this.input.focus();
        }

        public getInput(callback:Function) {
            this.callback = callback;
            var that = this;
            this.input.keyup(function (e) {
                if (e.which == 13) {
                    if (that.validateOperation()) {
                        that.addOperation();
                    }
                }
            });
        }

        public validateOperation():boolean {
            var value = this.input.val().toLowerCase().trim().replace(/\s/g, '');
            var regexp = new RegExp("^(r\\d+[/\*]\\d+(\\.\\d+)?|r\\d+[\+\-](\\d+(\\.\\d+)?|r\\d+|\\d+(\\.\\d+)?r\\d+))$");
            if (!regexp.exec(value)) {
                this.errorManager.error('Entered operation does not match the pattern!');
                this.input.addClass('error-input');
                return false;
            }
            var rowRegexp = new RegExp("r(\\d+)", "g");
            var rows = value.match(rowRegexp);
            var rowNums = [];
            var previousRow = 0;
            for (var i = 0; i < rows.length; i++) {
                var row = parseInt(rows[i].substr(1));
                rowNums.push(row);
                if ($.inArray(row, this.usedRows) != -1) {
                    this.errorManager.error('This row has already appeared in a neighbouring operation: ' + row + '. Perform the same operation in the next step to avoid ambiguity');
                    this.input.addClass('error-input');
                    return false;
                }
                if (row < 1 || row > this.rowCount) {
                    this.errorManager.error('Specified row does not exist: ' + row);
                    this.input.addClass('error-input');
                    return false;
                }
                if (previousRow == row) {
                    this.errorManager.error('Same row appears twice: ' + row);
                    this.input.addClass('error-input');
                    return false;
                }
                previousRow = row;
            }
            if (!!new RegExp("/").exec(value)) {
                var zeroRegexp = new RegExp("\\d+(\\.\\d+)?$");
                var result = value.match(zeroRegexp);
                if (parseFloat(result) == 0) {
                    this.errorManager.error('Division by zero!');
                    this.input.addClass('error-input');
                    return false;
                }
            }
            this.usedRows.push(rowNums[0]);
            this.input.removeClass('error-input');
            this.errorManager.clear();
            return true;
        }

        public addOperation() {
            var value = this.input.val();
            this.input.val('');
            this.node.find('.operations').append('<div class="single-operation">' + value + '</div>');
            this.operations.push(value.toLowerCase().trim().replace(/\s/g, ''));
            if (this.operations.length == this.rowCount) {
                this.complete();
            }
        }

        public complete() {
            this.input.remove();
            this.callback(this.operations);
        }

        public createNode() {
            this.node = HTML.operationBlock();
        }


    }

    export class Step {

        private operation:Operation;
        private matrix:Matrix;

        constructor(operation:Operation, matrix:Matrix) {
            this.operation = operation;
            this.matrix = matrix;
        }

        public operation():Operation {
            return this.operation;
        }

        public matrix():Matrix {
            return this.matrix;
        }

    }

    export class Matrix {

        private target:JQuery;
        private numbers:number[][];
        private divider:number;
        private node:JQuery;

        constructor(target:JQuery, numbers:number[][], divider:number) {
            this.target = target;
            this.numbers = numbers;
            this.divider = divider;
            this.createNode();
        }

        private createNode() {
            this.node = HTML.matrixBlock();
            for (var i = 0; i < this.numbers.length; i++) {
                var tr = HTML.tr();
                var numberCounter = 0;
                for (var k = 0; k < this.numbers[0].length + 1; k++) {
                    if (k == this.divider) {
                        tr.append(HTML.divider());
                    } else {
                        var td = HTML.td('' + this.numbers[i][numberCounter]);
                        tr.append(td);
                        numberCounter++;
                    }
                }
                this.node.find('tbody').append(tr);
            }
        }

        public render() {
            this.target.append(this.node);
        }

        public rows():number {
            return this.numbers.length;
        }

        public columns():number {
            return this.numbers[0].length;
        }

        public numbers():number[][] {
            return this.numbers;
        }

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
            var block = HTML.matrixBlock('mini-inputs');
            for (var i = 0; i < this.a; i++) {
                var tr = HTML.tr();
                this.inputs[i] = [];
                var inputCounter = 0;
                for (var k = 0; k < this.b + (this.c > 0 ? this.c + 1 : 0); k++) {
                    if (k == this.b) {
                        tr.append(HTML.divider());
                    } else {
                        var input = HTML.numberInput((i + 1) + ',' + (inputCounter + 1));
                        this.inputs[i][inputCounter] = input;
                        tr.append(HTML.td().append(input));
                        inputCounter++;
                    }
                }
                block.find('tbody').append(tr);
            }
            this.target.append(block);
        }

        public getInput() {
            var that = this;
            this.inputs[0][0].focus();
            for (var i = 0; i < this.a; i++) {
                for (var k = 0; k < this.b + this.c; k++) {
                    if (i == that.a - 1 && k == that.b + that.c - 1) {
                        this.inputs[i][k].keyup(function (e) {
                            if (e.which == 13) {
                                if (that.validateInput()) {
                                    that.fetchNumbers();
                                }
                            }
                        });
                    } else {
                        (function () {
                            var row = i, column = k;
                            if (k == that.b + that.c - 1) {
                                row++;
                                column = 0;
                            } else {
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
        }

        private validateInput():boolean {
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
            if (pass) this.errorManager.clear();
            else this.errorManager.error('Fields highlighted in red do not contain valid numbers');
            return pass;
        }

        private isNumber(number:string):boolean {
            return !isNaN(parseFloat(number));
        }

        private fetchNumbers() {
            var numbers = [];
            for (var i = 0; i < this.a; i++) {
                numbers[i] = [];
                for (var k = 0; k < this.b + this.c; k++) {
                    numbers[i][k] = parseFloat(this.inputs[i][k].val());
                }
            }
            this.callback(numbers, this.b);
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

        public static matrixBlock(_class:string = ''):JQuery {
            return $('<div class="block matrix ' + _class + '"> <table><tbody></tbody></table></div>');
        }

        public static operationBlock():JQuery {
            return $('<div class="block operation"><div class="operations"></div><div class="arrow"></div></div>');
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

        public static textInput(placeholder:string):JQuery {
            return $('<input type="text" placeholder="' + placeholder + '">');
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