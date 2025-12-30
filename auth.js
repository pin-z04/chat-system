const usersRef = db.ref("users");

// 註冊
document.getElementById("registerBtn")?.addEventListener("click", () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const nickname = document.getElementById("nickname").value.trim();

  if (!email || !password || !nickname) return alert("請填寫所有欄位");

  usersRef.orderByChild("email").equalTo(email).once("value", snap => {
    if (snap.exists()) return alert("帳號已存在");

    const userId = Date.now().toString();
    usersRef.child(userId).set({
      email,
      password,
      nickname,
      lastPasswordChange: 0
    });
    alert("註冊成功，請登入");
    location.href = "index.html";
  });
});

// 登入
document.getElementById("loginBtn")?.addEventListener("click", () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) return alert("請填寫所有欄位");

  usersRef.orderByChild("email").equalTo(email).once("value", snap => {
    if (!snap.exists()) return alert("帳號不存在");

    let user = null;
    snap.forEach(s => user = { id: s.key, ...s.val() });

    if (user.password !== password) return alert("密碼錯誤");

    // 登入成功
    localStorage.setItem("uid", user.id);
    localStorage.setItem("nickname", user.nickname);
    location.href = "lobby.html";
  });
});
