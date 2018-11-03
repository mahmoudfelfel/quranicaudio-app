import htmlToText from 'html-to-text';

// eslint-disable-next-line max-len
export const cleanTextHTML = text => htmlToText.fromString(text, { wordwrap: false, ignoreHref: true, ignoreImage: true });
