Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value))
}

Storage.prototype.getObject = function(key) {
    let value = this.getItem(key);
    if (value === null) {
        return value
    }
    if (value[0] === "{" || value[0] === "[") {
        value = JSON.parse(value);
    }
    return value
}

export function listBookmarks() {
    let bookmarks = localStorage.getObject('bookmarks')
    if (typeof bookmarks === 'undefined' || bookmarks == null) {
        return []
    }
    return bookmarks
}

export function addBookmark(article) {
    if (isBookmarked(article)) {
        return
    }

    let bookmarks = localStorage.getObject('bookmarks')
    if (typeof bookmarks === 'undefined' || bookmarks == null) {
        bookmarks = []
    }
    bookmarks.push(article)
    localStorage.setObject('bookmarks', bookmarks)
    return bookmarks
}

export function removeBookmark(articleId) {
    let bookmarks = localStorage.getObject('bookmarks')
    if (typeof bookmarks === 'undefined' || bookmarks == null) {
        return
    }

    let indexBookmark = -1
    let bookmark = null
    // eslint-disable-next-line no-unused-vars
    for (const index in bookmarks) {
        let currentBookmark = bookmarks[index]
        if (currentBookmark.id === articleId) {
            indexBookmark = index
            bookmark = currentBookmark
            break
        }
    }
    if (indexBookmark > -1) {
        bookmarks.splice(indexBookmark, 1);
    }
    localStorage.setObject('bookmarks', bookmarks)
    return bookmark
}

export function isBookmarked(article) {
    // console.log('isBookmarked')
    let bookmarks = localStorage.getObject('bookmarks')
    // console.log(bookmarks)
    if (typeof bookmarks === 'undefined' || bookmarks == null) {
        return false
    }
    // eslint-disable-next-line no-unused-vars
    for (const index in bookmarks) {
        let currentBookmark = bookmarks[index]
        if (currentBookmark.id === article.id) {
            return true
        }
    }
    return false
}