window.addEventListener("DOMContentLoaded", () => {
  const messagesDiv = document.getElementById("messages");
  const messageInput = document.getElementById("messageInput");
  const sendBtn = document.getElementById("sendBtn");
  const chatTitle = document.getElementById("chatTitle");
  const membersDiv = document.getElementById("members");

  const myId = localStorage.getItem("uid");
  let nickname = localStorage.getItem("nickname") || "訪客";
  const chatId = localStorage.getItem("chatId");

  const chatRef = db.ref("chats/" + chatId);
  const messagesRef = chatRef.child("messages");
  const membersRef = chatRef.child("members");

  function formatTime(ts) {
    const d = new Date(ts);
    return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
  }

  function renderChatTitle(chatData, members) {
    const count = Object.keys(members || {}).length;
    chatTitle.innerText = `${chatData.name} (${count})`;
  }

  function renderMembers(members) {
    let html = "";
    for (let uid in members) {
      html += `${members[uid]} `;
      if (uid !== myId) html += `<button onclick="kickUser('${uid}')">踢</button>`;
      html += "<br>";
    }
    membersDiv.innerHTML = html;
  }

  chatRef.on("value", snap => {
    const chatData = snap.val() || {};
    const members = chatData.members || {};
    renderChatTitle(chatData, members);
    renderMembers(members);
  });

  function sendMessage() {
    const text = messageInput.value.trim();
    if (!text) return;
    const msgId = messagesRef.push().key;
    messagesRef.child(msgId).set({ senderId: myId, name: nickname, text, time: Date.now() });
    messageInput.value = "";
  }

  sendBtn.addEventListener("click", sendMessage);
  messageInput.addEventListener("keypress", e => { if(e.key==="Enter") sendMessage(); });

  messagesRef.on("child_added", snap => {
    const data = snap.val();
    const key = snap.key;
    const div = document.createElement("div");
    div.className = "msg";
    if (data.senderId === myId) div.classList.add("self");
    div.id = key;
    div.innerHTML = `
      <div class="retract" onclick="retractMessage('${key}')">收回</div>
      <div class="name">${data.name}</div>
      <div class="text">${data.text}</div>
      <div class="time">${formatTime(data.time)}</div>
    `;
    messagesDiv.appendChild(div);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  });

  messagesRef.on("child_removed", snap => {
    const div = document.getElementById(snap.key);
    if (div) div.remove();
  });

  window.retractMessage = key => messagesRef.child(key).remove();

  window.leaveChat = () => { membersRef.child(myId).remove(); location.href="lobby.html"; };

  window.deleteChat = () => { if(confirm("確定刪除整個聊天室嗎？")){ chatRef.remove(); location.href="lobby.html"; } };

  window.editChatName = () => { const newName = prompt("輸入新的聊天室名稱"); if(!newName) return; chatRef.child("name").set(newName); };

  window.inviteUser = () => { const newName = prompt("輸入要加入的暱稱"); if(!newName) return; const newId = Date.now().toString(); membersRef.child(newId).set(newName); };

  window.kickUser = uid => { if(confirm("確定踢出這個使用者嗎？")) membersRef.child(uid).remove(); };

});
