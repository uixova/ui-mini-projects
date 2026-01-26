const htmlCode = document.getElementById("html-code");
const cssCode = document.getElementById("css-code");
const jsCode = document.getElementById("js-code");
const output = document.getElementById("output");

const editors = [htmlCode, cssCode, jsCode];
const TAB_SIZE = 4;
let lastClosingTag = '';

function run() {
    const html = htmlCode.value;
    const css = cssCode.value;
    const js = jsCode.value;

    output.contentDocument.body.innerHTML = html + "<style>" + css + "</style>";
    output.contentWindow.eval(js);
}

function handleTabIndentation(editor, event) {
    if (event.key === 'Tab') {
        event.preventDefault();

        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        const spaces = ' '.repeat(TAB_SIZE);

        editor.value = editor.value.substring(0, start) + spaces + editor.value.substring(end);

        editor.selectionStart = editor.selectionEnd = start + TAB_SIZE;
    }
}

function handleKeyPress(editor, event) {
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const value = editor.value;
    
    let openChar = null;
    let closeChar = null;

    switch (event.key) {
        case '(': openChar = '('; closeChar = ')'; break;
        case '[': openChar = '['; closeChar = ']'; break;
        case '{': openChar = '{'; closeChar = '}'; break;
        case '"': openChar = '"'; closeChar = '"'; break;
        case "'": openChar = "'"; closeChar = "'"; break;
    }

    if (openChar) {
        editor.value = value.substring(0, start) + openChar + closeChar + value.substring(end);
        editor.selectionStart = editor.selectionEnd = start + 1;
        event.preventDefault(); 
        lastClosingTag = '';
        return;
    }
    
    if (editor === htmlCode && event.key === '>') {
        const textBeforeCursor = value.substring(0, start);
        const lastOpenBracketIndex = textBeforeCursor.lastIndexOf('<');

        if (lastOpenBracketIndex !== -1) {
            let tagNameMatch = textBeforeCursor.substring(lastOpenBracketIndex + 1).match(/^[a-zA-Z0-9]+/);
            
            if (tagNameMatch) {
                const tagName = tagNameMatch[0];
                const closingTag = `</${tagName}>`;
                
                editor.value = value.substring(0, start) + '>' + closingTag + value.substring(end);
                
                editor.selectionStart = editor.selectionEnd = start + 1;
                
                event.preventDefault(); 
                
                lastClosingTag = closingTag; 
            }
        }
    }
}

function handleAutoDelete(editor, event) {
    if (event.key === 'Backspace' && lastClosingTag && editor === htmlCode) {
        const start = editor.selectionStart;
        const value = editor.value;
        
        if (start > 0 && value.substring(start - 1, start) === '>') {
            
            const tagStart = start;
            const tagEnd = start + lastClosingTag.length;
            
            editor.value = value.substring(0, tagStart) + value.substring(tagEnd);
            
            editor.selectionStart = editor.selectionEnd = start - 1;

            event.preventDefault();
            lastClosingTag = '';
        }
    }
}

editors.forEach(editor => {
    editor.addEventListener('keydown', (e) => {
        handleTabIndentation(editor, e);
        handleAutoDelete(editor, e); 
    });
    
    editor.addEventListener('keypress', (e) => {
        handleKeyPress(editor, e); 
    });
    
    editor.addEventListener('input', run);
});

window.onload = run;
