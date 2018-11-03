import htmlToText from 'html-to-text';

export const cleanTextHTML = text => htmlToText.fromString(text, { wordwrap: false, ignoreHref: true, ignoreImage: true });

export const isSelectedSurah = (file, selectedSurah) => selectedSurah && file && file.qari_id === selectedSurah.reciterId && file.surah_id === selectedSurah.id;
export const isSelectedReciter = (reciter, selectedSurah) => selectedSurah && reciter && reciter.id === selectedSurah.reciterId;
