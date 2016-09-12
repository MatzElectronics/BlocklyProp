/**
 * Visual Blocks Language
 *
 * Copyright 2014 Michel Lampo.
 *
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Generating Prop-C for basic blocks.
 * @author michel@creatingfuture.eu  (Michel Lampo)
 * @author valetolpegin@gmail.com ( Vale Tolpegin )
 */
'use strict';

//define blocks
if (!Blockly.Blocks)
    Blockly.Blocks = {};


Blockly.Blocks.console_print = {
    init: function () {
        this.setColour(colorPalette.getColor('protocols'));
        this.appendValueInput('MESSAGE')
            .setCheck('String')
            .appendField("Terminal print text");
        this.appendDummyInput()
            .appendField("then a new line")
            .appendField(new Blockly.FieldCheckbox("FALSE"), "ck_nl");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    }
};

Blockly.Blocks.console_print_variables = {
    init: function () {
        this.setColour(colorPalette.getColor('protocols'));
        this.appendValueInput('VALUE')
            .appendField("Terminal print number");
        this.appendDummyInput()
            .appendField("as")
            .appendField(new Blockly.FieldDropdown([
                ['Decimal','DEC'],
                ['Hexadecimal','HEX'],
                ['Binary', 'BIN']
            ]), "FORMAT");
        this.appendDummyInput()
            .appendField("then a new line")
            .appendField(new Blockly.FieldCheckbox("FALSE"), "ck_nl");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    }
};

Blockly.Blocks.console_scan_text = {
    init: function () {
        this.setColour(colorPalette.getColor('protocols'));
        this.appendDummyInput()
                .appendField("Terminal receive text store in");
        this.appendValueInput('VALUE')
                .setCheck('String');
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    }
};

Blockly.propc.console_scan_text = function () {
    var data = Blockly.propc.valueToCode(this, 'VALUE', Blockly.propc.ORDER_ATOMIC) || '';    
    Blockly.propc.vartype_[data] = 'char *';   
    Blockly.propc.serial_terminal_ = true;

    if(data !== '') {
        var code = 'getStr(' + data + ', 64);\n';

        return code;
    } else {
        return '';
    }
};

Blockly.Blocks.console_scan_number = {
    init: function () {
        this.setColour(colorPalette.getColor('protocols'));
        this.appendDummyInput()
                .appendField("Terminal receive number store in");
        this.appendValueInput('VALUE')
                .setCheck('Number');
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    }
};

Blockly.propc.console_scan_number = function () {
    var data = Blockly.propc.valueToCode(this, 'VALUE', Blockly.propc.ORDER_ATOMIC) || '';    

    Blockly.propc.serial_terminal_ = true;

    if(data !== '') {
        var code = 'scan("%d\\n", &' + data + ');\n';

        return code;
    } else {
        return '';
    }
};

// Terminal print text
Blockly.propc.console_print = function () {
    var text = Blockly.propc.valueToCode(this, 'MESSAGE', Blockly.propc.ORDER_ATOMIC);
    var checkbox = this.getFieldValue('ck_nl');

    Blockly.propc.serial_terminal_ = true;
    
    var code = 'print(' + text + ');\n';
    if (checkbox === 'TRUE') { code += 'print("\\r");\n'; }
    return code;
};

Blockly.propc.console_print_variables = function () {
    var value = Blockly.propc.valueToCode(this, 'VALUE', Blockly.propc.ORDER_ATOMIC);
    var format = this.getFieldValue('FORMAT');
    var checkbox = this.getFieldValue('ck_nl');
    Blockly.propc.serial_terminal_ = true;

    var code = 'print(';
    if (checkbox !== 'TRUE') {
        if (format === 'BIN') {
            code += '"%b"';
        } else if (format === 'HEX') {
            code += '"%x"';                
        } else {
            code += '"%d"';
        } 
    } else {
        if (format === 'BIN') {
            code += '"%b\\r"';
        } else if (format === 'HEX') {
            code += '"%x\\r"';                
        } else {
            code += '"%d\\r"';
        } 
    }
    code += ', ' + value + ');\n';
    return code;
};

Blockly.Blocks.console_newline = {
    init: function () {
        this.setColour(colorPalette.getColor('protocols'));
        this.appendDummyInput()
            .appendField("Terminal new line");

        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    }
};

Blockly.Blocks.console_clear = {
    init: function () {
        this.setColour(colorPalette.getColor('protocols'));
        this.appendDummyInput()
            .appendField("Terminal clear screen");

        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    }
};

Blockly.Blocks.console_move_to_column = {
    init: function () {
        this.setColour(colorPalette.getColor('protocols'));
        this.appendDummyInput()
            .appendField("Terminal move to column");
        this.appendValueInput('COLUMNS')
            .setCheck('Number');

        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    }
};

Blockly.Blocks.console_move_to_row = {
    init: function () {
        this.setColour(colorPalette.getColor('protocols'));
        this.appendDummyInput()
            .appendField("Terminal move to row");
        this.appendValueInput('ROWS')
            .setCheck('Number');

        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    }
};

Blockly.Blocks.console_move_to_position = {
    init: function () {
        this.setColour(colorPalette.getColor('protocols'));
        this.appendDummyInput()
            .appendField("Terminal move to row");
        this.appendValueInput('ROW')
            .setCheck('Number');
        this.appendDummyInput()
            .appendField("column");
        this.appendValueInput('COLUMN')
            .setCheck('Number');

        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    }
};

Blockly.propc.console_newline = function () {
    Blockly.propc.serial_terminal_ = true;
    return 'term_cmd(CR);\n';
};

Blockly.propc.console_clear = function () {
    Blockly.propc.serial_terminal_ = true;
    return 'term_cmd(CLS);\n';
};

Blockly.propc.console_move_to_position = function () {
    Blockly.propc.serial_terminal_ = true;
    var row = Blockly.propc.valueToCode(this, 'ROW', Blockly.propc.ORDER_NONE);
    var column = Blockly.propc.valueToCode(this, 'COLUMN', Blockly.propc.ORDER_NONE);

    if (Number(row) < 0) {
        row = 0;
    } else if (Number(row) > 255) {
        row = 255;
    }

    if (Number(column) < 0) {
        column = 0;
    } else if (Number(column) > 255) {
        column = 255;
    }

    return 'term_cmd(CRSRXY, ' + column + ', ' + row + ');\n';
};
