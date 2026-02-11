// Notepad App
const NotepadApp = {
    init() {
        const textarea = document.getElementById('notepadArea');
        if (!textarea) return;
        
        document.getElementById('notepadNew')?.addEventListener('click', () => textarea.value = '');
        document.getElementById('notepadSave')?.addEventListener('click', () => {
            const blob = new Blob([textarea.value], { type: 'text/plain' });
            const link = document.createElement('a');
            link.download = 'notes.txt';
            link.href = URL.createObjectURL(blob);
            link.click();
        });
        document.getElementById('notepadOpen')?.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.txt,.md,.js,.html,.css,.json';
            input.onchange = (e) => {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onload = (ev) => textarea.value = ev.target.result);
                reader.readAsText(file);
            };
            input.click();
        });
    }
};

NotepadApp.init();
