'use strict';

import * as vscode from 'vscode';

import Window = vscode.window;
import QuickPickItem = vscode.QuickPickItem;
import QuickPickOptions = vscode.QuickPickOptions;
import Range = vscode.Range;

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

        const opts: QuickPickOptions = { matchOnDescription: true };
        const items: QuickPickItem[] = [];

        for (var key in quick_options_hash) {
            items.push(quick_options_hash[key]);
        }

        Window.showQuickPick(items).then((menu_selection) => {
            if (!menu_selection) {
                return;
            }

            const editor = Window.activeTextEditor;
            const document = editor.document;
            const selections = editor.selections;

            editor.edit(function (edit) {
                selections.forEach(element => {
                    let selected_text: string = document.getText(new Range(element.start, element.end));

                    if (selected_text.length == 0) {
                        return;
                    }

                    switch (menu_selection.label) {
                        case quick_options_hash['decimal_to_binary'].label:
                        case quick_options_hash['decimal_to_hex'].label:
                        case quick_options_hash['hex_to_binary'].label:
                        case quick_options_hash['hex_to_decimal'].label:
                        case quick_options_hash['binary_to_decimal'].label:
                        case quick_options_hash['binary_to_hex'].label:
                            let representation: number = 0;
                            let new_base: number = 0;

                            selected_text = selected_text.trim();
                            selected_text = selected_text.replace('0x', '');
                            selected_text = selected_text.replace('0b', '');

                            switch (menu_selection.label) {
                                case quick_options_hash['decimal_to_binary'].label:
                                    representation = Number(selected_text);
                                    new_base = 2;
                                    break;
                                case quick_options_hash['decimal_to_hex'].label:
                                    representation = Number(selected_text);
                                    new_base = 16;
                                    break;
                                case quick_options_hash['hex_to_binary'].label:
                                    representation = Number('0x' + selected_text);
                                    new_base = 2;
                                    break;
                                case quick_options_hash['hex_to_decimal'].label:
                                    representation = Number('0x' + selected_text);
                                    new_base = 10;
                                    break;
                                case quick_options_hash['binary_to_decimal'].label:
                                    representation = Number('0b' + selected_text);
                                    new_base = 10;
                                    break;
                                case quick_options_hash['binary_to_hex'].label:
                                    representation = Number('0b' + selected_text);
                                    new_base = 16;
                                    break;
                            }

                            if (isNaN(representation) || new_base <= 0) {
                                return;
                            }

                            edit.replace(element, representation.toString(new_base));
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
