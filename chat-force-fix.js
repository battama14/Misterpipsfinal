// Force fix chat widget
setTimeout(() => {
    const toggle = document.getElementById('chatToggle');
    const chatWindow = document.getElementById('chatWindow');
    const close = document.getElementById('closeChatBtn');
    
    console.log('Elements:', toggle, chatWindow, close);
    
    if (toggle && chatWindow) {
        toggle.onclick = function() {
            console.log('Toggle clicked');
            if (chatWindow.style.display === 'none' || !chatWindow.style.display) {
                chatWindow.style.display = 'block';
                chatWindow.style.position = 'fixed';
                chatWindow.style.bottom = '20px';
                chatWindow.style.right = '20px';
                chatWindow.style.width = '350px';
                chatWindow.style.height = '500px';
                chatWindow.style.background = 'white';
                chatWindow.style.border = '1px solid #ccc';
                chatWindow.style.borderRadius = '10px';
                chatWindow.style.zIndex = '9999';
                console.log('Chat opened');
            } else {
                chatWindow.style.display = 'none';
                console.log('Chat closed');
            }
        };
    }
    
    if (close && chatWindow) {
        close.onclick = function() {
            console.log('Close clicked');
            chatWindow.style.display = 'none';
        };
    }
}, 1000);

console.log('Chat force fix loaded');