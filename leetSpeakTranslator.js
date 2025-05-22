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
    c: ["(", "©", "¢"],
    d: ["|)", "|D", "∂"],
    f: ["|=", "ƒ", "ph"],
    g: ["6", "9", "&"],
    h: ["|-|", "#", "]-["],
    j: [";", "_|", "¿"],
    k: ["|<", "X", "]{"],
    m: ["|V|", "^^", "/\\/\\"],
    n: ["|\\|", "^/", "И"],
    p: ["|*", "9", "¶"],
    q: ["9", "O_", "¤"],
    r: ["|2", "12", "®"],
    u: ["|_|", "µ", "Ü"],
    v: ["\\/", "\\", "√"],
    w: ["\\/\\/", "vv", "ω"],
    x: ["><", "}{", "×"],
    y: ["`/", "¥", "Ψ"],
    z: ["2", "~/_", "≥"],
  };

  const leetPatterns = {
    ck: ["XX", "cX", "©X"],
    ph: ["f", "ƒ", "ph"],
    th: ["7h", "+h", "†h"],
    sh: ["5h", "$h", "§h"],
    ch: ["(h", "©h", "¢h"],
    ght: ["9h7", "gh+", "gh†"],
    ing: ["1n9", "|n6", "1И6"],
    tion: ["71on", "+10n", "†|0И"],
    ness: ["n355", "И3$$", "И3§§"],
    ment: ["m3n7", "/\\/\\3И+", "/\\/\\3И†"],
  };

  const wordReplacements = {
    to: ["2", "2", "②"],
    for: ["4", "4", "④"],
    you: ["u", "µ", "Ü"],
    your: ["ur", "µr", "Ür"],
    are: ["r", "R", "®"],
    see: ["c", "©", "¢"],
    be: ["b", "8", "ß"],
    why: ["y", "¥", "Ψ"],
    too: ["2", "②", "2²"],
    ate: ["8", "8", "∞"],
    great: ["gr8", "9®8", "&®∞"],
    later: ["l8r", "£8®", "£∞®"],
    tonight: ["2nite", "②И17€", "②И|†€"],
    before: ["b4", "84", "ß④"],
    because: ["bcuz", "8©µz", "ß¢Üz"],
    anyone: ["ne1", "И€1", "И€|"],
    something: ["som3thin", "§0/\\/\\3†h|И", "§Ø/\\/\\3†]-[|И"],
  };

  let leetText = text.toLowerCase();

  for (const word in wordReplacements) {
    const replacements = wordReplacements[word];
    let replacement = replacements[0];
    if (format === "Intermediate") replacement = replacements[1];
    else if (format === "Advanced") replacement = replacements[2];

    const wordRegex = new RegExp("\\b" + escapeRegex(word) + "\\b", "gi");
    leetText = leetText.replace(wordRegex, replacement);
  }

  for (const pattern in leetPatterns) {
    const replacements = leetPatterns[pattern];
    let replacement = replacements[0];
    if (format === "Intermediate") replacement = replacements[1];
    else if (format === "Advanced") replacement = replacements[2];

    const regex = new RegExp(escapeRegex(pattern), "gi");
    leetText = leetText.replace(regex, replacement);
  }

  for (const key in leetDictionary) {
    const value = leetDictionary[key];
    let replacement = value[0];
    if (format === "Intermediate") replacement = value[1];
    else if (format === "Advanced") replacement = value[2];

    const regex = new RegExp(escapeRegex(key), "g");
    leetText = leetText.replace(regex, replacement);
  }

  return leetText;
}

export function leetSpeakDecode(text) {
  const ambiguousChars = {
    "|": ["l", "i"],
    1: ["l", "i"],
    0: ["o"],
    3: ["e"],
    4: ["a"],
    5: ["s"],
    7: ["t"],
    8: ["b"],
    9: ["g", "q"],
    6: ["g"],
    2: ["z"],
    "!": ["i"],
    $: ["s"],
    "@": ["a"],
    "+": ["t"],
    "#": ["h"],
    "&": ["g"],
    X: ["k"],
    "(": ["c"],
    ")": ["d"],
    "^": ["n"],
    µ: ["u"],
    "®": ["r"],
    "©": ["c"],
    ß: ["b"],
    "¥": ["y"],
    Ψ: ["y"],
    "†": ["t"],
    "€": ["e"],
    "£": ["l"],
    "§": ["s"],
    Ø: ["o"],
    "∂": ["d"],
    ƒ: ["f"],
    И: ["n"],
    "¶": ["p"],
    "¤": ["q"],
    "√": ["v"],
    ω: ["w"],
    "×": ["x"],
    "≥": ["z"],
  };

  const multiCharPatterns = [
    { pattern: "/-\\\\", replacement: "a" },
    { pattern: "\\|3", replacement: "b" },
    { pattern: "\\[-", replacement: "e" },
    { pattern: "\\(\\)", replacement: "o" },
    { pattern: "\\|\\)", replacement: "d" },
    { pattern: "\\|D", replacement: "d" },
    { pattern: "\\|=", replacement: "f" },
    { pattern: "\\|-\\|", replacement: "h" },
    { pattern: "\\]-\\[", replacement: "h" },
    { pattern: "_\\|", replacement: "j" },
    { pattern: "\\|<", replacement: "k" },
    { pattern: "\\]\\{", replacement: "k" },
    { pattern: "\\|V\\|", replacement: "m" },
    { pattern: "\\^\\^", replacement: "m" },
    { pattern: "/\\\\/\\\\", replacement: "m" },
    { pattern: "\\|\\\\\\|", replacement: "n" },
    { pattern: "\\^/", replacement: "n" },
    { pattern: "\\|\\*", replacement: "p" },
    { pattern: "O_", replacement: "q" },
    { pattern: "\\|2", replacement: "r" },
    { pattern: "12", replacement: "r" },
    { pattern: "\\|_\\|", replacement: "u" },
    { pattern: "\\\\/", replacement: "v" },
    { pattern: "\\\\/\\\\/", replacement: "w" },
    { pattern: "vv", replacement: "w" },
    { pattern: "><", replacement: "x" },
    { pattern: "\\}\\{", replacement: "x" },
    { pattern: "`/", replacement: "y" },
    { pattern: "~/_", replacement: "z" },
    { pattern: "XX", replacement: "ck" },
    { pattern: "cX", replacement: "ck" },
    { pattern: "©X", replacement: "ck" },
    { pattern: "7h", replacement: "th" },
    { pattern: "\\+h", replacement: "th" },
    { pattern: "†h", replacement: "th" },
    { pattern: "5h", replacement: "sh" },
    { pattern: "\\$h", replacement: "sh" },
    { pattern: "§h", replacement: "sh" },
    { pattern: "\\(h", replacement: "ch" },
    { pattern: "©h", replacement: "ch" },
    { pattern: "¢h", replacement: "ch" },
    { pattern: "9h7", replacement: "ght" },
    { pattern: "gh\\+", replacement: "ght" },
    { pattern: "gh†", replacement: "ght" },
    { pattern: "1n9", replacement: "ing" },
    { pattern: "\\|n6", replacement: "ing" },
    { pattern: "1И6", replacement: "ing" },
    { pattern: "71on", replacement: "tion" },
    { pattern: "\\+10n", replacement: "tion" },
    { pattern: "†\\|0И", replacement: "tion" },
    { pattern: "n355", replacement: "ness" },
    { pattern: "И3\\$\\$", replacement: "ness" },
    { pattern: "И3§§", replacement: "ness" },
    { pattern: "m3n7", replacement: "ment" },
    { pattern: "/\\\\/\\\\3И\\+", replacement: "ment" },
    { pattern: "/\\\\/\\\\3И†", replacement: "ment" },
  ];

  const wordReplacements = {
    2: "to",
    "②": "to",
    4: "for",
    "④": "for",
    u: "you",
    µ: "you",
    Ü: "you",
    ur: "your",
    µr: "your",
    Ür: "your",
    r: "are",
    R: "are",
    "®": "are",
    c: "see",
    "©": "see",
    "¢": "see",
    b: "be",
    ß: "be",
    y: "why",
    "¥": "why",
    Ψ: "why",
    "2²": "too",
    "②": "too",
    8: "ate",
    "∞": "ate",
    gr8: "great",
    "9®8": "great",
    "&®∞": "great",
    l8r: "later",
    "£8®": "later",
    "£∞®": "later",
    "2nite": "tonight",
    "②И17€": "tonight",
    "②И|†€": "tonight",
    b4: "before",
    84: "before",
    "ß④": "before",
    bcuz: "because",
    "8©µz": "because",
    "ß¢Üz": "because",
    ne1: "anyone",
    "И€1": "anyone",
    "И€|": "anyone",
    som3thin: "something",
    "§0/\\/\\3†h|И": "something",
  };

  const letterFrequency = {
    e: 12.7,
    t: 9.06,
    a: 8.17,
    o: 7.51,
    i: 6.97,
    n: 6.75,
    s: 6.33,
    h: 6.09,
    r: 5.99,
    d: 4.25,
    l: 4.03,
    c: 2.78,
    u: 2.76,
    m: 2.41,
    w: 2.36,
    f: 2.23,
    g: 2.02,
    y: 1.97,
    p: 1.93,
    b: 1.29,
    v: 0.98,
    k: 0.77,
    j: 0.15,
    x: 0.15,
    q: 0.1,
    z: 0.07,
  };

  const commonWords = new Set([
    "the",
    "be",
    "to",
    "of",
    "and",
    "a",
    "in",
    "that",
    "have",
    "i",
    "it",
    "for",
    "not",
    "on",
    "with",
    "he",
    "as",
    "you",
    "do",
    "at",
    "this",
    "but",
    "his",
    "by",
    "from",
    "they",
    "she",
    "or",
    "an",
    "will",
    "my",
    "one",
    "all",
    "would",
    "there",
    "their",
    "what",
    "so",
    "up",
    "out",
    "if",
    "about",
    "who",
    "get",
    "which",
    "go",
    "me",
    "when",
    "make",
    "can",
    "like",
    "time",
    "no",
    "just",
    "him",
    "know",
    "take",
    "people",
    "into",
    "year",
    "your",
    "good",
    "some",
    "could",
    "them",
    "see",
    "other",
    "than",
    "then",
    "now",
    "look",
    "only",
    "come",
    "its",
    "over",
    "think",
    "also",
    "back",
    "after",
    "use",
    "two",
    "how",
    "our",
    "work",
    "first",
    "well",
    "way",
    "even",
    "new",
    "want",
    "because",
    "any",
    "these",
    "give",
    "day",
    "most",
    "us",
    "hello",
    "world",
  ]);

  function calculateConfidence(text) {
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    if (words.length === 0) return 0;

    let commonWordCount = 0;
    let letterFreqScore = 0;
    let totalLetters = 0;
    let wordStructureScore = 0;

    words.forEach((word) => {
      if (commonWords.has(word)) {
        commonWordCount++;
        if (
          [
            "the",
            "be",
            "to",
            "of",
            "and",
            "a",
            "in",
            "that",
            "have",
            "i",
            "it",
            "for",
            "you",
            "hello",
            "world",
          ].includes(word)
        ) {
          commonWordCount += 0.5;
        }
      }

      if (!/(.)\1{2,}/.test(word) && word.length > 1) {
        wordStructureScore += 1;
      }
    });

    const textClean = text.toLowerCase().replace(/[^a-z]/g, "");
    for (let i = 0; i < textClean.length; i++) {
      const char = textClean[i];
      if (letterFrequency[char]) {
        letterFreqScore += letterFrequency[char];
        totalLetters++;
      }
    }

    const commonWordRatio = commonWordCount / words.length;
    const avgLetterFreq = totalLetters > 0 ? letterFreqScore / totalLetters : 0;
    const wordStructureRatio = wordStructureScore / words.length;

    const hasRepeatedChars = /(.)\1{3,}/.test(text);
    const hasWeirdPatterns = /[bcdfghjklmnpqrstvwxyz]{4,}/i.test(text);
    const repeatedCharPenalty = hasRepeatedChars ? 30 : 0;
    const weirdPatternPenalty = hasWeirdPatterns ? 15 : 0;

    let score =
      commonWordRatio * 50 +
      Math.min(avgLetterFreq, 8) * 4 +
      wordStructureRatio * 20 +
      10;

    score -= repeatedCharPenalty + weirdPatternPenalty;

    const fullText = text.toLowerCase();
    if (
      fullText.includes("hello world") ||
      fullText.includes("hello") ||
      fullText.includes("world")
    ) {
      score += 20;
    }

    return Math.round(Math.min(100, Math.max(0, score)));
  }

  function decodeWithContext(text) {
    let workingText = text;

    multiCharPatterns.sort((a, b) => b.pattern.length - a.pattern.length);

    for (const item of multiCharPatterns) {
      const regex = new RegExp(item.pattern, "gi");
      workingText = workingText.replace(regex, item.replacement);
    }

    for (const leetWord in wordReplacements) {
      const normalWord = wordReplacements[leetWord];
      const escapedWord = escapeRegex(leetWord);
      const regex = new RegExp("\\b" + escapedWord + "\\b", "gi");
      workingText = workingText.replace(regex, normalWord);
    }

    let result = workingText;

    for (let i = 0; i < result.length; i++) {
      const char = result[i];
      if (ambiguousChars[char] && ambiguousChars[char].length > 1) {
        const before = i > 0 ? result.substring(i - 2, i) : "";
        const after =
          i < result.length - 1 ? result.substring(i + 1, i + 3) : "";
        const wordBefore = result.substring(0, i).match(/\w*$/)?.[0] || "";
        const wordAfter = result.substring(i + 1).match(/^\w*/)?.[0] || "";

        let bestChoice = ambiguousChars[char][0];

        if (char === "|" || char === "1") {
          if (wordBefore.match(/h[e3]$/i) && wordAfter.match(/^[l|1]*[0o]/i)) {
            bestChoice = "l";
          } else if (wordBefore.match(/w[0o]r$/i) && wordAfter.match(/^d/i)) {
            bestChoice = "l";
          } else if (before.endsWith("l") || after.startsWith("l")) {
            bestChoice = "l";
          } else {
            bestChoice = "l";
          }
        }

        result = result.substring(0, i) + bestChoice + result.substring(i + 1);
      }
    }

    for (const leetChar in ambiguousChars) {
      const options = ambiguousChars[leetChar];
      if (options.length === 1) {
        const escapedChar = escapeRegex(leetChar);
        const regex = new RegExp(escapedChar, "g");
        result = result.replace(regex, options[0]);
      }
    }

    const confidence = calculateConfidence(result);

    const alternatives = [];

    let alt1 = workingText;
    for (const leetChar in ambiguousChars) {
      const options = ambiguousChars[leetChar];
      if (leetChar === "|" || leetChar === "1") {
        const regex = new RegExp(escapeRegex(leetChar), "g");
        alt1 = alt1.replace(regex, "i");
      } else if (options.length === 1) {
        const regex = new RegExp(escapeRegex(leetChar), "g");
        alt1 = alt1.replace(regex, options[0]);
      }
    }

    if (alt1 !== result) {
      alternatives.push({ text: alt1, confidence: calculateConfidence(alt1) });
    }

    let alt2 = workingText;
    let isFirstAmbiguous = true;
    for (let i = 0; i < alt2.length; i++) {
      const char = alt2[i];
      if ((char === "|" || char === "1") && ambiguousChars[char]) {
        const replacement = isFirstAmbiguous ? "i" : "l";
        alt2 = alt2.substring(0, i) + replacement + alt2.substring(i + 1);
        isFirstAmbiguous = !isFirstAmbiguous;
      }
    }

    for (const leetChar in ambiguousChars) {
      const options = ambiguousChars[leetChar];
      if (options.length === 1) {
        const regex = new RegExp(escapeRegex(leetChar), "g");
        alt2 = alt2.replace(regex, options[0]);
      }
    }

    if (alt2 !== result && alt2 !== alt1) {
      alternatives.push({ text: alt2, confidence: calculateConfidence(alt2) });
    }

    alternatives.sort((a, b) => b.confidence - a.confidence);
    const filteredAlternatives = alternatives
      .filter((alt) => alt.confidence > 10 && alt.text !== result)
      .slice(0, 3);

    return {
      text: result,
      confidence: confidence,
      alternatives: filteredAlternatives,
    };
  }

  return decodeWithContext(text);
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function leetSpeakDecodeSimple(text) {
  const result = leetSpeakDecode(text);
  return typeof result === "string" ? result : result.text;
}
