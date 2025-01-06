self.onmessage = function (e) {
  console.log("Data received from main thread:", e.data);
  let result = 0;
  for (let i = 0; i < 1000000000; i++) {
    result += i;
  }
  postMessage(result); // Gửi kết quả về main thread
};
