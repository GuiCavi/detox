function win32Implementation() {
  const escapeInQuotedStringWin32 = (fragment) => fragment.replace(/"/g, '""');
  const escapeInQuotedRegexpWin32 = escapeInQuotedStringWin32;
  const searchRegexpWin32 = (pattern) => `findstr /R /C:"${escapeInQuotedStringWin32(pattern)}"`;
  const searchFragmentWin32 = (fragment) => `findstr /C:"${escapeInQuotedStringWin32(fragment)}"`;
  const addCR = 'find "" /v';

  return {
    escape: {
      inQuotedString: escapeInQuotedStringWin32,
      inQuotedRegexp: escapeInQuotedRegexpWin32,
    },
    search: {
      regexp: searchRegexpWin32,
      fragment: searchFragmentWin32,
    },
    normalize: {
      crlf: addCR,
    },
  };
}

function nixImplementation() {
  const SPECIAL_CHARS = /(["\^\$\[\]\*\.\\])/g;

  const escapeInQuotedStringNix = (fragment) => fragment.replace(/"/g, '\\"');
  const escapeInQuotedRegexpNix = (fragment) => fragment.replace(SPECIAL_CHARS, "\\$1");
  const searchRegexpNix = (pattern) => `grep "${escapeInQuotedStringNix(pattern)}"`;
  const searchFragmentNix = (fragment) => `grep -e "${escapeInQuotedStringNix(fragment)}"`;
  const stripCR = `tr -d $'\\r'`;

  return {
    escape: {
      inQuotedString: escapeInQuotedStringNix,
      inQuotedRegexp: escapeInQuotedRegexpNix,
    },
    search: {
      regexp: searchRegexpNix,
      fragment: searchFragmentNix,
    },
    normalize: {
      crlf: stripCR,
    },
  };
}

const isInsideCMD_EXE = process.platform === 'win32' && !process.env['SHELL'];

module.exports = isInsideCMD_EXE
  ? win32Implementation()
  : nixImplementation();
