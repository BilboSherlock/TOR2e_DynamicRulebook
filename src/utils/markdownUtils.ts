import React from 'react';

export function preprocessMarkdownContent(content: string): string {
  if (!content) return '';
  let text = content;

  // Process quote shortcodes BEFORE wikilinks
  text = text.replace(
    /\[\[subhead-quote\]\]([\s\S]*?)\[\[\/subhead-quote\]\]/gi,
    (_, quoteText) => `\n\n<div class="subhead-quote">\n\n${quoteText.trim()}\n\n</div>\n\n`
  );
  text = text.replace(
    /\[subhead-quote\]([\s\S]*?)\[\/subhead-quote\]/gi,
    (_, quoteText) => `\n\n<div class="subhead-quote">\n\n${quoteText.trim()}\n\n</div>\n\n`
  );

  text = text.replace(
    /\[\[inline-quote\]\]([\s\S]*?)\[\[\/inline-quote\]\]/gi,
    (_, quoteText) => `\n\n<div class="inline-quote">\n\n${quoteText.trim()}\n\n</div>\n\n`
  );
  text = text.replace(
    /\[inline-quote\]([\s\S]*?)\[\/inline-quote\]/gi,
    (_, quoteText) => `\n\n<div class="inline-quote">\n\n${quoteText.trim()}\n\n</div>\n\n`
  );

  // Preprocess Foundry VTT compendium links, Wikilinks, and box shortcodes
  text = text.replace(/\[\[([^\]]+)\]\]\(([^)]*)\)/g, (_, target, label) => `[${label || target}](#compendium-${encodeURIComponent(target)})`);
  text = text.replace(/\[\[Compendium\.[^\]|]+\|([^\]]+)\]\]/g, (_, label) => `[${label}](#compendium-${encodeURIComponent(label)})`);
  text = text.replace(/\[\[Compendium\.([^\]]+)\]\]/g, (_, title) => `[${title}](#compendium-${encodeURIComponent(title)})`);
  text = text.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, (_, target, label) => `[${label}](#compendium-${encodeURIComponent(target)})`);
  text = text.replace(/\[\[([^\]]+)\]\]/g, (_, title) => `[${title}](#compendium-${encodeURIComponent(title)})`);

  // Support key-box, red-box, and example-box container syntaxes with newline separation for proper markdown block parsing
  text = text.replace(/:::\s*key-box/gi, '\n\n<div class="key-box">\n\n');
  text = text.replace(/:::\s*red-box/gi, '\n\n<div class="red-box">\n\n');
  text = text.replace(/:::\s*example/gi, '\n\n<div class="example-box">\n\n');
  text = text.replace(/:::/g, '\n\n</div>\n\n');

  text = text.replace(/<key-box>/gi, '\n\n<div class="key-box">\n\n').replace(/<\/key-box>/gi, '\n\n</div>\n\n');
  text = text.replace(/<red-box>/gi, '\n\n<div class="red-box">\n\n').replace(/<\/red-box>/gi, '\n\n</div>\n\n');
  text = text.replace(/<example>/gi, '\n\n<div class="example-box">\n\n').replace(/<\/example>/gi, '\n\n</div>\n\n');
  text = text.replace(/\[key-box\]/gi, '\n\n<div class="key-box">\n\n').replace(/\[\/key-box\]/gi, '\n\n</div>\n\n');
  text = text.replace(/\[red-box\]/gi, '\n\n<div class="red-box">\n\n').replace(/\[\/red-box\]/gi, '\n\n</div>\n\n');
  text = text.replace(/\[example\]/gi, '\n\n<div class="example-box">\n\n').replace(/\[\/example\]/gi, '\n\n</div>\n\n');

  // Preprocess Letter from Gandalf to wrap it in a custom handwritten glowing container
  text = text.replace(
    /## Letter from Gandalf\s*([\s\S]*?)(?=\n## |\n\* \* \*|$)/gi,
    (_, bodyText) => `## Letter from Gandalf\n\n<div class="gandalf-letter-body">\n\n${bodyText}\n\n</div>`
  );

  // Format Favoured and Ill-Favoured consistently
  text = text.replace(/([*_]+)(Ill[- ]Favoured|ill[- ]favoured|ill favoured|Ill favoured)([*_]+)/gi, '*Ill-Favoured*');
  text = text.replace(/(?<![*_a-zA-Z])(Ill[- ]favoured|ill[- ]favoured|ill favoured|Ill[- ]Favoured)(?![*_a-zA-Z])/gi, '*Ill-Favoured*');
  text = text.replace(/([*_]+)(Favoured|favoured)([*_]+)/gi, '*Favoured*');
  text = text.replace(/(?<![*_a-zA-Z])Favoured(?![*_a-zA-Z])/g, '*Favoured*');

  // Format Uppercase Skills to bold Title Case
  text = text.replace(
    /\b(AWE|ATHLETICS|AWARENESS|HUNTING|SONG|CRAFT|ENHEARTEN|TRAVEL|INSIGHT|HEALING|COURTESY|BATTLE|PERSUADE|STEALTH|SCAN|EXPLORE|RIDDLE|LORE|PROTECTION)\b/g,
    (m) => `**${m.charAt(0) + m.slice(1).toLowerCase()}**`
  );
  text = text.replace(/\*{4,}([^*]+)\*{4,}/g, '**$1**');

  return text;
}
