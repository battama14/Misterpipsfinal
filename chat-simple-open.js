// Bouton chat
const chatBtn = document.createElement('div');
chatBtn.style.cssText = 'position: fixed; bottom: 20px; right: 20px; width: 60px; height: 60px; background: #007bff; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 1000; font-size: 24px; color: white;';
chatBtn.innerHTML = '💬';
chatBtn.onclick = () => {
    const chatWindow = document.querySelector('div[style*="position: fixed"][style*="bottom: 100px"]');
    if (chatWindow) {
        chatWindow.style.display = chatWindow.style.display === 'none' ? 'block' : 'none';
    }
};
document.body.appendChild(chatBtn);