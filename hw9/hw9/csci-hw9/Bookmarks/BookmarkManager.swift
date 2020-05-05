//
//  BookmarkManager.swift
//  csci-hw9
//
//  Created by Angel Ricardo Nieto Garcia on 5/4/20.
//  Copyright © 2020 Angel Ricardo Nieto Garcia. All rights reserved.
//

import UIKit

class BookmarkManager {
    static var getAllObjects: [Article] {
         if let objects = UserDefaults.standard.value(forKey: "bookmarks") as? Data {
            let decoder = JSONDecoder()
            if let objectsDecoded = try? decoder.decode(Array.self, from: objects) as [Article] {
               return objectsDecoded
            }
         }
        return []
      }

    static func saveAllObjects(allObjects: [Article]) {
         let encoder = JSONEncoder()
         if let encoded = try? encoder.encode(allObjects){
            UserDefaults.standard.set(encoded, forKey: "bookmarks")
         }
    }
    
    static func addBookmark(article: Article) {
        var bookmarks = getAllObjects
        bookmarks.append(article)
        saveAllObjects(allObjects: bookmarks)
    }
    
    static func removeBookmark(article: Article) {
        var bookmarks = getAllObjects
        if let indexToRemove = bookmarks.firstIndex(where: {$0 == article}) {
            bookmarks.remove(at: indexToRemove)
        } else {
            let alertController = UIAlertController(title: "Logical Error", message:
                "Impossible to remove bookmark", preferredStyle: .alert)
            alertController.addAction(UIAlertAction(title: "Dismiss", style: .default))
            
            
            let keyWindow = UIApplication.shared.windows.filter {$0.isKeyWindow}.first
            
            if var topController = keyWindow?.rootViewController {
                while let presentedViewController = topController.presentedViewController {
                    topController = presentedViewController
                }

                topController.present(alertController, animated: true, completion: nil)
            }
        }
    }
    
    static func isBookmark(article: Article) -> Bool {
        let bookmarks = getAllObjects
        return bookmarks.contains(article)
    }
}
