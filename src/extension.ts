'use strict';

import * as vscode from "vscode";

import { converter } from "./converter";

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.dataConversion', () => {
        if (!vscode.window.activeTextEditor) {
            vscode.window.showInformationMessage('Open a file');
            return;
        }

        let quick_options_hash = {
            'decimal_to_binary': { label: "Decimal -> Binary", description: "Convert decimal to binary" },
            'decimal_to_hex': { label: "Decimal -> Hex", description: "Convert decimal to hex" },
            'hex_to_binary': { label: "Hex -> Binary", description: "Convert hex to binary" },
            'hex_to_decimal': { label: "Hex -> Decimal", description: "Convert hex to decimal" },
            'binary_to_decimal': { label: "Binary -> Decimal", description: "Convert binary to decimal" },
            'binary_to_hex': { label: "Binary -> Hex", description: "Convert binary to hex" },
            'escape_url': { label: "Escape URL", description: "Escape special characters from URL" },
            'unescape_url': { label: "Unescape URL", description: "Unescape special characters from URL" },
            'unicode_to_hex': { label: "Unicode to Hex", description: "Convert unicode text to hex" },
            'hex_to_unicode': { label: "Hex to Unicode", description: "Convert hex to unicode text" }
        };

        const opts: vscode.QuickPickOptions = { matchOnDescription: true };
        const items: vscode.QuickPickItem[] = [];

        for (var key in quick_options_hash) {
            items.push(quick_options_hash[key]);
        }

        vscode.window.showQuickPick(items).then((menu_selection) => {
            if (!menu_selection) {
                return;
            }

            const editor = vscode.window.activeTextEditor;

            editor.edit(function (edit) {
                editor.selections.forEach(element => {
                    let selected_text: string = editor.document.getText(new vscode.Range(element.start, element.end));

                    if (selected_text.length == 0) {
                        return;
                    }

                    switch (menu_selection.label) {
                        case quick_options_hash['decimal_to_binary'].label:
                            edit.replace(element, converter.convert_text_to_base(selected_text, 10, 2));
                            break;
                        case quick_options_hash['decimal_to_hex'].label:
                            edit.replace(element, converter.convert_text_to_base(selected_text, 10, 16));
                            break;
                        case quick_options_hash['hex_to_binary'].label:
                            edit.replace(element, converter.convert_text_to_base(selected_text, 16, 2));
                            break;
                        case quick_options_hash['hex_to_decimal'].label:
                            edit.replace(element, converter.convert_text_to_base(selected_text, 16, 10));
                            break;
                        case quick_options_hash['binary_to_decimal'].label:
                            edit.replace(element, converter.convert_text_to_base(selected_text, 2, 10));
                            break;
                        case quick_options_hash['binary_to_hex'].label:
                            edit.replace(element, converter.convert_text_to_base(selected_text, 2, 16));
                            break;
                        case quick_options_hash['escape_url'].label:
                            edit.replace(element, encodeURIComponent(selected_text));
                            break;
                        case quick_options_hash['unescape_url'].label:
                            edit.replace(element, decodeURIComponent(selected_text));
                            break;
                        case quick_options_hash['unicode_to_hex'].label:
                            var converted_text: string = '';

                            for (var i = 0; i < selected_text.length; i++) {
                                converted_text += "\\u" + selected_text.codePointAt(i).toString(16);
                            }

                            edit.replace(element, converted_text);
                            break;
                        case quick_options_hash['hex_to_unicode'].label:
                            var converted_text: string = '';

                            let unicode_elements: string[] = selected_text.split('\\u');

                            unicode_elements.forEach(element => {
                                let parsed_number: number = Number("0x" + element);

                                if (isNaN(parsed_number)) {
                                    return;
                                }

                                converted_text += String.fromCharCode(parsed_number);
                            });

                            edit.replace(element, converted_text);
                            break;
                    }
                });
            });
        });
    });

    context.subscriptions.push(disposable);
}
