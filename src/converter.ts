export module converter {
    export function convert_text_to_base(text: string, old_base: number, new_base: number) {
        let representation: number = 0;
        let number_prefix: string = '';
        let negative_prefix: string = '';
        
        if(text.length == 0) {
            return '';
        }

        text = text.trim();
        text = text.replace('0x', '');
        text = text.replace('0b', '');

        if(text[0] == '-'){
            negative_prefix += '-';
        }

        text = text.replace('-', '');

        if(old_base == 16) {
            number_prefix += '0x';
        }
        else if(old_base == 2) {
            number_prefix += '0b';
        }

        representation = Number(number_prefix + text);

        if(isNaN(representation)){
            return '';
        }

        return negative_prefix + representation.toString(new_base);
    }
}