window.addEventListener("DOMContentLoaded", () => {
  const chatList = document.getElementById("chatList");
  const nameInput = document.getElementById("nameInput");

  const myId = localStorage.getItem("uid");
  const myNickname = localStorage.getItem("nickname") || "";
  nameInput.value = myNickname;

  const chatsRef = db.ref("chats");
  const chatDivs = {};

  function createChat() {
    const nickname = nameInput.value.trim();
    if (!nickname) return alert("請先輸入暱稱");

    const chatName = prompt("聊天室名稱");
    if (!chatName) return;

    const chatId = chatsRef.push().key;

    db.ref("chats/" + chatId).set({
      name: chatName,
      owner: myId,
      members: {
        [myId]: nickname
      }
    });
  }
  window.createChat = createChat;

  chatsRef.on("child_added", snap => {
    const chat = snap.val();
    const chatId = snap.key;

    const div = document.createElement("div");
    div.className = "chat-item";
    div.innerHTML = `
      <span class="name">${chat.name} (0)</span>
      <div>
        <button onclick="editChatName('${chatId}')">編輯</button>
        <button onclick="deleteChat('${chatId}')">刪除</button>
      </div>
    `;
    chatDivs[chatId] = div;

    div.querySelector("span.name").onclick = () => {
      localStorage.setItem("chatId", chatId);
      localStorage.setItem("nickname", nameInput.value);
      location.href = "chat.html";
    };

    chatList.appendChild(div);

    db.ref(`chats/${chatId}/members`).on("value", snap => {
      const members = snap.val() || {};
      const memberCount = Object.keys(members).length;
      div.querySelector("span.name").innerText = `${chat.name} (${memberCount})`;
    });
  });

  window.editChatName = chatId => {
    const newName = prompt("輸入新的聊天室名稱");
    if (!newName) return;
    db.ref(`chats/${chatId}/name`).set(newName);
  };

  window.deleteChat = chatId => {
    if (confirm("確定刪除整個聊天室嗎？")) {
      db.ref(`chats/${chatId}`).remove();
    }
  };
});
