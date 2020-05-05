//
//  SearchResultsViewController.swift
//  csci-hw9
//
//  Created by Angel Ricardo Nieto Garcia on 5/3/20.
//  Copyright © 2020 Angel Ricardo Nieto Garcia. All rights reserved.
//

import UIKit
import SwiftSpinner

class SearchResultsViewController: ArticleTableViewController {
    
    var search: String!
    let searchWorker: SearchWorker = SearchWorker()
    
    class func searchResultsViewControllerForSearch(_ search: String) -> UIViewController {
        let storyboard = UIStoryboard(name: "Main", bundle: nil)

        let viewController =
            storyboard.instantiateViewController(withIdentifier: "SearchResultsController")
        
        if let searchResultsViewController = viewController as? SearchResultsViewController {
            searchResultsViewController.search = search
        }
        
        return viewController
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        let nib = UINib(nibName: "NewsTableViewCell", bundle: nil)
        tableView.register(nib, forCellReuseIdentifier: "newsCell")
        
        searchWorker.fetchSearch(query: search, searchCompletion: {(completion) in
            SwiftSpinner.hide()
            switch completion {
            case .success(let articles):
                self.articles = articles
                self.tableView.reloadData()
                self.refreshControl?.endRefreshing()
            case .failure(let error):
                let alertController = UIAlertController(title: "Network Error", message:
                    error.localizedDescription, preferredStyle: .alert)
                alertController.addAction(UIAlertAction(title: "Dismiss", style: .default))
                self.present(alertController, animated: true, completion: nil)
                self.refreshControl?.endRefreshing()
            }
        })
    }
}
