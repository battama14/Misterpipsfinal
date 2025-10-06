// Chat direct sans délai
document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('chatToggle');
    if (toggle) {
        toggle.onclick = () => {
            alert('Chat clicked!');
            const chat = document.getElementById('chatWindow');
            if (chat) {
                chat.style.display = 'block';
                chat.style.position = 'fixed';
                chat.style.bottom = '20px';
                chat.style.right = '20px';
                chat.style.width = '350px';
                chat.style.height = '500px';
                chat.style.background = 'white';
                chat.style.zIndex = '9999';
                chat.style.border = '2px solid red';
            }
        };
    }
});

window.addEventListener('load', () => {
    const toggle = document.getElementById('chatToggle');
    if (toggle) {
        toggle.onclick = () => {
            alert('Chat clicked!');
            const chat = document.getElementById('chatWindow');
            if (chat) {
                chat.style.display = 'block';
                chat.style.position = 'fixed';
                chat.style.bottom = '20px';
                chat.style.right = '20px';
                chat.style.width = '350px';
                chat.style.height = '500px';
                chat.style.background = 'white';
                chat.style.zIndex = '9999';
                chat.style.border = '2px solid red';
            }
        };
    }
});