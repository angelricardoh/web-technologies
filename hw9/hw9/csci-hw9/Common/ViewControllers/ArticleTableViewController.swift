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

    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        // show all rows depending on how many videos we receive
        return articles.count
    }
    
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        // customize and show data based on array
        let customCell = tableView.dequeueReusableCell(withIdentifier: "newsCell", for: indexPath) as? NewsTableViewCell
        
        customCell?.titleLabel.text = articles[indexPath.row].title
        customCell?.timeAgoLabel.text = articles[indexPath.row].date
        customCell?.sectionLabel.text = "| " + articles[indexPath.row].section
        guard let imageUrl = URL(string: articles[indexPath.row].image) else {
            let alertController = UIAlertController(title: "Image download Error", message:
                "Error downloading image with url: " + articles[indexPath.row].image, preferredStyle: .alert)
            alertController.addAction(UIAlertAction(title: "Dismiss", style: .default))
            return customCell!
        }
        customCell?.articleImageView?.sd_setImage(with: imageUrl, completed: nil)
        
        return customCell!
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
        } else {
            SwiftSpinner.show("Loading Detailed article..")

            let articleSelected = articles[indexPath.row]
            let detailViewController = DetailViewController.detailViewControllerWithArticleId(articleSelected.id)
            
            navigationController?.pushViewController(detailViewController, animated: true)
        }
        tableView.deselectRow(at: indexPath, animated: false)
    }
}
