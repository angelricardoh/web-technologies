//
//  ArticleTableViewController.swift
//  csci-hw9
//
//  Created by Angel Ricardo Nieto Garcia on 5/3/20.
//  Copyright © 2020 Angel Ricardo Nieto Garcia. All rights reserved.
//

import UIKit
import SwiftSpinner

class ArticleTableViewController: UITableViewController {
    
    var articles: [Article] = []
    var resultsTableController: ResultsTableViewController?
    var lastSelectedIndexPath: IndexPath?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        navigationController?.navigationBar.prefersLargeTitles = true
                                
        let nib = UINib(nibName: "NewsTableViewCell", bundle: nil)
        tableView.register(nib, forCellReuseIdentifier: "newsCell")
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        
        navigationController?.navigationBar.prefersLargeTitles = true
        
        if let lastSelectedIndexPath = self.lastSelectedIndexPath {
            self.tableView.beginUpdates()
            self.tableView.reloadRows(at: [lastSelectedIndexPath], with: .none)
            self.tableView.endUpdates()
            self.lastSelectedIndexPath = nil
        } else {
            self.tableView.reloadData()
        }
    }

    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        // show all rows depending on how many videos we receive
        return articles.count
    }
    
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        // customize and show data based on array
        let customCell = tableView.dequeueReusableCell(withIdentifier: "newsCell", for: indexPath) as? NewsTableViewCell
        
        customCell?.titleLabel.text = articles[indexPath.row].title
        customCell?.timeAgoLabel.text = articles[indexPath.row].timeSince
        customCell?.sectionLabel.text = "| " + articles[indexPath.row].section
        
        if BookmarkManager.isBookmark(article: articles[indexPath.row]) {
            customCell?.bookmarkButton.setImage(UIImage(systemName: "bookmark.fill"), for: .normal)
        } else {
            customCell?.bookmarkButton.setImage(UIImage(systemName: "bookmark"), for: .normal)
        }
        customCell?.bookmarkButton.tag = indexPath.row
        customCell?.bookmarkButton.addTarget(self, action: #selector(bookmarkTapped(_:)), for: .touchUpInside)
        
        guard let imageUrl = URL(string: articles[indexPath.row].image) else {
            let alertController = UIAlertController(title: "Image download Error", message:
                "Error downloading image with url: " + articles[indexPath.row].image, preferredStyle: .alert)
            alertController.addAction(UIAlertAction(title: "Dismiss", style: .default))
            return customCell!
        }

        customCell?.articleImageView?.sd_setImage(with: imageUrl, placeholderImage: UIImage(named: "default-guardian"), completed: nil)
        
        return customCell!
    }
    
    @objc func bookmarkTapped(_ sender: UIButton) {
        
        let currentArticle = articles[sender.tag]
        
        if BookmarkManager.isBookmark(article: currentArticle) {
            BookmarkManager.removeBookmark(article: currentArticle)
        } else {
            BookmarkManager.addBookmark(article: currentArticle)
        }
        self.tableView.beginUpdates()
        self.tableView.reloadRows(at: [IndexPath(row: sender.tag, section: 0)], with: .none)
        self.tableView.endUpdates()
    }
    
    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        
        if tableView === resultsTableController?.tableView {
            SwiftSpinner.show("Loading Search results..")
    
            guard let query = resultsTableController?.suggestions[indexPath.row] else {
                print("resultsTableController suggestions does not exists in this controller")
                return
            }
            
            let searchResultsViewController = SearchResultsViewController.searchResultsViewControllerForSearch(query)
            navigationController?.pushViewController(searchResultsViewController, animated: true)
            resultsTableController?.dismiss(animated: false, completion: nil)
        } else {
            SwiftSpinner.show("Loading Detailed article..")

            let articleSelected = articles[indexPath.row]
            let detailViewController = DetailViewController.detailViewControllerWithArticleId(articleSelected.id)
            self.lastSelectedIndexPath = indexPath
            
            navigationController?.pushViewController(detailViewController, animated: true)
        }
        tableView.deselectRow(at: indexPath, animated: false)
    }
    
    // Context menu
    override func tableView(_ tableView: UITableView, contextMenuConfigurationForRowAt indexPath: IndexPath, point: CGPoint) -> UIContextMenuConfiguration? {
        
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
                let currentArticle = self.articles[indexPath.row]
                
                if BookmarkManager.isBookmark(article: currentArticle) {
                    BookmarkManager.removeBookmark(article: currentArticle)
                    let currentCell = self.tableView.cellForRow(at: indexPath) as? NewsTableViewCell
                    currentCell?.bookmarkButton.setImage(UIImage(systemName: "bookmark"), for: .normal)
                } else {
                    BookmarkManager.addBookmark(article: currentArticle)
                    let currentCell = self.tableView.cellForRow(at: indexPath) as? NewsTableViewCell
                    currentCell?.bookmarkButton.setImage(UIImage(systemName: "bookmark.fill"), for: .normal)
                }
            }
            
            return UIMenu(title: "Menu", children: [share, bookmark])
        }
    }
}
