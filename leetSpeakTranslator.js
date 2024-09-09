export function leetSpeakEncode(text, format) {
  const leetDictionary = {
    a: ["4", "@", "/-\\"],
    e: ["3", "€", "[-"],
    l: ["1", "|", "£"],
    s: ["5", "$", "§"],
    t: ["7", "+", "†"],
    o: ["0", "()", "Ø"],
    i: ["1", "!", "|"],
    b: ["8", "|3", "ß"],
  };

  let leetText = text.toLowerCase();
  for (const [key, value] of Object.entries(leetDictionary)) {
    let replacement = value[0]; // Default to Basic
    if (format === "Intermediate") replacement = value[1];
    else if (format === "Advanced") replacement = value[2];

    const regex = new RegExp(key, "g");
    leetText = leetText.replace(regex, replacement);
  }

  return leetText;
}

export function leetSpeakDecode(text) {
  const leetReverseDictionary = {
    4: "a",
    "@": "a",
    "/-\\": "a",
    3: "e",
    "€": "e",
    "[-": "e",
    1: "l",
    "|": "l",
    "£": "l",
    5: "s",
    $: "s",
    "§": "s",
    7: "t",
    "+": "t",
    "†": "t",
    0: "o",
    "()": "o",
    Ø: "o",
    "!": "i",
    8: "b",
    "|3": "b",
    ß: "b",
  };

  let decodedText = text;
  for (const [leetChar, normalChar] of Object.entries(leetReverseDictionary)) {
    const regex = new RegExp(
      leetChar.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "g"
    );
    decodedText = decodedText.replace(regex, normalChar);
  }

  return decodedText;
}
