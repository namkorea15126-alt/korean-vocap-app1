document.addEventListener("DOMContentLoaded", function () {
    var words = WORDS;
    var memoryData = JSON.parse(localStorage.getItem("memoryData")) || {};

    var meaning = document.getElementById("meaning");
    var korean = document.getElementById("korean");
    var statusText = document.getElementById("statusText");
    var progressText = document.getElementById("progress");

    var knownBtn = document.getElementById("knownBtn");
    var unknownBtn = document.getElementById("unknownBtn");
    var resetBtn = document.getElementById("resetBtn");

    var audio = document.getElementById("audio");
    var currentWord = null;

    function getUnlearnedWords() {
        return words.filter(w => memoryData[w.ko] !== "known");
    }

    function playAudio(word) {
        if (!word.audio) return;
        audio.src = word.audio;
        audio.currentTime = 0;
        audio.play().catch(() => {});
    }

    function showWord() {
        var remainingWords = getUnlearnedWords();

        if (remainingWords.length === 0) {
            meaning.textContent = "🎉 Finished!";
            korean.textContent = "";
            korean.classList.add("hidden");
            statusText.textContent = "";
            progressText.textContent =
                "Remembered: " + words.length + " / " + words.length + " (100%)";
            return;
        }

        currentWord =
            remainingWords[Math.floor(Math.random() * remainingWords.length)];

        meaning.textContent = currentWord.vi;
        korean.textContent = currentWord.ko;
        korean.classList.add("hidden"); // Ẩn chữ Hàn khi sang từ mới

        if (memoryData[currentWord.ko] === "known")
            statusText.textContent = "✅ Remembered";
        else if (memoryData[currentWord.ko] === "unknown")
            statusText.textContent = "❌ Not Remembered";
        else statusText.textContent = "🤔 Unmarked";

        updateProgress();
        playAudio(currentWord); // 🔊 tự phát âm tiếng Hàn
    }

    function saveWordStatus(status) {
        if (!currentWord) return;
        memoryData[currentWord.ko] = status;
        localStorage.setItem("memoryData", JSON.stringify(memoryData));
        showWord();
    }

    function updateProgress() {
        var knownCount = Object.values(memoryData).filter(v => v === "known").length;
        var total = words.length;
        progressText.textContent =
            "Remembered: " + knownCount + " / " + total +
            " (" + Math.round((knownCount / total) * 100) + "%)";
    }

    function resetData() {
        if (confirm("Are you sure start learning again?")) {
            memoryData = {};
            localStorage.setItem("memoryData", JSON.stringify(memoryData));
            showWord();
        }
    }

    // 👆 CLICK NGHĨA → HIỆN / ẨN CHỮ HÀN
    meaning.addEventListener("click", function () {
        korean.classList.toggle("hidden");
    });

    knownBtn.addEventListener("click", function () {
        saveWordStatus("known");
    });

    unknownBtn.addEventListener("click", function () {
        saveWordStatus("unknown");
    });

    resetBtn.addEventListener("click", resetData);

    showWord();
});
