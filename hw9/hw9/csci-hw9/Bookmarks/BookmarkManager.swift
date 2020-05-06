//
//  BookmarkManager.swift
//  csci-hw9
//
//  Created by Angel Ricardo Nieto Garcia on 5/4/20.
//  Copyright © 2020 Angel Ricardo Nieto Garcia. All rights reserved.
//

import UIKit
import Toast_Swift

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
        showToast(message: "Article Bookmarked. Check out the Bookmarks tab to view")
    }
    
    static func removeBookmark(article: Article) {
        var bookmarks = getAllObjects
        if let indexToRemove = bookmarks.firstIndex(where: {$0 == article}) {
            bookmarks.remove(at: indexToRemove)
            saveAllObjects(allObjects: bookmarks)
            showToast(message: "Article Removed from Bookmarks")
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
    
    static func showToast(message: String) {
        let keyWindow = UIApplication.shared.windows.filter {$0.isKeyWindow}.first
        
        if var topController = keyWindow?.rootViewController {
            while let presentedViewController = topController.presentedViewController {
                topController = presentedViewController
            }
            let customPoint = CGPoint(x: topController.view.bounds.size.width / 2.0, y: (topController.view.bounds.size.height - 125))
            topController.view.makeToast(message, duration: 3.0, point: customPoint, title: nil, image: nil, completion: nil)
        }
    }
}
