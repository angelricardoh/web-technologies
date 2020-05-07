//
//  BookmarksViewController.swift
//  csci-hw9
//
//  Created by Angel Ricardo Nieto Garcia on 4/19/20.
//  Copyright © 2020 Angel Ricardo Nieto Garcia. All rights reserved.
//

import UIKit
import SwiftSpinner

class BookmarksViewController: UICollectionViewController {

    private let sectionInsets = UIEdgeInsets(top: 2.0,
                                             left: 12.0,
                                             bottom: 2.0,
                                             right: 12.0)
    
    @IBOutlet weak var nobookmarksLabel: UILabel!
    var articles: [Article] = []
    var lastSelectedIndexPath: IndexPath?
    private let itemsPerRow: CGFloat = 2
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        navigationController?.navigationBar.prefersLargeTitles = true
                
        let layout = UICollectionViewFlowLayout()
        collectionView.setCollectionViewLayout(layout, animated: true)
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
                        
        self.articles = BookmarkManager.getAllObjects
        
        if let lastSelectedIndexPath = self.lastSelectedIndexPath {
            self.collectionView.reloadItems(at: [lastSelectedIndexPath])
            self.lastSelectedIndexPath = nil
        } else {
            self.collectionView.reloadData()
        }
        
        if articles.count == 0 {
            nobookmarksLabel.isHidden = false
        } else {
            nobookmarksLabel.isHidden = true
        }
        navigationController?.navigationBar.prefersLargeTitles = true
    }
    
    @objc func bookmarkTapped(_ sender: UIButton) {
        removeArticle(at: sender.tag)
    }
    
    func removeArticle(at index:Int) {
        let currentArticle = articles[index]
        
        BookmarkManager.removeBookmark(article: currentArticle)
        
        articles.remove(at: index)
        self.collectionView.reloadData()
        
        if articles.count == 0 {
            nobookmarksLabel.isHidden = false
            navigationController?.navigationBar.prefersLargeTitles = true
        }
    }
}

extension BookmarksViewController {
    override func numberOfSections(in collectionView: UICollectionView) -> Int {
        return 1
    }
    
    override func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        
        return articles.count
    }
    
    override func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        
        let customCell = collectionView.dequeueReusableCell(withReuseIdentifier: "newsCollectionCell", for: indexPath) as? NewsCollectionViewCell
        
        customCell?.titleLabel.text = articles[indexPath.row].title
        customCell?.timeAgoLabel.text = articles[indexPath.row].date
        customCell?.sectionLabel.text = "| " + articles[indexPath.row].section
        
        if BookmarkManager.isBookmark(article: articles[indexPath.row]) {
            customCell?.bookmarkButton.setImage(UIImage(systemName: "bookmark.fill"), for: .normal)
        } else {
            customCell?.bookmarkButton.setImage(UIImage(systemName: "bookmark"), for: .normal)
        }
        customCell?.bookmarkButton.tag = indexPath.row
        customCell?.bookmarkButton.addTarget(self, action: #selector(bookmarkTapped(_:)), for: .touchUpInside)
        
        let imageUrlString = articles[indexPath.row].image
        if !imageUrlString.isEmpty, let imageUrl = URL(string: imageUrlString) {
            customCell?.articleImageView?.sd_setImage(with: imageUrl, placeholderImage: UIImage(named: "default_guardian"))
        }
        
        return customCell!
    }
    
    override func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
        SwiftSpinner.show("Loading Detailed article..")
        
        let articleSelected = articles[indexPath.row]
        let detailViewController = DetailViewController.detailViewControllerWithArticleId(articleSelected.id)
        self.lastSelectedIndexPath = indexPath
        
        navigationController?.pushViewController(detailViewController, animated: true)
        collectionView.deselectItem(at: indexPath, animated: false)
    }
    
    // Context menu
    override func collectionView(_ collectionView: UICollectionView, contextMenuConfigurationForItemAt indexPath: IndexPath, point: CGPoint) -> UIContextMenuConfiguration? {
        
        let currentArticle = articles[indexPath.row]

        return UIContextMenuConfiguration(identifier: nil, previewProvider: nil) { suggestedActions in
            
            let share = UIAction(title: "Share with Twitter", image: UIImage(named: "twitter")) { action in
                let articleShareUrl = "https://twitter.com/intent/tweet?text=Check+out+this+Article!&url=" + currentArticle.shareUrl + "&hashtags=CSCI_571_NewsApp"
                if let url = URL(string: articleShareUrl) {
                    UIApplication.shared.open(url)
                }
                
                print("Sharing \(currentArticle)")
            }
            
            let bookmark = UIAction(title: "Bookmark", image: UIImage(systemName: "bookmark")) { action in
                self.removeArticle(at: indexPath.row)
            }
            
            return UIMenu(title: "Menu", children: [share, bookmark])
        }
    }
}

extension BookmarksViewController : UICollectionViewDelegateFlowLayout {
    func collectionView(_ collectionView: UICollectionView,
                        layout collectionViewLayout: UICollectionViewLayout,
                        sizeForItemAt indexPath: IndexPath) -> CGSize {
        
        let paddingSpace = sectionInsets.left * (itemsPerRow + 1)
        let availableWidth = view.frame.width - paddingSpace
        let widthPerItem = availableWidth / itemsPerRow
        
        return CGSize(width: widthPerItem, height: 288)
    }
    
    func collectionView(_ collectionView: UICollectionView,
                        layout collectionViewLayout: UICollectionViewLayout,
                        minimumInteritemSpacingForSectionAt section: Int) -> CGFloat {
        return 5.0
    }
    
    func collectionView(_ collectionView: UICollectionView, layout
        collectionViewLayout: UICollectionViewLayout,
                        minimumLineSpacingForSectionAt section: Int) -> CGFloat {
        return sectionInsets.left
    }
    
    func collectionView(_ collectionView: UICollectionView,
                        layout collectionViewLayout: UICollectionViewLayout,
                        insetForSectionAt section: Int) -> UIEdgeInsets {
        return sectionInsets
    }
}
