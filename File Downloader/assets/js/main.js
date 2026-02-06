const fileInput = document.getElementById("downloader-input"),
      downloadBtn = document.querySelector(".download-btn");

downloadBtn.addEventListener("click", e => {
    e.preventDefault();
    if(!fileInput.value) return alert("Lütfen geçerli bir URL girin!");

    downloadBtn.innerText = "Dosya alınıyor...";
    fetchFile(fileInput.value);
});

const fetchFile = (url) => {
    fetch(url)
    .then(res => {
        const contentType = res.headers.get('content-type');
        return res.blob().then(blob => ({ blob, contentType }));
    })
    .then(({ blob, contentType }) => {
        let tempUrl = URL.createObjectURL(blob);
        let aTag = document.createElement("a");
        aTag.href = tempUrl;

        let fileName = url.split('/').pop().split('?')[0];

        if (!fileName.includes(".") && contentType) {
            const extension = contentType.split('/')[1].split('+')[0]; 
            fileName += `.${extension}`;
        }

        fileName = fileName.replace(".mpeg", ".mp3").replace(".quicktime", ".mov");

        aTag.download = fileName || "downloaded-file";
        document.body.appendChild(aTag);
        aTag.click();
        
        aTag.remove();
        URL.revokeObjectURL(tempUrl);
        downloadBtn.innerText = "Download File";
        fileInput.value = "";
    })
    .catch(() => {
        alert("Dosya indirilemedi. Güvenlik (CORS) engeli veya hatalı bağlantı.");
        downloadBtn.innerText = "Download File";
    });
}