// // Test env
export const host = "http://localhost:8080/"
export const commentsboxioProjectID = '5649895713144832-proj'
export const bingAutosuggestKey = 'dbc7ff5a53734d91bcaf23ecdb50c086'

// // Prod env
// export const host = 'https://hw8-csci571-sever.ue.r.appspot.com/'
// export const commentsboxioProjectID = '5734738228674560-proj'
// export const bingAutosuggestKey = "f4964c95567e4d4887e0c11be9e227b6"

export const sections = [
  "world",
  "politics",
  "business",
  "technology",
  "sports",
];
export const sharePhrase = "CSCI_571_NewsApp";

export const source = function() {
  let storedSource = localStorage.getItem("source");
  if (storedSource === 'nytimes') {
    return storedSource;
  } else {  // default case
    return 'guardian';
  }
};

export const isGuardianChecked = function() {
  return source() === 'guardian' ? true : false
}

export const section = function(location) {
  const pathname = location.pathname

  if (pathname.includes('search')) {
    return 'search'
  }  else if (pathname.includes( 'favorites')) {
    return 'favorites'
  } else {
    return 'sections'
  }
}