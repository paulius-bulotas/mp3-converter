function downloadMusic() {
  const videoUrl = document.getElementById("userInput").value;
  const title = videoUrl.replace(/[\/\?<>\\:\*\|"]/g, '_');

  fetch(`/musicInfo/query?url=${videoUrl}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.blob();
    })
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      // a.download = `${title}.mp3`;
      a.download = `downloaded.mp3`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    })
    .catch((err) => {
      console.error("Error:", err);
    });
}
